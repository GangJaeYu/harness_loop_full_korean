# Phase 06 — contracts-and-sharing

- **Goal**: 계약서를 템플릿에서 만들어 조항을 고치고, PDF로 내려받고, 공유 링크로 클라이언트에게 보내고, 법적 고지와 처리방침 문안이 붙는다. **이 phase의 태스크 12개가 전부 `blocked` 다** — 아래 차단 원인이 풀리기 전에는 어느 것도 시작할 수 없다.
- **Dependencies**: phase-05 (그리고 차단 미결 OQ-001·OQ-007·OQ-009·OQ-010의 해소, CF-006의 정리)
- **Status**: pending

## Acceptance Criteria
(이 기준으로 phase 완료가 자동 판정된다.)

1. 프로젝트 상세에서 템플릿을 골라 계약서를 만들고 조항을 고쳐 저장한 뒤 PDF를 내려받는 흐름이 끝까지 동작한다
2. 공유 링크를 만들어 로그인하지 않은 브라우저에서 열면 본문과 고지가 보이고 PDF가 내려받아진다
3. 계약서 편집 화면·PDF 모든 페이지·공유 화면 세 곳에서 같은 고지 문자열이 발견되고 사용자가 지울 수 없다
4. 처리방침 문안의 수집 항목이 `database.md §3.3` 의 컬럼 목록과 일치한다
5. (실패 경로) 폐기된 토큰·삭제된 문서의 토큰·존재하지 않는 토큰 세 경우의 응답이 상태 코드와 본문까지 동일하다
6. (실패 경로) 초안 인보이스의 공유 링크 발급 요청이 409와 사유를 돌려준다

## Tasks
| ID | 파일 | Goal | depends_on | status |
|---|---|---|---|---|
| phase-06-task-01 | `phase-06-tasks/phase-06-task-01.md` | 계약서·조항·템플릿 테이블을 만들고 `party_snapshot` 과 버전 구조를 세운다 | phase-03-task-04 | blocked |
| phase-06-task-02 | `phase-06-tasks/phase-06-task-02.md` | 템플릿 또는 빈 문서로 계약서를 만들고 클라이언트·프로젝트 값을 본문에 채운다 | phase-06-task-01 | blocked |
| phase-06-task-03 | `phase-06-tasks/phase-06-task-03.md` | 디자이너용 계약서 기본 템플릿 1~2종의 조항 본문을 `contract_templates` 에 넣는다 | phase-06-task-01 | blocked |
| phase-06-task-04 | `phase-06-tasks/phase-06-task-04.md` | 조항 전체 교체와 번호 재부여를 한 트랜잭션에서 하고 발송본은 새 버전으로만 고치게 한다 | phase-06-task-02 | blocked |
| phase-06-task-05 | `phase-06-tasks/phase-06-task-05.md` | 조항 편집·순서 변경·미저장 이탈 확인·고지 상시 표시를 담은 계약서 화면을 만든다 | phase-06-task-04, phase-06-task-06 | blocked |
| phase-06-task-06 | `phase-06-tasks/phase-06-task-06.md` | 고지 문구를 상수 한 곳에 두고 편집 화면·인쇄 꼬리말·공유 화면 세 자리가 그것을 참조하게 한다 | phase-02-task-08 | blocked |
| phase-06-task-07 | `phase-06-tasks/phase-06-task-07.md` | 쪽 번호와 고지 꼬리말이 모든 페이지에 반복되는 계약서 PDF를 만든다 | phase-06-task-05, phase-04-task-09, phase-06-task-06 | blocked |
| phase-06-task-08 | `phase-06-tasks/phase-06-task-08.md` | 128비트 CSPRNG 토큰의 해시만 저장하고 폐기를 상태로 표현하는 테이블을 만든다 | phase-04-task-01 | blocked |
| phase-06-task-09 | `phase-06-tasks/phase-06-task-09.md` | 링크를 발급·폐기하고 부재·폐기·삭제 세 경우를 같은 응답으로 만든다 | phase-06-task-08, phase-04-task-03 | blocked |
| phase-06-task-10 | `phase-06-tasks/phase-06-task-10.md` | `/s/:token` 을 서버 렌더 전용으로 만들어 JS 없이도 본문과 고지가 보이게 한다 | phase-06-task-09, phase-06-task-06, phase-02-task-06 | blocked |
| phase-06-task-11 | `phase-06-tasks/phase-06-task-11.md` | 열람 시각을 이력으로 남기고 최초·최근 열람 시각과 총 횟수를 소유자 화면에 보여 준다 | phase-06-task-10, phase-04-task-03 | blocked |
| phase-06-task-12 | `phase-06-tasks/phase-06-task-12.md` | 수집 항목·보관 기간·파기 시점·문의처를 실제 저장 위치와 일치하게 처리방침 문안으로 채운다 | phase-02-task-11 | blocked |

> **이 phase의 태스크 12개 중 12개가 `blocked` 다.**
> 차단 원인: CF-006, OQ-001, OQ-007, OQ-009, OQ-010.
> 원인이 풀리기 전에는 위 수용 기준을 판정할 수 없다.

## 태스크 간 관계
task-01 → task-02 → task-04 → task-05 가 계약서 줄기, task-08 → task-09 → task-10 → task-11 이 공유 줄기다. task-06(고지)은 두 줄기가 모두 필요로 하므로 가장 먼저 풀려야 하고, task-03(템플릿 본문)과 task-12(처리방침 문안)는 각각 OQ-007·OQ-010 하나에만 걸려 있어 그 답이 오면 다른 것보다 먼저 풀린다.

## 근거 문서
- 요구사항: FR-006, FR-007, FR-008, FR-009, FR-010, FR-011, FR-016, FR-024(문안) / NFR-005, NFR-012, NFR-014
- 설계: `database.md §3.5`, `database.md §3.8`, `database.md §3.9`, `backend.md §3.3`, `backend.md §3.5`, `backend.md §3.10`, `backend.md §3.11`, `backend.md §3.15`, `frontend.md §3.1`, `frontend.md §3.7`, `frontend.md §3.9`, `frontend.md §3.10`, `frontend.md §3.12`, `auth.md §3.7`, `security.md §3.6`
