---
id: phase-04-task-02
phase: "04"
title: 인보이스 번호 원자적 채번
priority: P0
goal: 계정·연도별 카운터 행 하나에 대한 원자적 갱신으로 `YYYY-NNNN` 번호를 채번한다
depends_on: [phase-04-task-01]
files: [migrations/0007_invoice_number_counters.sql, src/modules/invoices/number.ts, src/modules/invoices/number.test.ts]
architecture: [database.md §3.7]
acceptance_criteria:
  - 한 계정에서 인보이스 20건을 동시에 생성하면 번호 20개가 모두 다르고 1~20에 빈 번호가 없다
  - 마지막 인보이스를 삭제한 뒤 새로 만들면 삭제된 번호가 아니라 다음 번호가 부여된다
  - 이미 존재하는 번호를 수동으로 입력해 저장하면 거부되고 사유가 반환된다
  - KST 기준 연도가 바뀌면 첫 인보이스가 'NNNN=0001' 로 시작한다
  - 수동 번호가 카운터보다 앞서간 상태에서 자동 채번을 하면 카운터를 밀어 최대 3회까지 재시도하고 성공한다
status: pending
verification: [lint, unit, e2e, task_validation]
blocked_by: []
---

# phase-04-task-02 — 인보이스 번호 원자적 채번

## Goal
계정·연도별 카운터 행 하나에 대한 원자적 갱신으로 `YYYY-NNNN` 번호를 채번한다.

## Context
`MAX(number)+1` 은 동시 생성에서 같은 번호를 만든다. 카운터 행 하나의 원자적 갱신으로 몰면 동시성 제어가 DB 행 잠금 하나로 끝난다(`database.md §3.7`).

## PRD 근거
- FR-013: 인보이스를 생성하면 "YYYY-NNNN" 형식의 번호가 자동 부여된다
- FR-013: 같은 계정 안에서 같은 번호를 가진 인보이스가 두 건 존재하지 않는다
- FR-013: 인보이스를 삭제해도 그 번호는 재사용되지 않는다

## TRD 근거
- TD-003 (확정) — DB가 유일성을 지킨다
- TD-013 (확정)
- TD-014 (확정) — 실제 PostgreSQL에 붙는 통합 테스트

## Architecture
- `database.md §3.7`

## Scope
### In Scope
- `invoice_number_counters` 테이블
- 채번 함수와 충돌 재시도
### Out of Scope
- 인보이스 생성 전체 흐름 — phase-04-task-04

## Acceptance Criteria
1. 한 계정에서 인보이스 20건을 동시에 생성하면 번호 20개가 모두 다르고 1~20에 빈 번호가 없다
2. 마지막 인보이스를 삭제한 뒤 새로 만들면 삭제된 번호가 아니라 다음 번호가 부여된다
3. 이미 존재하는 번호를 수동으로 입력해 저장하면 거부되고 사유가 반환된다
4. KST 기준 연도가 바뀌면 첫 인보이스가 `NNNN=0001` 로 시작한다
5. 수동 번호가 카운터보다 앞서간 상태에서 자동 채번을 하면 카운터를 밀어 최대 3회까지 재시도하고 성공한다

## Dependencies
- phase-04-task-01

## Files
- `migrations/0007_invoice_number_counters.sql` — 새로 만든다
- `src/modules/invoices/number.ts` — 새로 만든다
- `src/modules/invoices/number.test.ts` — 새로 만든다

> **파일이 하나가 아닌 이유**: 카운터 테이블과 채번 함수를 떼어 놓으면 동시 생성 검증이 어느 쪽에도 걸리지 않는다.

## 바뀔 수 있는 지점
없음
