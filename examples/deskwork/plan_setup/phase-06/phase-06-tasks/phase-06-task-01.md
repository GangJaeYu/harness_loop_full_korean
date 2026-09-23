---
id: phase-06-task-01
phase: "06"
title: contracts·contract_clauses·contract_templates 테이블
priority: P0
goal: 계약서·조항·템플릿 테이블을 만들고 `party_snapshot` 과 버전 구조를 세운다
depends_on: [phase-03-task-04]
files: [migrations/0011_contracts.sql, src/modules/contracts/data.ts, src/modules/contracts/data.test.ts]
architecture: [database.md §3.5, database.md §3.1]
acceptance_criteria:
  - 템플릿으로 만든 계약서의 'party_snapshot' 이 생성 시점 값을 담고, 프로젝트 금액을 바꿔도 그대로다
  - 조항 3건의 순서를 바꿔 저장하면 'position' 이 1,2,3으로 다시 매겨진다
  - 같은 'contract_id' 에 같은 'position' 을 두 번 넣으면 UNIQUE 위반으로 거부된다
  - 'status' 에 'draft'·'sent' 외의 값을 넣으면 CHECK 제약에서 거부된다
  - 다른 계정 id로 조회하면 결과가 0건이다
status: blocked
verification: [lint, unit, e2e, task_validation]
blocked_by: [CF-006, OQ-001, OQ-007]
---

# phase-06-task-01 — contracts·contract_clauses·contract_templates 테이블

## Goal
계약서·조항·템플릿 테이블을 만들고 `party_snapshot` 과 버전 구조를 세운다.

## Context
이 태스크는 **막혀 있다.** `overview.md §7` 의 CF-006(`P0 뼈대: 예`, 미해소)이 계약서 개체와 공유 경로를 걸고 있고, PRD OQ-001(전자서명)이 뒤집히면 서명 개체가 추가되어 `database.md §3.5` 전체를 다시 그린다. OQ-007은 템플릿 본문의 확정을 막고 있다.

**무엇이 정해지면 풀리는가**: PRD OQ-001(전자서명을 이번 버전에서 빼도 되는가)과 OQ-007(템플릿의 법적 검토 범위)에 사용자가 답하고, CF-006이 '기본값 채택으로 닫힘'으로 정리되면 풀린다.

## PRD 근거
- FR-006: 초안 생성 후 프로젝트의 금액을 바꿔도 이미 만든 계약서 본문은 자동으로 바뀌지 않는다
- FR-007: 조항을 추가·삭제·순서 변경할 수 있고, 조항 번호는 저장 시 순서대로 다시 매겨진다

## TRD 근거
- TD-003 (확정)
- TD-002 (확정)

## Architecture
- `database.md §3.5`
- `database.md §3.1`

## Scope
### In Scope
- 세 테이블과 data 함수
### Out of Scope
- 템플릿 본문 내용 — phase-06-task-03 (차단)
- 생성 흐름 — phase-06-task-02 (차단)

## Acceptance Criteria
1. 템플릿으로 만든 계약서의 `party_snapshot` 이 생성 시점 값을 담고, 프로젝트 금액을 바꿔도 그대로다
2. 조항 3건의 순서를 바꿔 저장하면 `position` 이 1,2,3으로 다시 매겨진다
3. 같은 `contract_id` 에 같은 `position` 을 두 번 넣으면 UNIQUE 위반으로 거부된다
4. `status` 에 `draft`·`sent` 외의 값을 넣으면 CHECK 제약에서 거부된다
5. 다른 계정 id로 조회하면 결과가 0건이다

## Dependencies
- phase-03-task-04

## Files
- `migrations/0011_contracts.sql` — 새로 만든다
- `src/modules/contracts/data.ts` — 새로 만든다
- `src/modules/contracts/data.test.ts` — 새로 만든다

> **파일이 하나가 아닌 이유**: 테이블과 접근 함수를 떼어 놓으면 스냅샷 불변성을 검증할 수 없다.

## 바뀔 수 있는 지점
OQ-001이 '전자서명 필수'로 뒤집히면 이 절 전체를 다시 그린다. OQ-007이 '공개 표준계약서를 쓸 수 없다'로 오면 `contract_templates` 행이 비고 `template_code` 가 항상 NULL이 된다.
