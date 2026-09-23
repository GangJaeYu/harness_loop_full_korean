# Phase 05 — dashboard-search-and-retention

- **Goal**: 로그인 직후 못 받은 돈이 보이고, 프로젝트 상세에서 문서와 집계를 한 화면에서 보고, 검색·알림·삭제·파기가 돈다. 차단되지 않은 P0 요구사항이 전부 여기서 끝난다.
- **Dependencies**: phase-04
- **Status**: pending

## Acceptance Criteria
(이 기준으로 phase 완료가 자동 판정된다.)

1. 로그인하면 대시보드가 첫 화면으로 뜨고 미수금 합계와 연체 목록이 표시되며, 한 줄을 누르면 그 인보이스의 프로젝트 상세로 이동한다
2. 프로젝트 상세를 뷰포트 900px에서 열면 요약 4개와 두 목록이 보이고 페이지 세로 스크롤바가 없다
3. 대시보드와 프로젝트 상세 각 1회 렌더에 실행된 질의가 3개이고, 프로젝트 200건·인보이스 1,000건 시드에서 P95가 1.5초 이내다
4. 클라이언트명 일부로 검색하면 종류별로 묶인 결과가 나온다
5. 정기 작업을 두 번 연속 실행해도 같은 인보이스의 알림은 1건이다
6. (실패 경로) 데이터가 하나도 없는 신규 계정에서는 0원과 "클라이언트 등록부터 시작하세요"가 표시된다
7. (실패 경로) 인증 비밀값 없이 `/internal/jobs/daily` 를 호출하면 404가 반환된다
8. (실패 경로) 삭제한 문서가 목록·검색·대시보드 어디에도 나오지 않는다

## Tasks
| ID | 파일 | Goal | depends_on | status |
|---|---|---|---|---|
| phase-05-task-01 | `phase-05-tasks/phase-05-task-01.md` | 프로젝트 200건·인보이스 1,000건 상태에서 대시보드와 프로젝트 상세 집계 질의의 P95를 재고 판정을 남긴다 | phase-04-task-06 | pending |
| phase-05-task-02 | `phase-05-tasks/phase-05-task-02.md` | 청구·입금·미수금 합계의 정의를 질의 한 곳에 고정하고 계정 범위와 프로젝트 범위가 같은 정의를 쓰게 한다 | phase-05-task-01 | pending |
| phase-05-task-03 | `phase-05-tasks/phase-05-task-03.md` | 아키텍처가 열거한 열 개의 인덱스만 만들고 근거 질의가 없는 인덱스를 금지한다 | phase-05-task-02 | pending |
| phase-05-task-04 | `phase-05-tasks/phase-05-task-04.md` | 요약 4개와 계약서·인보이스 두 목록을 900px 뷰포트 안에 배치하고 목록 내부만 스크롤하게 한다 | phase-05-task-03, phase-03-task-07, phase-04-task-08 | pending |
| phase-05-task-05 | `phase-05-tasks/phase-05-task-05.md` | 로그인 직후 첫 화면에서 미수금 합계·연체 목록·진행 중 프로젝트를 질의 3개로 보여 준다 | phase-05-task-04, phase-04-task-07 | pending |
| phase-05-task-06 | `phase-05-tasks/phase-05-task-06.md` | UNIQUE 제약으로 중복이 생기지 않는 알림을 저장하고 읽지 않은 개수를 모든 화면 상단에 보여 준다 | phase-05-task-05 | pending |
| phase-05-task-07 | `phase-05-tasks/phase-05-task-07.md` | 클라이언트명·프로젝트명 부분 일치로 프로젝트·계약서·인보이스를 종류별로 묶어 돌려주는 검색을 만든다 | phase-05-task-05 | pending |
| phase-05-task-08 | `phase-05-tasks/phase-05-task-08.md` | 삭제를 `deleted_at` 기록으로 바꾸고 프로젝트 삭제 시 계약서·인보이스를 같은 트랜잭션에서 함께 삭제한다 | phase-05-task-05 | pending |
| phase-05-task-09 | `phase-05-tasks/phase-05-task-09.md` | 연체 알림 생성·30일 경과 파기·해지 계정 파기·이력 1년 정리를 단계별 독립 트랜잭션으로 도는 경로 하나를 만든다 | phase-05-task-08, phase-05-task-06, phase-04-task-03 | pending |
| phase-05-task-10 | `phase-05-tasks/phase-05-task-10.md` | 비밀번호 재확인 → 해지 기록 → 세션 삭제 → 공유 링크 폐기를 한 트랜잭션에서 하고 파기 예정일을 화면에 보여 준다 | phase-05-task-09, phase-02-task-11 | pending |

## 태스크 간 관계
task-01(성능 스파이크) → task-02 → task-03 → task-04 → task-05 가 주 사슬이다. task-06(알림)·task-07(검색)·task-08(삭제)은 task-05 뒤에서 서로 병렬이고, task-09(정기 작업)가 셋을 모은 뒤 task-10(계정 해지)이 온다.

## 근거 문서
- 요구사항: FR-005, FR-019, FR-020, FR-021, FR-022, FR-023, FR-024(파기 시점 표시) / NFR-001, NFR-007, NFR-009, NFR-011, NFR-013
- 설계: `database.md §3.10`, `database.md §3.11`, `database.md §3.13`, `database.md §3.14`, `backend.md §3.5`, `backend.md §3.8`, `backend.md §3.13`, `backend.md §3.14`, `frontend.md §3.3`, `frontend.md §3.6`, `frontend.md §3.13`, `auth.md §3.6`
