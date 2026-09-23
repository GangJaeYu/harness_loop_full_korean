---
id: phase-03-task-07
phase: "03"
title: 프로젝트 목록·등록 화면
priority: P0
goal: 프로젝트 목록과 등록·편집 화면을 만들고 대금 조건 입력의 합계 오류를 숫자와 함께 보여 준다
depends_on: [phase-03-task-06, phase-03-task-03]
files: [src/app/(app)/projects/page.tsx, src/app/(app)/projects/new/page.tsx, tests/e2e/projects.spec.ts]
architecture: [frontend.md §3.1, frontend.md §3.7, frontend.md §3.8]
acceptance_criteria:
  - 대금 조건 비율 합이 90%면 합계 숫자가 포함된 메시지가 해당 입력란에 표시된다
  - 종료일을 시작일보다 앞선 날짜로 입력하면 오류가 표시되고 저장되지 않는다
  - 프로젝트가 0건이면 목록 자리에 빈 상태 문구와 생성 버튼이 표시된다
  - 금액이 목록에서 천 단위 구분과 함께 '원' 으로 표시된다
  - 초기 표시에 '/api/*' 요청이 0건이다
status: pending
verification: [lint, unit, e2e, task_validation]
blocked_by: []
---

# phase-03-task-07 — 프로젝트 목록·등록 화면

## Goal
프로젝트 목록과 등록·편집 화면을 만들고 대금 조건 입력의 합계 오류를 숫자와 함께 보여 준다.

## Context
클라이언트 화면이 폼 오류 규약을 이미 세웠다. 이 태스크는 그 규약을 대금 조건이라는 더 복잡한 폼에 적용한다.

## PRD 근거
- FR-004: 대금 조건을 비율로 입력할 때 합이 100%가 아니면 저장되지 않고 현재 합계가 표시된다
- FR-002 아님 — 이 태스크는 FR-004 전용

## TRD 근거
- TD-002 (확정)
- TD-015 (확정)

## Architecture
- `frontend.md §3.1`
- `frontend.md §3.7`
- `frontend.md §3.8`

## Scope
### In Scope
- 프로젝트 목록·등록·편집 화면
- 회차 입력 UI
### Out of Scope
- 프로젝트 상세 — phase-05-task-04 (집계가 필요해 뒤로 뺐다)

## Acceptance Criteria
1. 대금 조건 비율 합이 90%면 합계 숫자가 포함된 메시지가 해당 입력란에 표시된다
2. 종료일을 시작일보다 앞선 날짜로 입력하면 오류가 표시되고 저장되지 않는다
3. 프로젝트가 0건이면 목록 자리에 빈 상태 문구와 생성 버튼이 표시된다
4. 금액이 목록에서 천 단위 구분과 함께 `원` 으로 표시된다
5. 초기 표시에 `/api/*` 요청이 0건이다

## Dependencies
- phase-03-task-06
- phase-03-task-03

## Files
- `src/app/(app)/projects/page.tsx` — 새로 만든다
- `src/app/(app)/projects/new/page.tsx` — 새로 만든다
- `tests/e2e/projects.spec.ts` — 새로 만든다

> **파일이 하나가 아닌 이유**: 목록과 등록 폼이 한 흐름으로 검증된다.

## 바뀔 수 있는 지점
없음
