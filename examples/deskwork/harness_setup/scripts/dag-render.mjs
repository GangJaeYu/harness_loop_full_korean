#!/usr/bin/env node
// dag-render — 태스크 frontmatter 만 읽어 loop_setup/DAG.md 를 만든다.
//
// 만든 곳: loop-setup (Layer 5). 다시 돌리는 곳: loop-update (태스크가 바뀌었을 때).
// harness-update 는 이 파일을 구성 요소 표와 무관한 것으로 알고 지우지 않는다.
//
// 출력(DAG.md)은 손으로 고치지 않는다 — 다음 실행에서 사라진다.
//   1) mermaid 그래프: phase = subgraph, 노드 = 태스크 ID, 실선 = depends_on,
//      점선 = 의존 경로 없는 files 겹침(동시 금지), 회색 점선 테두리 = blocked
//   2) 구간별 폭 표 (phase 는 앞 phase 가 completed 여야 열린다 — LOOP.md 2절)
//   3) 확인 결과: 순환 / 없는 ID 참조 / blocked 와 그 후행
//   4) 의존 경로 없는 파일 겹침 쌍 목록 + 공유 런타임 자원 후보(패턴)
//
// 사용: node harness_setup/scripts/dag-render.mjs [--out <경로>] [--stdout]
// 외부 패키지를 쓰지 않는다 (package.json 이 생기기 전에도 돌아야 한다).

import { readFileSync, writeFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, relative, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, '..', '..');
const args = process.argv.slice(2);
const outArg = args.indexOf('--out');
const outPath = outArg >= 0 ? args[outArg + 1] : join(root, 'loop_setup', 'DAG.md');
const toStdout = args.includes('--stdout');

// 공유 런타임 자원 후보 패턴 — HARNESS.md 2절 구성 요소 표에서 뽑았다
//   PostgreSQL → 마이그레이션·시드 / 앱 → 환경 파일·포트 / 의존성 매니페스트(npm)
const RESOURCE_PATTERNS = [
  { group: 'migration', kind: 'DB 스키마 (PostgreSQL)', test: (f) => /^migrations\//.test(f) || /(^|\/)migrate\.ts$/.test(f) },
  { group: 'env-config', kind: '환경 설정 (앱·local-dev)', test: (f) => /(^|\/)\.env[^/]*$/.test(f) },
  { group: 'deps-manifest', kind: '의존성 매니페스트 (npm)', test: (f) => /(^|\/)package(-lock)?\.json$/.test(f) },
  { group: 'test-config', kind: '게이트 도구 설정', test: (f) => /(^|\/)(playwright|vitest)\.config\.[cm]?[jt]s$/.test(f) || /(^|\/)(eslint\.config\.mjs|\.prettierrc|tsconfig\.json)$/.test(f) },
];

// ── 1. 태스크 문서 수집 ────────────────────────────────────────────────────────
function walk(dir, acc = []) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p, acc);
    else if (/^phase-\d+-task-\d+\.md$/.test(name)) acc.push(p);
  }
  return acc;
}

