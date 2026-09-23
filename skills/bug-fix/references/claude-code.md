# Claude Code 환경 보조 지침 (bug-fix)

## 진입 조건 확인

0단계는 Read·Grep 으로 끝난다 — `plan_setup/STATE.md` 의 `Phase Overview` 에서 `in_progress` 검색, `docs/PRD.md` 머리의 `as-is` 표기, `harness_setup/HARNESS.md` 1절 게이트 상태.
`git status --porcelain` 으로 미커밋 변경을 본다. 걸리면 AskUserQuestion 을 쓰지 말고 평문으로 사실과 갈 곳을 알리고 멈춘다 — 진입 조건은 선택지가 아니다.

## 버그/요구 변경 판정의 질문

1단계에서 as-is 기준에 걸린 OQ 의 답을 모르면 AskUserQuestion 으로 묻는다. 선택지는 셋 — "의도가 아니었다(버그)" / "의도였다" / "모른다(코드가 드러낸 의도로 판정)". 셋째를 빼지 않는다 — OQ 종류가 `확인` 이라 사용자도 모를 수 있고, 찍은 답이 LOG 에 사실로 남는다.
질문 2(새 결정이 필요한가)는 묻지 않는다. 기대 동작 한 줄을 써 보고 걸리는 결정이 있으면 feature-add 로 판정해 보고한다 — 그 결정을 여기서 사용자에게 받아 버리면 PRD 에 없는 규칙이 코드에만 생긴다.

## 재현과 게이트 실행

앱은 `harness_setup/scripts/local-dev.*` 로 띄운다(Bash 또는 PowerShell 도구). **종료 코드를 그대로 읽는다.** 포트를 다른 프로세스가 쓰고 있으면 `taskkill`·`kill` 로 내리지 않는다 — 사용자의 프로세스다.
HTTP 재현은 `curl` 또는 `node -e "fetch(...)"`. 앱을 못 띄우면 결함이 있는 식을 `node -e` 로 그 입력값에 돌려 재현 수단을 "코드 단위" 로 적는다.
회귀 검사의 "고치기 전 실패" 는 코드를 고치기 전에 게이트 명령(정의서의 `## 명령`)을 돌려 출력의 `fail` 수와 실패 메시지로 확인한다. 출력 요약을 LOG 줄에 옮긴다.

## 분리 검증

`LOOP.md` 구동기대로 연다. 구동기가 헤드리스 자식이면 Bash 로 `claude -p "<6단계 지시문>"` 을 **읽기 전용 허용 목록**으로 돌린다(`LOOP.md` 4절의 검증 토막 허용 목록). 서브에이전트(Agent 도구)는 LOOP.md 가 그것을 분리 수단으로 적어 둔 경우에만 쓴다 — 상위 세션의 권한을 물려받고, 이 세션이 판정을 받아 읽으므로 구현자의 판단이 섞이기 쉽다.
지시문에는 LOG.md 경로가 아니라 재현 줄의 문장을 넣는다.

## 다음 스킬 연결

이 스킬이 부르는 것은 `harness-update` 하나다(4단계). Skill 도구로 부르고 SKILL.md 4단계의 호출 지시를 BUG-NN·파일·케이스 이름을 채워 넘긴다. Skill 도구가 없으면 `skills/harness-update/SKILL.md` 를 읽어 그 절차를 직접 따르되 같은 지시를 자기에게 적용한다.
feature-add 로 돌릴 때는 부르지 않는다 — 판정과 넘길 요청 문장을 보고하고 끝낸다. 사용자가 이어서 원하면 그때 feature-add 가 새로 시작한다.

## 파일 작성

`LOG.md` 는 Edit 으로 **끝에 덧붙인다**(마지막 줄 뒤). 기존 줄을 바꾸지 않는다. Write 로 파일을 통째로 다시 쓰지 않는다.
커밋은 `git add <바뀐 파일 경로들>` 뒤 `git commit -m "BUG-NN: <제목>"`. `git add -A` 를 쓰지 않는다.
