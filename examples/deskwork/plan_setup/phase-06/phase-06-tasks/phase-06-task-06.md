---
id: phase-06-task-06
phase: "06"
title: 법적 효력 고지 문구 상수와 세 자리 노출
priority: P0
goal: 고지 문구를 상수 한 곳에 두고 편집 화면·인쇄 꼬리말·공유 화면 세 자리가 그것을 참조하게 한다
depends_on: [phase-02-task-08]
files: [src/lib/legal-notice.ts, src/lib/legal-notice.test.ts]
architecture: [frontend.md §3.12, frontend.md §3.9]
acceptance_criteria:
  - 계약서 편집 화면·PDF 모든 페이지·공유 화면 세 곳에서 같은 고지 문자열이 발견된다
  - 사용자가 조항 본문에 고지와 같은 문자열을 넣거나 지워도 꼬리말 고지는 그대로다
  - 고지 문구를 사용자 입력 데이터에서 가져오는 코드 경로가 0건이다
  - 고지 상수를 비우면 세 자리의 테스트가 모두 실패한다
status: blocked
verification: [lint, unit, e2e, task_validation]
blocked_by: [OQ-007, CF-006]
---

# phase-06-task-06 — 법적 효력 고지 문구 상수와 세 자리 노출

## Goal
고지 문구를 상수 한 곳에 두고 편집 화면·인쇄 꼬리말·공유 화면 세 자리가 그것을 참조하게 한다.

## Context
이 태스크는 **막혀 있다.** `frontend.md §3.12` 가 "고지 문구의 최종 문안은 PRD OQ-007 미해소로 확정하지 않는다 — 위치와 불변성만 고정한다"고 적었다. FR-011은 PRD 9절 추적표에서 `정의됨 (차단)` 이다.

**무엇이 정해지면 풀리는가**: OQ-007(템플릿의 법적 검토 범위)에 답이 오면 문안이 정해지고 상수 값만 채우면 된다 — 구조 변경은 없다.

## PRD 근거
- FR-011: "본 템플릿은 참고용이며 법적 효력을 보장하지 않습니다"라는 취지의 고지가 항상 표시된다
- FR-011: 사용자가 이 고지를 숨기거나 삭제할 수 없다
- NFR-014: 화면·PDF·공유 화면 전부에 FR-011의 고지가 존재하며 사용자가 제거할 수 없다

## TRD 근거
- TD-002 (확정)
- TD-017 (스파이크 필요)

## Architecture
- `frontend.md §3.12`
- `frontend.md §3.9`

## Scope
### In Scope
- 고지 상수와 세 자리 참조
- 불변성 검사
### Out of Scope
- 처리방침 문안 — phase-06-task-12 (차단, 다른 미결이다)

## Acceptance Criteria
1. 계약서 편집 화면·PDF 모든 페이지·공유 화면 세 곳에서 같은 고지 문자열이 발견된다
2. 사용자가 조항 본문에 고지와 같은 문자열을 넣거나 지워도 꼬리말 고지는 그대로다
3. 고지 문구를 사용자 입력 데이터에서 가져오는 코드 경로가 0건이다
4. 고지 상수를 비우면 세 자리의 테스트가 모두 실패한다

## Dependencies
- phase-02-task-08

## Files
- `src/lib/legal-notice.ts` — 새로 만든다
- `src/lib/legal-notice.test.ts` — 새로 만든다

## 바뀔 수 있는 지점
OQ-007이 확정되면 문안 값만 채운다(구조 변경 없음).
