# 예시 프로젝트 — Deskwork

[← 저장소 README](../../README.md)

**이 폴더는 스킬을 순서대로 실행해 나온 실제 산출물입니다.** "프리랜서 디자이너용으로 계약서랑 인보이스를 한 곳에서 관리하는 웹서비스 / 1인 개발 / 3개월"이라는
한 문장에서 출발해 아이디어 → PRD → TRD → 아키텍처 → 마스터 플랜 → 검증 하네스 → 개발 루프 세팅까지 진행한 상태입니다.

- **코드는 없습니다.** 루프를 세팅한 직후, 첫 태스크를 시작하기 전 상태입니다
- 스킬 평가 중에 만든 것이라 **사용자와 문답 없이** 진행했습니다. 사용자가 답했어야 할 자리는 합리적 가정으로 채우고 문서에 `(가정)` 으로 표시했습니다(본문이 언급하는 `questions.md` 는 여기 포함하지 않았습니다)
- 루프는 "Orca 있음, 병렬, 동시 3개" 조건으로 세팅했습니다. 워크트리 경로는 `D:\work\...` 로 바꿔 두었습니다

## 무엇을 보면 좋은가

| 파일 | 볼 것 |
|---|---|
| [`docs/IDEA.md`](docs/IDEA.md) | 한 문장이 문제·타깃·MVP 범위·미결 사항으로 구체화되는 방식 |
| [`docs/PRD.md`](docs/PRD.md) | 요구사항마다 붙은 ID(`FR-`·`NFR-`)와 관찰 가능한 수용 기준, 미결(`OQ-`) 표 |
| [`docs/TRD.md`](docs/TRD.md) | 기술 결정(`TD-`)마다 근거 요구사항·검증 방법·되돌리기 비용 |
| [`docs/ARCHITECTURE/`](docs/ARCHITECTURE/) | `overview.md` 와 영역별 설계 6개. 앞 문서와 어긋나는 곳은 충돌(`CF-`)로 표시 |
| [`plan_setup/PLAN.md`](plan_setup/PLAN.md) | phase 6개·태스크 61개의 지도, 요구사항 → 태스크 추적표, 차단된 태스크 |
| [`plan_setup/phase-02/`](plan_setup/phase-02/) | phase 문서 하나와 태스크 문서들 — frontmatter(`depends_on`·`files`·`verification`)가 뒤의 자동화 재료 |
| [`harness_setup/HARNESS.md`](harness_setup/HARNESS.md) | 게이트 4개의 명령·활성 시점, `local-dev` 종료 코드와 구성 요소 표 |
| [`harness_setup/quality_gates/`](harness_setup/quality_gates/) | 게이트 정의서. 특히 `task_validation.md` 의 "검증 세션에 주지 않는 것" |
| [`loop_setup/DAG.md`](loop_setup/DAG.md) | 스크립트가 그린 태스크 의존 그래프와 구간별 병렬 폭 |
| [`loop_setup/LOOP.md`](loop_setup/LOOP.md) | 모든 세션이 따르는 실행 규칙 — 실패 분류, 재시도, 구동 방식, 병렬·격리, 질문하는 지점 |
| [`plan_setup/STATE.md`](plan_setup/STATE.md) | 루프가 쓰는 현재 상태 — 재시도 기록, 사람의 승인(기한 포함), 배정표 |
| [`CLAUDE.md`](CLAUDE.md) | 스킬 없이 시작하는 세션도 읽는 규칙 요약 |
