---
id: phase-02-task-05
phase: "02"
title: 로그인·로그아웃과 실패 응답 비구분
priority: P0
goal: 이메일·비밀번호 어느 쪽이 틀렸는지 알 수 없는 로그인 실패 응답을 응답 시간까지 포함해 만든다
depends_on: [phase-02-task-04]
files: [src/modules/accounts/route.ts, src/modules/accounts/route.test.ts]
architecture: [auth.md §3.2, security.md §3.2, backend.md §3.3]
acceptance_criteria:
  - 존재하지 않는 이메일과 존재하는 이메일+틀린 비밀번호의 응답 본문·상태 코드가 동일하다
  - 두 경우의 응답 시간이 같은 자릿수다(계정이 없어도 해시 검증에 준하는 시간을 소비한다)
  - 로그아웃하면 세션 행이 사라지고 쿠키가 만료된다
  - 'deleted_at' 이 채워진 계정으로 로그인하면 실패한다
  - 로그인 실패 로그에 입력한 비밀번호가 남지 않는다
status: pending
verification: [lint, unit, e2e, task_validation]
blocked_by: []
---

# phase-02-task-05 — 로그인·로그아웃과 실패 응답 비구분

## Goal
이메일·비밀번호 어느 쪽이 틀렸는지 알 수 없는 로그인 실패 응답을 응답 시간까지 포함해 만든다.

## Context
phase-02-task-04 가 가입과 해시를 만들었다. 로그인은 그 해시를 검증하는 쪽이다.

## PRD 근거
- FR-001: 잘못된 비밀번호로 로그인하면 "이메일 또는 비밀번호가 올바르지 않습니다"가 표시된다(어느 쪽이 틀렸는지는 구분해 알리지 않는다)

## TRD 근거
- TD-010 (확정)
- TD-008 (확정) — 단일 오류 형식

## Architecture
- `auth.md §3.2`
- `security.md §3.2`
- `backend.md §3.3`

## Scope
### In Scope
- 로그인·로그아웃 route와 service
- 응답 시간 평탄화
### Out of Scope
- 재설정 — phase-02-task-10
- 화면 — phase-02-task-07

## Acceptance Criteria
1. 존재하지 않는 이메일과 존재하는 이메일+틀린 비밀번호의 응답 본문·상태 코드가 동일하다
2. 두 경우의 응답 시간이 같은 자릿수다(계정이 없어도 해시 검증에 준하는 시간을 소비한다)
3. 로그아웃하면 세션 행이 사라지고 쿠키가 만료된다
4. `deleted_at` 이 채워진 계정으로 로그인하면 실패한다
5. 로그인 실패 로그에 입력한 비밀번호가 남지 않는다

## Dependencies
- phase-02-task-04

## Files
- `src/modules/accounts/route.ts` — 새로 만든다
- `src/modules/accounts/route.test.ts` — 새로 만든다

## 바뀔 수 있는 지점
없음
