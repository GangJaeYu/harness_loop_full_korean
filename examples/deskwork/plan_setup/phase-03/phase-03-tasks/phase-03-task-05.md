---
id: phase-03-task-05
phase: "03"
title: 대금 조건 합계 검증
priority: P0
goal: 회차 집합의 비율 합 10000 또는 금액 합 = 총 계약금액을 저장 직전에 검사하고 현재 합계·차액을 응답에 담는다
depends_on: [phase-03-task-04, phase-01-task-05]
files: [src/modules/projects/payment-terms.ts, src/modules/projects/payment-terms.test.ts]
architecture: [backend.md §3.6, database.md §3.4]
acceptance_criteria:
  - 비율 회차 3건을 5000/3000/1000으로 저장하면 거부되고 응답 메시지에 현재 합계 '9000'(=90%)이 포함된다
  - 금액 회차 합이 총 계약금액보다 10,000원 적으면 거부되고 차액 '10000' 이 응답에 포함된다
  - 비율 회차와 금액 회차를 섞어 보내면 거부된다
  - 회차 0건은 통과한다
  - 검사는 저장과 같은 트랜잭션 안에서 한 번만 수행된다
status: pending
verification: [lint, unit, e2e, task_validation]
blocked_by: []
---

# phase-03-task-05 — 대금 조건 합계 검증

## Goal
회차 집합의 비율 합 10000 또는 금액 합 = 총 계약금액을 저장 직전에 검사하고 현재 합계·차액을 응답에 담는다.

## Context
개별 회차 제약은 DB가 잡지만 집합 합계는 잡을 수 없고, 무엇보다 '현재 합계를 응답에 담는다'를 DB 제약이 만족시킬 수 없다(`backend.md §3.6`).

## PRD 근거
- FR-004: 대금 조건을 비율로 입력할 때 합이 100%가 아니면 저장되지 않고 현재 합계가 표시된다
- FR-004: 대금 조건을 금액으로 입력할 때 합이 총 계약금액과 다르면 저장되지 않고 차액이 표시된다

## TRD 근거
- TD-013 (확정)
- TD-004 (확정)

## Architecture
- `backend.md §3.6`
- `database.md §3.4`

## Scope
### In Scope
- 회차 집합 검증 함수와 오류 메시지의 숫자
### Out of Scope
- 회차 승계 — phase-04-task-04

## Acceptance Criteria
1. 비율 회차 3건을 5000/3000/1000으로 저장하면 거부되고 응답 메시지에 현재 합계 `9000`(=90%)이 포함된다
2. 금액 회차 합이 총 계약금액보다 10,000원 적으면 거부되고 차액 `10000` 이 응답에 포함된다
3. 비율 회차와 금액 회차를 섞어 보내면 거부된다
4. 회차 0건은 통과한다
5. 검사는 저장과 같은 트랜잭션 안에서 한 번만 수행된다

## Dependencies
- phase-03-task-04
- phase-01-task-05

## Files
- `src/modules/projects/payment-terms.ts` — 새로 만든다
- `src/modules/projects/payment-terms.test.ts` — 새로 만든다

## 바뀔 수 있는 지점
없음
