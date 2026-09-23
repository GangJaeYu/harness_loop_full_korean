# 개발 루프: Deskwork (가칭)

- **입력 문서**: plan_setup/(PLAN.md·phase·task·STATE.md·LOG.md), harness_setup/(HARNESS.md·quality_gates/)
- **전제**: 한 태스크에 구현 세션 하나. 검증과 반영은 별도 세션(4절의 세 토막). **병렬 운용**(8절) — 동시 상한 3, 오르카 구동(②), 격리 1. 폭이 1인 구간은 단일과 같다
- **읽는 순서**: 세션을 열면 이 문서 → `plan_setup/STATE.md`. **구동기가 준 지시문이 토막을 지정하면 그 지시문이 0절 6번보다 앞선다.** 워커는 문서를 코디네이터 트리(8절)에서 읽는다
- **작성**: 2026-09-23, loop-setup. 규칙은 이 파일에만 있다. 그림은 `loop_setup/DAG.md`(생성물). 고칠 때는 `loop-update`

## 0. 세션을 열 때

1. 이 문서와 `STATE.md` 를 읽는다
2. `STATE.md` 의 `Task Status` 와 태스크 문서의 `status` 가 어긋나면 **태스크 문서 기준으로 맞추고** LOG.md 에 남긴다 (앞 세션이 기록 도중 끊긴 흔적)
3. `Retry` 절에 그 태스크의 이력이 있으면 **거기서 이어받는다.** 앞의 시도를 반복하지 않는다
4. **`Standing Decisions` 의 만료를 확인한다** — 각 항목이 걸린 게이트의 **활성 시점 태스크**(게이트 정의서, 없으면 `HARNESS.md` 1절 표)가
   이미 `completed` 면 그 승인은 죽은 것이다. `HARNESS.md` 표의 `활성` 표시를 기다리지 않는다(표는 한 박자 늦는 요약이다).
   **지우고 `LOG.md` 에 한 줄 남긴다.** 지우는 것은 봐주는 것을 없애는 방향이라 루프가 해도 된다. **범위를 넓히는 것은 `loop-update`** 다
5. `Next Action` 에 **`답:`** 줄이 있으면 사람의 답이다. 반영하고 `질문:`·`답:` 두 줄을 지운 뒤 `LOG.md` 에 남긴다.
   미활성 승인 → `Standing Decisions` 에 범위·기한과 함께 / 3회 소진의 답 → 3절 "이어서·건너뛰라" / `답: 해소 OQ-0xx` → 2절 차단 해소 /
   phase 완료 묶음 실패의 답 → `답: 재판정`(반영 토막으로 phase 판정 재실행) 또는 `답: <ID> 다시`(그 태스크 `in_progress`·`Cycle 0`) /
   수용 기준 재작성 → `plan-generator` 10단계로 넘기고 종료. 어느 종류에도 안 맞거나 처리 도중 막히면 `답:` 을 지우지 말고 `질문:` 을 새로 적고 종료한다.
   `알림(<주체>, ~<만료>):` 줄은 답이 아니다 — 그 주체가 처리한 뒤 지운다
6. 어느 토막인지 정한다 — **병렬(이 프로젝트)에서는 지시문의 `태스크: <ID>` 와 `Assignments` 의 그 행이 토막을 정한다.**
   (단일로 돌 때만: 판정 파일이 있으면 반영, `Last Verification` 이 `task_validation 미활성` 이면 판정 없이 반영, `task_validation 대기` 면 할 일 없음, 그 외 구현)
   반영 쪽은 판정 파일의 **마지막 줄이 `END` 인지** 먼저 본다 — 없으면 잘린 것(4절). 그다음 `LOG.md` 의 마지막 줄이 이미 그 판정을 담고 있으면
   앞 반영이 파일을 지우기 전에 죽은 것이므로 파일만 지우고 다음 단계를 잇는다. 판정을 두 번 기록하지 않는다
7. **phase 를 열 때**(앞 phase 가 `completed` 가 되고 다음 phase 첫 태스크를 배정하기 직전) 두 가지를 확인한다. 걸리면 그 phase 를 열지 않고 `질문:` 을 남긴다
   - 만료된 `알림(…, ~<만료>):` → `질문: 처리되지 않은 알림 n개 — 처리 / 다음 phase 까지 연장 / 폐기`
   - 9절 미결 중 `언제` 가 지금인 것 → `질문: <ID> 판단 시점 도달 — <선택지>`
   (병렬에서는 **2·4·5·7 이 코디네이터의 일**이고 워커는 읽기만 한다)

## 1. 한 사이클

한 태스크는 **구현 → 검증 → 반영** 세 토막이고 토막마다 세션이 다르다(4절).

| # | 토막 | 단계 | 근거 |
|---|---|---|---|
| 1 | 반영(코디) | 배정 — 실행 가능 태스크를 빈 슬롯에 주고 태스크 문서 `in_progress`, `Assignments` 행 추가, 그 phase 첫 태스크면 `Phase Overview` 를 `in_progress` | 2·8절 |
| 2 | 구현 | **시작 전 하네스 점검** — 부족하면 구현하지 않고 `STATUS: 하네스 부족` | 7절 |
| 3 | 구현 | 태스크 구현 — `files` 와 `architecture` 안에서만 | 2절 |
| 4 | 구현 | `local-dev` 로 자기 트리의 환경 준비 | 6절 |
| 5 | 구현 | `verification` 의 `lint`·`unit`·`e2e` 를 **순서대로**. 실패하면 3절대로 **분류 → (진짜 결함만) 수정 → 재실행**을 이 세션 안에서(최대 3회) | 3절 |
| 6 | 구현 | 출력 블록 `STATUS: task_validation 대기`(미활성이면 `task_validation 미활성`)를 결과 파일에 쓰고 **닫는다**. 3회 소진·환경 문제·판정 불가도 블록으로 넘기고 닫는다 | 4·8절 |
| 7 | 반영(코디) | 블록을 `Retry History`·`LOG.md` 로 옮기고 행을 `검증`(미활성이면 승인 확인 → 12번) | 4절 |
| 8 | 검증 | **새 세션**이 `task_validation` 만 돌려 판정 블록(+ `END`)을 쓰고 닫는다 | 4절 |
| 9 | 반영(코디) | 판정을 `STATE.md`·`LOG.md` 로 옮긴다 | 5절 |
| 10 | 반영(코디) | FAIL 이면 **분류** → 진짜 결함은 행을 `수정` 으로(같은 슬롯의 새 구현 세션이 고친다, `Cycle` +1) → 다시 6번 | 3절 |
| 11 | 반영(코디) | 전부 통과하면 완료 판정 (미활성 게이트는 `Standing Decisions` 승인 확인) | 5절 |
| 12 | 반영(코디) | 태스크 `status: completed` → `STATE.md` → `LOG.md` → 커밋·병합·기본 브랜치 fast-forward | 5·8절 |
| 13 | 반영(코디) | **완료 후 하네스 점검**, **반복 판정** | 7·3절 |
| 14 | 반영(코디) | phase 의 모든 태스크가 끝났으면 phase 판정 | 5절 |
| 15 | — | 세션을 닫는다. 다음 태스크는 새 구현 세션 | 4절 |

**원본 17단계에서 바꾼 것**: 게이트 이름을 사이클에 박지 않고 `verification` 값으로 연다 / `task_validation` 앞뒤에 세션 경계 / 실패 수정 앞에 **분류**, 완료 앞에 **미활성 확인** / 기록을 시작·전이·완료 세 번 / 원본 본문의 "성공하면 커밋"을 되살림 / 병렬이라 태스크 선택은 워커가 아니라 코디네이터가 한다.

## 2. 태스크 선택 (코디네이터가 판정한다)

