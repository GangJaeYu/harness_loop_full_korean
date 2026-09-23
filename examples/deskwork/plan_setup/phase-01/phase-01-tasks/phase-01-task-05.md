---
id: phase-01-task-05
phase: "01"
title: 금액·세액 계산 모듈
priority: P0
goal: 부가세·원천징수 계산과 원 단위 절사를 순수 정수 연산 함수 네 개로 서버 한 지점에 고정한다
depends_on: [phase-01-task-01]
files: [src/lib/money.ts, src/lib/money.test.ts]
architecture: [backend.md §3.7]
acceptance_criteria:
  - 공급가액 1,000,003원에 원천징수를 적용하면 '{tax: 33000, billed: 1000003, net: 967003}' 이 반환된다
  - 부가세 모드에서 공급가액 1,000,005원이면 부가세 100,000원(절사)·청구 1,100,005원이 반환된다
  - 과세 방식 '없음'이면 'tax=0' 이고 'billed' 와 'net' 이 공급가액과 같다
  - 항목 금액은 수량 × 단가로 계산되고 공급가액 합계가 모든 항목 금액의 합과 일치한다
  - 수량 또는 단가가 음수인 입력을 넣으면 함수가 예외를 던지고 값을 반환하지 않는다
  - 모듈 어디에도 부동소수 리터럴('0.033', '0.1')이 없다
status: pending
verification: [lint, unit, e2e, task_validation]
blocked_by: []
---

# phase-01-task-05 — 금액·세액 계산 모듈

## Goal
부가세·원천징수 계산과 원 단위 절사를 순수 정수 연산 함수 네 개로 서버 한 지점에 고정한다.

## Context
인보이스 금액이 화면·PDF·집계 세 곳에서 갈리지 않게 하는 유일한 지점이다. 인보이스 태스크보다 먼저 만든다.

## PRD 근거
- FR-014: 부가세 = 공급가액 × 0.1(원 단위 절사), 원천징수액 = 공급가액 × 0.033(원 단위 절사)
- NFR-008: 모든 금액은 원 단위 정수로 저장되며 표시·PDF·합계 어디서도 반올림 오차가 발생하지 않는다
- NFR-016: 통화는 원(KRW) 단일

## TRD 근거
- TD-004 (확정) — 금액은 원 단위 정수, 계산·절사는 서버 한 지점

## Architecture
- `backend.md §3.7`

## Scope
### In Scope
- `lineAmount` · `supplyTotal` · `taxOf` · `settle` 네 함수
- 정수 연산과 `Math.trunc` 절사
### Out of Scope
- 금액을 컬럼에 저장하는 것 — phase-04-task-01
- 화면 표시 서식 — phase-01-task-06

## Acceptance Criteria
1. 공급가액 1,000,003원에 원천징수를 적용하면 `{tax: 33000, billed: 1000003, net: 967003}` 이 반환된다
2. 부가세 모드에서 공급가액 1,000,005원이면 부가세 100,000원(절사)·청구 1,100,005원이 반환된다
3. 과세 방식 '없음'이면 `tax=0` 이고 `billed` 와 `net` 이 공급가액과 같다
4. 항목 금액은 수량 × 단가로 계산되고 공급가액 합계가 모든 항목 금액의 합과 일치한다
5. 수량 또는 단가가 음수인 입력을 넣으면 함수가 예외를 던지고 값을 반환하지 않는다
6. 모듈 어디에도 부동소수 리터럴(`0.033`, `0.1`)이 없다

## Dependencies
- phase-01-task-01

## Files
- `src/lib/money.ts` — 새로 만든다
- `src/lib/money.test.ts` — 새로 만든다

## 바뀔 수 있는 지점
PRD OQ-004(세금 처리 범위)가 '금액만'으로 결정되면 `taxOf`·`settle` 이 사라지고 이 태스크의 절반이 폐기된다(`backend.md §3.7` 의 '바뀔 수 있는 지점'). 되돌리기 비용은 이 파일 하나와 `database.md §3.6` 의 두 컬럼이다.
