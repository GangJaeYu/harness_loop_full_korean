---
id: phase-02-task-02
phase: "02"
title: data 계층의 소유자 조건과 삭제 필터 규약
priority: P0
goal: data 계층의 모든 함수가 첫 인자로 `accountId` 를 받고 질의에 소유자 조건과 삭제 필터를 항상 포함하게 강제한다
depends_on: [phase-02-task-01]
files: [src/lib/data-guard.ts, tests/architecture/owner-condition.test.ts]
architecture: [backend.md §3.2, database.md §3.1, auth.md §3.5]
acceptance_criteria:
  - 'accountId' 를 첫 인자로 받지 않는 data 함수를 추가하면 테스트가 실패한다
  - 예외로 허용되는 이름은 'findByShareToken*' 과 'sweep*' 뿐이고, 각각 'sharing' · 'jobs' 밖에 있으면 테스트가 실패한다
  - 'accountId' 를 비교하는 조건문이 data 계층 밖에 있으면 테스트가 실패한다
  - 다른 계정 id로 조회하면 결과가 0건이고 service가 '없음'을 반환한다
status: pending
verification: [lint, unit, e2e, task_validation]
blocked_by: []
---

# phase-02-task-02 — data 계층의 소유자 조건과 삭제 필터 규약

## Goal
data 계층의 모든 함수가 첫 인자로 `accountId` 를 받고 질의에 소유자 조건과 삭제 필터를 항상 포함하게 강제한다.

## Context
TD-012가 '어느 계층에서 강제하는가'를 아키텍처로 넘겼고, `backend.md §3.2` 가 함수 시그니처를 답으로 골랐다. 도메인 테이블이 늘어나기 전에 이 규약을 먼저 세운다.

## PRD 근거
- NFR-004: 다른 계정의 클라이언트·프로젝트·계약서·인보이스 상세 및 PDF 생성 주소에 접근하면 404가 반환된다
- FR-022: 검색 결과에는 다른 계정의 문서가 포함되지 않는다

## TRD 근거
- TD-012 (확정) — 모든 데이터 접근에 소유자 조건 강제, 위반·부재를 구분하지 않고 404

## Architecture
- `backend.md §3.2`
- `database.md §3.1`
- `auth.md §3.5`

## Scope
### In Scope
- 소유자 조건·삭제 필터를 붙이는 헬퍼
- 규약 위반을 잡는 테스트
### Out of Scope
- route에서 404로 바꾸는 처리 — phase-01-task-03 의 오류 모듈
- 각 도메인의 실제 질의

## Acceptance Criteria
1. `accountId` 를 첫 인자로 받지 않는 data 함수를 추가하면 테스트가 실패한다
2. 예외로 허용되는 이름은 `findByShareToken*` 과 `sweep*` 뿐이고, 각각 `sharing` · `jobs` 밖에 있으면 테스트가 실패한다
3. `accountId` 를 비교하는 조건문이 data 계층 밖에 있으면 테스트가 실패한다
4. 다른 계정 id로 조회하면 결과가 0건이고 service가 '없음'을 반환한다

## Dependencies
- phase-02-task-01

## Files
- `src/lib/data-guard.ts` — 새로 만든다
- `tests/architecture/owner-condition.test.ts` — 새로 만든다

## 바뀔 수 있는 지점
없음
