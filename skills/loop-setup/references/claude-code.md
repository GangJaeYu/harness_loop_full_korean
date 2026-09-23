# Claude Code 환경 보조 지침 (loop-setup)

## 두 입력을 읽는 방법

`plan_setup/` 과 `harness_setup/` 만 읽는다. **PRD·TRD·아키텍처는 읽지 않는다** —
루프는 요구사항을 해석하는 쪽이 아니고, 읽으면 태스크에 적히지 않은 요구를 구현하러 가게 된다.

태스크는 수십 개이므로 **frontmatter 만 기계로 훑는 편이 정확하다.** 이건 눈으로 세면 반드시 틀린다.

```bash
grep -H '^depends_on:\|^status:\|^files:\|^verification:' plan_setup/phase-*/phase-*-tasks/*.md
```

여기서 나오는 것이 DAG 의 재료 전부다 — 노드 목록, 간선, `blocked` 집합, `files` 겹침.
**순환과 미존재 참조는 스크립트로 확인한다.** 태스크가 60개를 넘어가면 사람이 읽어 찾을 수 있는 종류가 아니고,
순환이 하나 있으면 그 태스크들은 영원히 실행 가능이 되지 않는다.

Explore 서브에이전트에게 **"모든 태스크의 frontmatter 를 표로 뽑아라"** 를 시켜도 된다.
다만 루프 규칙 자체(무엇을 언제 멈출지, 무엇을 사람에게 물을지)는 직접 정한다.

하네스 쪽은 **`## 명령` 절의 위치와 `## 활성 시점` 의 태스크 ID** 만 확인하면 된다.
명령 내용을 `LOOP.md` 로 옮겨 적지 않는다 — 하네스가 갱신되면 옮겨 적은 쪽이 낡고,
낡은 명령은 "돌긴 도는데 다른 것을 검사하는" 상태를 만든다.

## `local-dev` 의 실제 옵션을 확인한다

`harness_setup/scripts/` 를 읽어 **실제 파일 이름과 옵션 이름**을 꺼낸다.
`.ps1` 이면 `-Status`, `.sh` 면 `--status` 처럼 표기가 다르다.
`LOOP.md` 에 일반형으로 적어 두면 첫 세션이 그것을 추측하고, 추측이 틀리면 환경 준비가 실패한 채로 게이트가 돈다.

## task_validation 을 분리된 세션으로 돌리는 방법

**분리 수단은 새 세션이고, 이 환경의 기본은 구동기 ①의 헤드리스 검증 자식 `claude -p` 다**(아래 "구동기" 절).
새 프로세스가 빈 컨텍스트로 시작하므로 구현 세션이 무엇을 했는지 모른다.
그것이 이 게이트가 원하는 조건이고, **루프가 그 조건을 실제로 만들어 내는 쪽**이다.
서브에이전트(구동기 ③)도 새 컨텍스트로 시작하지만 상위 세션의 권한을 물려받아 검증 토막만 읽기 전용으로 좁힐 수 없고,
상위 세션이 태스크를 거듭 돌리며 컨텍스트를 쌓으므로 **대안으로만** 둔다. 사용자가 지정할 때 쓴다.

`LOOP.md` 에 **그대로 복사해 쓸 수 있는 지시문**을 적어 둔다. 매번 손으로 다시 쓰면 매번 다른 것이 새어 나간다.
넣을 것은 넷뿐이다.

1. 태스크 문서 경로
2. `harness_setup/quality_gates/task_validation.md` 경로
3. 애플리케이션이 실행 중이라는 사실과 접속 주소
4. 판정 블록을 그대로 출력하라는 지시

