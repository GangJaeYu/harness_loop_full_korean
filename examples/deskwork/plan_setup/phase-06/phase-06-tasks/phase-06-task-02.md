---
id: phase-06-task-02
phase: "06"
title: 계약서 생성과 변수 자동 채움
priority: P0
goal: 템플릿 또는 빈 문서로 계약서를 만들고 클라이언트·프로젝트 값을 본문에 채운다
depends_on: [phase-06-task-01]
files: [src/modules/contracts/service.ts, src/modules/contracts/service.test.ts]
architecture: [backend.md §3.3, database.md §3.5]
acceptance_criteria:
  - 템플릿을 고르면 클라이언트 상호·담당자명·사업자등록번호, 프로젝트명, 총 계약금액, 기간, 대금 조건이 채워진 초안이 생성된다
  - 프로젝트에 값이 없는 항목은 본문에 '[미입력]' 으로 남고 그 개수가 응답에 포함된다
  - 템플릿을 고르지 않고 빈 계약서로 시작할 수 있다
  - 다른 계정의 프로젝트에 계약서를 만들려 하면 404가 반환된다
  - 생성 후 프로젝트 금액을 바꿔도 계약서 본문 금액이 그대로다
status: blocked
verification: [lint, unit, e2e, task_validation]
blocked_by: [CF-006, OQ-001, OQ-007]
---

# phase-06-task-02 — 계약서 생성과 변수 자동 채움

## Goal
템플릿 또는 빈 문서로 계약서를 만들고 클라이언트·프로젝트 값을 본문에 채운다.

## Context
이 태스크는 **막혀 있다.** FR-006은 PRD 9절 추적표에서 `정의됨 (차단)` 이고 차단 미결은 OQ-007이다. CF-006도 함께 걸린다.

**무엇이 정해지면 풀리는가**: OQ-007(템플릿의 법적 검토 범위)과 OQ-001에 답이 오면 풀린다.

## PRD 근거
- FR-006: 템플릿을 고르면 ... 채워진 초안이 생성된다
- FR-006: 값이 없는 항목은 본문에 "[미입력]" 표시로 남고, 그 개수가 화면 상단에 안내된다

## TRD 근거
- TD-003 (확정)
- TD-002 (확정)

## Architecture
- `backend.md §3.3`
- `database.md §3.5`

## Scope
### In Scope
- 생성 service와 변수 채움
### Out of Scope
- 템플릿 본문 — phase-06-task-03 (차단)

## Acceptance Criteria
1. 템플릿을 고르면 클라이언트 상호·담당자명·사업자등록번호, 프로젝트명, 총 계약금액, 기간, 대금 조건이 채워진 초안이 생성된다
2. 프로젝트에 값이 없는 항목은 본문에 "[미입력]" 으로 남고 그 개수가 응답에 포함된다
3. 템플릿을 고르지 않고 빈 계약서로 시작할 수 있다
4. 다른 계정의 프로젝트에 계약서를 만들려 하면 404가 반환된다
5. 생성 후 프로젝트 금액을 바꿔도 계약서 본문 금액이 그대로다

## Dependencies
- phase-06-task-01

## Files
- `src/modules/contracts/service.ts` — 새로 만든다
- `src/modules/contracts/service.test.ts` — 새로 만든다

## 바뀔 수 있는 지점
OQ-007이 '템플릿을 직접 작성해야 한다'로 오면 템플릿 목록이 비고 이 태스크는 '빈 계약서 생성'만 남는다 — PRD 핵심 가치 3번이 사라지는 경우다.
