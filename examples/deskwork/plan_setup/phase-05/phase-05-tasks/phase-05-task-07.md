---
id: phase-05-task-07
phase: "05"
title: 문서 검색
priority: P1
goal: 클라이언트명·프로젝트명 부분 일치로 프로젝트·계약서·인보이스를 종류별로 묶어 돌려주는 검색을 만든다
depends_on: [phase-05-task-05]
files: [src/modules/search/service.ts, src/app/(app)/search/page.tsx, tests/e2e/search.spec.ts]
architecture: [backend.md §3.14, database.md §3.14, frontend.md §3.6]
acceptance_criteria:
  - 대문자로 검색해도 소문자 프로젝트명이 결과에 나온다
  - 이름 중간 두 글자로 검색해도 결과에 나온다
  - 다른 계정의 같은 이름 프로젝트는 결과에 없다
  - 빈 문자열이나 공백만으로 요청하면 400이고 질의가 실행되지 않는다
  - 결과가 없으면 '검색 결과가 없습니다'와 입력한 검색어가 함께 표시된다
  - 종류별 상한 50건을 넘으면 '더 좁혀 검색하세요'가 함께 반환된다
  - 삭제된 문서가 결과에 나오지 않는다
status: pending
verification: [lint, unit, e2e, task_validation]
blocked_by: []
---

# phase-05-task-07 — 문서 검색

## Goal
클라이언트명·프로젝트명 부분 일치로 프로젝트·계약서·인보이스를 종류별로 묶어 돌려주는 검색을 만든다.

## Context
계약서는 phase-06 이 차단된 동안 결과가 항상 빈 묶음이다. 세 묶음 구조는 지금 만들어 두고 계약서가 생기면 그대로 채워진다.

## PRD 근거
- FR-022: 검색어를 입력하면 ... 종류별로 묶여 표시된다
- FR-022: 검색은 대소문자를 구분하지 않고 부분 일치를 지원한다
- FR-022: 검색 결과에는 다른 계정의 문서가 포함되지 않는다
- FR-022: 검색어가 비어 있으면 검색이 실행되지 않는다

## TRD 근거
- TD-003 (확정)
- TD-012 (확정)
- TRD 1.2절 — 검색 엔진을 넣지 않는다

## Architecture
- `backend.md §3.14`
- `database.md §3.14`
- `frontend.md §3.6`

## Scope
### In Scope
- 검색 service·route
- 검색 결과 화면
### Out of Scope
- 문서 본문 검색(요구사항 신설이 된다)

## Acceptance Criteria
1. 대문자로 검색해도 소문자 프로젝트명이 결과에 나온다
2. 이름 중간 두 글자로 검색해도 결과에 나온다
3. 다른 계정의 같은 이름 프로젝트는 결과에 없다
4. 빈 문자열이나 공백만으로 요청하면 400이고 질의가 실행되지 않는다
5. 결과가 없으면 "검색 결과가 없습니다"와 입력한 검색어가 함께 표시된다
6. 종류별 상한 50건을 넘으면 "더 좁혀 검색하세요"가 함께 반환된다
7. 삭제된 문서가 결과에 나오지 않는다

## Dependencies
- phase-05-task-05

## Files
- `src/modules/search/service.ts` — 새로 만든다
- `src/app/(app)/search/page.tsx` — 새로 만든다
- `tests/e2e/search.spec.ts` — 새로 만든다

> **파일이 하나가 아닌 이유**: 질의와 결과 화면을 떼면 '결과 없음 문구와 검색어'가 어느 쪽에서도 관찰되지 않는다.

## 바뀔 수 있는 지점
없음
