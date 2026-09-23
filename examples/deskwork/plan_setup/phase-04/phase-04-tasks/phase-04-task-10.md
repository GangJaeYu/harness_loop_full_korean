---
id: phase-04-task-10
phase: "04"
title: 인보이스 인쇄 템플릿과 PDF 응답
priority: P0
goal: 인쇄 CSS로 페이지가 나뉘는 인보이스 템플릿을 만들고 `application/pdf` 로 응답한다
depends_on: [phase-04-task-09, phase-04-task-08]
files: [src/print/invoice-template.tsx, src/modules/invoices/pdf-route.ts, tests/e2e/invoice-pdf.spec.ts]
architecture: [frontend.md §3.9, backend.md §3.10]
acceptance_criteria:
  - 인보이스 상세에서 'PDF 내려받기'를 누르면 PDF 파일이 다운로드된다
  - PDF에 인보이스 번호·발행일·지급 기한·공급자·공급받는자·모든 항목·공급가액·세액·청구 금액·입금 계좌가 화면과 같은 문자열로 들어 있다
  - 항목 25개 인보이스의 합계 영역이 마지막 페이지에만 있다
  - 다른 계정의 인보이스 PDF 생성 주소로 접근하면 404가 반환되고 파일이 생성되지 않는다
  - PDF 버튼을 누르면 버튼이 비활성화되고 3초 후 진행 표시가 나타난다
  - 템플릿 파일에 금액 계산식이 없다(서버가 준 값만 표시한다)
status: pending
verification: [lint, unit, e2e, task_validation]
blocked_by: []
---

# phase-04-task-10 — 인보이스 인쇄 템플릿과 PDF 응답

## Goal
인쇄 CSS로 페이지가 나뉘는 인보이스 템플릿을 만들고 `application/pdf` 로 응답한다.

## Context
어댑터(phase-04-task-09)와 화면(phase-04-task-08)이 준비됐다. 계약서 PDF는 OQ-001에 막혀 phase-06 에 있고, 인보이스 PDF는 차단 미결이 없어 여기서 완성된다.

## PRD 근거
- FR-015: PDF에는 인보이스 번호, 발행일, 지급 기한, ... 입금 계좌가 화면과 동일하게 포함된다
- FR-015: 항목이 20개를 넘으면 페이지가 나뉘고 합계 영역은 마지막 페이지에만 표시된다
- FR-015: 다른 계정의 인보이스 PDF 생성 주소로 접근하면 파일이 생성되지 않고 404가 반환된다
- NFR-002: 3초를 넘으면 진행 표시가 노출된다

## TRD 근거
- TD-017 (스파이크 필요)
- TD-006 (확정) — 파일로 저장하지 않는다

## Architecture
- `frontend.md §3.9`
- `backend.md §3.10`

## Scope
### In Scope
- 인보이스 인쇄 템플릿
- PDF 응답 route
- 로그인 화면의 진행 표시
### Out of Scope
- 계약서 인쇄 템플릿 — phase-06-task-07 (차단)
- 고지 문구 꼬리말 — phase-06-task-06 (차단, FR-015의 수용 기준은 고지를 요구하지 않는다)
- 공유 화면의 PDF 버튼 — phase-06-task-10 (차단)

## Acceptance Criteria
1. 인보이스 상세에서 'PDF 내려받기'를 누르면 PDF 파일이 다운로드된다
2. PDF에 인보이스 번호·발행일·지급 기한·공급자·공급받는자·모든 항목·공급가액·세액·청구 금액·입금 계좌가 화면과 같은 문자열로 들어 있다
3. 항목 25개 인보이스의 합계 영역이 마지막 페이지에만 있다
4. 다른 계정의 인보이스 PDF 생성 주소로 접근하면 404가 반환되고 파일이 생성되지 않는다
5. PDF 버튼을 누르면 버튼이 비활성화되고 3초 후 진행 표시가 나타난다
6. 템플릿 파일에 금액 계산식이 없다(서버가 준 값만 표시한다)

## Dependencies
- phase-04-task-09
- phase-04-task-08

## Files
- `src/print/invoice-template.tsx` — 새로 만든다
- `src/modules/invoices/pdf-route.ts` — 새로 만든다
- `tests/e2e/invoice-pdf.spec.ts` — 새로 만든다

> **파일이 하나가 아닌 이유**: 템플릿과 응답 경로가 함께 있어야 '내려받은 PDF가 화면과 같다'를 관찰할 수 있다.

## 바뀔 수 있는 지점
TD-017 스파이크(OQ-014) 결과에 따라 인쇄 CSS 방식 자체가 바뀔 수 있다(`frontend.md §3.9`). CF-005(무JS 공유 화면의 진행 표시)는 공유 화면 쪽 문제이며 이 태스크의 로그인 화면 진행 표시에는 영향이 없다.
