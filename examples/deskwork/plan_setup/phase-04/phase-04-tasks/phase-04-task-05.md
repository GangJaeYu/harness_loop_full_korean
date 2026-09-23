---
id: phase-04-task-05
phase: "04"
title: 인보이스 항목·과세 저장 route
priority: P0
goal: 항목 목록과 과세 방식을 받아 계산 모듈의 결과를 네 금액 컬럼에 저장하는 경로를 만든다
depends_on: [phase-04-task-04, phase-01-task-05]
files: [src/modules/invoices/route.ts, src/modules/invoices/route.test.ts]
architecture: [backend.md §3.3, backend.md §3.7, security.md §3.1]
acceptance_criteria:
  - 항목 3건을 보내면 공급가액 합계가 모든 항목 금액의 합과 일치한다
  - 과세 방식 '부가세 10%'로 저장하면 'tax_amount' 가 절사된 값이고 'billed_amount = supply + tax' 다
  - 과세 방식 '원천징수 3.3%'로 저장하면 'net_amount = supply - tax' 이고 두 값이 응답에 모두 있다
  - 수량 또는 단가에 음수를 보내면 400이 반환되고 저장되지 않는다
  - route 파일에 금액 계산식이 없다(계산은 'src/lib/money.ts' 호출뿐이다)
  - 다른 계정의 인보이스 저장 주소로 요청하면 404다
status: pending
verification: [lint, unit, e2e, task_validation]
blocked_by: []
---

# phase-04-task-05 — 인보이스 항목·과세 저장 route

## Goal
항목 목록과 과세 방식을 받아 계산 모듈의 결과를 네 금액 컬럼에 저장하는 경로를 만든다.

## Context
phase-01-task-05 의 계산 모듈을 저장 경로에 처음으로 연결하는 태스크다.

## PRD 근거
- FR-014: 항목을 추가하면 그 항목의 금액이 (수량 × 단가)로 계산되어 표시된다
- FR-014: 수량 또는 단가에 음수를 입력하면 저장되지 않는다
- NFR-008: 표시·PDF·합계 어디서도 반올림 오차가 발생하지 않는다

## TRD 근거
- TD-004 (확정)
- TD-013 (확정)
- TD-008 (확정)

## Architecture
- `backend.md §3.3`
- `backend.md §3.7`
- `security.md §3.1`

## Scope
### In Scope
- 항목·과세 저장 route
- 계산 모듈 호출과 결과 저장
### Out of Scope
- 항목 0개일 때 발송 금지 — phase-04-task-06
- 화면 — phase-04-task-08

## Acceptance Criteria
1. 항목 3건을 보내면 공급가액 합계가 모든 항목 금액의 합과 일치한다
2. 과세 방식 '부가세 10%'로 저장하면 `tax_amount` 가 절사된 값이고 `billed_amount = supply + tax` 다
3. 과세 방식 '원천징수 3.3%'로 저장하면 `net_amount = supply - tax` 이고 두 값이 응답에 모두 있다
4. 수량 또는 단가에 음수를 보내면 400이 반환되고 저장되지 않는다
5. route 파일에 금액 계산식이 없다(계산은 `src/lib/money.ts` 호출뿐이다)
6. 다른 계정의 인보이스 저장 주소로 요청하면 404다

## Dependencies
- phase-04-task-04
- phase-01-task-05

## Files
- `src/modules/invoices/route.ts` — 새로 만든다
- `src/modules/invoices/route.test.ts` — 새로 만든다

## 바뀔 수 있는 지점
PRD OQ-004(세금 처리 범위) 미해소. '금액만'으로 결정되면 과세 방식 입력과 `tax_amount` 저장이 사라진다.
