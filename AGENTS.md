# 하네스 + 루프 풀스택 스킬 — 에이전트 색인

> **플러그인으로 설치했다면 이 파일은 없어도 된다.** 코덱스가 `skills/` 를 직접 찾는다.
> 이 색인은 저장소를 **서브모듈이나 clone 으로 프로젝트에 넣어 쓸 때**의 진입로다.

이 저장소는 **프로젝트를 설계하고 구현하는 절차**를 레이어별 스킬로 나눠 담고 있다.
아래 조건에 해당하면 **그 스킬의 `SKILL.md` 를 전문 읽고 그대로 따른다.** 요약본으로 대체하지 않는다.

각 `SKILL.md` 끝에 환경별 안내가 있다 — **Codex에서 돌고 있으면 그 스킬의 `references/codex.md` 를 함께 읽는다.**
선택지를 묻는 방법, 파일 쓰는 방법, 다음 단계를 남기는 방법이 거기 있다.

## 언제 무엇을 읽는가

| 사용자가 이렇게 말하면 | 읽을 것 | 만들어지는 것 |
|---|---|---|
| "아이디어가 있는데 정리해줘", "이런 서비스 어때?", 아이디어가 아직 모호할 때 | `skills/idea-brainstorm/SKILL.md` | `docs/IDEA.md` |
| "PRD 만들어줘", "요구사항 정리해줘", "뭘 만들 건지 문서로" | `skills/prd-generator/SKILL.md` | `docs/PRD.md` |
| "TRD 만들어줘", "기술 스택 정하자", "어떤 기술로 만들지" | `skills/trd-generator/SKILL.md` | `docs/TRD.md` |
| "아키텍처 설계해줘", "구조 잡아줘" | `skills/architecture-generator/SKILL.md` | `docs/ARCHITECTURE/*.md` |
| "개발 계획 세워줘", "태스크로 쪼개줘", "마스터 플랜" | `skills/plan-generator/SKILL.md` | `plan_setup/PLAN.md`·`phase-NN/`·`STATE.md`·`LOG.md` |
| "하네스 세팅해줘", "품질 게이트", "테스트 파이프라인", "로컬 개발 환경" | `skills/harness-setup/SKILL.md` | `harness_setup/quality_gates/`·`scripts/` |
| "하네스 업데이트해줘", "게이트 갱신", "Redis 추가됐어" | `skills/harness-update/SKILL.md` | (기존 `harness_setup/` 갱신) |
| "개발 루프 세팅해줘", "이제 구현 시작하자", "태스크 순서 정해줘" | `skills/loop-setup/SKILL.md` | `loop_setup/LOOP.md` |
| "루프 업데이트해줘", "병렬 폭 바꾸자", "루프가 자꾸 같은 데서 멈춰" | `skills/loop-update/SKILL.md` | (기존 `LOOP.md` 갱신) |
| 문서 없이 만든 코드를 이 절차에 올리고 싶을 때, "이 코드 문서화해줘" | `skills/code-to-docs/SKILL.md` | as-is `docs/`·phase-01 현행 고정·하네스·루프 |
| 완료된 프로젝트에서 "리팩토링하자", "라이브러리 올리자" | `skills/refactor-plan/SKILL.md` | 후미 `## 리팩토링 N` 절·`phase-NN-refactor-*` |
| 완료된 프로젝트에서 "xx 기능 추가하려는데" | `skills/feature-add/SKILL.md` | 후미 `## 추가 N` 절·`phase-NN-<기능>` |
| 완료된 프로젝트를 쓰다가 "xx 가 안 돼" (루프 중 게이트 실패는 아님) | `skills/bug-fix/SKILL.md` | 회귀 검사·`LOG.md` `### BUG-NN`·커밋 1회 |

## 순서가 있다

```
IDEA → PRD → TRD → ARCHITECTURE → PLAN(phase·task) → HARNESS(게이트·스크립트) → LOOP(실행 규칙)
                                                                                    ↓
                                          태스크를 DAG 순서로 병렬 구현 → 게이트 4단계 → 분리 검증 → 완료
```

**각 레이어는 앞 레이어의 '파일'만 입력으로 받는다.** 대화 맥락에 의존하지 않으므로,
세션이 끊겨도 문서만 있으면 이어서 진행할 수 있다. 앞 문서가 없으면 그 레이어부터 하자고 제안한다.

**레이어를 건너뛰지 않는다.** 뒤 레이어의 결정을 앞에서 미리 확정하면
(PRD에 기술 스택을 적는 등) 뒤 레이어가 그것을 검토 대상이 아니라 기정사실로 읽는다.

## 구현을 시작한 뒤

`loop_setup/LOOP.md` 가 만들어졌으면 **그 뒤로는 이 색인이 아니라 `LOOP.md` 가 안내한다.**
세션을 열 때 `LOOP.md` 와 `plan_setup/STATE.md` 를 읽고 거기 적힌 사이클을 따른다.
구동기가 지시문으로 토막(구현·검증·반영·코디네이터)을 지정했으면 그 지시문이 먼저다.

`LOOP.md` 가 정한 것 중 특히 지킬 것 넷이다.

- **재수정 사이클은 최대 3회.** 소진하면 스스로 기준을 낮추지 말고 사용자에게 보고하고 멈춘다
- **한 태스크에 한 세션.** 그리고 `task_validation` 은 **구현한 세션과 다른 세션**에서 돈다 —
  같은 세션이 구현하고 판정하면 그 게이트는 이름만 남는다
- **게이트 실패는 고치기 전에 분류한다.** 진짜 결함만 코드를 고치고, 나머지는 하네스나 태스크 문서로 간다
- **병렬에서 문서는 코디네이터만 쓴다.** 워커는 `STATE.md`·`LOG.md`·태스크 문서·하네스 문서를 쓰지 않고
  주 트리에서 읽기만 하며, 기록할 것은 출력 블록으로 넘긴다