| 규칙 | 판정 근거 (frontmatter) |
|---|---|
| `blocked` 는 실행하지 않는다 | `status: blocked`·`blocked_by`. 현재 `phase-06-task-01`~`12` 12건(OQ-001·007·009·010, CF-006). 사람이 미결을 풀어야 열린다 |
| dependency 미완료는 실행하지 않는다 | `depends_on` 이 전부 `completed` |
| 한 번에 하나만 완료로 전환한다 | 도착한 판정은 순서대로 하나씩 병합·완료. `failed` 인 행은 `Next Action` 에 `답:` 이 있을 때만 이어받는다 |
| 범위를 확장하지 않는다 | `files`·`architecture` 밖은 건드리지 않는다. 고쳐야 하면 고치지 말고 보고(`STATUS: failed: 범위 밖 수정 필요 <파일>`) — 나누는 것은 Layer 3 |
| 모호하면 추측하지 않고 멈춘다 | 관찰 불가능한 수용 기준은 Layer 3으로 |
| 현재 phase 가 끝나기 전에는 다음 phase 를 열지 않는다 | `Phase Overview` 에서 현재 phase 가 `completed` 가 아니면 다음 phase 태스크는 `depends_on` 이 차 있어도 배정하지 않는다 |
| `DAG.md` 에 없는 태스크는 배정하지 않는다 | `알림(loop-update, ~다음 phase 전): DAG 에 없는 태스크 <ID>` |

첫 태스크: **`phase-01-task-01`** (진입 차수 0 인 유일한 노드).
**실행 가능 0개인데 미완료가 남았으면** 차단 대기이거나 순환이다(`DAG.md` 3절: 순환 0건). 전자는 `Next Action` 에 `배정 없음: 차단 대기 — OQ-001·OQ-007·OQ-009·OQ-010·CF-006 을 풀면 phase-06 12개가 열린다` 를 남긴다. `blocked_by: [폐기]` 는 보고에 넣지 않는다.

### 차단 해소
사용자는 `Next Action` 에 **`답: 해소 OQ-0xx`** 로 알린다(대화형이면 말로). **코디네이터**가 0절 5번에서 배정보다 먼저 한다:
①앞 문서(PRD 8절·TRD 12절·overview.md 7절)에 해소가 반영됐는지 **그 표 한 줄만** 확인 — 안 됐으면 열지 않고 `답:` 을 지우지 말고 `질문: OQ-0xx 해소가 <문서 절>에 반영되지 않았다. 문서를 고친 뒤 다시 알려 달라` →
②`PLAN.md` 5절 차단 표에서 그 ID 를 `blocked_by` 에 가진 태스크를 찾는다 → ③`blocked_by` 에서 지우고, 비면 `status: pending` →
④답이 수용 기준을 바꾸면 `blocked` 그대로 두고 "수용 기준 재작성 필요(Layer 3)"를 `Next Action` 에 → ⑤`STATE.md`·`LOG.md`(`### <ID> Unblocked (OQ-0xx 해소).`) →
⑥`harness-update` ①(대기 → 미활성: unit 커버 영역 '공유 토큰'·'고지 문구', e2e FLOW-09·FLOW-10). ②③이 필요하면 `질문:`. 그리고 `알림(loop-update, ~다음 phase 전): 차단 해소로 DAG·충돌 표 재검토`.

## 3. 게이트

**태스크의 `verification` 값 = `harness_setup/quality_gates/` 아래 같은 이름의 문서.** 지금 61개 태스크 전부 `[lint, unit, e2e, task_validation]` 이다.

| 게이트 | 어디를 읽나 | 판정 |
|---|---|---|
| `lint`·`unit`·`e2e` | 정의서의 `## 명령` 절 명령 한 줄 | 돌려서 **종료 코드**로 |
| `task_validation` | `## 절차`·`## 판정 형식` | **세션을 열어** 판정 블록을 받아서(4절) |

**`task_validation.md` 에는 `## 명령` 절이 없다.** 넷째는 명령이 아니라 세션이다. 앞 셋의 통과를 넷째의 통과로 읽지 않는다.
**명령을 이 문서에 베껴 적지 않는다** — 하네스가 갱신되면 베낀 쪽이 낡는다. 매번 정의서에서 꺼낸다.
순서는 `lint → unit → e2e → task_validation` 고정(배열 순서가 아니라 이 순서). **앞이 실패하면 뒤를 돌리지 않는다.** `e2e` 와 `task_validation` 앞에는 `local-dev` 가 성공해 있어야 한다(unit 의 통합 테스트도 DB 가 필요하다).

### 활성 시점과 미활성
활성 시점은 정의서의 `## 활성 시점` 에서, **없으면 `HARNESS.md` 1절 표에서** 읽는다(`task_validation` 이 그렇다). 두 곳이 다르면 정의서가 이긴다. 지금 값:

| 게이트 | 활성 시점 (그 태스크가 `completed` 가 된 뒤부터) | 출처 |
|---|---|---|
| lint | `phase-01-task-01` | lint.md |
| unit | `phase-01-task-01` — 그중 **통합 테스트(실제 DB)는 `phase-01-task-02`** | unit.md |
| e2e | `phase-02-task-07` | e2e.md |
| task_validation | `phase-01-task-01` | HARNESS.md 1절 표 |

그 태스크가 아직 `completed` 가 아니면 **결과가 무엇이든 `미활성`** 이다 — 돌려도 되고 건너뛰어도 되지만 통과로도 실패로도 읽지 않는다
(`package.json` 이 없어 나는 오류, 테스트 0건, `no tests found` 가 전부 여기다). **활성 시점 이후에는 반드시 돌린다.** 그때 "검사 대상 없음"이면 `harness-update` 다.
**`부분 활성`** 은 활성 시점이 하나가 아닐 때다 — 이 프로젝트에서는 unit 이 `phase-01-task-01` 완료 ~ `phase-01-task-02` 완료 사이(통합 테스트 부분이 아직 없음), e2e FLOW-07 이 `phase-02-task-08` ~ `phase-05-task-05` 사이. 표기를 붙이는 것은 `harness-update`, 루프는 읽기만 한다.
`대기` 는 blocked 에 걸린 것(FLOW-09·FLOW-10, unit 커버 영역 둘)이고 루프가 올리지 않는다. 어휘 넷(`활성`·`부분 활성`·`미활성`·`대기`) 밖의 이름을 만들지 않는다.
미활성 게이트를 달고 완료시킬지는 **사람이 정한다** — `STATE.md` 의 `Standing Decisions` 에 승인이 있으면 따른다(세팅 때 게이트별로 받아 두었다). 승인은 그 게이트가 활성되면 만료된다(0절 4번). **무기한 승인을 만들지 않는다.**

### 실패 — 고치기 전에 분류한다

| 분류 | 알아보는 법 | 무엇을 고치나 | 게이트 재실행 |
|---|---|---|---|
| 진짜 결함 | 같은 순서를 수동으로 밟아도 같은 결과 | **코드** | **최대 3회, 처음부터 전부** |
| 낡은 스펙 | 화면·규약이 의도적으로 바뀌었고 게이트가 옛 정의를 본다 | 흐름 정의 (`harness-update`) | 고쳐진 뒤 1회, 실패한 게이트부터 |
| 환경 문제 | `local-dev` 가 **0이 아닌 코드로 끝났다**(6절), `npm audit` 네트워크 실패, 검증자의 `RESULT: 환경 문제` | 환경 (재준비 → `harness-update`) | 재준비 뒤 1회, 실패한 게이트부터 |
| 흔들림 | 재시도로 살아난 통과(`flaky`)가 1건이라도 / 같은 코드로 결과가 다르다 | **그 테스트** (`harness-update` ① 안정화. 단언을 빼는 것은 ③) | 고쳐진 뒤 1회, 실패한 게이트부터 |
| 판정 불가 | 수용 기준이 관찰 가능하게 쓰이지 않았다 | 태스크 문서 (Layer 3) | 0회 — 즉시 중단 |

"재시도를 세지 않는다"는 "봐준다"가 아니다 — 다섯 갈래 전부 그 태스크는 통과가 아니다. 뒤 넷은 고칠 곳이 코드가 아니라서 세지 않을 뿐이고, 그 1회는 예산이 아니라 **고친 것이 고쳐졌는지 보는 확인 실행**이다.
**같은 분류가 그 태스크에서 두 번째로 나오면 멈춘다.** 코드가 아닌 갈래도 한 태스크에서 **합쳐 3회** 쌓이면 멈춘다. 흔들림을 남겨 둔 채 진행하지 않는다 — 흔들리는 게이트는 꺼진 게이트다.
**재실행은 실패한 게이트부터**, 앞 게이트는 제품 코드가 바뀌었을 때만 다시(`진짜 결함` 만 처음부터 전부 — lint 는 프로젝트 전체를 돈다).
**검증자가 "환경이 이상해 판정을 멈췄다"고 하면 `FAIL` 이 아니라 환경 문제다.** 안 뜬 화면을 보고 FAIL 을 적으면 멀쩡한 코드를 세 번 고치게 된다.

