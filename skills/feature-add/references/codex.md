# Codex 환경 보조 지침 (feature-add)

## 진입 조건 확인

`grep -n in_progress plan_setup/STATE.md`, `ls docs/PRD.md harness_setup loop_setup/LOOP.md`, `git status --porcelain`. 걸리면 선택지 없이 사실과 갈 곳을 알리고 멈춘다.

## 모호/명확 판정과 번호 읽기

1단계의 넷(무엇·누가·어느 흐름·수용 기준)은 요청 문장과 `docs/PRD.md` 2·3·4절로 판정한다. 경계선이면 모호로 보고 idea-brainstorm 절차로 간다.
마지막 번호는 `grep` 으로 — `grep -n "^#### FR-" docs/PRD.md | tail -1`, `grep -rhn "^| OQ-" docs/ harness_setup/HARNESS.md loop_setup/LOOP.md | sort -t- -k2 | tail -1`, `grep -n "^#### TD-" docs/TRD.md | tail -1`, `grep -n "^### 3\." docs/ARCHITECTURE/*.md`, `grep -rn "^## 추가 " docs/`.
섞인 요청은 이렇게 답한다.

```
요청 중 "<리팩토링·버그 부분>" 은 동작이 안 바뀌는 정리 / 문서대로 동작하지 않는 것이라 refactor-plan / bug-fix 로 떼어 냅니다. 이 스킬은 "<기능 부분>" 만 진행합니다.
```

## 다음 스킬 연결

Codex 에서는 스킬 자동 호출을 기대하지 말고 **다음 단계를 명시적으로** 남긴다. 순서와 각각의 호출 지시(SKILL.md 3~8단계) 를 N·번호·phase 이름을 채워서 함께.

```
다음 단계 1 (모호할 때): idea-brainstorm 스킬(SKILL.md)을 읽고 아래 지시대로 docs/IDEA.md 후미에 절을 붙입니다.
  <3단계 호출 지시 전문>
다음 단계 2: prd-generator 후미 절 모드 — <4단계 호출 지시>
다음 단계 3 (TD 가 새로 생기거나 바뀔 때): trd-generator 후미 절 모드 — <5단계 호출 지시>
다음 단계 4: architecture-generator 9단계 — <6단계 호출 지시>
다음 단계 5: plan-generator 10단계 — <7단계 호출 지시>
다음 단계 6: harness-update — <8단계 지시>
다음 단계 7: loop-update — <8단계 지시>
끝나면 feature-add 9~10단계(현재 단계 줄·자체 점검·보고)로 돌아옵니다.
```

같은 세션에서 이어서 하면 각 스킬의 `SKILL.md` 를 읽고 그 절차를 따르되, 위 지시를 자기에게 적용한다. 후미 절 모드 지시("1~N단계를 다시 돌리지 말고 후미 절만")를 먼저 읽고 시작한다 — 안 그러면 그 스킬의 1단계가 문서를 처음부터 쓴다.

## 파일 작성

이 스킬이 직접 쓰는 것은 `CLAUDE.md`·`AGENTS.md` 의 `현재 단계` 줄뿐이다. `sed` 나 편집 도구로 그 줄만 바꾼다. 승인 모드에 따라 쓰기 권한 요청이 필요할 수 있으니 작성 직전에 경로를 알린다.
후미 절은 `cat >> docs/PRD.md <<'EOF'` 처럼 **덧붙이기**로 쓴다 — 통째로 다시 쓰면 기존 절이 바뀐다. 9절 추적표·2절 요약 표 같은 표의 행 추가만 편집 도구로 그 자리에 넣는다.