그리고 **"이 두 문서, 태스크 문서의 `architecture` 가 가리키는 설계 절, 실행 중인 앱 외의 정보를 찾지 말라"**를 명시한다.
설계 절은 하네스가 허용한 유일한 추가 입력이다 — 수용 기준이 그 절을 인용하는 일이 흔하고, Layer 2가 쓴 것이라 구현 판단이 새지 않는다.
검증 세션은 저장소를 뒤지다 구현 흔적(커밋 메시지, 최근 변경 파일, 작업 메모)을 읽을 수 있는데,
그게 들어가면 분리한 의미가 없어진다. **가장 흔한 누수는 "참고하라"고 붙이는 한 줄 요약**이고,
그 한 줄이 정확히 구현 중에 형성된 판단이다.

**한 세션 안에서 구현하고 같은 세션이 판정하는 것은 이 게이트를 돌린 것이 아니다.**
그렇게 돌 수밖에 없으면 통과로 기록하지 말고 사용자에게 알린다.

## 구동기 — 이 환경에서 세션을 여는 방법

**오르카가 있으면 ②, 없으면 ① 스크립트 구동이 기본이고 둘 다 병렬로 돈다**(11단계). 오르카 유무는 `orca --version` 으로 확인한다.
헤드리스 실행(`claude -p`)은 이 저장소에서 실제로 확인됐다. 아래는 ①의 토막별 명령이고, ①-병렬은 이것을 슬롯 트리마다 띄운다.

```
claude -p "<LOOP.md 의 구현 지시문>" --model <8절 구현 행> --effort <8절 구현 행> --allowedTools "Read,Write,Edit,Bash(<local-dev 경로>:*),Bash(<게이트 명령>:*),Bash(git add:*),Bash(git commit:*),Bash(git restore:*),Bash(rm <판정 파일 경로>)" --output-format text
claude -p "<LOOP.md 의 검증 지시문>" --model <8절 검증 행> --effort <8절 검증 행> --allowedTools "Read,Bash(<local-dev 경로>:*),<HARNESS.md 의 관찰 수단 도구 — 브라우저 MCP 도구 이름 또는 Bash(<e2e 도구>:*)>" --output-format text > <판정 파일 경로>
```

검증 세션의 허용 목록에 **관찰 수단이 빠지면** 검증자는 화면을 볼 수 없어 `판정 불가` 만 내거나, 더 나쁘게는 코드를 읽는다.
브라우저 MCP 도구는 `mcp__<서버>__*` 형태의 이름으로 허용한다. 판정 파일은 저장소 밖(OS 임시 폴더)에 두고 반영 토막이 지운다.
```
claude -p "<LOOP.md 의 반영 지시문>" --model <8절 반영 행> --effort <8절 반영 행> --allowedTools "(구현과 같은 목록)" --output-format text
```

세 지시문이 **구현 → 검증 → 반영** 세 토막이다. 구동기 스크립트는 `STATE.md` 의 `Last Verification` 과 판정 파일 유무만 보고
어느 것을 띄울지 정한다(LOOP.md 4절의 알고리즘). `git commit` 이 허용 목록에 없으면 반영 토막이 완료 뒤 커밋에서 멈춘다.
Windows 에서 세션의 셸 도구 이름이 `Bash` 가 아니라 `PowerShell` 이면 허용 목록의 이름도 그것으로 쓴다.

**모델과 추론 강도는 `--model`·`--effort` 로 토막마다 준다.** 별칭(`opus`·`sonnet`·`haiku`)과 강도(`low|medium|high|xhigh|max`)는 설치된 버전의 `claude --help` 로 확인한다.
값은 LOOP.md 8절 표에서 읽고 스크립트에 박지 않는다. 역할별 모델을 묻는 질문은 AskUserQuestion 하나로 — 선택지 넷(추천대로 / 전부 최상위 / 전부 보통 / 직접 지정)에
`description` 으로 사용량 차이(폭 × 모델)를 적는다. "직접 지정"이면 역할마다 한 번 더 묻는다. `--max-budget-usd` 가 있으면 구현 토막에 상한을 걸어 폭주를 막을 수 있다 — 값은 사용자에게 묻는다.
코디네이터 자식(①-병렬·②)과 ②의 질문 답변 자식은 8절 코디네이터 행의 모델로 띄운다 — 판단만 하는 자리에 보통 급을 쓰면 배정·병합에서 흔들린다.

