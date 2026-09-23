---
id: phase-02-task-04
phase: "02"
title: 가입 — 이메일·비밀번호·처리방침 동의
priority: P0
goal: 이메일 정규화와 8자 검증, Argon2id 해시 저장, 동의 시각 기록까지 하는 가입 경로를 만든다
depends_on: [phase-02-task-03, phase-01-task-04]
files: [src/modules/accounts/service.ts, src/modules/accounts/service.test.ts]
architecture: [auth.md §3.1, database.md §3.2]
acceptance_criteria:
  - 가입에 성공하면 세션이 만들어지고 대시보드로 이동한다
  - 같은 이메일로 다시 가입하면 계정이 생성되지 않고 '이미 사용 중인 이메일' 메시지가 반환된다(UNIQUE 위반 문구가 새지 않는다)
  - 대소문자만 다른 이메일도 중복으로 거부된다
  - 비밀번호 7자로 가입하면 거부되고 사유가 반환된다
  - 처리방침 동의 없이 요청하면 거부된다
  - 가입 후 'accounts' 어느 컬럼에서도 입력한 비밀번호 문자열이 검색되지 않는다
status: pending
verification: [lint, unit, e2e, task_validation]
blocked_by: []
---

# phase-02-task-04 — 가입 — 이메일·비밀번호·처리방침 동의

## Goal
이메일 정규화와 8자 검증, Argon2id 해시 저장, 동의 시각 기록까지 하는 가입 경로를 만든다.

## Context
세션(phase-02-task-03)과 검증(phase-01-task-04)이 준비된 뒤다. FR-024의 네 수용 기준 중 '동의 없이는 가입 불가' 하나가 여기서 처리된다.

## PRD 근거
- FR-001: 이메일과 비밀번호를 입력해 가입하면 계정이 생성되고 로그인된 상태로 대시보드가 열린다
- FR-001: 비밀번호가 8자 미만이면 가입이 거부되고 사유가 화면에 표시된다
- FR-024: 가입 화면에서 처리방침에 동의하지 않으면 가입이 진행되지 않는다
- NFR-006: 저장소에 비밀번호 평문이 존재하지 않는다

## TRD 근거
- TD-010 (확정) — Argon2id
- TD-013 (확정) — 서버 경계 검증

## Architecture
- `auth.md §3.1`
- `database.md §3.2`

## Scope
### In Scope
- 가입 service 로직
- 이메일 정규화 함수(로그인과 공유)
- 동의 시각 기록
### Out of Scope
- 처리방침 문서 내용 — phase-06-task-12 (차단)
- 가입 화면 — phase-02-task-07

## Acceptance Criteria
1. 가입에 성공하면 세션이 만들어지고 대시보드로 이동한다
2. 같은 이메일로 다시 가입하면 계정이 생성되지 않고 "이미 사용 중인 이메일" 메시지가 반환된다(UNIQUE 위반 문구가 새지 않는다)
3. 대소문자만 다른 이메일도 중복으로 거부된다
4. 비밀번호 7자로 가입하면 거부되고 사유가 반환된다
5. 처리방침 동의 없이 요청하면 거부된다
6. 가입 후 `accounts` 어느 컬럼에서도 입력한 비밀번호 문자열이 검색되지 않는다

## Dependencies
- phase-02-task-03
- phase-01-task-04

## Files
- `src/modules/accounts/service.ts` — 새로 만든다
- `src/modules/accounts/service.test.ts` — 새로 만든다

## 바뀔 수 있는 지점
없음
