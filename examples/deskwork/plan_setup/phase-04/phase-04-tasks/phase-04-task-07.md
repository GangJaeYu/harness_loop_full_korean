---
id: phase-04-task-07
phase: "04"
title: 연체 파생 조건과 초과 일수
priority: P0
goal: `status='sent' AND due_date < KST 오늘` 을 조회 시점 파생 조건 한 곳에 고정하고 초과 일수를 함께 낸다
depends_on: [phase-04-task-06]
files: [src/modules/invoices/overdue.ts, src/modules/invoices/overdue.test.ts]
architecture: [database.md §3.12, database.md §3.14]
acceptance_criteria:
  - 기한이 어제인 발송 인보이스가 연체 질의 결과에 나오고 초과 일수 1이 함께 나온다
  - 그 인보이스를 입금 완료로 바꾸면 연체 질의 결과에서 사라진다
  - 'due_date' 가 NULL인 발송 인보이스는 연체 질의 결과에 나오지 않는다
  - 연체를 저장하는 컬럼이나 배치 갱신 코드가 존재하지 않는다
  - KST 자정 직전·직후의 경계 시각에 대해 판정이 KST 날짜 기준으로 일관된다
status: pending
verification: [lint, unit, e2e, task_validation]
blocked_by: []
---

# phase-04-task-07 — 연체 파생 조건과 초과 일수

## Goal
`status='sent' AND due_date < KST 오늘` 을 조회 시점 파생 조건 한 곳에 고정하고 초과 일수를 함께 낸다.

## Context
연체를 저장 상태로 두면 배치가 안 돈 날 화면이 틀린 값을 보여 준다. 파생으로 두면 FR-019의 네 수용 기준이 조건식 하나로 판정된다(`database.md §3.12`).

## PRD 근거
- FR-019: 발송 상태이고 지급 기한이 오늘보다 이전인 인보이스는 목록과 대시보드에서 연체로 표시된다
- FR-019: 연체 인보이스에는 기한 초과 일수가 함께 표시된다
- FR-019: 지급 기한이 비어 있는 인보이스는 연체로 판정되지 않는다

## TRD 근거
- TD-003 (확정) — UTC 저장·KST 판정
- TD-014 (확정)

## Architecture
- `database.md §3.12`
- `database.md §3.14`

## Scope
### In Scope
- 연체 조건식과 초과 일수 계산
- 연체 목록 질의
### Out of Scope
- 연체 알림 생성 — phase-05-task-06·phase-05-task-09
- 대시보드 표시 — phase-05-task-05

## Acceptance Criteria
1. 기한이 어제인 발송 인보이스가 연체 질의 결과에 나오고 초과 일수 1이 함께 나온다
2. 그 인보이스를 입금 완료로 바꾸면 연체 질의 결과에서 사라진다
3. `due_date` 가 NULL인 발송 인보이스는 연체 질의 결과에 나오지 않는다
4. 연체를 저장하는 컬럼이나 배치 갱신 코드가 존재하지 않는다
5. KST 자정 직전·직후의 경계 시각에 대해 판정이 KST 날짜 기준으로 일관된다

## Dependencies
- phase-04-task-06

## Files
- `src/modules/invoices/overdue.ts` — 새로 만든다
- `src/modules/invoices/overdue.test.ts` — 새로 만든다

## 바뀔 수 있는 지점
PRD OQ-024(지급 기한 기본값)가 미해소다. 기본값을 두는 쪽으로 결정되면 생성 시 `due_date` 를 채우게 되고 연체 판정 대상이 늘어난다 — 이 조건식 자체는 바뀌지 않는다.