확인된 동작 셋 — 허용 목록 안의 도구는 승인 없이 돌고, 목록 밖의 쓰기는 **멈추지 않고 거부로 끝나며**
(자식에게 "거부되면 그렇게 적고 종료하라"를 지시문에 둔다), 읽기 전용 셸 명령은 목록에 없어도 통과한다.
자식은 작업 디렉터리의 `CLAUDE.md` 를 자동으로 읽는다 — 12단계에서 넣은 `## 루프` 절이 "LOOP.md 0절부터"를 말하므로, 지시문이 잘리거나 짧아도 규칙은 남는다. 지시문은 4절의 템플릿(LOOP.md 를 직접 가리킨다)을 그대로 쓴다.
`--dangerously-skip-permissions` 는 **사용자가 명시적으로 켠 경우에만** 쓰고, 그 사실을 `LOOP.md` 에 적는다.

**①-병렬**은 라운드마다 코디네이터 트리에서 `claude -p "<코디네이터 지시문>"` 을 한 번 띄우고, `STATE.md` 의 `Assignments` 행마다 그 워커의 자리(슬롯 1 은 코디네이터 트리, 2 이상은 `worker-N` 트리)에서
구현·검증 자식을 **백그라운드로 동시에** 띄워 전부 끝날 때까지 기다린다(PowerShell 이면 `Start-Process -Wait`/`Start-Job`, 셸이면 `&` 와 `wait`).
코디네이터 트리는 세팅 때 `git worktree add <경로> -B coordinator <8절 기본 브랜치>`, 워커 트리는 `git worktree add <8절 경로> -B worker-N coordinator` 로 코디네이터가 만들고, 자식은 그 폴더를 작업 디렉터리로 받는다.
슬롯 1 의 `worker-1` 은 코디네이터 트리에서 돌고 워크트리는 둘째부터다. `main` 에서는 아무것도 띄우지 않는다 — 사용자의 자리다. 재배정 직전 `git reset --hard coordinator && git clean -fd`, 완료마다 기본 브랜치(8절 — `main` 이 아닐 수 있다) fast-forward.
슬롯 경로는 세팅 때 정한다 — 저장소 경로에 `OneDrive`·`Dropbox`·`iCloud`·`Google Drive` 가 들어 있으면 형제 폴더 대신 저장소 안 `.wt/worker-N`(`.gitignore` 추가)이나 동기화 밖 경로를 제안한다.
격리 3이면 스크립트가 `e2e 대기`·검증 행을 슬롯 순서대로 돌리며 앱을 전환한다(`local-dev -Down` → 그 슬롯 트리에서 `local-dev` → e2e 명령 → 검증 자식). 판단이 없는 일이라 스크립트 몫이다.
`DAG.md` 는 `harness_setup/scripts/dag-render.*` 로 만든다 — frontmatter 만 읽는 스크립트라 프로젝트 런타임(Node 면 `.mjs`, 아니면 PowerShell/셸)으로 쓰고 Bash 로 한 번 돌려 본다.
코디네이터 허용 목록은 `Read,Write,Edit,Bash(git add:*),Bash(git commit:*),Bash(git merge:*),Bash(git worktree:*),Bash(git checkout:*),Bash(git clean:*),Bash(<local-dev 경로>:*),Bash(rm <결과 파일 경로>)` 이고 코드 수정 도구는 주지 않는다. 워커에는 `git clean`·`git merge` 를 주지 않는다.
구현 자식의 표준 출력은 `done-<ID>.txt` 로 받는다 — `TASK/STATUS/RETRY/LOG/END` 블록이고 `END` 가 없으면 중단된 것이다.
워커 자식에게는 `plan_setup/`·`harness_setup/` 문서를 읽을 **코디네이터 트리 절대 경로**와 자기 이름(`worker-N`)을 지시문에 넣는다 — 워커 트리의 문서는 낡았다.