function parseList(v) {
  v = (v ?? '').trim();
  if (!v.startsWith('[')) return v ? [v] : [];
  return v.slice(1, v.lastIndexOf(']')).split(',').map((s) => s.trim().replace(/^["']|["']$/g, '')).filter(Boolean);
}

function parseFrontmatter(text) {
  const m = text.match(/^﻿?---\r?\n([\s\S]*?)\r?\n---/);
  if (!m) return null;
  const fm = {};
  for (const line of m[1].split(/\r?\n/)) {
    const kv = line.match(/^([A-Za-z_]+):\s*(.*)$/);
    if (kv) fm[kv[1]] = kv[2];
  }
  return fm;
}

const planDir = join(root, 'plan_setup');
const files = walk(planDir).sort();
const tasks = new Map();
const parseErrors = [];
for (const f of files) {
  const fm = parseFrontmatter(readFileSync(f, 'utf8'));
  if (!fm || !fm.id) { parseErrors.push(relative(root, f)); continue; }
  tasks.set(fm.id, {
    id: fm.id,
    phase: fm.id.match(/^phase-(\d+)/)[1],
    title: (fm.title ?? '').trim(),
    status: (fm.status ?? '').trim(),
    deps: parseList(fm.depends_on),
    files: parseList(fm.files),
    blockedBy: parseList(fm.blocked_by),
    verification: parseList(fm.verification),
    path: relative(root, f).replace(/\\/g, '/'),
  });
}
const ids = [...tasks.keys()];
const phases = [...new Set(ids.map((i) => tasks.get(i).phase))].sort();

// ── 2. 확인: 없는 ID / 순환 / blocked 후행 ───────────────────────────────────
const missingRefs = [];
for (const t of tasks.values()) for (const d of t.deps) if (!tasks.has(d)) missingRefs.push([t.id, d]);

const succ = new Map(ids.map((i) => [i, []]));
for (const t of tasks.values()) for (const d of t.deps) if (tasks.has(d)) succ.get(d).push(t.id);

// Kahn — 남는 노드가 순환에 걸린 것
const indeg = new Map(ids.map((i) => [i, tasks.get(i).deps.filter((d) => tasks.has(d)).length]));
const queue = ids.filter((i) => indeg.get(i) === 0);
const topo = [];
while (queue.length) {
  const n = queue.shift();
  topo.push(n);
  for (const s of succ.get(n)) { indeg.set(s, indeg.get(s) - 1); if (indeg.get(s) === 0) queue.push(s); }
}
const inCycle = ids.filter((i) => !topo.includes(i));

const isDiscarded = (t) => t.blockedBy.length > 0 && t.blockedBy.every((b) => b === '폐기');
const blocked = new Set(ids.filter((i) => tasks.get(i).status === 'blocked' && !isDiscarded(tasks.get(i))));
const blockedDesc = new Set();
{
  const st = [...blocked];
  while (st.length) { const n = st.pop(); for (const s of succ.get(n)) if (!blocked.has(s) && !blockedDesc.has(s)) { blockedDesc.add(s); st.push(s); } }
}
const excluded = (i) => blocked.has(i) || blockedDesc.has(i) || inCycle.includes(i) || isDiscarded(tasks.get(i));

// ── 3. 도달 가능성 (의존 경로가 있는가) ───────────────────────────────────────
const reach = new Map();
function reachable(from) {
  if (reach.has(from)) return reach.get(from);
  const seen = new Set();
  const st = [...succ.get(from)];
  while (st.length) { const n = st.pop(); if (seen.has(n)) continue; seen.add(n); st.push(...succ.get(n)); }
  reach.set(from, seen);
  return seen;
}
const hasPath = (a, b) => reachable(a).has(b) || reachable(b).has(a);

// ── 4. 파일 겹침 쌍 (의존 경로 없는 것만) ─────────────────────────────────────
const overlaps = [];
for (let i = 0; i < ids.length; i++) for (let j = i + 1; j < ids.length; j++) {
  const a = tasks.get(ids[i]), b = tasks.get(ids[j]);
  const shared = a.files.filter((f) => b.files.includes(f));
  if (shared.length && !hasPath(a.id, b.id)) overlaps.push({ a: a.id, b: b.id, shared });
}
const overlapSet = new Set(overlaps.flatMap((o) => [`${o.a}|${o.b}`, `${o.b}|${o.a}`]));

// 공유 런타임 자원 후보 (처리는 LOOP.md 8절 자원 충돌 표에서 붙인다)
const resources = [];
for (const p of RESOURCE_PATTERNS) {
  const hits = [...tasks.values()].filter((t) => t.files.some(p.test)).map((t) => ({ id: t.id, files: t.files.filter(p.test) }));
  if (hits.length) resources.push({ ...p, hits });
}
const emptyFiles = [...tasks.values()].filter((t) => t.files.length === 0).map((t) => t.id);

// ── 5. 구간별 폭 — phase 는 앞 phase 가 끝나야 열린다(LOOP.md 2절) ────────────
//   phase 안에서 단계 = 1 + (같은 phase 안 선행의 최대 단계). 앞 phase 선행은 이미 끝난 것으로 본다.
//   폭 = 그 단계의 실행 대상 수. 겹침 조정 폭 = 파일 겹침 점선끼리 같은 단계에 있으면 하나로 센다.
const level = new Map();
for (const n of topo) {
  const t = tasks.get(n);
  if (excluded(n)) continue;
  const inPhase = t.deps.filter((d) => tasks.has(d) && tasks.get(d).phase === t.phase && !excluded(d));
  level.set(n, 1 + Math.max(0, ...inPhase.map((d) => level.get(d) ?? 0)));
}
const widthRows = [];
let maxWidth = 0;
for (const ph of phases) {
  const members = ids.filter((i) => tasks.get(i).phase === ph && level.has(i));
  const nPhase = ids.filter((i) => tasks.get(i).phase === ph).length;
  if (!members.length) { widthRows.push({ ph, step: '—', list: [], width: 0, adj: 0, note: `실행 대상 0 (${nPhase}개 전부 blocked 또는 그 후행)` }); continue; }
  const maxL = Math.max(...members.map((i) => level.get(i)));
  for (let L = 1; L <= maxL; L++) {
    const list = members.filter((i) => level.get(i) === L);
    // 겹침 조정: 탐욕적으로 서로 겹치지 않는 것만 센다
    const picked = [];
    for (const i of list) if (!picked.some((p) => overlapSet.has(`${p}|${i}`))) picked.push(i);
    maxWidth = Math.max(maxWidth, picked.length);
    widthRows.push({ ph, step: L, list, width: list.length, adj: picked.length, note: '' });
  }
}

// ── 6. mermaid ────────────────────────────────────────────────────────────────
const nid = (i) => i.replace(/^phase-(\d+)-task-(\d+)$/, 'p$1t$2');
const short = (i) => i.replace(/^phase-(\d+)-task-(\d+)$/, '$1-$2');
const esc = (s) => s.replace(/"/g, "'").replace(/[<>]/g, '');
const mm = ['```mermaid', 'flowchart TB'];
for (const ph of phases) {
  mm.push(`  subgraph P${ph}["phase-${ph}"]`);
  mm.push('    direction TB');
  for (const i of ids.filter((x) => tasks.get(x).phase === ph)) mm.push(`    ${nid(i)}["${short(i)} ${esc(tasks.get(i).title)}"]`);
  mm.push('  end');
}
for (const t of tasks.values()) for (const d of t.deps) if (tasks.has(d)) mm.push(`  ${nid(d)} --> ${nid(t.id)}`);
for (const o of overlaps) mm.push(`  ${nid(o.a)} -.-|files 겹침| ${nid(o.b)}`);
mm.push('  classDef blocked fill:#eeeeee,stroke:#999999,stroke-dasharray:4 3,color:#777777');
mm.push('  classDef blockedDesc stroke:#999999,stroke-dasharray:4 3');
if (blocked.size) mm.push(`  class ${[...blocked].map(nid).join(',')} blocked`);
if (blockedDesc.size) mm.push(`  class ${[...blockedDesc].map(nid).join(',')} blockedDesc`);
mm.push('```');

// ── 7. 출력 ───────────────────────────────────────────────────────────────────
const today = new Date().toISOString().slice(0, 10);
const runnable = ids.filter((i) => !excluded(i));
const out = [];
out.push('# 태스크 DAG');
out.push('');
out.push(`> **생성물이다 — 손으로 고치지 않는다.** \`node harness_setup/scripts/dag-render.mjs\` 의 출력이고 다음 실행에서 덮어써진다.`);
out.push(`> 규칙·자원 충돌 처리·슬롯은 \`loop_setup/LOOP.md\` 8절에 있다. 태스크가 바뀌면 \`loop-update\` 가 이 스크립트를 다시 돌린다.`);
out.push('');
out.push(`- 생성: ${today}`);
out.push(`- 태스크 문서: ${ids.length}개 (노드 ${ids.length}개) · 실행 대상: ${runnable.length}개 · blocked: ${blocked.size}개 · blocked 후행: ${blockedDesc.size}개`);
out.push(`- 폭 최댓값(겹침 조정, 사용자 상한 적용 전): ${maxWidth}`);
out.push('');
out.push('## 1. 그래프');
out.push('');
out.push('실선 = `depends_on` · 점선 = 의존 경로 없는 `files` 겹침(동시 금지) · 회색 점선 테두리 = `blocked`(흰 바탕 점선 = blocked 의 후행)');
out.push('');
out.push(...mm);
out.push('');
out.push('## 2. 구간별 폭');
out.push('');
out.push('phase 는 앞 phase 가 `completed` 가 된 뒤에 열린다(LOOP.md 2절). 단계 = 같은 phase 안 선행 기준의 깊이. 앞 phase 선행은 끝난 것으로 본다.');
out.push('실제 배정은 선행이 끝나는 대로 동적으로 열리므로 이 표는 상한의 근사다. 자원 그룹 직렬(LOOP.md 8절)은 여기 반영하지 않았다.');
out.push('');
out.push('| phase | 단계 | 동시에 열리는 태스크 | 폭 | 겹침 조정 폭 |');
out.push('|---|---|---|---|---|');
for (const r of widthRows) out.push(`| ${r.ph} | ${r.step} | ${r.list.length ? r.list.map(short).join(', ') : r.note} | ${r.width} | ${r.adj} |`);
out.push('');
out.push('| phase | 폭 최댓값 |');
out.push('|---|---|');
for (const ph of phases) out.push(`| ${ph} | ${Math.max(0, ...widthRows.filter((r) => r.ph === ph).map((r) => r.adj))} |`);
out.push('');
out.push('## 3. 확인 결과');
out.push('');
out.push(`- 순환: ${inCycle.length ? '**있음** — ' + inCycle.join(', ') + ' (Layer 3 으로 돌려보낸다)' : '0건'}`);
out.push(`- 없는 ID 를 가리키는 depends_on: ${missingRefs.length ? '**' + missingRefs.map(([a, b]) => `${a} → ${b}`).join(', ') + '**' : '0건'}`);
out.push(`- frontmatter 를 읽지 못한 문서: ${parseErrors.length ? '**' + parseErrors.join(', ') + '**' : '0건'}`);
out.push(`- blocked: ${blocked.size ? [...blocked].map(short).join(', ') : '0건'}`);
out.push(`- blocked 의 후행(실행 대상에서 제외): ${blockedDesc.size ? [...blockedDesc].map(short).join(', ') : '0건'}`);
out.push(`- 실행 대상 중 진입 차수 0(지금 열 수 있는 후보): ${runnable.filter((i) => tasks.get(i).deps.every((d) => !tasks.has(d) || tasks.get(d).status === 'completed')).filter((i) => tasks.get(i).status !== 'completed').map(short).join(', ') || '없음'}`);
out.push('');
out.push('## 4. 의존 경로 없는 파일 겹침 쌍');
out.push('');
if (!overlaps.length) out.push('0건');
else { out.push('| 태스크 쌍 | 겹치는 파일 |'); out.push('|---|---|'); for (const o of overlaps) out.push(`| ${short(o.a)} ↔ ${short(o.b)} | ${o.shared.map((f) => '`' + f + '`').join(', ')} |`); }
out.push('');
out.push('### 공유 런타임 자원 후보 (패턴 일치. 처리는 LOOP.md 8절 자원 충돌 표)');
out.push('');
if (!resources.length) out.push('0건');
else { out.push('| 자원 그룹 | 종류 | 태스크 (파일) |'); out.push('|---|---|---|'); for (const r of resources) out.push(`| ${r.group} | ${r.kind} | ${r.hits.map((h) => `${short(h.id)} (${h.files.map((f) => '`' + f + '`').join(', ')})`).join('<br>')} |`); }
out.push('');
out.push(`### files 가 빈 태스크`);
out.push('');
out.push(emptyFiles.length ? emptyFiles.join(', ') : '0건');
out.push('');

const text = out.join('\n');
if (toStdout) process.stdout.write(text);
else { writeFileSync(outPath, text, 'utf8'); console.log(`DAG.md 작성: ${relative(root, outPath)} (태스크 ${ids.length}개, 실행 대상 ${runnable.length}개, 폭 최댓값 ${maxWidth}, 겹침 ${overlaps.length}쌍, 순환 ${inCycle.length}, 없는 참조 ${missingRefs.length})`); }
process.exit(inCycle.length || missingRefs.length || parseErrors.length ? 1 : 0);
