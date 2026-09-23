---
id: phase-06-task-03
phase: "06"
title: 계약서 템플릿 본문 등록
priority: P0
goal: 디자이너용 계약서 기본 템플릿 1~2종의 조항 본문을 `contract_templates` 에 넣는다
depends_on: [phase-06-task-01]
files: [migrations/0011a_contract_templates_seed.sql, tests/contracts/template-content.test.ts]
architecture: [database.md §3.5]
acceptance_criteria:
  - 활성 템플릿이 1종 이상 조회된다
  - 템플릿 본문에 수정 횟수·저작권 귀속·시안 반려·추가 요청 비용·대금 지급 시기 조항이 모두 들어 있다
  - 템플릿 본문에 채움 변수가 정의된 이름으로만 등장한다(정의되지 않은 변수가 있으면 테스트가 실패한다)
  - 비활성 템플릿은 목록에 나오지 않는다
status: blocked
verification: [lint, unit, e2e, task_validation]
blocked_by: [OQ-007, CF-006]
---

# phase-06-task-03 — 계약서 템플릿 본문 등록

## Goal
디자이너용 계약서 기본 템플릿 1~2종의 조항 본문을 `contract_templates` 에 넣는다.

## Context
이 태스크는 **막혀 있다.** `database.md §3.5` 가 "템플릿 본문 내용은 PRD OQ-007이 막고 있으므로 이 문서는 구조만 고정하고 내용은 비운다"고 명시했다. 본문을 지금 쓰면 법적 검토 결과에 따라 통째로 버린다.

**무엇이 정해지면 풀리는가**: OQ-007에 답이 오면 풀린다 — 공개 표준계약서를 그대로 쓸 수 있는지, 법률 자문이 필요한지. 담당은 사용자 본인이고 PRD가 '템플릿 본문 작성 착수 전'을 시점으로 적었다.

## PRD 근거
- FR-006: 템플릿은 수정 횟수, 저작권 귀속, 시안 반려, 추가 요청 비용, 대금 지급 시기 조항을 포함한다
- OQ-007(PRD 8절): 템플릿의 법적 검토 범위가 정해지기 전에는 템플릿 본문을 확정하지 않는다

## TRD 근거
- TD-003 (확정)

## Architecture
- `database.md §3.5`

## Scope
### In Scope
- 템플릿 행 등록과 본문
### Out of Scope
- 고지 문구 — phase-06-task-06 (차단)

## Acceptance Criteria
1. 활성 템플릿이 1종 이상 조회된다
2. 템플릿 본문에 수정 횟수·저작권 귀속·시안 반려·추가 요청 비용·대금 지급 시기 조항이 모두 들어 있다
3. 템플릿 본문에 채움 변수가 정의된 이름으로만 등장한다(정의되지 않은 변수가 있으면 테스트가 실패한다)
4. 비활성 템플릿은 목록에 나오지 않는다

## Dependencies
- phase-06-task-01

## Files
- `migrations/0011a_contract_templates_seed.sql` — 새로 만든다
- `tests/contracts/template-content.test.ts` — 새로 만든다

> **파일이 하나가 아닌 이유**: 본문 등록과 필수 조항 검사가 함께 있어야 '다섯 조항이 다 있다'가 관찰된다.

## 바뀔 수 있는 지점
OQ-007의 최악 결과는 '템플릿 없이 빈 계약서만 제공'이고, 그러면 이 태스크 자체가 사라진다.
