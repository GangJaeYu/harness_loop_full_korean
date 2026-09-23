---
id: phase-06-task-05
phase: "06"
title: 계약서 편집 화면
priority: P0
goal: 조항 편집·순서 변경·미저장 이탈 확인·고지 상시 표시를 담은 계약서 화면을 만든다
depends_on: [phase-06-task-04, phase-06-task-06]
files: [src/app/(app)/contracts/[id]/page.tsx, tests/e2e/contract-edit.spec.ts]
architecture: [frontend.md §3.1, frontend.md §3.7, frontend.md §3.12]
acceptance_criteria:
  - 편집 화면 상단에 고지 문구가 항상 표시되고 사용자가 숨기거나 삭제할 수 없다
  - 조항을 수정한 뒤 저장하지 않고 다른 화면으로 이동하려 하면 확인 창이 뜬다
  - 값이 없는 항목의 '[미입력]' 개수가 화면 상단에 표시된다
  - 발송된 계약서를 열면 편집이 막히고 새 버전 생성 안내가 표시된다
  - 폭 375px에서 열면 '데스크톱에서 편집해 주세요' 안내가 표시된다
status: blocked
verification: [lint, unit, e2e, task_validation]
blocked_by: [CF-006, OQ-001, OQ-007]
---

# phase-06-task-05 — 계약서 편집 화면

## Goal
조항 편집·순서 변경·미저장 이탈 확인·고지 상시 표시를 담은 계약서 화면을 만든다.

## Context
이 태스크는 **막혀 있다.** 고지 문구(phase-06-task-06)와 조항 편집(phase-06-task-04)이 모두 막혀 있어 그 위에 세워진다.

**무엇이 정해지면 풀리는가**: OQ-001·OQ-007이 풀리면 함께 풀린다.

## PRD 근거
- FR-007: 저장하지 않고 화면을 벗어나려 하면 저장되지 않은 변경이 있다는 확인 창이 표시된다
- FR-011: 계약서 편집 화면 상단에 고지가 항상 표시된다
- NFR-011: 문서 편집은 데스크톱 전용이어도 된다

## TRD 근거
- TD-002 (확정)
- TD-015 (확정)

## Architecture
- `frontend.md §3.1`
- `frontend.md §3.7`
- `frontend.md §3.12`

## Scope
### In Scope
- 계약서 편집 화면
### Out of Scope
- PDF 버튼 — phase-06-task-07 (차단)
- 공유 링크 버튼 — phase-06-task-09 (차단)

## Acceptance Criteria
1. 편집 화면 상단에 고지 문구가 항상 표시되고 사용자가 숨기거나 삭제할 수 없다
2. 조항을 수정한 뒤 저장하지 않고 다른 화면으로 이동하려 하면 확인 창이 뜬다
3. 값이 없는 항목의 "[미입력]" 개수가 화면 상단에 표시된다
4. 발송된 계약서를 열면 편집이 막히고 새 버전 생성 안내가 표시된다
5. 폭 375px에서 열면 "데스크톱에서 편집해 주세요" 안내가 표시된다

## Dependencies
- phase-06-task-04
- phase-06-task-06

## Files
- `src/app/(app)/contracts/[id]/page.tsx` — 새로 만든다
- `tests/e2e/contract-edit.spec.ts` — 새로 만든다

## 바뀔 수 있는 지점
없음
