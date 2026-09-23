---
id: phase-03-task-04
phase: "03"
title: projects·payment_terms 테이블과 data 계층
priority: P0
goal: 프로젝트와 회차 테이블을 만들고 만분율 정수 비율과 날짜 순서 제약을 DB에 건다
depends_on: [phase-03-task-01]
files: [migrations/0005_projects_payment_terms.sql, src/modules/projects/data.ts, src/modules/projects/data.test.ts]
architecture: [database.md §3.4, database.md §3.1]
acceptance_criteria:
  - 'end_date' 가 'start_date' 보다 앞선 행을 넣으면 CHECK 제약에서 거부된다
  - 'total_amount' 에 -1을 넣으면 거부된다
  - 'ratio_bp' 와 'amount' 를 둘 다 채운 회차를 넣으면 CHECK 제약에서 거부된다
  - 같은 'project_id' 에 같은 'position' 을 두 번 넣으면 UNIQUE 위반으로 거부된다
  - 회차 0건인 프로젝트를 저장하면 성공한다
  - 프로젝트 삭제 시 회차가 FK CASCADE로 함께 사라진다(물리 파기 시점에만)
status: pending
verification: [lint, unit, e2e, task_validation]
blocked_by: []
---

# phase-03-task-04 — projects·payment_terms 테이블과 data 계층

## Goal
프로젝트와 회차 테이블을 만들고 만분율 정수 비율과 날짜 순서 제약을 DB에 건다.

## Context
클라이언트가 있어야 프로젝트가 매달린다. 회차를 컬럼이 아니라 행으로 둔 것은 인보이스가 '선택한 회차'를 가리켜야 하기 때문이다(`database.md §3.4`).

## PRD 근거
- FR-004: 프로젝트는 ... 총 계약금액, 시작일·종료일, 대금 조건(비율 또는 금액), 상태를 갖는다
- FR-004: 대금 조건을 비워 두어도 프로젝트는 저장된다
- NFR-008: 모든 금액은 원 단위 정수로 저장된다

## TRD 근거
- TD-003 (확정)
- TD-004 (확정) — 금액은 원 단위 정수
- TD-013 (확정)

## Architecture
- `database.md §3.4`
- `database.md §3.1`

## Scope
### In Scope
- `projects` · `payment_terms` 테이블
- 조회·저장 data 함수
### Out of Scope
- 회차 집합 합계 검증 — phase-03-task-05 (DB CHECK로 표현할 수 없다)

## Acceptance Criteria
1. `end_date` 가 `start_date` 보다 앞선 행을 넣으면 CHECK 제약에서 거부된다
2. `total_amount` 에 -1을 넣으면 거부된다
3. `ratio_bp` 와 `amount` 를 둘 다 채운 회차를 넣으면 CHECK 제약에서 거부된다
4. 같은 `project_id` 에 같은 `position` 을 두 번 넣으면 UNIQUE 위반으로 거부된다
5. 회차 0건인 프로젝트를 저장하면 성공한다
6. 프로젝트 삭제 시 회차가 FK CASCADE로 함께 사라진다(물리 파기 시점에만)

## Dependencies
- phase-03-task-01

## Files
- `migrations/0005_projects_payment_terms.sql` — 새로 만든다
- `src/modules/projects/data.ts` — 새로 만든다
- `src/modules/projects/data.test.ts` — 새로 만든다

> **파일이 하나가 아닌 이유**: 테이블 제약과 접근 함수를 떼어 놓으면 제약이 실제로 걸리는지 확인할 수 없다.

## 바뀔 수 있는 지점
없음
