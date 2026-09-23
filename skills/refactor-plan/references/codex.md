# Codex 환경 보조 지침 (refactor-plan)

## 진입 조건 확인

`grep -n in_progress plan_setup/STATE.md`, `harness_setup/HARNESS.md` 1절의 `현재` 열, `ls docs/PRD.md`, `git status --porcelain`. 걸리면 선택지 없이 사실과 갈 곳을 알리고 멈춘다.

## 범위는 번호 목록으로 한 번

```
리팩토링 범위를 골라 주세요 (복수 가능). 답이 없으면 요청에서 읽히는 <범위> 로 진행합니다.
  1) 기저 언어·프레임워크 교체 — TRD·ARCHITECTURE 후미 절. 행위 보존은 e2e 만, unit 은 phase 안에서 다시 세움
  2) 라이브러리 최신화 — TRD 후미 절. 게이트 넷 전부
  3) 코드 정리 — 문서 없음 또는 ARCHITECTURE 후미 절. 게이트 넷 전부
요청 중 "<요구 변경 부분>" 은 요구가 바뀌는 것이라 feature-add 로 떼어 냅니다.
```

목록 확인(2단계 끝)은 표를 그대로 보여 주고 뺄 것·더할 것을 받는다.

## 코드 대조

`grep -rn "function getUserId"` 같은 정의 검색, `grep -rn "require("` 로 의존 방향, 문서 3절의 경로를 `ls` 로 확인. 파일과 줄 번호를 목록의 "위치" 열에 그대로 옮긴다.
테스트 디렉터리를 `grep -rln "<라우트|함수>"` 해 행위 보존 근거 열을 채운다. 앱은 띄우지 않아도 된다. 띄운다면 `harness_setup/scripts/local-dev` 를 쓰고 포트를 쓰는 다른 프로세스를 죽이지 않는다.

## 다음 스킬 연결

Codex 에서는 스킬 자동 호출을 기대하지 말고 **다음 단계를 명시적으로** 남긴다. 순서와 각각의 호출 지시(SKILL.md 3~5단계) + 고칠 목록 표를 함께.

```
다음 단계 1 (범위가 요구할 때): trd-generator 스킬(SKILL.md)을 읽고 아래 지시대로 docs/TRD.md 후미에 절을 붙입니다.
  <3단계 TRD 호출 지시 전문 + 고칠 목록>
다음 단계 2 (범위가 요구할 때): architecture-generator 9단계 — <3단계 ARCHITECTURE 호출 지시>
다음 단계 3: plan-generator 10단계 — <4단계 호출 지시 + 고칠 목록>
다음 단계 4: harness-update — <5단계 지시>
다음 단계 5: loop-update — <5단계 지시>
끝나면 refactor-plan 6~7단계(현재 단계 줄·자체 점검·보고)로 돌아옵니다.
```

같은 세션에서 이어서 하면 각 스킬의 `SKILL.md` 를 읽고 그 절차를 따르되, 위 지시를 자기에게 적용한다.

## 파일 작성

이 스킬이 직접 쓰는 것은 `CLAUDE.md`·`AGENTS.md` 의 `현재 단계` 줄뿐이다. `sed` 나 편집 도구로 그 줄만 바꾼다. 승인 모드에 따라 쓰기 권한 요청이 필요할 수 있으니 작성 직전에 경로를 알린다. `docs/PRD.md` 는 쓰지 않는다.
