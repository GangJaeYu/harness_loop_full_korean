#!/usr/bin/env node
// loop-drive — 개발 루프 구동 스크립트 (LOOP.md 4절 "② 오르카 스크립트 구동" 을 옮긴 것)
//
// 만든 곳: loop-setup (Layer 5). 고치는 곳: loop-update.
// **이 스크립트는 판단하지 않는다.** 띄우고, 기다리고, 받은 질문을 판단 자식에게 넘기고, 결과 파일을 확인할 뿐이다.
// 판단(반영·분류·병합·배정)은 라운드마다 새로 여는 코디네이터 자식(claude -p)이 한다. STATE.md 도 쓰지 않는다.
//
// 반드시 **오르카 터미널 안에서, 코디네이터 트리(브랜치 coordinator)를 작업 디렉터리로** 돌린다.
// 오르카 CLI 는 호출한 터미널을 Run 의 코디네이터로 묶는다 — 밖에서는 no_active_sender_terminal.
//
// 사용:
//   node harness_setup/scripts/loop-drive.mjs              루프 구동 (②)
//   node harness_setup/scripts/loop-drive.mjs --dry-run    아무것도 띄우지 않고 이번 라운드에 할 일과 명령만 출력
//   node harness_setup/scripts/loop-drive.mjs --smoke      스모크 테스트: 가벼운 모델의 시험 워커 하나로
//                                                          ask→reply→결과 파일→worker_done→worker-release 확인
//
// 값은 박지 않는다 — 모델·강도·대기 길이·슬롯 경로·포트는 LOOP.md 8절 표에서, 지시문은 LOOP.md 4절의
// ```text id=...``` 블록에서 읽는다. 바꿀 때는 LOOP.md 한 곳만 고친다(loop-update).

import { readFileSync, writeFileSync, existsSync, mkdirSync, readdirSync, unlinkSync, copyFileSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';
import { tmpdir } from 'node:os';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..');
const DRY = process.argv.includes('--dry-run');
const SMOKE = process.argv.includes('--smoke');
// --dry-assign <태스크 ID>:<worker-N>:<토막> — 드라이런에서 배정표 행을 흉내 낸다(코디네이터가 배정했다고 치고 띄울 명령을 본다)
const DRY_ASSIGN = process.argv.flatMap((a, i, all) => (a === '--dry-assign' ? [all[i + 1]] : []))
  .map((v) => { const [id, worker, stage] = v.split(':'); return { id, worker, stage }; });
const TMP = join(tmpdir(), 'deskwork-loop');
const RUN_FILE = join(TMP, 'loop-run.txt');
const log = (...a) => console.log(`[loop-drive ${new Date().toISOString().slice(11, 19)}]`, ...a);

// ── LOOP.md 에서 설정 읽기 ─────────────────────────────────────────────────────
const LOOP = readFileSync(join(ROOT, 'loop_setup', 'LOOP.md'), 'utf8');

function tableRow(label) {
  const line = LOOP.split(/\r?\n/).find((l) => l.startsWith(`| ${label} |`));
  if (!line) throw new Error(`LOOP.md 8절에서 "${label}" 행을 찾지 못했다`);
  return line.split('|').slice(1, -1).map((c) => c.trim().replace(/`/g, ''));
}
function role(label) { const [, cli, model, effort] = tableRow(label); return { cli, model, effort }; }
const ROLES = { coord: role('코디네이터'), impl: role('구현 워커'), verify: role('검증 워커'), smoke: role('스모크 시험 워커') };

const SLOTS = {};
for (const l of LOOP.split(/\r?\n/)) {
  const m = l.match(/^\| (worker-\d+) \| (\d+) \| `([^`]+)` \| (\d+) \| (\d+) \| (\d+) \| (\d+) \| `([^`]+)` \|/);
  if (m) SLOTS[m[1]] = { slot: +m[2], tree: m[3], app: +m[4], pg: +m[5], smtp: +m[6], mailWeb: +m[7], db: m[8] };
}
const WAIT_MS = +(LOOP.match(/대기 한 번의 길이\*\*[^`]*`(\d+)`/) ?? [])[1] || 900000;
const COORD_TREE = SLOTS['worker-1']?.tree ?? ROOT;
const MAIN_TREE = (LOOP.match(/\*\*main 트리\*\*: `([^`]+)`/) ?? [])[1];
if (!MAIN_TREE) throw new Error('LOOP.md 8절에서 main 트리 경로를 찾지 못했다');

const INSTR = {};
for (const m of LOOP.matchAll(/```text id=([\w-]+)\r?\n([\s\S]*?)```/g)) INSTR[m[1]] = m[2].trim();
for (const k of ['impl', 'verify', 'coord', 'qa', 'parallel-add', 'orca-add', 'smoke'])
  if (!INSTR[k]) throw new Error(`LOOP.md 에 \`\`\`text id=${k} 지시문 블록이 없다`);

