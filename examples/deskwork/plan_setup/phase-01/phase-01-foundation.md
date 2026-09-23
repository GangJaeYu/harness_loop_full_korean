# Phase 01 — foundation

- **Goal**: 프로젝트 뼈대와 공통 규약(계층·오류·검증·금액·표시·비밀값·로그)이 서고, 뒤 단계의 설계를 뒤집을 수 있는 두 실험(PDF 생성 시간, 메일 도달)의 판정이 문서로 남는다.
- **Dependencies**: 없음
- **Status**: pending

## Acceptance Criteria
(이 기준으로 phase 완료가 자동 판정된다.)

1. 빈 DB에 전체 마이그레이션을 적용하고 되돌린 뒤 다시 적용해도 오류가 없다
2. 공급가액 1,000,003원에 원천징수를 적용하면 `{tax: 33000, billed: 1000003, net: 967003}` 이 나오고, 같은 값이 표시 유틸을 거쳐 `1,000,003원` 으로 렌더된다
3. 네 계층의 의존 방향을 어기는 import를 넣으면 계층 테스트가 실패한다
4. 필수 비밀값 하나를 비우고 서버를 띄우면 요청을 받기 전에 기동에 실패한다
5. `spikes/oq-014-pdf.md` 와 `spikes/oq-011-mail.md` 에 측정값과 '판정' 한 줄이 각각 들어 있다
6. (실패 경로) 로그 호출에 클라이언트 개인정보를 담으면 출력에서 그 값이 사라지거나 호출이 거부된다

## Tasks
| ID | 파일 | Goal | depends_on | status |
|---|---|---|---|---|
| phase-01-task-01 | `phase-01-tasks/phase-01-task-01.md` | route/service/data/adapter 네 계층의 디렉터리와 의존 방향 규칙을 세우고 타입 검사가 통과하는 빈 애플리케이션을 만든다 | [] | pending |
| phase-01-task-02 | `phase-01-tasks/phase-01-task-02.md` | 순번이 붙은 마이그레이션 파일로만 스키마를 바꾸고 모든 파일이 되돌리기를 갖도록 하는 실행기를 만든다 | phase-01-task-01 | pending |
| phase-01-task-03 | `phase-01-tasks/phase-01-task-03.md` | 모든 오류 응답이 쓰는 `{error:{code,message,fields?}}` 형식과 일곱 개 이하의 코드 집합을 한 모듈로 고정한다 | phase-01-task-01 | pending |
| phase-01-task-04 | `phase-01-tasks/phase-01-task-04.md` | route 진입 직후 한 번만 도는 스키마 검증 지점을 만들고 화면과 서버가 같은 스키마 정의를 참조하게 한다 | phase-01-task-03 | pending |
| phase-01-task-05 | `phase-01-tasks/phase-01-task-05.md` | 부가세·원천징수 계산과 원 단위 절사를 순수 정수 연산 함수 네 개로 서버 한 지점에 고정한다 | phase-01-task-01 | pending |
| phase-01-task-06 | `phase-01-tasks/phase-01-task-06.md` | 금액·시각·날짜·사업자등록번호의 표시 서식을 한 모듈에 모아 화면과 인쇄 템플릿이 같은 함수를 쓰게 한다 | phase-01-task-01 | pending |
| phase-01-task-07 | `phase-01-tasks/phase-01-task-07.md` | 네 종류의 비밀값을 환경변수로만 받고, 하나라도 없으면 요청을 받기 전에 기동에 실패하게 한다 | phase-01-task-01 | pending |
| phase-01-task-08 | `phase-01-tasks/phase-01-task-08.md` | 요청 로그를 JSON으로 표준 출력에 내보내되 개인정보·비밀값이 로그에 들어가지 못하게 막는다 | phase-01-task-07 | pending |
| phase-01-task-09 | `phase-01-tasks/phase-01-task-09.md` | 조항 30개·항목 20개 규모의 인쇄 HTML을 헤드리스 Chromium으로 렌더해 생성 시간을 재고 컨테이너에서 실행되는지 판정한다 | phase-01-task-01 | pending |
| phase-01-task-10 | `phase-01-tasks/phase-01-task-10.md` | 주요 메일 서비스 3곳에 테스트 메일을 보내 스팸으로 분류되는지 확인하고 판정을 남긴다 | phase-01-task-07 | pending |

## 태스크 간 관계
phase-01-task-01 이 모든 것의 앞이다. task-02~08 은 task-01 뒤에서 서로 독립이라 병렬 가능하다(task-04는 task-03 뒤, task-08은 task-07 뒤). 스파이크 둘(task-09·task-10)도 병렬이며, task-09 의 결과가 phase-04-task-09 를, task-10 의 결과가 phase-02-task-10 을 가른다.

## 근거 문서
- 요구사항: FR-003, FR-004, FR-013, FR-014, FR-002, FR-017 / NFR-006, NFR-008, NFR-013, NFR-015, NFR-016, NFR-002, NFR-004
- 설계: `backend.md §3.1`, `backend.md §3.4`, `backend.md §3.7`, `backend.md §3.10`, `backend.md §3.12`, `database.md §3.15`, `frontend.md §3.8`, `security.md §3.1`, `security.md §3.2`, `security.md §3.3`, `security.md §3.4`
