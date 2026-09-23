---
id: phase-03-task-06
phase: "03"
title: 프로젝트 등록·수정 service·route
priority: P0
goal: 프로젝트 CRUD를 열고 대금 조건 검증을 저장 경로에 연결한다
depends_on: [phase-03-task-05, phase-03-task-02]
files: [src/modules/projects/service.ts, src/modules/projects/route.ts, src/modules/projects/service.test.ts]
architecture: [backend.md §3.3, backend.md §3.4, security.md §3.1]
acceptance_criteria:
  - 프로젝트명·클라이언트·총 계약금액을 보내 저장하면 클라이언트 상세와 프로젝트 목록 양쪽 질의에 나타난다
  - 종료일이 시작일보다 앞서면 400과 해당 입력란 식별자가 반환된다
  - 총 계약금액에 숫자가 아닌 값을 보내면 400이 반환되고 저장되지 않는다
  - 다른 계정의 프로젝트 상세 주소로 요청하면 404이고 본문에 그 데이터가 없다
  - 존재하지 않는 클라이언트 id로 프로젝트를 만들면 거부된다
status: pending
verification: [lint, unit, e2e, task_validation]
blocked_by: []
---

# phase-03-task-06 — 프로젝트 등록·수정 service·route

## Goal
프로젝트 CRUD를 열고 대금 조건 검증을 저장 경로에 연결한다.

## Context
phase-03-task-05 가 회차 검증을 만들었다. 이 태스크가 그것을 저장 경로에 붙인다.

## PRD 근거
- FR-004: 프로젝트명·클라이언트·총 계약금액을 입력해 저장하면 ... 양쪽에 나타난다
- FR-004: 종료일이 시작일보다 앞서면 저장되지 않고 오류가 표시된다

## TRD 근거
- TD-008 (확정)
- TD-012 (확정)

## Architecture
- `backend.md §3.3`
- `backend.md §3.4`
- `security.md §3.1`

## Scope
### In Scope
- 프로젝트 CRUD service·route
### Out of Scope
- 프로젝트 상세의 집계와 문서 목록 — phase-05-task-04
- 삭제 시 인보이스 동반 삭제 — phase-05-task-08

## Acceptance Criteria
1. 프로젝트명·클라이언트·총 계약금액을 보내 저장하면 클라이언트 상세와 프로젝트 목록 양쪽 질의에 나타난다
2. 종료일이 시작일보다 앞서면 400과 해당 입력란 식별자가 반환된다
3. 총 계약금액에 숫자가 아닌 값을 보내면 400이 반환되고 저장되지 않는다
4. 다른 계정의 프로젝트 상세 주소로 요청하면 404이고 본문에 그 데이터가 없다
5. 존재하지 않는 클라이언트 id로 프로젝트를 만들면 거부된다

## Dependencies
- phase-03-task-05
- phase-03-task-02

## Files
- `src/modules/projects/service.ts` — 새로 만든다
- `src/modules/projects/route.ts` — 새로 만든다
- `src/modules/projects/service.test.ts` — 새로 만든다

> **파일이 하나가 아닌 이유**: 도메인 규칙과 그 규칙이 만드는 HTTP 응답이 함께 있어야 수용 기준이 관찰된다.

## 바뀔 수 있는 지점
없음
