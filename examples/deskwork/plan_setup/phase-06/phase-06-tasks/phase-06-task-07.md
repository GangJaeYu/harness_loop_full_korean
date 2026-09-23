---
id: phase-06-task-07
phase: "06"
title: 계약서 인쇄 템플릿과 PDF 응답
priority: P0
goal: 쪽 번호와 고지 꼬리말이 모든 페이지에 반복되는 계약서 PDF를 만든다
depends_on: [phase-06-task-05, phase-04-task-09, phase-06-task-06]
files: [src/print/contract-template.tsx, src/modules/contracts/pdf-route.ts, tests/e2e/contract-pdf.spec.ts]
architecture: [backend.md §3.10, frontend.md §3.9]
acceptance_criteria:
  - 조항 30개 계약서 PDF의 모든 페이지 하단에 'n / m' 쪽 번호와 고지 문구가 있다
  - PDF에 화면에 표시된 모든 조항 본문·당사자 정보·금액·기간이 같은 문자열로 들어 있다
  - 다른 계정의 계약서 PDF 생성 주소로 접근하면 404가 반환되고 파일이 생성되지 않는다
  - 조항 30개 기준 생성 시간 5회 측정 중앙값이 10초 이내다
  - 템플릿 파일에 금액 계산식이 없다
status: blocked
verification: [lint, unit, e2e, task_validation]
blocked_by: [CF-006, OQ-001, OQ-007]
---

# phase-06-task-07 — 계약서 인쇄 템플릿과 PDF 응답

## Goal
쪽 번호와 고지 꼬리말이 모든 페이지에 반복되는 계약서 PDF를 만든다.

## Context
이 태스크는 **막혀 있다.** PRD 8절 OQ-001의 '차단하는 요구사항'에 FR-008이 들어 있고, 고지 문구(phase-06-task-06)도 막혀 있다.

**무엇이 정해지면 풀리는가**: OQ-001과 OQ-007이 풀리면 함께 풀린다.

## PRD 근거
- FR-008: 본문이 한 쪽을 넘으면 페이지가 나뉘고 각 페이지 하단에 "n / m" 형식의 쪽 번호가 표시된다
- FR-008: 모든 페이지에 FR-011의 고지 문구가 포함된다
- FR-008: 다른 계정의 계약서 PDF 생성 주소로 접근하면 파일이 생성되지 않고 404가 반환된다
- NFR-002: PDF 생성 10초 이내

## TRD 근거
- TD-017 (스파이크 필요, OQ-014)
- TD-006 (확정)

## Architecture
- `backend.md §3.10`
- `frontend.md §3.9`

## Scope
### In Scope
- 계약서 인쇄 템플릿
- PDF 응답 경로
### Out of Scope
- 공유 화면의 PDF 링크 — phase-06-task-10 (차단)

## Acceptance Criteria
1. 조항 30개 계약서 PDF의 모든 페이지 하단에 "n / m" 쪽 번호와 고지 문구가 있다
2. PDF에 화면에 표시된 모든 조항 본문·당사자 정보·금액·기간이 같은 문자열로 들어 있다
3. 다른 계정의 계약서 PDF 생성 주소로 접근하면 404가 반환되고 파일이 생성되지 않는다
4. 조항 30개 기준 생성 시간 5회 측정 중앙값이 10초 이내다
5. 템플릿 파일에 금액 계산식이 없다

## Dependencies
- phase-06-task-05
- phase-04-task-09
- phase-06-task-06

## Files
- `src/print/contract-template.tsx` — 새로 만든다
- `src/modules/contracts/pdf-route.ts` — 새로 만든다
- `tests/e2e/contract-pdf.spec.ts` — 새로 만든다

> **파일이 하나가 아닌 이유**: 템플릿과 응답 경로가 함께 있어야 '모든 페이지에 고지와 쪽 번호'가 관찰된다.

## 바뀔 수 있는 지점
TD-017 스파이크(OQ-014) 결과에 따라 인쇄 CSS 방식 자체가 바뀔 수 있다.
