---
id: phase-04-task-06
phase: "04"
title: 인보이스 상태 전이와 이력
priority: P0
goal: `POST /api/invoices/:id/status` 하나가 전이 표를 적용하고 같은 트랜잭션에서 이력 1건을 남기게 한다
depends_on: [phase-04-task-05, phase-04-task-03]
files: [src/modules/invoices/status.ts, src/modules/invoices/status.test.ts]
architecture: [database.md §3.12, backend.md §3.9, backend.md §3.5]
acceptance_criteria:
  - 초안을 'sent' 로 바꾸면 'sent_at' 이 기록되고 이력 1건이 남는다
  - 초안을 'paid' 로 바로 바꾸려 하면 409와 사유가 반환된다
  - 항목이 없는 인보이스를 'sent' 로 바꾸려 하면 409와 사유가 반환된다
  - 'paid → sent' 로 되돌리면 'paid_at' 이 NULL이 된다
  - 상태를 3회 바꾸면 이력 3건이 전후 상태와 함께 남는다
  - 이력 삽입을 강제로 실패시키면 인보이스 상태도 바뀌지 않는다
status: pending
verification: [lint, unit, e2e, task_validation]
blocked_by: []
---

# phase-04-task-06 — 인보이스 상태 전이와 이력

## Goal
`POST /api/invoices/:id/status` 하나가 전이 표를 적용하고 같은 트랜잭션에서 이력 1건을 남기게 한다.

## Context
전이 경로를 상태별 엔드포인트로 흩으면 규칙이 세 곳에 나뉜다. 한 경로에서 표 하나를 보게 한다(`backend.md §3.9`).

## PRD 근거
- FR-018: 초안에서 곧바로 입금완료로 바꿀 수 없고 사유가 표시된다
- FR-018: 입금완료 인보이스를 다시 발송 상태로 되돌리면 입금일이 지워지고 미수금 합계에 다시 포함된다
- FR-014: 항목이 하나도 없으면 인보이스를 '발송' 상태로 바꿀 수 없고 사유가 표시된다
- NFR-009: 인보이스 상태 변경이 기록되고 최소 1년 보존된다

## TRD 근거
- TD-007 (확정)
- TD-003 (확정)

## Architecture
- `database.md §3.12`
- `backend.md §3.9`
- `backend.md §3.5`

## Scope
### In Scope
- 전이 표 적용
- 전이와 이력의 단일 트랜잭션
### Out of Scope
- 연체 판정 — phase-04-task-07 (상태가 아니라 파생 조건이다)
- 미수금 합계 — phase-05-task-02

## Acceptance Criteria
1. 초안을 `sent` 로 바꾸면 `sent_at` 이 기록되고 이력 1건이 남는다
2. 초안을 `paid` 로 바로 바꾸려 하면 409와 사유가 반환된다
3. 항목이 없는 인보이스를 `sent` 로 바꾸려 하면 409와 사유가 반환된다
4. `paid → sent` 로 되돌리면 `paid_at` 이 NULL이 된다
5. 상태를 3회 바꾸면 이력 3건이 전후 상태와 함께 남는다
6. 이력 삽입을 강제로 실패시키면 인보이스 상태도 바뀌지 않는다

## Dependencies
- phase-04-task-05
- phase-04-task-03

## Files
- `src/modules/invoices/status.ts` — 새로 만든다
- `src/modules/invoices/status.test.ts` — 새로 만든다

## 바뀔 수 있는 지점
없음
