---
id: phase-05-task-02
phase: "05"
title: 집계 정의 — 청구·입금·미수금
priority: P0
goal: 청구·입금·미수금 합계의 정의를 질의 한 곳에 고정하고 계정 범위와 프로젝트 범위가 같은 정의를 쓰게 한다
depends_on: [phase-05-task-01]
files: [src/modules/invoices/aggregate.ts, src/modules/invoices/aggregate.test.ts]
architecture: [database.md §3.10, backend.md §3.8]
acceptance_criteria:
  - 발송 3건(각 100만)·입금 1건(50만)·초안 2건인 프로젝트에서 청구 합계 350만, 입금 합계 50만, 미수금 300만이 반환된다
  - 입금 완료 1건을 발송으로 되돌리면 미수금이 그 금액만큼 늘어난다
  - 삭제한 인보이스는 어느 합계에도 포함되지 않는다
  - 다른 계정의 인보이스가 어느 합계에도 포함되지 않는다
  - 집계를 저장하는 컬럼이 존재하지 않는다(질의로만 구한다)
  - 프로젝트 범위 집계와 계정 범위 집계가 같은 함수를 쓴다
status: pending
verification: [lint, unit, e2e, task_validation]
blocked_by: []
---

# phase-05-task-02 — 집계 정의 — 청구·입금·미수금

## Goal
청구·입금·미수금 합계의 정의를 질의 한 곳에 고정하고 계정 범위와 프로젝트 범위가 같은 정의를 쓰게 한다.

## Context
저장 집계를 두면 인보이스 상태가 바뀔 때마다 갱신 지점이 늘고, 하나라도 빠지면 FR-005의 일치 기준이 조용히 깨진다(`database.md §3.10`).

## PRD 근거
- FR-005: 총 계약금액, 청구 합계, 입금 합계, 미수금 합계가 숫자로 표시된다
- FR-005: 미수금 합계는 발송·연체 상태 인보이스 금액의 합과 일치한다
- FR-020: 대시보드에 미수금 합계가 숫자로 표시된다

## TRD 근거
- TD-003 (확정)
- TD-004 (확정)

## Architecture
- `database.md §3.10`
- `backend.md §3.8`

## Scope
### In Scope
- 세 합계의 질의 정의
- 계정·프로젝트 범위 공유
### Out of Scope
- 인덱스 — phase-05-task-03
- 화면 표시 — phase-05-task-04, phase-05-task-05

## Acceptance Criteria
1. 발송 3건(각 100만)·입금 1건(50만)·초안 2건인 프로젝트에서 청구 합계 350만, 입금 합계 50만, 미수금 300만이 반환된다
2. 입금 완료 1건을 발송으로 되돌리면 미수금이 그 금액만큼 늘어난다
3. 삭제한 인보이스는 어느 합계에도 포함되지 않는다
4. 다른 계정의 인보이스가 어느 합계에도 포함되지 않는다
5. 집계를 저장하는 컬럼이 존재하지 않는다(질의로만 구한다)
6. 프로젝트 범위 집계와 계정 범위 집계가 같은 함수를 쓴다

## Dependencies
- phase-05-task-01

## Files
- `src/modules/invoices/aggregate.ts` — 새로 만든다
- `src/modules/invoices/aggregate.test.ts` — 새로 만든다

## 바뀔 수 있는 지점
**CF-002 미해소.** 합계에 쓰는 금액 컬럼을 `net_amount`(실수령액)로 잠정 고정한다. '청구액 기준'으로 결정되면 이 파일의 컬럼 이름 한 곳만 `billed_amount` 로 바뀐다(`database.md §3.10`). CF-002는 `P0 뼈대: 아니오` 이므로 이 태스크를 차단하지 않는다.
