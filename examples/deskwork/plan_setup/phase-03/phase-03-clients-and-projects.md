# Phase 03 — clients-and-projects

- **Goal**: 클라이언트를 등록하고 그 아래에 프로젝트와 대금 조건을 만들 수 있게 된다. 이후 모든 문서가 매달릴 중심 개체가 선다.
- **Dependencies**: phase-02
- **Status**: pending

## Acceptance Criteria
(이 기준으로 phase 완료가 자동 판정된다.)

1. 클라이언트 등록 → 그 클라이언트로 프로젝트 등록 → 목록에서 확인, 이 흐름이 끝까지 동작한다
2. 대금 조건을 비율 또는 금액으로 저장할 수 있고 회차 0건도 저장된다
3. 저장된 금액이 목록에서 천 단위 구분과 함께 `원` 으로 표시된다
4. (실패 경로) 대금 조건 비율 합이 90%면 저장되지 않고 현재 합계 숫자가 해당 입력란에 표시된다
5. (실패 경로) 프로젝트가 연결된 클라이언트를 삭제하려 하면 삭제되지 않고 연결된 프로젝트 수가 화면에 표시된다
6. (실패 경로) 다른 계정의 클라이언트·프로젝트 상세 주소로 접근하면 404가 반환되고 본문에 그 데이터가 없다

## Tasks
| ID | 파일 | Goal | depends_on | status |
|---|---|---|---|---|
| phase-03-task-01 | `phase-03-tasks/phase-03-task-01.md` | 클라이언트 테이블을 만들고 소유자 조건이 붙은 조회·저장 함수를 세운다 | phase-02-task-02 | pending |
| phase-03-task-02 | `phase-03-tasks/phase-03-task-02.md` | 클라이언트 CRUD를 열고 연결 프로젝트가 있는 클라이언트의 삭제를 개수와 함께 거부한다 | phase-03-task-01, phase-01-task-04 | pending |
| phase-03-task-03 | `phase-03-tasks/phase-03-task-03.md` | 클라이언트 목록과 상세·편집 화면을 만들고 빈 상태와 인라인 오류를 붙인다 | phase-03-task-02, phase-02-task-08 | pending |
| phase-03-task-04 | `phase-03-tasks/phase-03-task-04.md` | 프로젝트와 회차 테이블을 만들고 만분율 정수 비율과 날짜 순서 제약을 DB에 건다 | phase-03-task-01 | pending |
| phase-03-task-05 | `phase-03-tasks/phase-03-task-05.md` | 회차 집합의 비율 합 10000 또는 금액 합 = 총 계약금액을 저장 직전에 검사하고 현재 합계·차액을 응답에 담는다 | phase-03-task-04, phase-01-task-05 | pending |
| phase-03-task-06 | `phase-03-tasks/phase-03-task-06.md` | 프로젝트 CRUD를 열고 대금 조건 검증을 저장 경로에 연결한다 | phase-03-task-05, phase-03-task-02 | pending |
| phase-03-task-07 | `phase-03-tasks/phase-03-task-07.md` | 프로젝트 목록과 등록·편집 화면을 만들고 대금 조건 입력의 합계 오류를 숫자와 함께 보여 준다 | phase-03-task-06, phase-03-task-03 | pending |

## 태스크 간 관계
task-01 → task-02 → task-03 이 클라이언트 줄기, task-04 → task-05 → task-06 → task-07 이 프로젝트 줄기다. 두 줄기는 task-04가 task-01에 의존하는 것 외에는 대체로 병렬이며, task-06 이 task-02 에도 의존하는 이유는 클라이언트 삭제 제한 질의가 프로젝트 쪽과 짝이기 때문이다.

## 근거 문서
- 요구사항: FR-003, FR-004 / NFR-004, NFR-008
- 설계: `database.md §3.3`, `database.md §3.4`, `backend.md §3.3`, `backend.md §3.4`, `backend.md §3.6`, `frontend.md §3.1`, `frontend.md §3.7`, `frontend.md §3.8`, `security.md §3.1`