**실패마다 `LOG.md` 에 이 형식의 줄을 남긴다** — `- 실패: <태스크 ID> / <게이트> / <검사 ID> / <분류>` (검사 ID = `FLOW-xx`·테스트 파일 경로·lint 규칙 이름).
**반복 판정**(코디네이터 지시문 2.5): 같은 검사 ID 가 **서로 다른 태스크 ID 둘 이상**에서 나오면(그 ID 의 마지막 `- 반복 처리:` 줄 뒤만 센다) 태스크 카운터와 무관하게 처리한다.
고칠 것이 테스트 안정화·흐름 정의 보정(`harness-update` ①)이면 지금 한다. ②③이 필요하면 **`질문:` 을 남기고 새 배정을 멈춘다**(돌던 행은 끝까지). `알림:` 으로 미루지 않는다. 처리했으면 `- 반복 처리: <검사 ID> → <무엇을 했나>`.
(격리 1이라 슬롯끼리 DB 를 공유하지 않는다. 그래도 DB·앱을 쓰는 테스트가 슬롯 사이에서 반복해 흔들리면 격리 설정(8절 슬롯 표·`.env.local`)부터 의심하고 `loop-update` 를 `질문:` 으로 올린다.)

### 재시도 3회
```
실행 1회차 실패 → 수정1 → 재실행 → 실패   (사이클 1)
              → 수정2 → 재실행 → 실패   (사이클 2)
              → 수정3 → 재실행 → 실패   (사이클 3) → 중단·보고
```
**세는 것은 수정 횟수이고 `진짜 결함` 만 센다.** 카운터는 태스크마다(`Retry` 의 그 태스크 블록). 구현 세션 안의 사이클과 반영 뒤 `수정` 행의 사이클을 **합쳐** 센다.
**3회는 원본 사양이 못 박은 값이고 루프가 조정하지 않는다.** 늘려 달라는 요청에는 상한을 지우지 않고 **분류가 먼저**라고 답한다 — 세 번이 부족했던 이유는 대개 그중 몇 번이 환경 문제나 흔들림에 소모됐기 때문이다. 늘리려면 원본 사양을 고치는 결정이다.
**소진하면 일시 중단하고 사용자에게 보고한다.** 스스로 기준을 낮춰 풀지 않는다. 남길 것: 태스크·`Task Status` 의 `failed` / `Last Verification` 의 그 태스크 줄 / `Retry` 이력(시도마다 게이트·검사 ID·분류·무엇을 했나) / `Next Action` 의 `질문:`(선택지 포함) / `LOG.md` 의 관찰(추정이 아니라 "무엇을 했더니 무엇이 보였다").
**미커밋 변경은 그 워커 트리에 그대로 둔다** — 커밋도 되돌리기도 하지 않는다. 행은 `정지` 로 슬롯을 점유한다.
- **"이어서"** → `status: in_progress`, `Cycle` 0, **`History` 유지**, 행을 같은 슬롯의 `수정` 으로, LOG `사용자 승인으로 재시도 예산 갱신`. 구현 모델 한 급 올림(8절)
- **"건너뛰라"** → 그 워커 트리를 `git -C <트리> reset --hard coordinator && git clean -fd`(`files` 되돌리기의 병렬판. `files` 밖 변경이 있었으면 보고), `failed` 유지, 행·`Retry` 블록 비움, LOG. 후행은 자동으로 열리지 않는다 → `알림(plan-generator, ~다음 phase 전): <ID> 건너뜀 — 폐기 또는 재작성 필요, 막힌 후행 n개`

### `알림:` 형식
`알림(<처리 주체>, ~<만료>): <내용>` — 주체는 `사람`·`plan-generator`·`harness-update`·`loop-update`, 만료 기본은 다음 phase 를 열기 전. 루프가 스스로 할 수 있는 것(`harness-update` ①)은 알림으로 남기지 않고 지금 한다. 처리한 쪽이 지운다. 연장은 만료만 바꾸고 LOG 에 한 줄.

## 4. 세션 경계와 구동기

한 태스크에 **구현 세션 + 검증 세션**, 반영은 **코디네이터 자식**이 겸한다(①-병렬·②).
**검증 세션에 주는 것**: 태스크 문서 경로 / 실행 중인 앱 주소(그 슬롯의 `APP_BASE_URL`) / `quality_gates/task_validation.md` / 판정 블록 출력 지시 / (필요 시) 태스크 `architecture` 가 가리키는 설계 절(`docs/ARCHITECTURE/`)
**주지 않는 것**: 구현 세션의 대화·요약·"무엇을 했는지" / 통과 보고·자체 점검 / 원인 추정·"여기를 봐 달라" / 파일 목록·diff·커밋 메시지·최근 변경 파일 / 앞 게이트 통과 사실 이상의 로그 — **주지 않는 목록이 이 게이트의 실질이다.**

**이 프로젝트의 분리 수단**: **오르카 검증 워커** — 구현 워커가 `worker_done` 으로 끝난 뒤 **같은 슬롯에 새로 띄우는 별도 에이전트 세션**(빈 컨텍스트, 검증 지시문만 받는다).
(`task_validation.md` 는 "서브에이전트"를 분리 수단으로 적었지만 이 루프는 더 강한 분리인 새 세션을 쓴다 — 정의서 문구 정정은 `harness-update` 몫, 보고에 올렸다.)
**수단이 없으면(오르카·claude 둘 다 못 띄우면) `task_validation` 을 `미활성` 으로 두고 사용자에게 알린다.** 같은 세션이 구현하고 판정한 것을 통과로 적지 않는다.
검증 워커는 **오르카 워커라 허용 목록을 줄 수 없다** — "쓰기·git 금지"는 지시문으로만 지켜진다(8절 권한 안내).
태스크가 끝나면 세션을 닫는다. 이어서 다음 태스크를 하지 않는다.

**판정 블록**: `task_validation.md` 의 '판정 형식' 그대로 + **마지막 줄 `END`**(전달 확인용. 없으면 잘린 것). `RESULT` 는 `PASS | FAIL | 판정 불가`, 환경이 이상해 판정을 멈췄으면 `환경 문제`.
**결과 파일**(기록이 아니라 전달 수단 — 저장소 밖, 태스크 ID 로 파생, 코디네이터가 옮긴 뒤 지운다): `%TEMP%\deskwork-loop\done-<ID>.txt`(구현 출력 블록) · `verdict-<ID>.txt`(판정 블록) · `dispatch-<ID>.txt`(구동 스크립트의 디스패치 표시) · `loop-run.txt`(Run ID). `%TEMP%` = Node 의 `os.tmpdir()`.
**잘린 파일**(`END` 없음): 지우고 행 유지, `Retry History` 에 `구현 중단`/`검증 중단` 한 줄(`Cycle` 미증가). 같은 태스크에서 두 줄째면 `질문:` — 세션 자체가 죽는 원인은 환경이다.

### 구동기
**모드**: **② 오르카 스크립트 구동.** 코디네이터를 상주시키지 않는다 — 판단은 라운드마다 새로 여는 코디네이터 자식(`claude -p`), 기다리기는 구동 스크립트.
**오르카 확인 결과**: 있음 — `orca --version` = `1.4.207` (2026-09-23). 명령 표면은 `orca skills get orchestration` 과 `orca orchestration worker-start|check|reply|worker-release|worker-list|run-use|run-create --help` 로 확인했다.
**구동 스크립트**: `harness_setup/scripts/loop-drive.mjs` — 아래 알고리즘을 옮긴 것. 모델·강도·대기 길이·슬롯은 8절 표에서, 지시문은 이 절의 `text id=` 블록에서 읽는다(스크립트에 박지 않는다).

