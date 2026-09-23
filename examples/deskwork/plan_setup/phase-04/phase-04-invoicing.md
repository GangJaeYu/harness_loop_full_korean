# Phase 04 — invoicing

- **Goal**: 프로젝트에서 인보이스를 만들어 항목과 세액을 채우고, 발송·입금 상태를 바꾸고, PDF로 내려받고 메일로 보낼 수 있게 된다. 계약→청구 한 바퀴의 청구 절반이 여기서 돈다.
- **Dependencies**: phase-03
- **Status**: pending

## Acceptance Criteria
(이 기준으로 phase 완료가 자동 판정된다.)

1. 프로젝트 상세에서 인보이스 생성 → 항목 입력 → 발송 → 입금 완료 표시까지 한 흐름으로 동작하고 매 전이가 이력에 남는다
2. 한 계정에서 인보이스 20건을 동시에 생성하면 번호 20개가 모두 다르고 빈 번호가 없다
3. 인보이스 PDF를 내려받으면 항목·금액·번호가 화면과 같은 문자열로 들어 있고, 항목 25개면 합계가 마지막 페이지에만 있다
4. 기한이 3일 지난 발송 인보이스에 "연체 3일" 배지가 뜨고 입금 완료로 바꾸면 사라진다
5. (실패 경로) 초안 인보이스를 곧바로 입금완료로 바꾸려 하면 409와 사유가 반환된다
6. (실패 경로) 다른 계정의 인보이스 PDF 생성 주소로 접근하면 404가 반환되고 파일이 생성되지 않는다
7. (실패 경로) 메일 발송을 실패시키면 화면에 사유가 표시되고 인보이스 상태·발송 시각이 그대로다

## Tasks
| ID | 파일 | Goal | depends_on | status |
|---|---|---|---|---|
| phase-04-task-01 | `phase-04-tasks/phase-04-task-01.md` | 네 금액 컬럼과 세 상태를 가진 인보이스 테이블을 만들고 스냅샷 컬럼을 세운다 | phase-03-task-04, phase-01-task-05 | pending |
| phase-04-task-02 | `phase-04-tasks/phase-04-task-02.md` | 계정·연도별 카운터 행 하나에 대한 원자적 갱신으로 `YYYY-NNNN` 번호를 채번한다 | phase-04-task-01 | pending |
| phase-04-task-03 | `phase-04-tasks/phase-04-task-03.md` | 수정·삭제 경로가 없는 이력 테이블과 `record()` 하나만 노출하는 공용 모듈을 만든다 | phase-02-task-01 | pending |
| phase-04-task-04 | `phase-04-tasks/phase-04-task-04.md` | 프로젝트 상세에서만 진입하는 인보이스 생성 경로를 만들고 클라이언트 스냅샷과 회차 금액을 승계한다 | phase-04-task-02, phase-03-task-06 | pending |
| phase-04-task-05 | `phase-04-tasks/phase-04-task-05.md` | 항목 목록과 과세 방식을 받아 계산 모듈의 결과를 네 금액 컬럼에 저장하는 경로를 만든다 | phase-04-task-04, phase-01-task-05 | pending |
| phase-04-task-06 | `phase-04-tasks/phase-04-task-06.md` | `POST /api/invoices/:id/status` 하나가 전이 표를 적용하고 같은 트랜잭션에서 이력 1건을 남기게 한다 | phase-04-task-05, phase-04-task-03 | pending |
| phase-04-task-07 | `phase-04-tasks/phase-04-task-07.md` | `status='sent' AND due_date < KST 오늘` 을 조회 시점 파생 조건 한 곳에 고정하고 초과 일수를 함께 낸다 | phase-04-task-06 | pending |
| phase-04-task-08 | `phase-04-tasks/phase-04-task-08.md` | 항목 입력·과세 선택·상태 변경·연체 배지를 담은 인보이스 화면을 만든다 | phase-04-task-07, phase-02-task-08, phase-01-task-06 | pending |
| phase-04-task-09 | `phase-04-tasks/phase-04-task-09.md` | 브라우저 인스턴스를 재사용하고 동시 렌더를 2건으로 제한하는 PDF 어댑터를 만든다 | phase-01-task-09, phase-02-task-02 | pending |
| phase-04-task-10 | `phase-04-tasks/phase-04-task-10.md` | 인쇄 CSS로 페이지가 나뉘는 인보이스 템플릿을 만들고 `application/pdf` 로 응답한다 | phase-04-task-09, phase-04-task-08 | pending |
| phase-04-task-11 | `phase-04-tasks/phase-04-task-11.md` | 클라이언트 담당자 이메일로 공유 링크가 담긴 메일을 보내고 실패 시 상태를 그대로 둔다 | phase-04-task-08, phase-02-task-09 | pending |

## 태스크 간 관계
task-01 → task-02 → task-04 → task-05 → task-06 → task-07 → task-08 이 주 사슬이다. task-03(감사 이력)은 phase-02-task-01 뒤라면 언제든 가능해 앞에서 병렬로 만들 수 있고 task-06 이 그것을 필요로 한다. task-09(렌더 어댑터)는 phase-01-task-09 의 스파이크 뒤에서 주 사슬과 병렬이며, task-10·task-11 이 마지막이다.

## 근거 문서
- 요구사항: FR-012, FR-013, FR-014, FR-015, FR-017, FR-018, FR-019 / NFR-002, NFR-004, NFR-008, NFR-009, NFR-011, NFR-016
- 설계: `database.md §3.6`, `database.md §3.7`, `database.md §3.9`, `database.md §3.12`, `backend.md §3.3`, `backend.md §3.5`, `backend.md §3.7`, `backend.md §3.9`, `backend.md §3.10`, `backend.md §3.12`, `backend.md §3.15`, `frontend.md §3.1`, `frontend.md §3.4`, `frontend.md §3.8`, `frontend.md §3.9`, `security.md §3.5`
