---
id: phase-06-task-04
phase: "06"
title: 조항 편집·저장과 발송본 새 버전
priority: P0
goal: 조항 전체 교체와 번호 재부여를 한 트랜잭션에서 하고 발송본은 새 버전으로만 고치게 한다
depends_on: [phase-06-task-02]
files: [src/modules/contracts/clauses.ts, src/modules/contracts/clauses.test.ts]
architecture: [backend.md §3.5, database.md §3.5]
acceptance_criteria:
  - 조항 본문을 수정하고 저장하면 다시 열었을 때 수정된 내용이 표시된다
  - 조항 3건의 순서를 바꿔 저장하면 번호가 1,2,3으로 다시 매겨진다
  - 조항이 하나도 남지 않은 상태로는 저장되지 않고 사유가 반환된다
  - 'status='sent'' 인 계약서의 조항 수정 요청은 거부되고 새 버전 생성 안내가 반환된다
  - 새 버전을 만들면 'root_contract_id' 가 같고 'version' 이 1 증가한 행이 생긴다
status: blocked
verification: [lint, unit, e2e, task_validation]
blocked_by: [CF-006, OQ-001]
---

# phase-06-task-04 — 조항 편집·저장과 발송본 새 버전

## Goal
조항 전체 교체와 번호 재부여를 한 트랜잭션에서 하고 발송본은 새 버전으로만 고치게 한다.

## Context
이 태스크는 **막혀 있다.** CF-006(`P0 뼈대: 예`)이 계약서 개체 설계 전체를 걸고 있고, OQ-001이 뒤집히면 `database.md §3.5` 를 다시 그린다.

**무엇이 정해지면 풀리는가**: OQ-001(전자서명)과 CF-006이 정리되면 풀린다.

## PRD 근거
- FR-007: 조항이 하나도 남지 않은 상태로는 저장되지 않는다
- FR-007: '발송됨' 상태인 계약서는 본문이 편집되지 않고, 편집하려면 새 버전을 만들어야 한다는 안내가 표시된다

## TRD 근거
- TD-003 (확정)
- TD-008 (확정)

## Architecture
- `backend.md §3.5`
- `database.md §3.5`

## Scope
### In Scope
- 조항 저장과 번호 재부여
- 새 버전 생성
### Out of Scope
- 편집 화면 — phase-06-task-05 (차단)

## Acceptance Criteria
1. 조항 본문을 수정하고 저장하면 다시 열었을 때 수정된 내용이 표시된다
2. 조항 3건의 순서를 바꿔 저장하면 번호가 1,2,3으로 다시 매겨진다
3. 조항이 하나도 남지 않은 상태로는 저장되지 않고 사유가 반환된다
4. `status='sent'` 인 계약서의 조항 수정 요청은 거부되고 새 버전 생성 안내가 반환된다
5. 새 버전을 만들면 `root_contract_id` 가 같고 `version` 이 1 증가한 행이 생긴다

## Dependencies
- phase-06-task-02

## Files
- `src/modules/contracts/clauses.ts` — 새로 만든다
- `src/modules/contracts/clauses.test.ts` — 새로 만든다

## 바뀔 수 있는 지점
없음
