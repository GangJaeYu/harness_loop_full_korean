# Phase 02 — authentication

- **Goal**: 계정을 만들고 로그인해 자기 데이터만 볼 수 있는 상태가 된다. 소유자 조건이 data 계층 시그니처로 강제되고, 비인증으로 열 수 있는 경로가 닫힌 목록이 된다.
- **Dependencies**: phase-01
- **Status**: pending

## Acceptance Criteria
(이 기준으로 phase 완료가 자동 판정된다.)

1. 가입 → 대시보드 진입 → 로그아웃 → 대시보드 주소 재접근 시 로그인 화면으로 이동, 이 흐름이 끝까지 동작한다
2. 가입 후 `accounts` 어느 컬럼에서도 입력한 비밀번호 문자열이 검색되지 않는다
3. 비인증 허용 목록에 없는 새 경로를 추가하면 기본이 인증 필수다
4. 폭 375px에서 공통 레이아웃을 열면 가로 스크롤바가 없다
5. 비밀번호 재설정을 요청하면 로컬 메일 캡처에 재설정 링크가 담긴 메일 1건이 잡히고, 완료 후 이전 비밀번호로는 로그인되지 않는다
6. (실패 경로) 존재하지 않는 이메일과 존재하는 이메일+틀린 비밀번호의 로그인 응답이 본문·상태 코드·응답 시간 자릿수까지 동일하다
7. (실패 경로) `accountId` 를 첫 인자로 받지 않는 data 함수를 추가하면 규약 테스트가 실패한다

## Tasks
| ID | 파일 | Goal | depends_on | status |
|---|---|---|---|---|
| phase-02-task-01 | `phase-02-tasks/phase-02-task-01.md` | 계정과 세션 테이블을 만들고 소유 관계의 뿌리인 `accounts` 를 세운다 | phase-01-task-02 | pending |
| phase-02-task-02 | `phase-02-tasks/phase-02-task-02.md` | data 계층의 모든 함수가 첫 인자로 `accountId` 를 받고 질의에 소유자 조건과 삭제 필터를 항상 포함하게 강제한다 | phase-02-task-01 | pending |
| phase-02-task-03 | `phase-02-tasks/phase-02-task-03.md` | DB 세션을 만들고 HttpOnly·Secure·SameSite 쿠키로 전달하며 고정 만료 14일을 적용한다 | phase-02-task-01, phase-01-task-07 | pending |
| phase-02-task-04 | `phase-02-tasks/phase-02-task-04.md` | 이메일 정규화와 8자 검증, Argon2id 해시 저장, 동의 시각 기록까지 하는 가입 경로를 만든다 | phase-02-task-03, phase-01-task-04 | pending |
| phase-02-task-05 | `phase-02-tasks/phase-02-task-05.md` | 이메일·비밀번호 어느 쪽이 틀렸는지 알 수 없는 로그인 실패 응답을 응답 시간까지 포함해 만든다 | phase-02-task-04 | pending |
| phase-02-task-06 | `phase-02-tasks/phase-02-task-06.md` | 경로를 공개 폼·공유·인증 필수 세 묶음으로 나누고 새 경로의 기본값을 '인증 필수'로 만든다 | phase-02-task-03 | pending |
| phase-02-task-07 | `phase-02-tasks/phase-02-task-07.md` | 서버 오류 응답의 `fields[].field` 를 입력란 `name` 에 붙여 인라인 오류를 띄우는 폼 화면을 만든다 | phase-02-task-05, phase-02-task-06, phase-01-task-03 | pending |
| phase-02-task-08 | `phase-02-tasks/phase-02-task-08.md` | 빈 상태·오류 상태·로딩 규칙을 공통 컴포넌트로 고정하고 브레이크포인트 하나(768px)를 세운다 | phase-02-task-07, phase-01-task-06 | pending |
| phase-02-task-09 | `phase-02-tasks/phase-02-task-09.md` | `send({to, subject, body})` 하나를 노출하는 어댑터를 두고 환경별로 구현체를 주입한다 | phase-01-task-07, phase-01-task-10 | pending |
| phase-02-task-10 | `phase-02-tasks/phase-02-task-10.md` | 해시로만 저장되는 24시간 만료 재설정 토큰을 발급하고, 완료 시 기존 세션을 전부 무효화한다 | phase-02-task-09, phase-02-task-05 | pending |
| phase-02-task-11 | `phase-02-tasks/phase-02-task-11.md` | `/privacy` 화면과 앱 공통 레이아웃 하단의 처리방침 링크를 만들어 FR-024의 접근 경로를 세운다 | phase-02-task-08 | pending |

## 태스크 간 관계
task-01 → task-02·task-03 → task-04 → task-05 → task-07 순이 인증의 뼈대다. task-06(라우팅)은 task-03 뒤에서 task-04·05 와 병렬 가능하다. task-09(메일 어댑터)와 task-10(재설정)은 phase-01-task-10 의 스파이크 판정 뒤에 온다. task-08(공통 레이아웃)과 task-11(처리방침 화면)은 화면 계열이라 task-07 뒤다.

## 근거 문서
- 요구사항: FR-001, FR-002, FR-024(동의·접근 경로) / NFR-004, NFR-006, NFR-010, NFR-011, NFR-012(경로 등재)
- 설계: `auth.md §3.1`~`§3.7`, `backend.md §3.2`, `backend.md §3.3`, `database.md §3.1`, `database.md §3.2`, `frontend.md §3.1`, `frontend.md §3.2`, `frontend.md §3.6`, `frontend.md §3.7`, `frontend.md §3.11`, `frontend.md §3.12`, `security.md §3.2`, `backend.md §3.12`
