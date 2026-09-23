# 시작하기

[← README](../README.md)

## 필요한 것

| 무엇 | 언제 필요한가 | 비고 |
|---|---|---|
| git | 처음부터 | 루프가 태스크마다 커밋하고, 병렬이면 워크트리를 씁니다 |
| Claude Code 또는 Codex CLI | 처음부터 | 루프는 새 세션을 `claude -p` / `codex exec` 로 엽니다 |
| Docker | 하네스·루프 단계 | 프로젝트의 DB·메일 캡처 같은 의존 서비스를 `local-dev` 스크립트가 컨테이너로 띄웁니다 (TRD 에서 정한 스택에 따라 다름) |
| Node · Playwright | 하네스·루프 단계 | e2e 게이트와 검증 세션의 브라우저 관찰 (웹 프로젝트 기준) |
| PowerShell 7 (`pwsh`) | Windows 에서 | 하네스 스크립트가 `.ps1` 로 만들어질 때. Windows 기본 PowerShell 5.1 만 있으면 스크립트 호출이 실패할 수 있습니다 |
| Orca (선택) | 병렬 운용 | 있으면 워커를 Orca 가 띄우고 화면에서 카드로 보입니다. 없으면 스크립트가 `claude -p` 로 띄웁니다 |

앞 네 단계(아이디어~플랜)는 문서만 만들기 때문에 git 과 CLI 만 있으면 됩니다.

## 설치

### 클로드 코드

```
/plugin marketplace add GangJaeYu/harness_loop_full_korean
/plugin install harness-loop-fullstack@harness-loop-fullstack
```

### 코덱스

```bash
codex plugin marketplace add GangJaeYu/harness_loop_full_korean
codex plugin marketplace list                                   # 등록됐는지 확인
codex plugin add harness-loop-fullstack@harness-loop-fullstack  # 플러그인 설치
```

> 코덱스의 플러그인 설치와 `skills/` 자동 탐색은 매니페스트 규격대로 두었지만 **실제 설치로는 아직 확인하지 못했습니다.**
> 안 되면 아래 "플러그인 없이"의 서브모듈 방식을 쓰세요.

### 버전 고정

두 호스트 모두 저장소 뒤에 `@` 로 붙입니다 — `GangJaeYu/harness_loop_full_korean@v1.10.0`(태그), `...@main`(브랜치).

### 플러그인 없이

- **클로드 코드**: `skills/` 안의 13개 폴더를 `~/.claude/skills/` 로 복사합니다
- **코덱스**: 저장소를 서브모듈로 넣고 프로젝트 루트 `AGENTS.md` 에서 색인을 가리킵니다

```bash
git submodule add https://github.com/GangJaeYu/harness_loop_full_korean .agent-skills
```

```markdown
스킬 색인: .agent-skills/AGENTS.md 를 읽고, 해당하는 스킬의 SKILL.md 를 전문 읽어 따른다.
```

둘 다 바로 되지만 갱신은 손으로 해야 합니다.

## 첫 프로젝트 따라 하기

빈 폴더에서 `git init` 을 하고 에이전트를 엽니다. 각 스킬은 끝나면 **보고하고 멈춥니다.** 검토하고 "다음으로"라고 해야 넘어갑니다.

1. **"프리랜서용 인보이스 앱 아이디어 정리하자"** — `idea-brainstorm` 이 역질문과 선택지로 범위를 좁혀 `docs/IDEA.md` 를 씁니다
2. **"PRD 써줘"** — 요구사항마다 `FR-001` 같은 ID 와 관찰 가능한 수용 기준이 붙습니다. 모르는 것은 미결(`OQ-`)로 남고, 답하면 문서가 갱신됩니다
3. **"TRD 써줘"** → **"아키텍처 설계해줘"** — 기술 결정과 설계. 앞 문서와 어긋나는 설계는 충돌(`CF-`)로 드러납니다
4. **"개발 계획 세워줘"** — phase 와 태스크로 쪼갭니다. 미결·충돌에 걸린 태스크는 `blocked` 로 표시됩니다
5. **"하네스 세팅해줘"** — 게이트 정의서와 `local-dev` 스크립트가 생깁니다. **보고에서 스크립트가 실제로 돌았는지, 브라우저 관찰 수단이 있는지** 확인하세요
6. **"개발 루프 세팅해줘"** — 병렬 여부·동시 에이전트 수·격리 방식·역할별 모델·미활성 게이트 승인을 묻습니다. 모르면 추천을 고르면 됩니다.
   끝나면 `loop_setup/DAG.md` 로 실행 순서를 검토하고, 안내에 따라 **구동 스크립트 시험 실행**을 한 번 돌립니다
7. **"첫 사이클 시작하자"** — 여기서부터는 스킬이 아니라 `LOOP.md` 가 안내합니다. 운용은 [운용 가이드](operations.md)

중간부터 시작해도 됩니다. 각 스킬은 앞 단계의 파일만 읽으므로, 그 파일이 있으면 되고 없으면 그 단계부터 하자고 제안합니다.

## 프로젝트에 생기는 파일

```
docs/            IDEA.md · PRD.md · TRD.md · ARCHITECTURE/
plan_setup/      PLAN.md · phase-NN/ (phase 문서와 태스크 문서) · STATE.md · LOG.md
harness_setup/   HARNESS.md · quality_gates/ (게이트 정의서 4개) · scripts/ (local-dev · dag-render · loop-drive)
loop_setup/      LOOP.md · DAG.md
CLAUDE.md · AGENTS.md   어느 세션에서든 지킬 규칙 요약 (두 파일은 같은 내용)
```

실제 모습은 [예시 프로젝트](../examples/deskwork/)에서 볼 수 있습니다.
