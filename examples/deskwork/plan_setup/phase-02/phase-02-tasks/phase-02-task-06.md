---
id: phase-02-task-06
phase: "02"
title: 라우팅 접근 제어와 비인증 경로 닫힌 목록
priority: P0
goal: 경로를 공개 폼·공유·인증 필수 세 묶음으로 나누고 새 경로의 기본값을 '인증 필수'로 만든다
depends_on: [phase-02-task-03]
files: [src/middleware.ts, src/middleware.test.ts]
architecture: [frontend.md §3.2, auth.md §3.7]
acceptance_criteria:
  - 로그인하지 않고 '/', '/projects/:id', '/invoices/:id' 를 열면 모두 '/login' 으로 이동한다
  - 로그인 후 원래 가려던 경로로 되돌아온다
  - 로그인 상태에서 '/login' 을 열면 '/' 로 이동한다
  - 비인증 허용 목록에 없는 새 경로를 추가하면 기본이 인증 필수다(테스트가 그것을 확인한다)
  - 로그인하지 않고 '/api/*' 의 임의 경로를 호출하면 401 이 반환된다
status: pending
verification: [lint, unit, e2e, task_validation]
blocked_by: []
---

# phase-02-task-06 — 라우팅 접근 제어와 비인증 경로 닫힌 목록

## Goal
경로를 공개 폼·공유·인증 필수 세 묶음으로 나누고 새 경로의 기본값을 '인증 필수'로 만든다.

## Context
`auth.md §3.7` 이 비인증 경로를 정확히 다섯 개로 못박았다. `/s/:token` 은 목록에만 등재하고 실제 화면은 phase-06-task-10(차단)이 만든다.

## PRD 근거
- FR-001: 로그인하지 않은 상태에서 대시보드 주소로 직접 접근하면 로그인 화면으로 이동한다
- NFR-004: 타인의 데이터는 주소를 알아도 접근할 수 없다
- NFR-012: 공유 링크 열람에 로그인·가입·앱 설치가 요구되지 않는다

## TRD 근거
- TD-010 (확정)
- TD-011 (확정) — 비인증 경로는 공유 토큰 하나뿐

## Architecture
- `frontend.md §3.2`
- `auth.md §3.7`

## Scope
### In Scope
- 세 묶음 라우팅 규칙
- 로그인 후 복귀 경로 보존
- 비인증 경로 목록 상수
### Out of Scope
- 자원 소유 판정 — phase-02-task-02 (data 계층에서만 한다)
- 공유 열람 화면 — phase-06-task-10 (차단)

## Acceptance Criteria
1. 로그인하지 않고 `/`, `/projects/:id`, `/invoices/:id` 를 열면 모두 `/login` 으로 이동한다
2. 로그인 후 원래 가려던 경로로 되돌아온다
3. 로그인 상태에서 `/login` 을 열면 `/` 로 이동한다
4. 비인증 허용 목록에 없는 새 경로를 추가하면 기본이 인증 필수다(테스트가 그것을 확인한다)
5. 로그인하지 않고 `/api/*` 의 임의 경로를 호출하면 401 이 반환된다

## Dependencies
- phase-02-task-03

## Files
- `src/middleware.ts` — 새로 만든다
- `src/middleware.test.ts` — 새로 만든다

## 바뀔 수 있는 지점
없음
