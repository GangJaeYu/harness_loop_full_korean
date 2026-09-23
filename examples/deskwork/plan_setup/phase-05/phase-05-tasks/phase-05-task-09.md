---
id: phase-05-task-09
phase: "05"
title: 하루 1회 정기 작업
priority: P0
goal: 연체 알림 생성·30일 경과 파기·해지 계정 파기·이력 1년 정리를 단계별 독립 트랜잭션으로 도는 경로 하나를 만든다
depends_on: [phase-05-task-08, phase-05-task-06, phase-04-task-03]
files: [src/jobs/daily.ts, src/jobs/daily.test.ts]
architecture: [backend.md §3.13, database.md §3.13]
acceptance_criteria:
  - 기한이 지난 인보이스가 3건일 때 작업을 실행하면 알림 3건이 생기고, 다시 실행해도 3건 그대로다
  - 'deleted_at' 을 31일 전으로 만든 문서가 작업 후 DB에서 사라지고 자식 행도 CASCADE로 사라진다
  - 그 문서의 'audit_events' 행은 파기 후에도 남아 있다
  - 'occurred_at' 이 1년을 넘은 이력 행이 작업 후 사라진다
  - 인증 비밀값 없이 '/internal/jobs/daily' 를 호출하면 404가 반환된다
  - 한 단계가 실패해도 다음 단계가 실행되고 실패가 로그에 남는다
  - 이 작업이 연체 '판정'을 저장하지 않는다(연체 컬럼을 쓰는 코드가 없다)
status: pending
verification: [lint, unit, e2e, task_validation]
blocked_by: []
---

# phase-05-task-09 — 하루 1회 정기 작업

## Goal
연체 알림 생성·30일 경과 파기·해지 계정 파기·이력 1년 정리를 단계별 독립 트랜잭션으로 도는 경로 하나를 만든다.

## Context
배치가 판정까지 맡으면 배치가 안 돈 날 화면이 틀린 값을 보여 준다. 배치에 남기는 것은 기록이 필요한 것(알림·파기)뿐이다(`backend.md §3.13`).

## PRD 근거
- NFR-007: 사용자가 삭제한 문서는 30일간 복구 가능 영역에 있다가 자동 파기된다. 계정을 해지하면 30일 뒤 모든 개인정보가 파기된다
- NFR-009: 감사 이력 최소 1년 보존
- FR-021: 인보이스가 새로 연체로 판정되면 알림 1건이 생성된다

## TRD 근거
- TD-005 (확정)
- TD-016 (잠정) — 호스팅 스케줄 실행
- TD-007 (확정)

## Architecture
- `backend.md §3.13`
- `database.md §3.13`

## Scope
### In Scope
- 정기 작업 경로와 호출자 인증
- 네 단계와 단계별 독립 트랜잭션
### Out of Scope
- 스케줄 등록 — 배포 구성(TD-016, OQ-013)

## Acceptance Criteria
1. 기한이 지난 인보이스가 3건일 때 작업을 실행하면 알림 3건이 생기고, 다시 실행해도 3건 그대로다
2. `deleted_at` 을 31일 전으로 만든 문서가 작업 후 DB에서 사라지고 자식 행도 CASCADE로 사라진다
3. 그 문서의 `audit_events` 행은 파기 후에도 남아 있다
4. `occurred_at` 이 1년을 넘은 이력 행이 작업 후 사라진다
5. 인증 비밀값 없이 `/internal/jobs/daily` 를 호출하면 404가 반환된다
6. 한 단계가 실패해도 다음 단계가 실행되고 실패가 로그에 남는다
7. 이 작업이 연체 '판정'을 저장하지 않는다(연체 컬럼을 쓰는 코드가 없다)

## Dependencies
- phase-05-task-08
- phase-05-task-06
- phase-04-task-03

## Files
- `src/jobs/daily.ts` — 새로 만든다
- `src/jobs/daily.test.ts` — 새로 만든다

## 바뀔 수 있는 지점
TD-016 잠정(PRD OQ-010·TRD OQ-013). 호스팅이 바뀌면 스케줄 호출 방식만 바뀌고 이 경로는 유지된다.
