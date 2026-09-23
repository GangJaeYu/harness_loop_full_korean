---
id: phase-02-task-09
phase: "02"
title: 메일 발송 어댑터 인터페이스
priority: P1
goal: `send({to, subject, body})` 하나를 노출하는 어댑터를 두고 환경별로 구현체를 주입한다
depends_on: [phase-01-task-07, phase-01-task-10]
files: [src/adapters/mailer.ts, src/adapters/mailer.test.ts]
architecture: [backend.md §3.12]
acceptance_criteria:
  - 로컬 환경에서는 캡처 구현체가, 운영 환경에서는 제공자 구현체가 주입된다
  - service 코드에서 제공자 이름이나 SDK 타입이 등장하는 곳이 0건이다
  - 어댑터가 예외를 던지면 'EXTERNAL_FAILED' 로 변환되어 올라간다
  - 어댑터가 도메인 모듈이나 data 계층을 import 하면 계층 테스트가 실패한다
status: pending
verification: [lint, unit, e2e, task_validation]
blocked_by: []
---

# phase-02-task-09 — 메일 발송 어댑터 인터페이스

## Goal
`send({to, subject, body})` 하나를 노출하는 어댑터를 두고 환경별로 구현체를 주입한다.

## Context
phase-01-task-10 의 스파이크가 제공자를 가른다. 인터페이스를 먼저 만들어 두면 그 결과가 구현체 교체로 끝난다.

## PRD 근거
- FR-002: 재설정 링크가 담긴 메일이 발송된다
- FR-017: 메일 발송 실패 시 사유가 표시되고 상태는 바뀌지 않는다
- NFR-015: 개인정보 국외 이전 금지 — 국내 처리 제공자만 후보다

## TRD 근거
- TD-009 (잠정, PRD OQ-011·OQ-010 대기) — 외부 연동은 트랜잭션 메일 발송 1개
- TD-018 (확정) — 로컬 메일 캡처

## Architecture
- `backend.md §3.12`

## Scope
### In Scope
- 어댑터 인터페이스와 환경별 주입
- 실패의 오류 코드 변환
### Out of Scope
- 메일 본문 문안 — 각 사용처 태스크
- 제공자 확정 — PRD OQ-011 (phase-01-task-10 의 스파이크 결과)

## Acceptance Criteria
1. 로컬 환경에서는 캡처 구현체가, 운영 환경에서는 제공자 구현체가 주입된다
2. service 코드에서 제공자 이름이나 SDK 타입이 등장하는 곳이 0건이다
3. 어댑터가 예외를 던지면 `EXTERNAL_FAILED` 로 변환되어 올라간다
4. 어댑터가 도메인 모듈이나 data 계층을 import 하면 계층 테스트가 실패한다

## Dependencies
- phase-01-task-07
- phase-01-task-10

## Files
- `src/adapters/mailer.ts` — 새로 만든다
- `src/adapters/mailer.test.ts` — 새로 만든다

## 바뀔 수 있는 지점
TD-009 가 잠정이다. PRD OQ-011 실험 결과로 제공자가 바뀌면 구현체만 교체하고 이 인터페이스는 유지한다(`backend.md §3.12`).