```
구동 스크립트 (오르카 터미널 안, 코디네이터 트리에서. 밖이면 no_active_sender_terminal)
  시작: %TEMP%\deskwork-loop\loop-run.txt 가 있으면 run-use --id <Run>, 없으면 run-create 후 그 파일에
        dispatch-<ID>.txt 가 남아 있으면 그 워커는 아직 돈다고 보고 다시 띄우지 않는다
  반복 {
    질문: 이 있고 답: 이 없으면 → 새로 띄우지 않는다. 도는 워커가 다 끝나면 멈추고 사람에게
    Phase Overview 전부 completed → 끝
    처리할 것이 있을 때만(첫 라운드 · worker_done 도착 · 도는 워커 0) → claude -p "<코디네이터 지시문>"   ← 빈 대기 뒤에는 부르지 않는다(토큰)
    Assignments 가 비고 Next Action 에 "배정 없음:" 이고 도는 워커 없음 → 멈춤
    Assignments 행 중 구현·수정·검증이고 dispatch 파일도 결과 파일도 없는 행마다:
      슬롯 2 이상이면 그 트리의 .env.local 을 확인(없으면 코디네이터 트리 것을 복사해 8절 슬롯 값으로 치환)
      orca orchestration worker-start --spec "worker-N: <구현|검증 지시문> 태스크: <ID> <병렬 덧붙임> <② 덧붙임>"
            --worktree current(슬롯 1) | path:<worker-N 트리> --agent claude --model <8절> --effort <8절> --json → dispatch-<ID>.txt
    orca orchestration check [--ack <앞 배달>] --wait --types "worker_done,escalation,question" --timeout-ms <8절> --json
      question·escalation → claude -p "<질문 답변 지시문>" → 첫 줄 "답: …" 이면 reply, 아니면 reply "사람 판단 대기 — STATUS: failed: 사람 판단 대기 블록을 쓰고 끝내라"
      worker_done → 결과 파일이 없으면 본문을 그 파일에(END 가 없으니 코디네이터가 중단으로 처리) → worker-release → dispatch 파일 삭제 → 다음 라운드
      빈 대기 → 체크포인트. 3회 연속이면 worker-list 로 생존만 본다. exited 인데 worker_done 이 없으면 dispatch 파일을 지우고 다음 라운드
      배달은 처리한 뒤 다음 check 에서 --ack
  }
```
스크립트는 **판단하지 않고 `STATE.md` 도 쓰지 않는다**(필자는 코디네이터 자식 하나). **phase 경계를 그냥 지난다** — 코디네이터 교체 없음, 판단 자식은 매 라운드 빈 컨텍스트.
대기는 Run 단위다 — 워커 하나라도 끝나면 다음 라운드, 나머지는 계속 돈다. 사람이 스크립트를 여는 것은 **처음과 `질문:` 에 답한 뒤**뿐이다(8절 구동 시작 명령).
격리 1이라 `e2e 대기` 토막은 없다 — 구현 워커가 자기 슬롯 앱으로 e2e 까지 돈다.

### 지시문 (고정 — 매번 손으로 쓰지 않는다. `{…}` 는 구동 스크립트가 채운다)

구현 지시문 (토막: 구현·수정):
```text id=impl
loop_setup/LOOP.md 와 plan_setup/STATE.md 를 읽고 0절대로 시작하라(문서 경로는 아래 덧붙임의 코디네이터 트리). 태스크 {ID} 하나만 구현하라.
토막이 수정이면 STATE.md 의 Retry 절 {ID} 블록과 Last Verification 의 {ID} 줄이 고칠 대상이다 — 앞의 시도를 반복하지 마라.
시작 전 하네스 점검(7절)을 먼저 하라. 구현은 태스크 문서의 files 와 architecture 안에서만 한다.
local-dev 로 자기 트리의 환경을 준비한 뒤 lint·unit·e2e 를 이 순서로 돌려라. 명령은 harness_setup/quality_gates/<게이트>.md 의 "## 명령" 절에서 꺼낸다. 앞이 실패하면 뒤를 돌리지 마라.
활성 시점(3절 표) 전 게이트는 결과가 무엇이든 미활성으로 적어라. task_validation 은 돌리지 마라.
실패하면 3절대로 먼저 분류하라. 진짜 결함만 고쳐 재실행하고(Retry 의 기존 Cycle 과 합쳐 최대 3회), 낡은 스펙·환경 문제·흔들림·판정 불가는 고치지 말고 STATUS 로 넘겨라.
마지막에 8절 워커 규칙의 출력 블록을 END 까지 만들어라. STATUS 는 task_validation 대기 | task_validation 미활성(task_validation 활성 시점 태스크가 아직 completed 가 아닐 때) | failed: <사유> | 하네스 부족: <무엇>.
커밋하지 말고 미커밋 변경은 그대로 두라. 권한이 거부된 명령이 있으면 그 사실을 LOG 줄에 적고 끝내라.
```

검증 지시문 (토막: 검증):
```text id=verify
다음 태스크의 수용 기준을 실행 중인 애플리케이션에서 관찰해 판정하라.
- 태스크 문서: {COORD}\{TASK_DOC}
- 절차와 판정 형식: {COORD}\harness_setup\quality_gates\task_validation.md
- 애플리케이션: {APP_URL}. 이상하면 작업 디렉터리에서 {LOCALDEV} -Status 로 먼저 보고, 안 떠 있으면 {LOCALDEV} 로 준비하라. 그래도 안 뜨면 RESULT 를 "환경 문제" 로 적고 판정을 멈춰라
- 이 두 문서, 태스크의 architecture 가 가리키는 설계 절(docs/ARCHITECTURE/), 실행 중인 앱 외의 정보는 찾지 마라. 구현 과정·대화 기록·커밋·diff·git 이력·LOOP.md·STATE.md·LOG.md 를 조회하지 마라.
코드를 근거로 PASS 를 주는 것은 수용 기준이 코드를 대상으로 할 때뿐이다(task_validation.md 절차 4).
STATE.md·LOG.md 를 쓰지 말고 코드를 고치지 말고 git 을 쓰지 마라. 판정 블록을 형식 그대로 쓰고 마지막 줄에 END 한 줄을 붙여라.
```

병렬 덧붙임 (구현·검증 워커 공통):
```text id=parallel-add
너는 {WORKER} 다. plan_setup/·harness_setup/ 문서는 코디네이터 트리 {COORD} 에서 읽어라(작업 디렉터리의 문서는 낡았을 수 있다). 0절의 쓰기 항목(2·4·5·7)은 건너뛰어라.
STATE.md·LOG.md·태스크 문서·하네스 문서를 쓰지 마라. 코드·게이트 명령·local-dev 는 작업 디렉터리(자기 트리)에서 돌려라 — 그 트리의 .env.local 이 8절 슬롯 값이다. 다른 워커의 트리를 건드리지 마라.
node_modules 가 없거나 package-lock.json 이 바뀌었으면 npm ci 를 먼저 하라.
(구현) 시작 전 하네스 점검에서 부족하면 구현하지 말고 STATUS: 하네스 부족 으로 끝내라. harness-update 를 부르지 마라.
```

② 덧붙임 (오르카 워커는 표준 출력을 넘길 수 없다):
```text id=orca-add
출력 블록(검증이면 판정 블록)을 {RESULT} 파일에 마지막 줄 END 까지 써라. 그다음 프리앰블의 worker_done 명령에 --report-path {RESULT} 를 붙여 한 번만 보내고 끝내라(블록을 썼으면 --outcome succeeded, 못 썼으면 failed). worker_done 본문은 세 문장 요약이다 — 블록을 담지 마라.
물을 것이 있으면 사람에게 묻지 말고 프리앰블의 ask 로 코디네이터에게 물어라.
```

