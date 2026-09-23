# Claude Code 환경 보조 지침 (refactor-plan)

## 진입 조건 확인

0단계의 셋은 Read 하나씩으로 끝난다 — `plan_setup/STATE.md` 의 `Phase Overview`(`in_progress` 검색), `harness_setup/HARNESS.md` 1절의 `현재` 열, `docs/PRD.md` 존재.
`git status --porcelain` 으로 미커밋 변경을 본다. 걸리면 AskUserQuestion 을 쓰지 말고 평문으로 사실과 갈 곳을 알리고 멈춘다 — 진입 조건은 선택지가 아니다.

## 범위는 AskUserQuestion 으로 한 번

1단계의 범위는 `multiSelect: true` 로 셋을 보여 준다. `option.description` 에 그 범위가 손대는 문서와 행위 보존 기준을 적는다.
요청에 요구 변경이 섞여 있으면 선택지에 넣지 않고 질문 본문에 "이 부분은 feature-add 로 떼어 냅니다" 를 적는다 — 선택지로 두면 사용자가 고르고, 그러면 리팩토링 phase 에 기능이 섞인다.
목록 확인(2단계 끝)은 객관식이 아니다 — 표를 평문으로 보여 주고 뺄 것·더할 것을 받는다.

## 코드 대조

2단계는 Grep 이 주 도구다 — 같은 함수 이름(`function getUserId`), import 되지 않는 export, 의존 방향을 어기는 `require`, 문서 3절이 적은 경로에 파일이 실제로 있는지(Glob).
결과의 파일과 줄 번호를 목록의 "위치" 열에 그대로 옮긴다. 행위 보존 근거 열은 테스트 디렉터리를 Grep 해 그 라우트·함수를 부르는 테스트 파일을 찾아 적는다.
코드가 크면 Explore 서브에이전트에게 "중복 정의·미사용 export·계층 어김을 파일:줄 표로" 를 시켜도 된다. 다만 **목록에 넣을지(동작이 바뀌는가)는 직접 판단한다** — 서브에이전트는 버그 수정을 리팩토링으로 올리기 쉽다.

앱을 띄워 볼 일은 거의 없다. 띄운다면 `harness_setup/scripts/local-dev` 를 쓰고, 다른 프로세스가 포트를 쓰고 있으면 죽이지 않는다(하네스 규칙).

## 다음 스킬 연결

Skill 도구로 **순서대로** 부른다 — 범위가 요구하면 `trd-generator`(후미 절 모드) → `architecture-generator`(9단계) → 항상 `plan-generator`(10단계) → `harness-update` → `loop-update`.
각 호출에는 SKILL.md 3~5단계의 호출 지시와 2단계의 고칠 목록 표를 프롬프트로 함께 넘긴다 — 스킬 본문은 부른 스킬 것이고, 지시와 목록은 이 스킬 것이다.
앞 스킬의 보고를 받은 뒤 다음을 부른다. 플랜은 문서를, 하네스는 플랜을, 루프는 하네스를 읽는다.

Skill 도구가 없는 환경이면 각 스킬의 `SKILL.md` 를 읽어 그 절차를 그대로 따르고 같은 지시를 자기에게 적용한다.

## 파일 작성

이 스킬이 직접 쓰는 파일은 `CLAUDE.md`·`AGENTS.md` 의 `현재 단계` 줄뿐이다(6단계). Edit 으로 그 줄만 바꾼다. `docs/PRD.md` 는 열어 읽되 쓰지 않는다.
