---
id: phase-02-task-01
phase: "02"
title: accounts·sessions 테이블과 data 계층
priority: P0
goal: 계정과 세션 테이블을 만들고 소유 관계의 뿌리인 `accounts` 를 세운다
depends_on: [phase-01-task-02]
files: [migrations/0002_accounts_sessions.sql, src/modules/accounts/data.ts, src/modules/accounts/data.test.ts]
architecture: [database.md §3.2, database.md §3.1, auth.md §3.3]
acceptance_criteria:
  - 마이그레이션을 적용하면 'accounts' 와 'sessions' 가 생기고 되돌리면 사라진다
  - 같은 이메일로 두 행을 넣으려 하면 UNIQUE 위반으로 거부된다
  - 대소문자만 다른 이메일은 소문자 정규화 후 중복으로 거부된다
  - 'accounts' 에 'role' 이나 권한 컬럼이 존재하지 않는다
  - 'deleted_at' 이 채워진 계정은 조회 함수의 결과에 나오지 않는다
status: pending
verification: [lint, unit, e2e, task_validation]
blocked_by: []
---

# phase-02-task-01 — accounts·sessions 테이블과 data 계층

## Goal
계정과 세션 테이블을 만들고 소유 관계의 뿌리인 `accounts` 를 세운다.

## Context
phase-01-task-02 가 마이그레이션 러너를 만들었다. 이 태스크가 첫 실제 테이블이고, 이후 모든 테이블이 여기의 `accounts.id` 를 참조한다.

## PRD 근거
- FR-001: 이메일과 비밀번호로 계정을 만들고 로그인한다
- NFR-006: 저장소에 비밀번호 평문이 존재하지 않는다(단방향 해시)
- NFR-007: 계정을 해지하면 30일 뒤 모든 개인정보가 파기된다

## TRD 근거
- TD-010 (확정) — 서버 세션 + Argon2id, 역할은 '소유자' 단일
- TD-005 (확정) — 논리 삭제

## Architecture
- `database.md §3.2`
- `database.md §3.1`
- `auth.md §3.3`

## Scope
### In Scope
- `accounts` · `sessions` 테이블
- 계정 조회·생성 data 함수
### Out of Scope
- 가입 흐름과 해시 — phase-02-task-04
- 세션 쿠키 — phase-02-task-03
- 재설정 토큰 테이블 — phase-02-task-10

## Acceptance Criteria
1. 마이그레이션을 적용하면 `accounts` 와 `sessions` 가 생기고 되돌리면 사라진다
2. 같은 이메일로 두 행을 넣으려 하면 UNIQUE 위반으로 거부된다
3. 대소문자만 다른 이메일은 소문자 정규화 후 중복으로 거부된다
4. `accounts` 에 `role` 이나 권한 컬럼이 존재하지 않는다
5. `deleted_at` 이 채워진 계정은 조회 함수의 결과에 나오지 않는다

## Dependencies
- phase-01-task-02

## Files
- `migrations/0002_accounts_sessions.sql` — 새로 만든다
- `src/modules/accounts/data.ts` — 새로 만든다
- `src/modules/accounts/data.test.ts` — 새로 만든다

> **파일이 하나가 아닌 이유**: 테이블과 그 접근 함수를 떼어 놓으면 어느 쪽도 혼자 검증되지 않는다.

## 바뀔 수 있는 지점
PRD OQ-003이 '스튜디오'로 뒤집히면 소유 주체가 계정에서 조직으로 바뀌고 이 절과 `auth.md §3.5` 를 다시 그린다(`database.md §3.1`).
