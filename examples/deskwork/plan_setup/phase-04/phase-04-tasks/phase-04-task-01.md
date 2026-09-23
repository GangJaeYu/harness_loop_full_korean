---
id: phase-04-task-01
phase: "04"
title: invoices·invoice_items 테이블과 data 계층
priority: P0
goal: 네 금액 컬럼과 세 상태를 가진 인보이스 테이블을 만들고 스냅샷 컬럼을 세운다
depends_on: [phase-03-task-04, phase-01-task-05]
files: [migrations/0006_invoices.sql, src/modules/invoices/data.ts, src/modules/invoices/data.test.ts]
architecture: [database.md §3.6, database.md §3.1]
acceptance_criteria:
  - 공급가액 1,000,003원·원천징수 인보이스를 저장하면 'tax_amount=33000', 'net_amount=967003', 'billed_amount=1000003' 이 저장되고 조회 시 동일하다
  - 단가에 -1을 넣으면 CHECK 제약에서 거부된다
  - 같은 계정에서 같은 'number' 를 가진 행 두 개를 넣으려 하면 UNIQUE 위반으로 거부된다
  - 'status' 에 'overdue' 를 넣으면 CHECK 제약에서 거부된다(연체는 상태가 아니다)
  - 'due_date' 가 NULL인 행이 정상 저장된다
  - 통화를 나타내는 컬럼이 존재하지 않는다
status: pending
verification: [lint, unit, e2e, task_validation]
blocked_by: []
---

# phase-04-task-01 — invoices·invoice_items 테이블과 data 계층

## Goal
네 금액 컬럼과 세 상태를 가진 인보이스 테이블을 만들고 스냅샷 컬럼을 세운다.

## Context
phase-01-task-05 가 계산을 함수로 고정했다. 이 테이블은 그 결과 네 값을 받아 저장만 한다.

## PRD 근거
- FR-012: 클라이언트 정보와 대금 조건에서 선택한 회차의 금액이 자동으로 채워진다
- FR-014: 부가세 10% 또는 원천징수 3.3%를 적용해 청구 금액을 얻는다
- NFR-008: 금액은 손실 없이 저장·표시된다
- NFR-016: 통화는 원(KRW) 단일

## TRD 근거
- TD-003 (확정)
- TD-004 (확정)
- TD-007 (확정)

## Architecture
- `database.md §3.6`
- `database.md §3.1`

## Scope
### In Scope
- `invoices` · `invoice_items` 테이블
- 조회·저장 data 함수
- `client_snapshot`
### Out of Scope
- 채번 — phase-04-task-02
- 상태 전이 규칙 — phase-04-task-06
- 집계 — phase-05-task-02

## Acceptance Criteria
1. 공급가액 1,000,003원·원천징수 인보이스를 저장하면 `tax_amount=33000`, `net_amount=967003`, `billed_amount=1000003` 이 저장되고 조회 시 동일하다
2. 단가에 -1을 넣으면 CHECK 제약에서 거부된다
3. 같은 계정에서 같은 `number` 를 가진 행 두 개를 넣으려 하면 UNIQUE 위반으로 거부된다
4. `status` 에 `overdue` 를 넣으면 CHECK 제약에서 거부된다(연체는 상태가 아니다)
5. `due_date` 가 NULL인 행이 정상 저장된다
6. 통화를 나타내는 컬럼이 존재하지 않는다

## Dependencies
- phase-03-task-04
- phase-01-task-05

## Files
- `migrations/0006_invoices.sql` — 새로 만든다
- `src/modules/invoices/data.ts` — 새로 만든다
- `src/modules/invoices/data.test.ts` — 새로 만든다

> **파일이 하나가 아닌 이유**: 테이블 제약과 접근 함수를 떼어 놓으면 금액 왕복 일치를 검증할 수 없다.

## 바뀔 수 있는 지점
PRD OQ-004(세금 처리 범위)가 '금액만'으로 결정되면 `tax_mode`·`tax_amount` 가 사라진다(`database.md §3.6`). CF-002(미수금 기준 금액)가 '청구액'으로 결정되어도 컬럼은 그대로이고 집계 질의만 바뀐다.