**② 오르카**가 있으면 구동기는 **오르카 터미널 안에서 도는 `harness_setup/scripts/loop-drive.*`** 다(LOOP.md 4절의 ② 알고리즘). 코디네이터를 대화형 세션으로 상주시키지 않는다 —
판단은 ①-병렬과 같은 `claude -p "<코디네이터 지시문>"` 이 라운드마다 하고, 스크립트는 `orca orchestration worker-start --spec "worker-N: <지시문>" --worktree current|path:<worker-N 워크트리> --agent claude --model <8절> --json` 으로 띄우고
`orca orchestration check --wait --types "worker_done,escalation,question" --timeout-ms <8절> --json` 으로 받는다(PowerShell 이면 `--types` 값을 따옴표로 감싼다). 받은 배달은 처리한 뒤 다음 `check` 에 `--ack <deliveryId>` 로 확인한다.
응답 JSON 에서 쓰는 값은 `result.deliveryId`·`result.messages[].type`·`id`·`body`·`payload`(문자열 JSON — `taskId`·`dispatchId`·`outcome`)·`result.timedOut` 이다. 오르카 버전마다 표면이 바뀔 수 있으므로 세팅 때 `orca skills get orchestration` 과 `orca orchestration <명령> --help` 로 확인한다.
질문(`question`·`escalation`)은 `claude -p "<질문 답변 지시문>" --allowedTools "Read,Edit(plan_setup/STATE.md)"` 에 넘겨 첫 줄이 `답:` 이면 `orca orchestration reply --id <메시지 id> --body "<답>"` 한다.
오르카 CLI 는 호출한 터미널을 코디네이터로 묶으므로 스크립트는 반드시 오르카 터미널 안에서 돈다(`ORCA_TERMINAL_HANDLE` 이 있어야 한다. 없으면 `no_active_sender_terminal`).
Run ID 는 OS 임시 폴더의 `loop-run.txt` 에 두고 재시작 때 `orca orchestration run-use --id <Run>` 으로 이어받는다. 워커는 대화형 에이전트라 결과를 표준 출력으로 넘길 수 없으므로
출력 블록·판정 블록을 `done-<ID>.txt`·`verdict-<ID>.txt` 에 직접 쓰고 `worker_done --report-path` 로 끝내게 지시문에 덧붙인다. 워커의 모델은 `--model`(오르카가 받는 공급자 모델 id)·`--effort` 로 주고, 응답의 `launch.effective` 로 실제 값을 확인한다.
세팅 때 **스모크 테스트**를 한다 — `orca terminal create --worktree current --title "loop smoke" --command "<loop-drive 스모크 옵션>"` 으로 가벼운 모델의 시험 워커 하나를 띄워
ask→reply→결과 파일→`worker_done`→`worker-release` 가 도는지 본다(2026-09-23 이 저장소에서 1분 안쪽으로 확인한 흐름이다).
오르카 화면에서 카드가 `coordinator`·`worker-1`·`worker-2` 로 보이도록 `orca worktree set --worktree <id> --display-name worker-N` 을 세팅 때 한 번 한다.

**③ 서브에이전트**는 상위 세션이 Agent 도구로 구현·검증을 각각 띄우는 것이다. 클로드 코드에서만 된다.
Agent 도구의 `model` 인자(`opus`·`sonnet`·`haiku`)에 8절 표의 값을 준다. 상위 세션이 코디네이터이므로 상위 세션 자체를 코디네이터 급으로 연다.

어느 모드든 **검증 세션은 `STATE.md`·`LOG.md` 를 쓰지 않는다.** 판정 블록을 출력하고, 옮기는 것은 구동기다.

