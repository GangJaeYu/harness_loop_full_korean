# Claude Code 환경 보조 지침 (feature-add)

## 진입 조건 확인

0단계의 둘은 Read·Glob 으로 끝난다 — `plan_setup/STATE.md` 의 `Phase Overview`(`in_progress` 검색), `docs/PRD.md`·`harness_setup/`·`loop_setup/LOOP.md` 존재.
`git status --porcelain` 으로 미커밋 변경을 본다. 걸리면 AskUserQuestion 을 쓰지 말고 평문으로 사실과 갈 곳을 알리고 멈춘다 — 진입 조건은 선택지가 아니다.

## 모호/명확 판정과 번호 읽기

1단계의 넷(무엇·누가·어느 흐름·수용 기준)은 요청 문장과 `docs/PRD.md` 2·3·4절을 Read 해서 판정한다. 경계선이면 AskUserQuestion 으로 묻지 말고 모호로 보고 idea-brainstorm 을 부른다 — 그 스킬이 역질문을 맡는다.
2단계의 마지막 번호는 Grep 한 번씩이다 — `^#### FR-`, `^#### NFR-`, `^\| US-`, `^\| OQ-`(docs/·HARNESS.md·LOOP.md 전체 — 하네스·루프도 미결을 만든다), `^#### TD-`, `^### 3\.`(영역 문서마다), `^\| CF-`, STATE.md 의 `\* \*\*\d\d-`. `## 추가 (\d+)` 는 `docs/` 전체를 Grep 해 최댓값을 잡는다.
섞인 요청(리팩토링·버그)은 선택지로 두지 않는다 — 질문 본문에 "이 부분은 refactor-plan / bug-fix 로 떼어 냅니다" 를 적는다. 선택지로 두면 사용자가 고르고, 그러면 기능 phase 에 섞인다.

## 다음 스킬 연결

Skill 도구로 **순서대로** 부른다 — 모호하면 `idea-brainstorm`(후미 절 모드) → 항상 `prd-generator`(후미 절 모드) → TD 가 새로 생기거나 바뀔 때 `trd-generator`(후미 절 모드) → `architecture-generator`(9단계) → `plan-generator`(10단계) → `harness-update` → `loop-update`.
각 호출에는 SKILL.md 3~8단계의 호출 지시를 프롬프트로 함께 넘긴다 — N·마지막 번호·phase 이름을 값으로 채워서. 스킬 본문은 부른 스킬 것이고, 지시는 이 스킬 것이다.
앞 스킬의 보고를 받은 뒤 다음을 부른다. TRD 는 PRD 후미 절을, 아키텍처는 둘을, 플랜은 셋을, 하네스는 플랜을, 루프는 하네스를 읽는다.

Skill 도구가 없는 환경이면 각 스킬의 `SKILL.md` 를 읽어 그 절차를 그대로 따르고 같은 지시를 자기에게 적용한다. 그때도 후미 절 모드의 지시("1~N단계를 다시 돌리지 말고 후미 절만")를 먼저 읽고 시작한다 — 안 그러면 그 스킬의 1단계가 문서를 처음부터 쓴다.

## 파일 작성

이 스킬이 직접 쓰는 파일은 `CLAUDE.md`·`AGENTS.md` 의 `현재 단계` 줄뿐이다(9단계). Edit 으로 그 줄만 바꾼다. 문서·플랜·하네스·루프는 부른 스킬이 쓴다.
부른 스킬이 후미 절 대신 파일을 통째로 다시 썼으면(Write 로 덮어씀) `git diff --stat docs/` 로 잡힌다 — 기존 절이 바뀌었으면 되돌리고 후미 절 모드로 다시 부른다.