const ALLOW = {
  coord: tableRow('코디네이터 허용 목록')[1],
  qa: tableRow('질문 답변 허용 목록')[1],
};

// ── STATE.md 읽기 (쓰지 않는다) ────────────────────────────────────────────────
function readState() {
  const s = readFileSync(join(ROOT, 'plan_setup', 'STATE.md'), 'utf8');
  const section = (name) => (s.split(/^# /m).find((x) => x.startsWith(name)) ?? '');
  const next = section('Next Action');
  const phases = section('Phase Overview').split(/\r?\n/).filter((l) => /^\* \*\*/.test(l));
  const assign = section('Assignments').split(/\r?\n/)
    .map((l) => l.match(/^\| (phase-\d+-task-\d+) \| (worker-\d+) \| (구현|수정|검증|정지|e2e 대기) \|/))
    .filter(Boolean).map((m) => ({ id: m[1], worker: m[2], stage: m[3] }));
  return {
    question: /^\s*\*?\s*질문:/m.test(next),
    answer: /^\s*\*?\s*답:/m.test(next),
    noAssign: /배정 없음:/.test(next),
    allDone: phases.length > 0 && phases.every((l) => /:\*\*\s*completed\s*$/.test(l)),
    assign: DRY && DRY_ASSIGN.length ? DRY_ASSIGN : assign,
  };
}

// ── 외부 명령 ─────────────────────────────────────────────────────────────────
function show(cmd, args) {
  return [cmd, ...args.map((a) => (/[\s"]/.test(a) ? JSON.stringify(a.length > 160 ? a.slice(0, 157) + '...' : a) : a))].join(' ');
}
function run(cmd, args, { cwd = ROOT, timeout } = {}) {
  if (DRY) { log('(dry-run) ' + show(cmd, args) + (cwd !== ROOT ? `   [cwd=${cwd}]` : '')); return { status: 0, stdout: '', dry: true }; }
  const r = spawnSync(cmd, args, { cwd, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024, timeout, windowsHide: true });
  if (r.error) throw r.error;
  return r;
}
function orca(args, opts) {
  const r = run('orca', [...args, '--json'], opts);
  if (r.dry) return {};
  try { return JSON.parse(r.stdout); } catch { throw new Error(`orca ${args[0]} ${args[1]} 응답을 JSON 으로 읽지 못했다 (exit ${r.status}): ${r.stdout?.slice(0, 400)} ${r.stderr?.slice(0, 400)}`); }
}
function claude(prompt, r, allowed, { cwd = ROOT } = {}) {
  const args = ['-p', prompt, '--model', r.model, '--effort', r.effort, '--allowedTools', allowed, '--output-format', 'text'];
  const res = run('claude', args, { cwd });
  return res.stdout ?? '';
}
// 응답 JSON 의 모양은 오르카 버전마다 바뀔 수 있다 — 키 이름으로 찾는다
function findKey(o, key) {
  if (!o || typeof o !== 'object') return undefined;
  if (key in o) return o[key];
  for (const v of Object.values(o)) { const f = findKey(v, key); if (f !== undefined) return f; }
  return undefined;
}

// ── 치환·파일 ─────────────────────────────────────────────────────────────────
const fill = (t, v) => t.replace(/\{(\w+)\}/g, (m, k) => (k in v ? v[k] : m));
function taskDoc(id) { const [, p] = id.match(/^phase-(\d+)-task-\d+$/); const dir = readdirSync(join(ROOT, 'plan_setup')).find((d) => d === `phase-${p}`); return `plan_setup/${dir}/phase-${p}-tasks/${id}.md`; }
const dispatchFile = (id) => join(TMP, `dispatch-${id}.txt`);
const resultFile = (id, stage) => join(TMP, `${stage === '검증' ? 'verdict' : 'done'}-${id}.txt`);
function running() { return existsSync(TMP) ? readdirSync(TMP).filter((f) => /^dispatch-.*\.txt$/.test(f)) : []; }

// 슬롯 2 이상 트리의 .env.local — 코디네이터 트리의 것(사람이 비밀값을 채운 것)을 복사하고 슬롯 값만 바꾼다.
// 판단이 없는 치환이다. 워크트리 자체는 코디네이터가 만든다(git worktree add). 트리가 없으면 띄우지 않는다.
function ensureEnvLocal(worker) {
  const s = SLOTS[worker];
  if (!s) throw new Error(`LOOP.md 8절 슬롯 표에 ${worker} 가 없다`);
  const target = join(s.tree, '.env.local');
  if (!existsSync(s.tree)) return false;
  if (existsSync(target)) return true;
  const src = readFileSync(join(COORD_TREE, '.env.local'), 'utf8');
  const set = {
    APP_PORT: s.app, APP_BASE_URL: `http://localhost:${s.app}`, POSTGRES_PORT: s.pg, POSTGRES_DB: s.db,
    MAIL_SMTP_PORT: s.smtp, MAIL_WEB_PORT: s.mailWeb,
    LOCALDEV_PG_CONTAINER: `deskwork-s${s.slot}-postgres`, LOCALDEV_PG_VOLUME: `deskwork-s${s.slot}-pgdata`, LOCALDEV_MAIL_CONTAINER: `deskwork-s${s.slot}-mailpit`,
  };
  let out = src.split(/\r?\n/).map((l) => { const k = l.split('=')[0].trim(); return k in set ? `${k}=${set[k]}` : l; }).join('\n');
  // DATABASE_URL 의 포트·DB 이름을 슬롯 값으로
  out = out.replace(/^(DATABASE_URL=postgres(?:ql)?:\/\/[^@]*@[^:/]+:)\d+\/[^\s?]+/m, `$1${s.pg}/${s.db}`);
  if (DRY) { log(`(dry-run) ${target} 를 코디네이터 트리의 .env.local 에서 만들고 슬롯 ${s.slot} 값으로 치환`); return true; }
  writeFileSync(target, out, 'utf8');
  log(`${worker}: .env.local 작성 (슬롯 ${s.slot})`);
  return true;
}

function workerSpec(row) {
  const s = SLOTS[row.worker];
  const v = {
    ID: row.id, WORKER: row.worker, TMP, COORD: COORD_TREE, TASK_DOC: taskDoc(row.id), APP_URL: `http://localhost:${s.app}`,
    RESULT: resultFile(row.id, row.stage), LOCALDEV: 'pwsh harness_setup/scripts/local-dev.ps1',
  };
  const base = row.stage === '검증' ? INSTR.verify : INSTR.impl;
  return `${row.worker}: ${fill(base, v)}\n태스크: ${row.id} (토막: ${row.stage})\n${fill(INSTR['parallel-add'], v)}\n${fill(INSTR['orca-add'], v)}`;
}

function startWorker(row) {
  const s = SLOTS[row.worker];
  const r = row.stage === '검증' ? ROLES.verify : ROLES.impl;
  const worktree = s.slot === 1 ? 'current' : `path:${s.tree}`;
  const res = orca(['orchestration', 'worker-start', '--spec', workerSpec(row), '--worktree', worktree,
    '--agent', r.cli, '--model', r.model, '--effort', r.effort, '--task-title', `${row.worker} ${row.stage} ${row.id}`]);
  if (DRY) return;
  const dispatchId = findKey(res, 'dispatchId') ?? findKey(findKey(res, 'dispatch') ?? {}, 'id');
  if (!dispatchId) throw new Error(`worker-start 응답에서 dispatchId 를 찾지 못했다 — 다시 띄우지 않는다. 응답: ${JSON.stringify(res).slice(0, 600)}`);
  writeFileSync(dispatchFile(row.id), JSON.stringify({ dispatchId, id: row.id, stage: row.stage, worker: row.worker }), 'utf8');
  log(`${row.worker} ${row.stage} ${row.id} 띄움 (dispatch ${dispatchId}, 실제 모델 ${JSON.stringify(findKey(res, 'effective') ?? '?')})`);
}

function answerQuestion(msg, byDispatch) {
  const d = byDispatch(msg) ?? {};
  const prompt = fill(INSTR.qa, { ID: d.id ?? '(알 수 없음)', WORKER: d.worker ?? '(알 수 없음)', QUESTION: String(msg.body ?? '').slice(0, 4000) });
  const out = claude(prompt, ROLES.coord, ALLOW.qa);
  const first = (out.split(/\r?\n/).find((l) => l.trim()) ?? '').trim();
  const body = first.startsWith('답:') ? first.slice(3).trim()
    : '사람 판단 대기 — 지금 상태 그대로 STATUS: failed: 사람 판단 대기 블록을 결과 파일에 END 까지 쓰고 worker_done 으로 끝내라';
  orca(['orchestration', 'reply', '--id', msg.id, '--body', body]);
  log(`질문 ${msg.id} → ${first.startsWith('답:') ? '문서로 답함' : '사람 판단 대기로 돌려보냄'}`);
}

// ── 스모크 테스트 ─────────────────────────────────────────────────────────────
function smoke() {
  mkdirSync(TMP, { recursive: true });
  const result = join(TMP, 'smoke-result.txt');
  orca(['orchestration', 'run-create', '--objective', 'deskwork loop smoke test']);
  const res = orca(['orchestration', 'worker-start', '--spec', fill(INSTR.smoke, { RESULT: result }), '--worktree', 'current',
    '--agent', ROLES.smoke.cli, '--model', ROLES.smoke.model, '--effort', ROLES.smoke.effort, '--task-title', 'loop smoke']);
  const dispatchId = DRY ? '(dry)' : findKey(res, 'dispatchId') ?? findKey(findKey(res, 'dispatch') ?? {}, 'id');
  let ack; const seen = { question: false, done: false };
  for (let i = 0; i < 6 && !seen.done; i++) {
    const r = orca(['orchestration', 'check', ...(ack ? ['--ack', ack] : []), '--wait', '--types', 'worker_done,escalation,question', '--timeout-ms', '120000'], { timeout: 180000 });
    if (DRY) break;
    ack = findKey(r, 'deliveryId');
    for (const m of findKey(r, 'messages') ?? []) {
      if (m.type === 'question' || m.type === 'escalation') {
        const out = claude(`시험 워커가 물었다: "${m.body}". 첫 줄에 "답: 확인" 만 출력하라.`, ROLES.smoke, 'Read');
        orca(['orchestration', 'reply', '--id', m.id, '--body', (out.match(/답:\s*(.*)/) ?? [, '확인'])[1]]);
        seen.question = true;
      }
      if (m.type === 'worker_done') seen.done = true;
    }
  }
  if (ack && !DRY) orca(['orchestration', 'check', '--ack', ack]);
  if (!DRY) orca(['orchestration', 'worker-release', '--dispatch', dispatchId]);
  const fileOk = !DRY && existsSync(result) && /\bEND\s*$/.test(readFileSync(result, 'utf8'));
  log(`스모크: ask/reply ${seen.question ? 'OK' : '없음'} · worker_done ${seen.done ? 'OK' : '없음'} · 결과 파일(END) ${fileOk ? 'OK' : '없음'} · release 요청함`);
  process.exit(seen.question && seen.done && fileOk ? 0 : 1);
}

// ── 본 루프 ───────────────────────────────────────────────────────────────────
function main() {
  mkdirSync(TMP, { recursive: true });
  if (!DRY && !process.env.ORCA_TERMINAL_HANDLE) {
    console.error('오르카 터미널 밖이다(ORCA_TERMINAL_HANDLE 없음). 오르카 터미널에서 코디네이터 트리를 열고 다시 실행하라.');
    process.exit(2);
  }
  // Run 이어받기 — 재시작해도 돌던 워커와 우편함을 잃지 않는다
  if (existsSync(RUN_FILE)) orca(['orchestration', 'run-use', '--id', readFileSync(RUN_FILE, 'utf8').trim()]);
  else {
    const r = orca(['orchestration', 'run-create', '--objective', 'Deskwork 개발 루프']);
    const runId = DRY ? null : findKey(r, 'runId') ?? findKey(findKey(r, 'run') ?? {}, 'id');
    if (!DRY) { if (!runId) throw new Error('run-create 응답에서 Run ID 를 찾지 못했다'); writeFileSync(RUN_FILE, runId, 'utf8'); }
  }
  const byDispatch = (msg) => {
    let p = {}; try { p = typeof msg.payload === 'string' ? JSON.parse(msg.payload) : msg.payload ?? {}; } catch { /* 본문만 있는 메시지 */ }
    const did = p.dispatchId ?? msg.dispatchId;
    for (const f of running()) { const d = JSON.parse(readFileSync(join(TMP, f), 'utf8')); if (d.dispatchId === did || d.id === p.taskId) return d; }
    return null;
  };

  let needCoord = true;   // 빈 대기 뒤에는 코디네이터를 부르지 않는다 — 처리할 것이 생겼을 때만(토큰 절약)
  let empty = 0, ack;
  for (let round = 1; ; round++) {
    let st = readState();
    const waitingHuman = st.question && !st.answer;
    if (waitingHuman && running().length === 0) { log('Next Action 에 질문: 이 있다 — 사람의 답: 을 기다린다. 답을 적은 뒤 다시 실행하라.'); break; }
    if (st.allDone) { log('Phase Overview 전부 completed — 끝.'); break; }

    if (needCoord && !waitingHuman) {
      log(`라운드 ${round}: 코디네이터 자식`);
      claude(fill(INSTR.coord, { TMP, COORD: COORD_TREE, MAIN: MAIN_TREE }), ROLES.coord, ALLOW.coord, { cwd: COORD_TREE });
      st = readState();
    }
    needCoord = false;
    if (st.question && !st.answer && running().length === 0) { log('코디네이터가 질문: 을 남겼다 — 멈춘다.'); break; }
    if (st.assign.length === 0 && st.noAssign && running().length === 0) { log('배정 없음 — 차단 대기 또는 막다른 곳. Next Action 을 보라.'); break; }

    if (!(st.question && !st.answer)) {
      for (const row of st.assign) {
        if (!['구현', '수정', '검증'].includes(row.stage) || existsSync(dispatchFile(row.id))) continue;
        if (existsSync(resultFile(row.id, row.stage))) continue;   // 결과가 도착했는데 아직 반영 전
        if (SLOTS[row.worker].slot > 1 && !ensureEnvLocal(row.worker)) { log(`${row.worker} 트리가 없다 — 코디네이터가 만들 때까지 띄우지 않는다`); continue; }
        startWorker(row);
      }
    }
    if (DRY) { log('(dry-run) 여기서 check --wait 로 기다린다: ' + show('orca', ['orchestration', 'check', '--wait', '--types', 'worker_done,escalation,question', '--timeout-ms', String(WAIT_MS), '--json'])); break; }
    if (running().length === 0) {
      // 띄운 것도 도는 것도 없다 — 코디네이터가 방금 반영만 했을 수 있으니 한 번 더 부른다. 두 번 연속이면 멈춘다
      if (round > 1 && st.assign.every((r) => r.stage === '정지')) { log('도는 워커 없음, 남은 행은 전부 정지 — 멈춘다.'); break; }
      needCoord = true; continue;
    }

    const r = orca(['orchestration', 'check', ...(ack ? ['--ack', ack] : []), '--wait', '--types', 'worker_done,escalation,question', '--timeout-ms', String(WAIT_MS)], { timeout: WAIT_MS + 120000 });
    ack = undefined;
    const msgs = findKey(r, 'messages') ?? [];
    if (findKey(r, 'timedOut') || msgs.length === 0) {
      if (++empty >= 3) {
        empty = 0;
        const list = orca(['orchestration', 'worker-list']);
        for (const f of running()) {
          const d = JSON.parse(readFileSync(join(TMP, f), 'utf8'));
          const row = (findKey(list, 'rows') ?? findKey(list, 'workers') ?? []).find((w) => JSON.stringify(w).includes(d.dispatchId));
          if (row && JSON.stringify(row).includes('"exited"')) { unlinkSync(join(TMP, f)); needCoord = true; log(`${d.worker} ${d.id}: exited 인데 worker_done 없음 — 결과 파일 없이 다음 라운드로`); }
        }
      }
      continue;   // 빈 대기는 체크포인트다. 코디네이터를 부르지 않는다
    }
    empty = 0;
    for (const m of msgs) {
      if (m.type === 'question' || m.type === 'escalation') answerQuestion(m, byDispatch);
      else if (m.type === 'worker_done') {
        const d = byDispatch(m);
        if (d) {
          const rf = resultFile(d.id, d.stage);
          if (!existsSync(rf)) writeFileSync(rf, String(m.body ?? ''), 'utf8');   // END 가 없으니 코디네이터가 '중단' 으로 처리
          orca(['orchestration', 'worker-release', '--dispatch', d.dispatchId]);
          unlinkSync(dispatchFile(d.id));
          log(`${d.worker} ${d.stage} ${d.id} 끝남`);
        }
        needCoord = true;
      }
    }
    ack = findKey(r, 'deliveryId');   // 처리한 뒤에 다음 check 에서 --ack
  }
  if (ack && !DRY) orca(['orchestration', 'check', '--ack', ack]);
}

if (SMOKE) smoke(); else main();
