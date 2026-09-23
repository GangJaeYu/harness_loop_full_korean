---
id: phase-02-task-10
phase: "02"
title: 비밀번호 재설정 — 토큰 발급과 완료
priority: P1
goal: 해시로만 저장되는 24시간 만료 재설정 토큰을 발급하고, 완료 시 기존 세션을 전부 무효화한다
depends_on: [phase-02-task-09, phase-02-task-05]
files: [migrations/0003_password_reset_tokens.sql, src/modules/accounts/password-reset.ts, src/modules/accounts/password-reset.test.ts]
architecture: [auth.md §3.4, auth.md §3.3, backend.md §3.12]
acceptance_criteria:
  - 가입된 이메일로 요청하면 로컬 메일 캡처에 재설정 링크가 담긴 메일 1건이 잡힌다
  - 가입되지 않은 이메일로 요청하면 화면 안내는 동일하고 메일은 잡히지 않으며 토큰 행도 생기지 않는다
  - 발급 25시간 뒤 링크를 열면 만료 안내가 표시된다
  - 재설정 완료 후 이전 비밀번호로 로그인하면 실패한다
  - 같은 링크를 두 번 사용하면 두 번째는 거부된다
  - DB에서 메일 링크의 토큰 문자열이 검색되지 않는다
status: pending
verification: [lint, unit, e2e, task_validation]
blocked_by: []
---

# phase-02-task-10 — 비밀번호 재설정 — 토큰 발급과 완료

## Goal
해시로만 저장되는 24시간 만료 재설정 토큰을 발급하고, 완료 시 기존 세션을 전부 무효화한다.

## Context
phase-01-task-10 의 스파이크가 메일 도달을 판정했고 phase-02-task-09 가 어댑터를 만들었다. 이 태스크가 그 위에 재설정 흐름을 얹는다.

## PRD 근거
- FR-002: 재설정 링크는 발급 후 24시간이 지나면 동작하지 않고 만료 안내가 표시된다
- FR-002: 가입되지 않은 이메일을 입력해도 화면에는 동일한 안내가 표시되고 메일은 발송되지 않는다
- FR-002: 재설정을 완료하면 기존 비밀번호로는 로그인되지 않는다

## TRD 근거
- TD-010 (확정)
- TD-009 (잠정)

## Architecture
- `auth.md §3.4`
- `auth.md §3.3`
- `backend.md §3.12`

## Scope
### In Scope
- `password_reset_tokens` 테이블
- 요청·완료 service와 route
- 세션 전체 무효화 연결
- 재설정 화면 2개
### Out of Scope
- 메일 제공자 선택 — TD-009 (잠정)

## Acceptance Criteria
1. 가입된 이메일로 요청하면 로컬 메일 캡처에 재설정 링크가 담긴 메일 1건이 잡힌다
2. 가입되지 않은 이메일로 요청하면 화면 안내는 동일하고 메일은 잡히지 않으며 토큰 행도 생기지 않는다
3. 발급 25시간 뒤 링크를 열면 만료 안내가 표시된다
4. 재설정 완료 후 이전 비밀번호로 로그인하면 실패한다
5. 같은 링크를 두 번 사용하면 두 번째는 거부된다
6. DB에서 메일 링크의 토큰 문자열이 검색되지 않는다

## Dependencies
- phase-02-task-09
- phase-02-task-05

## Files
- `migrations/0003_password_reset_tokens.sql` — 새로 만든다
- `src/modules/accounts/password-reset.ts` — 새로 만든다
- `src/modules/accounts/password-reset.test.ts` — 새로 만든다

> **파일이 하나가 아닌 이유**: 토큰 테이블과 그 발급·검증 로직을 떼어 놓으면 만료·재사용 금지를 혼자 검증할 수 없다.

## 바뀔 수 있는 지점
PRD OQ-011 미해소. phase-01-task-10 의 스파이크가 '도달 실패'로 판정되면 FR-002의 경로 자체를 PRD와 함께 다시 설계한다(`auth.md §3.4` 의 '바뀔 수 있는 지점'). 그때 이 태스크는 재작성 대상이다.