## 파일 작성

`loop_setup/LOOP.md` 를 Write 로 쓴다. 파일은 하나다.

그리고 **`plan_setup/STATE.md` 를 고친다** — `# Retry` 와 `# Standing Decisions` 두 절을
`Last Verification` 뒤에 끼운다. Edit 로 넣고 기존 다섯 절은 건드리지 않는다.
**앞 레이어의 산출물을 고치는 것이므로 보고에 반드시 올린다.**

`loop_setup/LOOP.md` 가 이미 있으면 읽고 나서 판단한다. `loop-update` 가 조정해 둔 규칙은 초기값으로 덮으면 사라진다.

## 사용자에게 묻는 지점

AskUserQuestion 을 쓰는 자리는 둘이다. **한 번씩만 묻는다.** 첫 자리는 질문 셋을 한 호출에 담는다.

**병렬 운용 (11단계) — 질문 셋.** ①병렬로 갈 것인가: 기본(첫 선택지, Recommended)은 **예**. 아니요면 ①-단일로 적고 격리는 미결로 남긴다.
②동시 에이전트 수 상한: 구간별 폭 표를 먼저 보여 주고 폭의 최댓값·그 절반·1 같은 선택지를 준다 — 폭보다 큰 수는 논다는 것을 `description` 에 적는다.
③격리 방식: 슬롯별 환경 통째 분리 / DB 하나 + 슬롯별 데이터베이스·계정 / 앱 쓰는 게이트만 직렬화. **테스트가 DB 를 쓰면 1·2 중 하나에 (Recommended)** 를 붙여 첫째로 둔다. `option.description` 에 **되돌리기 비용**과
`local-dev` 가 슬롯 변수를 읽는지 확인한 결과를 적는다 — 안 읽으면 1·2는 `harness-update` 가 먼저다. 3은 "병렬 이득이 구현·lint·unit 까지, e2e 와 검증은 슬롯 순서대로. 단 unit 은 병렬로 돌므로 통합 테스트가 공유 DB 를 쓰면 서로 오염된다"를 적는다.
④슬롯 경로(저장소가 동기화 폴더 아래일 때만 묻는다): 저장소 안 `.wt/worker-N` / 동기화 밖 경로. 아니면 형제 폴더를 기본으로 적고 묻지 않는다.
②에서는 에이전트 배치도 같이 받는다 — 구현·검증·코디네이터 각각 claude/codex. 검증을 구현과 다른 에이전트로 두는 선택지를 첫째로 둔다.
DAG 그림은 묻지 않고 그려서 보고에서 검토를 요청한다.

**미활성 게이트를 달고 태스크를 완료시킬 것인가 (8단계).** 초기에는 거의 모든 게이트가 미활성이라
그대로 두면 첫 태스크부터 매번 멈춘다. 한 번 물어 받은 답을 `STATE.md` 의 `Standing Decisions` 에 적는다.
**선택지에 "게이트가 활성될 때까지"라는 범위를 넣는다** — 무기한 승인은 하네스를 끄는 것과 같다.

**재시도 3회·게이트 순서·분리 세션은 묻지 않는다.** 원본 사양과 Layer 4가 이미 정했다.

## 다음 단계 연결

사용자가 검토를 마치고 동의하면 첫 사이클을 시작한다. **동의 전에는 시작하지 않는다.**
루프 문서가 확정되지 않은 채로 구현에 들어가면, 그 세션이 자기 나름의 순서를 만들고 그게 기본선이 된다.

첫 사이클을 시작할 때는 **이 스킬이 아니라 `LOOP.md` 가 안내한다.** 스킬 본문을 다시 읽지 말고
방금 만든 문서와 `STATE.md` 를 읽는다 — 그게 앞으로 모든 세션이 하는 일이고, 여기서 그것이 실제로 되는지 확인된다.
