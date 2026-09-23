---
id: phase-03-task-02
phase: "03"
title: 클라이언트 등록·수정·삭제 service·route
priority: P0
goal: 클라이언트 CRUD를 열고 연결 프로젝트가 있는 클라이언트의 삭제를 개수와 함께 거부한다
depends_on: [phase-03-task-01, phase-01-task-04]
files: [src/modules/clients/service.ts, src/modules/clients/route.ts, src/modules/clients/service.test.ts]
architecture: [backend.md §3.3, backend.md §3.4, security.md §3.1]
acceptance_criteria:
  - 사업자등록번호를 9자리로 보내면 400과 함께 'fields[0].field == 'bizRegNo'' 가 반환된다
  - '123-45-6789' 를 보내면 '1234567890' 으로 정규화되어 저장된다
  - 프로젝트 2건이 연결된 클라이언트 삭제를 요청하면 삭제되지 않고 응답에 '2' 가 포함된다
  - 다른 계정이 만든 클라이언트의 상세 주소로 접근하면 404가 반환되고 본문에 그 데이터가 없다
  - 상호를 비워 보내면 400과 해당 입력란 식별자가 반환된다
status: pending
verification: [lint, unit, e2e, task_validation]
blocked_by: []
---

# phase-03-task-02 — 클라이언트 등록·수정·삭제 service·route

## Goal
클라이언트 CRUD를 열고 연결 프로젝트가 있는 클라이언트의 삭제를 개수와 함께 거부한다.

## Context
테이블과 data 계층이 준비됐다. 이 태스크가 도메인 규칙(삭제 제한)과 HTTP 경계를 얹는다.

## PRD 근거
- FR-003: 프로젝트가 1건 이상 연결된 클라이언트를 삭제하려 하면 삭제되지 않고 연결된 프로젝트 수가 표시된다
- FR-003: 다른 계정이 만든 클라이언트의 상세 주소로 접근하면 내용이 표시되지 않고 404가 반환된다
- NFR-004: 타인의 데이터는 주소를 알아도 접근할 수 없다

## TRD 근거
- TD-008 (확정)
- TD-012 (확정)
- TD-013 (확정)

## Architecture
- `backend.md §3.3`
- `backend.md §3.4`
- `security.md §3.1`

## Scope
### In Scope
- 클라이언트 CRUD service·route
- 삭제 전 연결 프로젝트 개수 검사
### Out of Scope
- 프로젝트 테이블 — phase-03-task-04 (개수 질의는 그 뒤에 실동작한다)
- 화면 — phase-03-task-03

## Acceptance Criteria
1. 사업자등록번호를 9자리로 보내면 400과 함께 `fields[0].field == "bizRegNo"` 가 반환된다
2. `123-45-6789` 를 보내면 `1234567890` 으로 정규화되어 저장된다
3. 프로젝트 2건이 연결된 클라이언트 삭제를 요청하면 삭제되지 않고 응답에 `2` 가 포함된다
4. 다른 계정이 만든 클라이언트의 상세 주소로 접근하면 404가 반환되고 본문에 그 데이터가 없다
5. 상호를 비워 보내면 400과 해당 입력란 식별자가 반환된다

## Dependencies
- phase-03-task-01
- phase-01-task-04

## Files
- `src/modules/clients/service.ts` — 새로 만든다
- `src/modules/clients/route.ts` — 새로 만든다
- `src/modules/clients/service.test.ts` — 새로 만든다

> **파일이 하나가 아닌 이유**: 도메인 규칙과 그 규칙이 만드는 HTTP 응답(개수를 담은 409/400)이 한 태스크 안에 있어야 수용 기준이 관찰된다.

## 바뀔 수 있는 지점
없음
