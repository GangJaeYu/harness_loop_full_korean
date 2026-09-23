---
id: phase-02-task-03
phase: "02"
title: 세션 생성·검증과 쿠키 속성
priority: P0
goal: DB 세션을 만들고 HttpOnly·Secure·SameSite 쿠키로 전달하며 고정 만료 14일을 적용한다
depends_on: [phase-02-task-01, phase-01-task-07]
files: [src/lib/session.ts, src/lib/session.test.ts]
architecture: [auth.md §3.3]
acceptance_criteria:
  - 로그인 응답의 쿠키에 'HttpOnly' 와 'Secure' 와 'SameSite=Lax' 가 있다
  - 요청마다 'last_seen_at' 이 갱신되지만 'expires_at' 은 연장되지 않는다
  - 만료 시각이 지난 세션 id로 요청하면 인증되지 않는다
  - 계정의 모든 세션을 무효화하는 함수를 부르면 그 계정의 세션 행이 전부 사라진다
  - 세션 조회가 요청당 1회를 넘으면 테스트가 실패한다
status: pending
verification: [lint, unit, e2e, task_validation]
blocked_by: []
---

# phase-02-task-03 — 세션 생성·검증과 쿠키 속성

## Goal
DB 세션을 만들고 HttpOnly·Secure·SameSite 쿠키로 전달하며 고정 만료 14일을 적용한다.

## Context
phase-02-task-01 이 `sessions` 테이블을 만들었다. 이 태스크가 그 위에 세션 수명과 쿠키 규칙을 얹고, 그 결과의 `account_id` 가 phase-02-task-02 의 소유자 조건 인자가 된다.

## PRD 근거
- FR-001: 로그인하지 않은 상태에서 대시보드 주소로 직접 접근하면 로그인 화면으로 이동한다
- FR-002: 재설정을 완료하면 기존 비밀번호로는 로그인되지 않는다
- NFR-006: 모든 페이지가 전송 구간 암호화로만 제공된다

## TRD 근거
- TD-010 (확정) — 서버 세션 + HttpOnly 쿠키

## Architecture
- `auth.md §3.3`

## Scope
### In Scope
- 세션 생성·조회·삭제
- 쿠키 속성
- 계정 단위 전체 무효화
### Out of Scope
- 로그인 화면과 폼 — phase-02-task-07
- 라우팅 접근 제어 — phase-02-task-06

## Acceptance Criteria
1. 로그인 응답의 쿠키에 `HttpOnly` 와 `Secure` 와 `SameSite=Lax` 가 있다
2. 요청마다 `last_seen_at` 이 갱신되지만 `expires_at` 은 연장되지 않는다
3. 만료 시각이 지난 세션 id로 요청하면 인증되지 않는다
4. 계정의 모든 세션을 무효화하는 함수를 부르면 그 계정의 세션 행이 전부 사라진다
5. 세션 조회가 요청당 1회를 넘으면 테스트가 실패한다

## Dependencies
- phase-02-task-01
- phase-01-task-07

## Files
- `src/lib/session.ts` — 새로 만든다
- `src/lib/session.test.ts` — 새로 만든다

## 바뀔 수 있는 지점
없음
