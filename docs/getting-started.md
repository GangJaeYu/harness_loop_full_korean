# 시작하기

[← README](../README.md)

## 필요한 것

- git 저장소(빈 폴더면 `git init`)
- Claude Code 또는 Codex CLI
- 그 밖의 도구(Docker, 브라우저 테스트 도구, WSL, Orca 등)는 프로젝트에 필요할 때만 씁니다. 에이전트가 Loop 전에 설치 여부를 확인하고, 없으면 무엇이 필요한지 알려 줍니다.

## 설치

### Claude Code

```text
/plugin marketplace add GangJaeYu/harness_loop_full_korean
/plugin install harness-loop-fullstack-kor@harness-loop-fullstack-kor
```

### Codex

```bash
codex plugin marketplace add GangJaeYu/harness_loop_full_korean
codex plugin add harness-loop-fullstack-kor@harness-loop-fullstack-kor
```

설치 명령은 호스트 버전에 따라 다를 수 있습니다. 안 되면 `codex plugin --help`로 확인하세요.

### 버전 고정

저장소 뒤에 `@태그`를 붙입니다. 예: `GangJaeYu/harness_loop_full_korean@v2.1.1`. 두 호스트 모두 같습니다.

### 1.x에서 옮기기

2.0부터 플러그인 이름이 `harness-loop-fullstack`에서 `harness-loop-fullstack-kor`로 바뀌었습니다. 1.x를 지우고 새로 설치합니다.

```text
# Claude Code
/plugin uninstall harness-loop-fullstack@harness-loop-fullstack
/plugin marketplace remove harness-loop-fullstack
/plugin marketplace add GangJaeYu/harness_loop_full_korean
/plugin install harness-loop-fullstack-kor@harness-loop-fullstack-kor
```

Codex도 같은 순서입니다. 제거 명령은 `codex plugin --help`로 확인한 뒤 옛 플러그인과 마켓플레이스를 지우고 위처럼 설치합니다.

**1.x로 만든 프로젝트**는 그대로 이어 쓸 수 있습니다. 기존 문서·태스크 ID·완료 이력은 유지됩니다.
"루프 업데이트해줘"(`loop-update`)라고 하면 옛 LOOP.md를 2.0 방식으로 필요한 부분만 고칩니다.
1.x의 구동·감시 스크립트, 상태판, 질문 답하기 탭은 2.0에서 쓰지 않습니다.

### 플러그인 없이

저장소를 프로젝트 안에 두고 프로젝트 지침에서 색인을 가리킵니다.

```bash
git submodule add https://github.com/GangJaeYu/harness_loop_full_korean .agent-skills
```

프로젝트의 `AGENTS.md` 또는 `CLAUDE.md`에 한 줄을 넣습니다.

```markdown
스킬 색인: .agent-skills/AGENTS.md 를 읽고, 해당하는 스킬의 SKILL.md 를 읽어 따른다.
```

이 방식은 갱신(`git submodule update --remote`)을 직접 해야 합니다.

## 첫 프로젝트

빈 폴더에서 에이전트를 열고 말합니다.

```text
개인용 독서 기록 웹앱을 만들고 싶어. 책 추가·메모·별점, 새로고침해도 유지.
환경을 확인하고 필요한 것을 먼저 물은 뒤 구현과 검증까지 진행해줘.
```

1. 에이전트가 환경(OS, 런타임, 도구, 권한)을 조사하고, 사용자만 정할 수 있는 것을 묻습니다. 목적과 범위, 허용·금지, 시간·사용량 예산, 쓸 모델, 한도에 걸렸을 때의 처리입니다.
2. IDEA → PRD → TRD → Architecture → Plan → Harness 순으로 문서를 만들고, 단계마다 결과와 다음 스킬을 제안합니다. IDEA·PRD·TRD에서는 선택지와 추천안을 붙여 필요한 만큼 묻고, 문서마다 검토를 받은 뒤 넘어갑니다.
3. 화면 제품이면 PRD 다음에 **실제 디자인 미리보기**를 보여 주고 고르게 합니다.
4. Loop가 시작되면 질문 없이 구현·검증·복구를 진행하고, 마지막에 완료 범위·증거·남은 미검증을 보고합니다.

단계마다 승인하기 번거로우면 처음에 "루프까지 묻지 말고 진행해, 예산은 1시간"처럼 범위와 예산을 함께 말하면 됩니다.

### 스킬을 직접 부르기

같은 요청이라도 에이전트가 스킬을 쓰지 않고 바로 처리할 때가 있습니다. 원하는 단계가 분명하면 이름을 적는 것이 확실합니다.

```text
# Claude Code
/harness-loop-fullstack-kor:trd-generator docs/PRD.md 기준으로 기술 결정 정리해줘

# Codex
$loop-setup 합의대로 루프 준비하고 시작해줘
```

다음 단계로 넘어갈 때도 제안받은 스킬 이름으로 승인하면 됩니다(예: "좋아, architecture-generator로 진행해").

## 프로젝트에 생기는 파일

| 경로 | 내용 |
|---|---|
| `docs/IDEA.md` | 문제·사용자·범위·불확실한 가정 |
| `docs/PRD.md` | 요구 ID·수용 기준·자율운영 합의 |
| `docs/DESIGN.md` | 화면 제품의 승인된 디자인 방향과 시각 품질 기준 |
| `docs/TRD.md` | 기술 결정과 근거 |
| `docs/ARCHITECTURE/` | 구조·경계·흐름 |
| `plan_setup/` | `PLAN.md`, phase·task, 현재 상태 `STATE.md`, 이력 `LOG.md` |
| `harness_setup/` | `HARNESS.md`, 검사 정의 `quality_gates/`, 필요한 스크립트 |
| `loop_setup/LOOP.md` | 실행 방식·권한·예산·복구·재개 |

작은 프로젝트는 문서도 작게 만듭니다. 모든 파일이 항상 생기지는 않습니다.
