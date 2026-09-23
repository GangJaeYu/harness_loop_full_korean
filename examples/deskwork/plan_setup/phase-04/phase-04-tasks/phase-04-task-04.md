---
id: phase-04-task-04
phase: "04"
title: 인보이스 생성 — 값 승계와 회차 중복 확인
priority: P0
goal: 프로젝트 상세에서만 진입하는 인보이스 생성 경로를 만들고 클라이언트 스냅샷과 회차 금액을 승계한다
depends_on: [phase-04-task-02, phase-03-task-06]
files: [src/modules/invoices/service.ts, src/modules/invoices/service.test.ts]
architecture: [backend.md §3.9, backend.md §3.3, database.md §3.4]
acceptance_criteria:
  - 생성하면 클라이언트 상호·담당자·사업자등록번호·주소가 'client_snapshot' 에 채워진다
  - 회차를 고르면 그 회차의 금액이 항목 금액으로 채워진다
  - 이미 인보이스가 발행된 회차를 다시 고르면 409와 '이미 청구된 회차입니다'가 반환되고, 'confirmed: true' 로 다시 보내면 생성된다
  - 대금 조건이 비어 있는 프로젝트에서는 회차 없이 금액을 직접 입력해 생성된다
  - 'POST /api/invoices' (프로젝트를 거치지 않는 경로)는 존재하지 않아 404를 반환한다
  - 채번·인보이스·항목 저장이 한 트랜잭션이며 중간 실패 시 번호도 소비되지 않는다
status: pending
verification: [lint, unit, e2e, task_validation]
blocked_by: []
---

# phase-04-task-04 — 인보이스 생성 — 값 승계와 회차 중복 확인

## Goal
프로젝트 상세에서만 진입하는 인보이스 생성 경로를 만들고 클라이언트 스냅샷과 회차 금액을 승계한다.

## Context
채번(phase-04-task-02)과 프로젝트·회차(phase-03)가 준비됐다. 경로 구조 자체가 '프로젝트를 거치지 않는 진입점 없음'의 증거가 된다(`backend.md §3.3`).

## PRD 근거
- FR-012: 프로젝트 상세에서 '인보이스 만들기'를 누르면 ... 채워진 초안이 생성된다
- FR-012: 이미 인보이스가 발행된 회차를 다시 고르면 "이미 청구된 회차입니다"가 표시되고, 사용자가 확인해야 진행된다
- FR-012: 프로젝트를 거치지 않는 인보이스 생성 진입점이 존재하지 않는다

## TRD 근거
- TD-003 (확정)
- TD-004 (확정)

## Architecture
- `backend.md §3.9`
- `backend.md §3.3`
- `database.md §3.4`

## Scope
### In Scope
- 생성 service와 트랜잭션 묶음
- 회차 중복 검사와 확인 플래그
### Out of Scope
- 항목 편집·과세 — phase-04-task-05
- 상태 전이 — phase-04-task-06

## Acceptance Criteria
1. 생성하면 클라이언트 상호·담당자·사업자등록번호·주소가 `client_snapshot` 에 채워진다
2. 회차를 고르면 그 회차의 금액이 항목 금액으로 채워진다
3. 이미 인보이스가 발행된 회차를 다시 고르면 409와 "이미 청구된 회차입니다"가 반환되고, `confirmed: true` 로 다시 보내면 생성된다
4. 대금 조건이 비어 있는 프로젝트에서는 회차 없이 금액을 직접 입력해 생성된다
5. `POST /api/invoices` (프로젝트를 거치지 않는 경로)는 존재하지 않아 404를 반환한다
6. 채번·인보이스·항목 저장이 한 트랜잭션이며 중간 실패 시 번호도 소비되지 않는다

## Dependencies
- phase-04-task-02
- phase-03-task-06

## Files
- `src/modules/invoices/service.ts` — 새로 만든다
- `src/modules/invoices/service.test.ts` — 새로 만든다

## 바뀔 수 있는 지점
없음
