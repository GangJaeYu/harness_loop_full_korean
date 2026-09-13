# harness-loop-fullstack (한글)

브레인스토밍부터 개발 루프까지를 레이어로 나눈 **한글 스킬 플러그인**입니다.
클로드 코드와 코덱스에서 함께 쓸 수 있도록, 공통 절차는 `SKILL.md` 에 두고
에이전트별 차이만 `references/` 로 분리했습니다.

## 무엇을 하는가

아이디어 하나를 **문서로 굳히고, 태스크로 쪼개고, 검증 관문을 세우고, 그것을 실제로 돌리는 규칙**까지
한 흐름으로 만듭니다. 각 레이어는 **앞 레이어의 파일만 입력으로 받으므로**,
세션이 끊겨도 문서만 있으면 이어서 진행할 수 있습니다.

```
IDEA → PRD → TRD → ARCHITECTURE → PLAN(phase·task) → HARNESS(게이트·스크립트) → LOOP(실행 규칙)
                                                                                    ↓
                                          태스크를 DAG 순서로 병렬 구현 → 게이트 4단계 → 분리 검증 → 완료
```

## 레이어 구성

| 레이어 | 스킬 | 산출물 |
|---|---|---|
| 0 | `idea-brainstorm` | `docs/IDEA.md` |
| 1 | `prd-generator` | `docs/PRD.md` |
| 1 | `trd-generator` | `docs/TRD.md` |
| 2 | `architecture-generator` | `docs/ARCHITECTURE/*.md` |
| 3 | `plan-generator` | `plan_setup/PLAN.md`, `phase-NN/`, `STATE.md`, `LOG.md` |
| 4 | `harness-setup`, `harness-update` | `harness_setup/quality_gates/`, `harness_setup/scripts/` |
| 5 | `loop-setup`, `loop-update` | `loop_setup/LOOP.md` |

## 설치

두 환경 모두 **정식 플러그인으로 설치**됩니다. 스킬은 `skills/<이름>/SKILL.md` 로 같은 자리에 있고,
호스트별 매니페스트만 서로 다른 경로에 두었기 때문에 **각 호스트는 자기 파일만 읽습니다.**

### 클로드 코드

```
/plugin marketplace add GangJaeYu/harness_loop_full_korean
/plugin install harness-loop-fullstack@harness-loop-fullstack
```

### 코덱스

```bash
codex plugin marketplace add GangJaeYu/harness_loop_full_korean
codex plugin marketplace list
```

브랜치나 태그를 고정하려면 `...@main` 또는 `...#v1.1.0` 을 붙입니다.

설치 후에는 어느 프로젝트에서든 "PRD 만들어줘" 같은 말에 스킬이 걸립니다.

> **확인된 범위**: 클로드 코드 설치와 헤드리스 자식 세션(`claude -p`) 실행은 실제로 확인했습니다.
> 코덱스의 플러그인 설치 명령과 `skills/` 자동 탐색은 매니페스트 규격대로 두었지만 **아직 실제 설치로 확인하지 못했습니다.**
> 안 되면 아래 '대안'의 서브모듈 + `AGENTS.md` 방식이 확실합니다.

### 대안 — 플러그인을 쓰지 않을 때

- **클로드 코드**: `skills/` 안의 9개 폴더를 `~/.claude/skills/` 로 복사합니다
- **코덱스**: 저장소를 프로젝트에 두고 루트 `AGENTS.md` 에서 색인을 가리킵니다

```bash
git submodule add https://github.com/GangJaeYu/harness_loop_full_korean .agent-skills
```

```markdown
스킬 색인: .agent-skills/AGENTS.md 를 읽고, 해당하는 스킬의 SKILL.md 를 전문 읽어 따른다.
```

둘 다 즉시 되지만 갱신을 손으로 해야 합니다.

## 어떻게 도는가 — 핵심 규칙

- **한 태스크에 한 세션.** 구현 → 검증 → 반영 세 토막이 각각 다른 세션이고, `task_validation` 은 **구현한 세션과 분리된 새 세션**
  (`claude -p` / `codex exec` 헤드리스 자식)에서 돕니다. 구현 중에 형성된 판단이 검증에 새지 않게 하기 위해서입니다
- **기본은 병렬.** `plan_setup/` 의 태스크로 DAG 를 그리고(`LOOP.md` 8절, 머메이드), 자원 충돌을 사전 검사한 뒤,
  코디네이터가 폭만큼 태스크를 배정합니다. 오르카가 있으면 오케스트레이션 워커, 없으면 스크립트가 슬롯마다 자식 세션을 띄웁니다
- **워크트리는 태스크마다가 아니라 필요한 자리에만.** 동시에 코드를 쓰는 둘째 워커부터 슬롯 워크트리를 받고, 검증·비코드 태스크는 받지 않습니다
- **재수정 사이클은 최대 3회.** 소진하면 기준을 낮추지 않고 사용자에게 보고하고 멈춥니다
- **게이트 실패는 고치기 전에 분류.** 진짜 결함만 코드를 고치고, 나머지는 하네스(`harness-update`)나 태스크 문서(`plan-generator`)로 갑니다

## 매니페스트가 넷인 이유

호스트마다 읽는 파일과 경로가 다릅니다. 경로가 겹치지 않으므로 서로 간섭하지 않습니다.

| | 클로드 코드 | 코덱스 |
|---|---|---|
| 마켓플레이스 | `.claude-plugin/marketplace.json` | `.agents/plugins/marketplace.json` |
| 플러그인 매니페스트 | `.claude-plugin/plugin.json` | 루트 `plugin.json` (`agent-plugins.org` 공통 표준) |
| 스킬 | `skills/<이름>/SKILL.md` | **같은 파일** |

## 두 환경에서 무엇이 다른가

**스킬 본문은 같습니다.** 절차·판단 기준·산출물 형식이 전부 `SKILL.md` 한 곳에 있고,
환경마다 다른 것만 `references/` 로 뺐습니다.

| | 클로드 코드 | 코덱스 |
|---|---|---|
| 참고 파일 | `references/claude-code.md` | `references/codex.md` |
| 선택지 묻기 | AskUserQuestion | 평문 번호 목록 |
| 분리 검증 세션 | 헤드리스 자식 세션 `claude -p` (대안: 서브에이전트) | 헤드리스 자식 세션 `codex exec` |
| 병렬 구동기 | 오르카 있으면 오케스트레이션, 없으면 스크립트 + 슬롯별 `claude -p` | 오르카 있으면 오케스트레이션, 없으면 스크립트 + 슬롯별 `codex exec` |
| 다음 스킬 연결 | 자동 호출 | 다음 단계를 텍스트로 남긴다 |

각 `SKILL.md` 끝에서 **자기 환경에 맞는 파일만 읽으라고 안내**하므로, 쓰지 않는 쪽 파일은 열리지 않습니다.

## 개발·평가 저장소

이 저장소는 **배포용**이라 스킬과 매니페스트만 담습니다. 원본 사양, 제작 규약, 스킬 평가 결과는
개발 저장소 [`GangJaeYu/harness_loop_full`](https://github.com/GangJaeYu/harness_loop_full) 에 있습니다.
스킬을 고치려면 그쪽에서 고치고 여기로 옮깁니다.