코디네이터 지시문 (토막: 반영+배정):
```text id=coord
loop_setup/LOOP.md 와 plan_setup/STATE.md 를 읽고 0절대로 시작하라(0절의 쓰기 항목은 네 일이다). 너는 구현하지 않는다. 결과 파일 폴더는 {TMP} 다.
0) 사용자가 기본 브랜치 main 에 직접 커밋한 것이 있으면 git merge main 을 먼저 하라(충돌이면 질문: 과 종료). 그다음 Next Action 의 답: 을 0절 5번대로 반영하라 — 차단 해소(2절), 이어서(같은 슬롯 행을 수정으로, Cycle 0), 건너뛰라(git -C <그 워커 트리> reset --hard coordinator && git clean -fd, 행·Retry 블록 비움, failed 유지, 알림:), 재판정, <ID> 다시(행을 구현으로).
1) {TMP}\done-<ID>.txt 가 있는 행마다: END 가 없으면 워커 중단 — Retry History 에 "구현 중단", 파일을 지우고 행을 유지하라(두 번째면 질문:).
   STATUS 가 "task_validation 대기" 면 행을 검증으로, "task_validation 미활성" 이면 Standing Decisions 승인을 따라 완료 판정으로(승인 없으면 질문:), "failed:" 면 3절대로 Retry·질문: 을 남기고 태스크 문서 failed·행 정지로,
   "하네스 부족" 이면 harness-update 를 ①만 하고 행을 구현으로 되돌려라(②③이면 질문: 과 행 정지). RETRY 줄은 그 태스크의 Retry 블록 History 로(진짜 결함이면 Cycle +1), LOG 줄은 LOG.md 로 옮기고 파일을 지워라.
2) {TMP}\verdict-<ID>.txt 가 있는 행마다: END 를 확인하고(없으면 지우고 행을 검증으로 유지, Retry History 에 "검증 중단", 두 번째면 질문:) 판정을 Last Verification 의 그 태스크 줄과 LOG.md 로 옮기고 파일을 지워라.
   PASS 면 한 번에 하나씩: 태스크 files 경로만 그 워커 트리에서 add·커밋("<ID>: <제목>")하고(슬롯 1 은 이 트리에서) 코디네이터 트리에 병합한 뒤, 태스크 문서 completed → STATE.md(Task Status, Last Verification "<ID> / PASS / —", Retry 블록 삭제) → LOG.md("### <ID> Verification PASS.") → 문서 경로만 add 해 커밋 → git -C {MAIN} merge --ff-only coordinator.
   files 밖 변경이 워커 트리에 남아 있으면 커밋하지 말고 보고하라(범위 확장). 병합 충돌·fast-forward 실패는 풀지 말고 질문: 이다.
   이어서 완료 후 점검(7절, harness-update ①만)·phase 판정(5절 — 완료 묶음은 이 트리에서 local-dev 후 npm run gate:e2e:phase). 행을 지우고 슬롯을 비워라(워커 트리는 git -C <트리> reset --hard coordinator && git clean -fd, 슬롯 1 은 문서 커밋 뒤 git clean -fd).
   FAIL 진짜 결함이면 Cycle +1 하고 관찰을 History 에 적은 뒤 행을 수정으로(같은 슬롯. 3회 소진이면 정지). RESULT 가 환경 문제면 코드를 건드리지 말고 그 워커 트리에서 local-dev 재준비 후 행을 검증으로(두 번째면 질문:). 판정 불가면 질문: 과 행 정지 — 슬롯은 비우지 않는다.
   실패는 LOG.md 에 "- 실패: <ID> / <게이트> / <검사 ID> / <분류>" 줄로 남겨라.
2.5) 반복 판정(3절): LOG.md 에서 같은 검사 ID 가 서로 다른 태스크 둘 이상에 나왔는지 세라(그 ID 의 마지막 "- 반복 처리:" 뒤만). harness-update ①로 고칠 수 있으면 지금 하고, ②③이면 질문: 을 남기고 3) 배정을 건너뛰어라. 처리했으면 "- 반복 처리: <검사 ID> → <무엇을 했나>". 네가 할 수 있는 것을 알림: 으로 미루지 마라.
   phase 를 새로 열 차례면 0절 7번을 먼저 하라 — 걸리면 질문: 과 함께 다음 phase 를 열지 마라.
3) 배정: DAG.md(그래프·폭 표)와 8절 자원 충돌 표로 실행 가능(depends_on 전부 completed, blocked 아님, 현재 phase, 돌고 있는 행과 같은 자원 그룹·단독 규칙에 안 걸림, DAG.md 에 있음)인 태스크를 빈 슬롯 수(상한 3 − 도는 행)만큼 골라 행을 추가하고(토막 구현) 태스크 문서를 in_progress 로 써라. 9절 OQ-025 가 열려 있으면 슬롯 1 만 쓴다.
   슬롯 1 은 이 트리(worker-1), 슬롯 2·3 은 8절 경로의 worker-N 워크트리 — 없으면 git worktree add <경로> -B worker-N coordinator 로 만들어라(.env.local 은 구동 스크립트가 만든다). Assignments 머리줄(동시 n / 상한 3 · 워크트리 목록)을 갱신하라.
   DAG 에 없는 태스크 문서가 있으면 "알림(loop-update, ~다음 phase 전): DAG 에 없는 태스크 <ID>". 배정할 것이 없고 미완료가 남았으면 Next Action 에 "배정 없음: <이유>" 를 남겨라(다음 라운드에 배정하면 지운다).
4) STATE.md 의 Task Status·Current Phase 를 태스크 문서 기준으로 맞추고, 바꾼 문서 경로만 add 해 커밋하고(git add -A 금지 — worker-1 의 작업 중 파일이 이 트리에 있다) 종료하라. 병렬에서 문서를 쓰는 것은 너뿐이다.
```

질문 답변 지시문 (워커의 ask·escalation 을 받을 때):
```text id=qa
loop_setup/LOOP.md 와 plan_setup/STATE.md, 그리고 태스크 {ID} 의 문서를 읽어라. {WORKER} 가 이렇게 물었다: "{QUESTION}"
이 문서들과 harness_setup/ 문서로 답할 수 있으면 첫 줄에 "답: <답>" 만 출력하라.
요구사항 해석·수용 기준 변경·게이트 약화·범위 확장·미결 판단이 필요한 질문이면 답하지 말고, STATE.md Next Action 에 "질문: {ID} — <질문>" 을 적고 첫 줄에 "질문:" 만 출력하라. 그 밖의 파일은 쓰지 마라.
```

스모크 시험 워커 지시문:
```text id=smoke
스모크 테스트다. 어떤 파일도 고치지 마라. 프리앰블의 ask 명령으로 코디네이터에게 "스모크 확인" 이라고 한 번 물어라.
받은 답을 {RESULT} 파일에 "ANSWER: <답>" 한 줄과 마지막 줄 END 로 써라. 그다음 프리앰블의 worker_done 에 --outcome succeeded --report-path {RESULT} 를 붙여 보내고 끝내라.
```

## 5. 완료와 기록

**코드 작성이 끝난 것은 완료가 아니다.** `verification` 의 게이트마다 **활성 상태에서 통과했거나, 미활성이면 `Standing Decisions` 에 유효한 승인이 있어야** 완료다. 커밋 조건도 같다.
기록 순서: **태스크 `status` → `STATE.md` → `LOG.md` → 커밋.** 어긋나면 태스크 문서가 이긴다. 병렬이라 셋 다 **코디네이터가 코디네이터 트리에서만** 쓴다.

| 시점 | STATE.md | LOG.md |
|---|---|---|
| 배정(시작) | `Assignments` 행, `Task Status` 의 그 태스크 `in_progress`, `Retry` 에 그 태스크 블록(Cycle 0). phase 첫 태스크면 `Phase Overview` `in_progress` | `### <ID> Started (worker-N).` |
| 게이트 | `Last Verification` 의 그 태스크 줄 | 통과는 한 줄, **실패는 관찰과 분류** + `- 실패: …` 줄 |
| 재시도 | `Retry` 블록의 `Cycle`(진짜 결함만 +1)·`History`(모든 갈래) | 무엇을 고쳤는가 |
| 검증 대기 | `Last Verification` = `<ID> / task_validation 대기 / —`, 행 `검증`. 미활성이면 `task_validation 미활성` | `### <ID> lint·unit·e2e PASS. task_validation 대기.` |
| 완료 | `completed`, 행 삭제, `Retry` 블록 삭제, **`Last Verification` 을 `<ID> / PASS / —`(미활성 승인이면 `PASS (미활성 승인)`)로 덮어쓴다** — `대기`·`미활성` 이 남으면 같은 태스크가 다시 반영된다 | `### <ID> Verification PASS.` |
| 잘린 판정·출력 | `History` 에 `검증 중단`/`구현 중단`(`Cycle` 미증가). 두 줄째면 `질문:` | `### <ID> 판정 파일 잘림.` |
| 중단 | `failed`, 행 `정지`, `Next Action` 에 `질문:` | 시도와 관찰 |
| phase 완료 | `Phase Overview`(그 phase `completed`, 다음 `in_progress`)·`Current Phase`·phase 문서 `Status: completed`·`Task Status` 를 다음 phase 태스크로 교체 | `### phase-NN Complete.` |
| phase 완료 묶음 실패 | `Phase Overview` 그대로, `Next Action` 에 `질문:` | `### phase-NN 완료 묶음 FAIL — FLOW-xx (분류).` |

