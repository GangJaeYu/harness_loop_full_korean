---
id: phase-05-task-05
phase: "05"
title: 미수금 대시보드
priority: P0
goal: 로그인 직후 첫 화면에서 미수금 합계·연체 목록·진행 중 프로젝트를 질의 3개로 보여 준다
depends_on: [phase-05-task-04, phase-04-task-07]
files: [src/app/(app)/page.tsx, tests/e2e/dashboard.spec.ts]
architecture: [backend.md §3.8, frontend.md §3.6, database.md §3.10]
acceptance_criteria:
  - 로그인하면 대시보드가 첫 화면으로 표시되고 미수금 합계가 숫자로 표시된다
  - 연체 인보이스 목록이 기한 초과 일수 내림차순으로 표시되고 각 줄에 클라이언트명·프로젝트명·인보이스 번호·금액·초과 일수가 있다
  - 목록의 한 줄을 누르면 그 인보이스가 속한 프로젝트 상세로 이동한다
  - 진행 중 프로젝트 목록의 각 줄에 총 계약금액과 그 프로젝트의 미수금이 함께 표시된다
  - 데이터가 하나도 없는 신규 계정에서는 0원과 '클라이언트 등록부터 시작하세요'가 표시된다
  - 이 화면 1회 렌더에 실행된 질의가 3개이고 응답 P95가 1.5초 이내다
status: pending
verification: [lint, unit, e2e, task_validation]
blocked_by: []
---

# phase-05-task-05 — 미수금 대시보드

## Goal
로그인 직후 첫 화면에서 미수금 합계·연체 목록·진행 중 프로젝트를 질의 3개로 보여 준다.

## Context
집계(phase-05-task-02)와 연체 조건(phase-04-task-07)이 준비됐다. 목록 렌더 중 행마다 질의가 붙는 것이 NFR-001을 깨는 가장 흔한 방식이라 질의 수를 수용 기준에 넣었다.

## PRD 근거
- FR-020: 로그인하면 대시보드가 첫 화면으로 표시된다
- FR-020: 연체 인보이스 목록이 기한 초과 일수 내림차순으로 표시된다
- FR-020: 데이터가 하나도 없는 신규 계정에서는 0원과 안내가 표시된다
- NFR-001: 대시보드의 응답 P95 1.5초 이내

## TRD 근거
- TD-002 (확정)
- TD-003 (확정)

## Architecture
- `backend.md §3.8`
- `frontend.md §3.6`
- `database.md §3.10`

## Scope
### In Scope
- 대시보드 화면과 질의 3개
- 빈 상태
### Out of Scope
- 알림 배지 — phase-05-task-06
- 검색 — phase-05-task-08

## Acceptance Criteria
1. 로그인하면 대시보드가 첫 화면으로 표시되고 미수금 합계가 숫자로 표시된다
2. 연체 인보이스 목록이 기한 초과 일수 내림차순으로 표시되고 각 줄에 클라이언트명·프로젝트명·인보이스 번호·금액·초과 일수가 있다
3. 목록의 한 줄을 누르면 그 인보이스가 속한 프로젝트 상세로 이동한다
4. 진행 중 프로젝트 목록의 각 줄에 총 계약금액과 그 프로젝트의 미수금이 함께 표시된다
5. 데이터가 하나도 없는 신규 계정에서는 0원과 "클라이언트 등록부터 시작하세요"가 표시된다
6. 이 화면 1회 렌더에 실행된 질의가 3개이고 응답 P95가 1.5초 이내다

## Dependencies
- phase-05-task-04
- phase-04-task-07

## Files
- `src/app/(app)/page.tsx` — 새로 만든다
- `tests/e2e/dashboard.spec.ts` — 새로 만든다

## 바뀔 수 있는 지점
**CF-002 미해소** — 미수금이 실수령액 기준이다. 청구액 기준으로 바뀌면 phase-05-task-02 의 컬럼만 바뀌고 이 화면은 그대로다.