관찰은 재현 가능한 문장으로 — "정상 동작 안 함"이 아니라 "무엇을 했더니 무엇이 보였다".
**커밋은 완료 조건을 만족한 뒤에만.** 메시지에 태스크 ID. 커밋에는 그 태스크의 `files` 경로만 넣는다(`.env.local` 같은 비밀값 파일이 딸려 들어가지 않게 — 저장소에 `.gitignore` 가 아직 없다). **merge·rebase 는 루프(워커) 밖, 코디네이터(orchestration)의 일이다.**

**phase 완료**: 모든 태스크 `completed`(`blocked`·`failed` 가 남았으면 완료가 아니다. `blocked_by: [폐기]` 만 예외) **그리고** phase 문서의 Acceptance Criteria 충족 **그리고** phase 완료 묶음 통과.
**phase 완료 묶음**(`e2e.md` 의 `gate:e2e:phase` — FLOW-07 브라우저 3종·375px, FLOW-09 는 `대기`)은 **여기가 유일하게 도는 자리**다. 명령은 `e2e.md` 에서 꺼낸다. 활성 전(`gate:e2e:phase` 는 `phase-05-task-05` 가 만든다)에는 미활성이다.
**실패하면 phase 를 완료로 찍지 않는다.** 재시도 3회는 적용하지 않는다(예산은 태스크 단위) — 분류를 먼저 하고, 깨진 흐름과 그것을 만든 태스크를 `질문:` 으로. 답은 `답: 재판정` 또는 `답: <ID> 다시`(0절 5번).
차단으로 `대기` 인 흐름은 실행 대상이 아니고, 부분 구간 값(FLOW-09 의 계약서 PDF 뺀 구간)을 판정으로 쓰지 않는다.
**phase-06 은 12개 전부 blocked 라 phase-05 완료 뒤 루프는 `배정 없음: 차단 대기` 로 멈춘다.** 그것이 정상이다 — 사람이 OQ-001·007·009·010·CF-006 을 풀어야 열린다.

## 6. 환경 준비와 실패 분류의 도구

`local-dev` 명령: **`pwsh harness_setup/scripts/local-dev.ps1`** (작업 디렉터리 = 자기 트리. 스크립트는 **그 트리 루트의 `.env.local`** 을 읽는다)
옵션: `-Status`(아무것도 띄우지 않고 판정만 — 분류에 먼저 쓴다) · `-Reset`(데이터 초기화) · `-Logs` · `-Down` · `-BigSeed`(NFR-001·OQ-015 용) · `-NoApp`

| 코드 | 무엇이 실패했나 | 누가 고치나 |
|---|---|---|
| 0 | 성공 | — |
| 2 | 전제 — Node.js·npm·Docker 없음 또는 Docker 미실행 | **사용자** — 설치·실행 |
| 3 | 환경변수 — `.env.local` 필수 키가 비었다 | **사용자** — 값을 채운다(슬롯 2·3 은 코디네이터 트리 것을 복사하므로 거기만 채우면 된다) |
| 4 | 의존 서비스 — PostgreSQL·Mailpit·브라우저 런타임 | 재준비(`-Reset`) → 안 되면 `harness-update` |
| 5 | 스키마·시드 — `db:migrate`/`db:seed` | 재준비 → 안 되면 `harness-update` (단 `db:*` 스크립트가 아직 없는 `phase-01-task-02` 전에는 미활성 구간이다) |
| 6 | 앱 — `APP_BASE_URL` 무응답 | 재준비 → 안 되면 `harness-update`. 슬롯 2·3 에서만 나면 9절 OQ-025(앱 포트)부터 본다 |

**0이 아니면 그 자체가 환경 문제 확정**이고 추측할 것이 없다. **앱 서버는 세션이 끝나도 살아 있어야 한다** — `local-dev` 가 분리 프로세스로 띄운다. 검증 세션은 `-Status` 로 확인하고 없으면 다시 띄운다.
**이 컴퓨터에는 지금 `pwsh`(PowerShell 7)가 없다**(2026-09-23 확인, Windows PowerShell 5.1 만 있음). 설치 전에는 `local-dev` 가 명령 없음으로 실패하고 그것은 **사람이 고칠 환경 문제**다(9절 OQ-026).

## 7. 하네스 갱신을 부르는 자리

| 언제 | 확인 |
|---|---|
| 태스크 시작 전 (워커) | 수용 기준 판정 수단이 있는가 / 덮는 흐름·커버 영역이 목록에 있는가 / 쓰는 의존 서비스가 `local-dev` 에 있는가 / 게이트 명령이 이 유형에 실제로 걸리는가 |
| 태스크 완료 후 (코디네이터) | 이 태스크가 어느 게이트의 활성 시점인가(01-01·01-02·02-07·05-05) / 흐름의 마지막 조각인가(e2e 흐름표의 활성 phase 열) / 필수 커버 영역을 덮었나(unit 표) / 새 의존 서비스·환경변수 |
| 시점 무관 (코디네이터) | 차단(OQ·CF) 해소(2절 ⑥) / 같은 흐름·검사 ID 의 실패가 두 태스크에 걸쳐 나옴(3절 반복 판정) |

전부 "예"면 부르지 않는다. **"게이트 실패"는 그 자체로 트리거가 아니다** — `낡은 스펙`·`환경 문제`·`흔들림` 으로 분류됐을 때만.
**무인 자식은 ①(상태 반영)만 한다.** ②(범위 확대)·③(약화)은 `질문:`. **병렬에서는 코디네이터만 자기 트리에서 부른다** — 워커는 `STATUS: 하네스 부족` 으로 돌려보낸다.

## 8. 병렬 운용

병렬 여부: **예**(2026-09-23 요청). 동시 에이전트 수 상한: **3**(요청). 구동기: **②**. 격리: **1 — 슬롯별 환경 통째 분리**.

### DAG (태스크 단위)
**그림은 `loop_setup/DAG.md`** — `harness_setup/scripts/dag-render.mjs` 의 출력이고 손으로 고치지 않는다. 태스크가 바뀌면 `loop-update` 가 다시 돌린다.
재생성: `node harness_setup/scripts/dag-render.mjs` → `loop_setup/DAG.md`. 마지막 생성: 2026-09-23, 태스크 61개(실행 대상 49 · blocked 12 · blocked 후행 0 · 순환 0 · 없는 참조 0 · 파일 겹침 0쌍).
규칙: 순환 없음 / 없는 ID 참조 없음 / `blocked` 와 그 후행 제외 / **동시 실행 후보 = 진입 차수 0** / **`files` 가 겹치면 간선이 없어도 동시에 스케줄하지 않는다.**

### 구간별 폭 (DAG.md 2절 요약. 권장 에이전트 = min(상한 3, 폭), 자원 그룹 직렬 반영)
| 구간 | 폭 | 권장 에이전트 |
|---|---|---|
| phase-01 시작 (01-01) | 1 | 1 |
| 01-01 완료 후 (01-02·03·05·06·07·09) | 6 | 3 |
| 그다음 (01-04·08·10) | 3 | 3 |
| phase-02 (최대 02-01·09 / 02-02·03 / 02-04·06 / 02-07·10) | 2 | 2 |
| phase-03 (최대 03-02·04 / 03-03·05) | 2 | 2 |
| phase-04 시작 (04-01·03·09) | 3 | 2 (04-01·04-03 `migration` 그룹 직렬) |
| phase-04 나머지 (04-10·11 에서만 2) | 1~2 | 1~2 |
| phase-05 (05-06·07·08 에서만 3) | 1~3 | 1~3 |
| phase-06 | 0 (전부 blocked) | 0 |

셋째 슬롯이 실제로 쓰이는 곳은 phase-01 과 phase-05 끝뿐이다. 나머지 구간에서 워커 트리 `worker-3` 은 논다.

### 자원 충돌 검사 결과 (코디네이터는 이 표와 `DAG.md` 점선만 본다. 배정 때 다시 검사하지 않는다)
| 태스크(쌍) | 자원 | 종류 | 자원 그룹 | 처리 |
|---|---|---|---|---|
| (파일 겹침) | — | 파일 겹침 | — | **0건** (`DAG.md` 4절) |
| 01-02, 02-01, 02-10, 03-01, 03-04, 04-01, 04-02, 04-03, 05-03, 05-06 (+ blocked 06-01·06-03·06-08) | `migrations/*`, `scripts/migrate.ts` | 공유 런타임(DB 스키마) | `migration` | **그룹 직렬** — 슬롯 DB 는 격리 1이 덮지만, 재사용되는 슬롯 DB 에 번호가 앞선 마이그레이션이 나중에 병합돼 들어오는 순서 역전을 막는다. 실제로 동시 후보가 되는 쌍은 04-01·04-03(04-02·04-03) 뿐 |
| 01-07 | `.env.example` | 공유 런타임(환경 설정) | `env-config` | 그룹 직렬(그룹에 다른 태스크 없음 — 실효 없음). 01-07 완료 후 코디네이터는 새 키가 생겼는지 보고 코디네이터 트리·슬롯 `.env.local` 에 키를 더하라고 `질문:`(값은 사람이 채운다) |
| 01-01 | `package.json`, `tsconfig.json` | 공유 런타임(의존성 매니페스트·도구 설정) | `deps-manifest` | 그룹 직렬(01-01 은 폭 1 구간이라 실효 없음). **뒤 태스크가 의존성을 더하려면 `files` 밖의 `package.json`·`package-lock.json` 을 고쳐야 한다** — 2절 범위 규칙대로 멈추고 보고한다(9절 참고, 보고에 올렸다) |
| (빈 `files`) | — | 빈 `files` | — | **0건** |

### 배정
**코디네이터가 태스크를 나눠 준다.** 구현 지시문에 `태스크: <ID>` 를 넣고 워커는 2절 선택을 건너뛴다. 배정표는 `STATE.md` 의 `Assignments` 이고 병합 전까지 "무엇이 도는가"의 원본이다. 토막 값: `구현`·`수정`·`검증`·`정지`.

### 슬롯과 워크트리
**기본 브랜치**: `main` (`origin/HEAD` 없음, `git branch --show-current` = `main`). **여기서는 아무도 작업하지 않는다** — 사용자의 자리. 완료된 태스크만 fast-forward 로 들어온다.
**main 트리**: `D:\work\deskwork` (지시문의 `{MAIN}`)
**코디네이터 트리**: 아래 표 `worker-1` 행의 경로, 브랜치 `coordinator`. 코디네이터(문서의 유일한 필자·배정·병합·`harness-update`·phase 완료 묶음) + 슬롯 1 의 `worker-1`. 코디네이터는 **문서 경로만 add** 한다(`git add -A` 금지).
**워커 트리** `worker-2`·`worker-3`: 형제 폴더(저장소가 동기화 폴더 아래가 아니다). 폭 2 구간에 들어갈 때 코디네이터가 `git worktree add <경로> -B worker-N coordinator` 로 만들고 재사용한다. 재배정 직전 `git -C <트리> reset --hard coordinator && git clean -fd`(`git checkout coordinator` 는 다른 워크트리에 체크아웃된 브랜치라 거부된다. `-x` 는 쓰지 않는다 — `node_modules` 재사용). 폭이 줄어 안 쓰면 **둔다**(컨테이너 한 벌이 남는다 — 내리려면 그 트리에서 `local-dev -Down`).
검증 워커는 구현이 돈 슬롯에서 **이어서** 돈다. 태스크 완료 = 워커 트리 커밋(`files` 경로만) → 코디네이터 트리 병합 → `main` fast-forward(`git -C {MAIN} merge --ff-only coordinator`). 사용자가 `main` 에 커밋했으면 라운드 시작 때 코디네이터 트리에 `git merge main` 을 먼저.
오르카 화면의 카드 이름은 `orca worktree set --worktree <id> --display-name coordinator|worker-N` 으로 둔다(세팅 때 한 번 — 아직 안 했다, 보고 참고). 슬롯 1 워커는 `--worktree current`, 슬롯 2·3 은 `--worktree path:<트리>`. `main` 에서는 띄우지 않는다.

### 슬롯별 환경 (격리 1 — 슬롯별 환경 통째 분리)
| 워커 | 슬롯 | 트리 | APP_PORT | POSTGRES_PORT | MAIL_SMTP_PORT | MAIL_WEB_PORT | POSTGRES_DB | 컨테이너·볼륨 |
|---|---|---|---|---|---|---|---|---|
| worker-1 | 1 | `D:\work\deskwork-coordinator` | 3101 | 5501 | 1101 | 8101 | `deskwork_slot1` | `deskwork-s1-postgres` · `deskwork-s1-pgdata` · `deskwork-s1-mailpit` |
| worker-2 | 2 | `D:\work\deskwork-worker-2` | 3102 | 5502 | 1102 | 8102 | `deskwork_slot2` | `deskwork-s2-postgres` · `deskwork-s2-pgdata` · `deskwork-s2-mailpit` |
| worker-3 | 3 | `D:\work\deskwork-worker-3` | 3103 | 5503 | 1103 | 8103 | `deskwork_slot3` | `deskwork-s3-postgres` · `deskwork-s3-pgdata` · `deskwork-s3-mailpit` |

값은 각 트리 루트의 **`.env.local`** 에 있다(`APP_BASE_URL`·`DATABASE_URL` 도 같은 포트·DB 로). 사용자의 `main` 트리(기본값 3000·5432·8025, `deskwork-postgres`)와도 겹치지 않는다.
`local-dev` 가 이 변수를 읽는지: **확인함** — 컨테이너 이름·볼륨·DB·포트를 전부 트리 루트 `.env.local` 에서 읽는다(`local-dev.ps1` 3절). `harness-update` 없이 적용된다.
**단 앱 포트는 미확인** — 스크립트는 `npm run dev` 에 포트를 넘기지 않으므로 `APP_PORT` 를 따르는지는 `phase-01-task-01` 이 만드는 `dev` 스크립트에 달렸다 → 9절 OQ-025. 닫히기 전까지 슬롯 1 만 쓴다(폭 1).
슬롯이 여럿이어도 **`task_validation` 분리는 여전히 필요하다.**

### 에이전트·모델 배치 (구동 스크립트가 여기서 읽는다. 이름은 여기에만 — 바꾸면 `loop-update`)
| 역할 | CLI | 모델 | 추론 강도 | 한 급 올리는 조건 |
|---|---|---|---|---|
| 코디네이터 | claude | opus | high | — |
| 구현 워커 | claude | sonnet | medium | `priority: P0` 이고 `files` 3개 이상 / 3회 소진 뒤 "이어서" 재배정 → `opus` |
| 검증 워커 | claude | sonnet | medium | — |
| 스모크 시험 워커 | claude | haiku | low | — |

사용자 선택: **추천대로**(2026-09-23). 급 → 이름: 최상위 `opus` · 보통 `sonnet` · 가벼움 `haiku` (`claude --help` 2.1.280 의 별칭. `fable` 별칭도 있으나 급이 확인되지 않아 쓰지 않았다 — 가정). 자동 대체(`--fallback-model`)는 쓰지 않는다. `--max-budget-usd` 는 걸지 않는다(사용자 선택).
질문 답변 자식도 코디네이터 행으로 띄운다. codex 가 설치되어 있지 않아 검증을 다른 CLI 로 두지 못했다 — 설치하면 `loop-update` 로 검증 워커만 codex 로.
**사용량 = 폭 × 모델**: 동시 워커는 최대 3(대부분 구간 1~2), 전부 `sonnet`. `opus` 는 라운드당 1회의 코디네이터 자식과 질문 답변에만.
**토큰 절약 규칙**: 코디네이터 상주 없음(라운드마다 새 자식) / **빈 대기 뒤에는 코디네이터를 부르지 않는다** / 대기 한 번 15분 / 워커는 문서를 필요한 절만 읽는다(이 문서의 0·3·8절 워커 규칙) / phase 완료 묶음은 phase 끝에만.

| 코디네이터 허용 목록 | `Read,Edit(plan_setup/**),Write(plan_setup/**),Edit(harness_setup/**),Write(harness_setup/**),Bash(git add:*),Bash(git commit:*),Bash(git merge:*),Bash(git worktree:*),Bash(git checkout:*),Bash(git branch:*),Bash(git clean:*),Bash(git reset:*),Bash(git -C:*),Bash(git status:*),Bash(pwsh harness_setup/scripts/local-dev.ps1:*),Bash(npm run gate:e2e:phase:*),Bash(rm -f:*)` |
|---|---|
| 질문 답변 허용 목록 | `Read,Edit(plan_setup/STATE.md)` |

코디네이터에는 **제품 코드 쓰기를 주지 않는다**(쓰기는 `plan_setup/`·`harness_setup/` 경로만). Windows 에서 자식의 셸 도구 이름이 `PowerShell` 이면 `Bash(...)` 를 `PowerShell(...)` 로 바꾼다(`loop-update`).
**오르카 워커(구현·검증)에는 허용 목록을 줄 수 없다** — `worker-start` 에 그 플래그가 없고 워커는 사용자의 claude 권한 설정으로 돈다. 사용자 설정에 허용해야 할 것: 파일 읽기·쓰기, `pwsh harness_setup/scripts/local-dev.ps1`, `npm run gate:lint|gate:unit|gate:e2e`, `npm ci`, `orca orchestration`(프리앰블 명령), 결과 파일 폴더 쓰기. 검증 워커의 "쓰기·git 금지"는 지시문으로만 지켜진다.
권한 전체 건너뛰기(`--dangerously-skip-permissions`)는 쓰지 않는다 — 사용자가 켜지 않았다.

**구동 스크립트**: `harness_setup/scripts/loop-drive.mjs` (모드 ②). 드라이런: `node harness_setup/scripts/loop-drive.mjs --dry-run [--dry-assign <ID>:<worker-N>:<토막>]`.
**구동 시작 명령**: 오르카에서 코디네이터 트리의 터미널을 열고(또는 `orca terminal create --worktree path:<코디네이터 트리> --title loop --command "node harness_setup/scripts/loop-drive.mjs"`) 그 안에서 `node harness_setup/scripts/loop-drive.mjs`.
사람이 여는 것은 처음과 `질문:` 에 답한 뒤뿐이다. 스크립트가 죽었다 다시 뜨면 `%TEMP%\deskwork-loop\loop-run.txt` 의 Run 을 `run-use` 로 이어받는다.
**대기 한 번의 길이**(②): `900000`ms. 빈 대기는 체크포인트다 — 3회 연속이면 `worker-list` 로 생존만 본다.
**스모크 테스트**: **아직 돌리지 않았다**(세팅 환경에서 오르카 워커 생성이 허용되지 않았다). 첫 구동 전에 오르카 터미널에서 `node harness_setup/scripts/loop-drive.mjs --smoke` — `haiku` 시험 워커 하나로 run-create → worker-start → ask/reply → 결과 파일(END) + worker_done → worker-release. 통과하면 이 줄에 날짜와 결과를 적는다(`loop-update`). 드라이런은 2026-09-23 통과(보고 참고).
독립 워크트리에서 작업 / 남의 워크트리를 고치지 않는다 / 공통 파일은 충돌 가능성을 확인한다 / 태스크 완료 후 커밋 / **merge·rebase 는 코디네이터의 책임.** 병합 충돌은 풀지 않고 `질문:`.

### 병렬에서 기록이 꼬이지 않게 하는 두 규칙
**(가) 칸을 넓혔다** — `Current Task`·`Last Verification`·`Retry` 를 태스크별 줄·블록으로(세팅 때 `STATE.md` 를 고쳤다. 옮길 기존 값은 없었다). Layer 3 이 만든 절을 바꾼 것이라 보고에 올렸다.
**(나) 필자를 하나로 줄인다** — 칸을 나눠도 파일 쓰기는 통째로 일어난다. 잠금으로 풀지 않는다(잠근 채 죽은 에이전트가 전체를 세운다).

| 무엇 | 병렬에서 누가 쓰나 |
|---|---|
| 태스크 문서의 `status` | **코디네이터만 자기 트리에서** — 배정 시 `in_progress`, 병합 뒤 `completed`, 정지 시 `failed`. 워커 브랜치는 코드만 바꾼다 |
| `STATE.md` | **코디네이터만.** 넓힌 절은 `태스크: <ID>` 의 줄·블록만 |
| `LOG.md` | **코디네이터만.** 워커는 출력 블록(`LOG:` 줄·판정 블록)을 넘기고 병합 순서대로 append |
| 하네스 문서 (`harness-update`) | **코디네이터만 자기 트리에서.** 워커는 `STATUS: 하네스 부족` |

`STATE.md` 가 실시간이 아니게 되는 것은 감수한다 — 지금 무엇이 도는지가 급하면 태스크 문서(코디네이터 트리)를 본다.

### 워커 규칙 (병렬)
- 코디네이터 트리(위 표 `worker-1` 행)에서 `plan_setup/`·`harness_setup/` 문서를 읽는다. 코드·게이트 명령·`local-dev` 는 자기 트리에서
- 0절의 쓰기 항목(2·4·5·7)을 건너뛴다. 차단 해소·승인 만료·`답:` 반영·phase 열 때의 확인은 코디네이터
- 구현 워커의 출력 블록 — 마지막 줄 `END`, 결과 파일 `%TEMP%\deskwork-loop\done-<ID>.txt` 에 쓴다:
  ```
  TASK: <ID>
  STATUS: task_validation 대기 | task_validation 미활성 | failed: <사유> | 하네스 부족: <무엇이 없나>
  RETRY: <게이트 / 흐름·검사 ID / 분류 / 무엇을 했나>   (구현 세션 안의 사이클마다 한 줄. 없으면 "없음")
  LOG: <LOG.md 에 남길 문장>                              (여러 줄 가능. 실패면 "- 실패: …" 줄 포함)
  END
  ```
- 시작 전 하네스 점검에서 부족을 보면 구현하지 않고 `STATUS: 하네스 부족`. `harness-update` 는 부르지 않는다
- 정지 행은 슬롯을 점유한 채 남는다. `DAG.md` 에 없는 태스크는 배정 대상이 아니다. 완료는 한 번에 하나씩

## 9. 미결

(격리 방식은 8절에서 정했으므로 여기 없다. `언제` 는 루프가 확인할 수 있는 시점 — 코디네이터가 phase 를 열 때와 해당 태스크 완료 후에 본다.)

| ID | 미결 | 종류 | 기본값 | 무엇을 보면 정하나 | 언제 |
|---|---|---|---|---|---|
| OQ-025 | 슬롯별 **앱 포트** 적용 — `npm run dev` 가 `.env.local` 의 `APP_PORT` 를 따르는가 (`local-dev.ps1` 은 포트를 넘기지 않는다) | 차단 | 슬롯 1 만 사용(폭 1) | `phase-01-task-01` 병합 뒤 `package.json` 의 `dev` 스크립트. 따르지 않으면 `질문:` — 고칠 곳은 `package.json`(Layer 3 에 `files` 추가 요청) 또는 `local-dev` 가 포트를 넘기게(`harness-update` ②) | `phase-01-task-01` 완료 후 (폭 2 구간 전) |
| OQ-026 | `pwsh`(PowerShell 7) 미설치 — `HARNESS.md` 의 `local-dev` 명령이 `pwsh` 로 적혀 있다 | 차단 | 없음 — `local-dev` 가 돌지 않는다 | 사용자가 PowerShell 7 을 설치하거나, `harness-update` 가 명령을 `powershell -ExecutionPolicy Bypass -File …` 로 바꾼다 | 첫 구동 전 |

**DAG 와 충돌 표는 순서와 파일 충돌을 덮지만 공유 런타임 인스턴스(DB·앱)는 덮지 못한다.** 그래서 격리 1(슬롯별 DB·메일·앱 포트)을 폭 2 구간 전에 닫는다 — DB 는 조용히 오염된다.
