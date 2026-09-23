---
id: phase-04-task-08
phase: "04"
title: 인보이스 편집·상세 화면
priority: P0
goal: 항목 입력·과세 선택·상태 변경·연체 배지를 담은 인보이스 화면을 만든다
depends_on: [phase-04-task-07, phase-02-task-08, phase-01-task-06]
files: [src/app/(app)/invoices/[id]/page.tsx, src/components/invoice-items-editor.tsx, tests/e2e/invoice-edit.spec.ts]
architecture: [frontend.md §3.1, frontend.md §3.4, frontend.md §3.8, frontend.md §3.11]
acceptance_criteria:
  - 항목 수량을 바꾸면 화면 합계가 즉시 바뀌고, 저장 후 다시 열면 서버가 계산한 값과 일치한다
  - 기한이 3일 지난 발송 인보이스에 '연체 3일' 배지가 표시되고, 입금 완료로 바꾸면 배지가 사라진다
  - 항목을 수정한 뒤 저장하지 않고 이동하려 하면 확인 창이 뜬다
  - 폭 375px에서 인보이스 상세를 열고 입금 완료로 표시하는 동작이 성공하며 가로 스크롤바가 없다
  - 폭 375px에서 항목 편집 화면을 열면 '데스크톱에서 편집해 주세요' 안내가 표시된다
  - 전역 상태 관리 라이브러리 의존성이 프로젝트에 존재하지 않는다
status: pending
verification: [lint, unit, e2e, task_validation]
blocked_by: []
---

# phase-04-task-08 — 인보이스 편집·상세 화면

## Goal
항목 입력·과세 선택·상태 변경·연체 배지를 담은 인보이스 화면을 만든다.

## Context
서버 쪽 인보이스 기능이 전부 끝난 뒤다. 화면은 표시만 하고 저장 값은 서버 계산 결과를 쓴다(`frontend.md §3.4`).

## PRD 근거
- FR-012~FR-018 (인보이스 편집·상세 화면이 만족시키는 범위)
- NFR-011: 폭 375px에서 인보이스 목록 확인·입금 완료 표시가 가로 스크롤 없이 동작한다. 문서 편집은 데스크톱 전용이어도 된다
- NFR-008: 화면 합계가 서버 계산 결과와 일치한다

## TRD 근거
- TD-002 (확정)
- TD-015 (확정)

## Architecture
- `frontend.md §3.1`
- `frontend.md §3.4`
- `frontend.md §3.8`
- `frontend.md §3.11`

## Scope
### In Scope
- 인보이스 상세·편집 화면
- 항목 편집기
- 상태 변경 버튼
- 연체 배지
### Out of Scope
- PDF 버튼 — phase-04-task-10
- 공유 링크 버튼 — phase-06-task-09 (차단)
- 메일 보내기 — phase-04-task-11

## Acceptance Criteria
1. 항목 수량을 바꾸면 화면 합계가 즉시 바뀌고, 저장 후 다시 열면 서버가 계산한 값과 일치한다
2. 기한이 3일 지난 발송 인보이스에 "연체 3일" 배지가 표시되고, 입금 완료로 바꾸면 배지가 사라진다
3. 항목을 수정한 뒤 저장하지 않고 이동하려 하면 확인 창이 뜬다
4. 폭 375px에서 인보이스 상세를 열고 입금 완료로 표시하는 동작이 성공하며 가로 스크롤바가 없다
5. 폭 375px에서 항목 편집 화면을 열면 "데스크톱에서 편집해 주세요" 안내가 표시된다
6. 전역 상태 관리 라이브러리 의존성이 프로젝트에 존재하지 않는다

## Dependencies
- phase-04-task-07
- phase-02-task-08
- phase-01-task-06

## Files
- `src/app/(app)/invoices/[id]/page.tsx` — 새로 만든다
- `src/components/invoice-items-editor.tsx` — 새로 만든다
- `tests/e2e/invoice-edit.spec.ts` — 새로 만든다

> **파일이 하나가 아닌 이유**: 항목 편집기는 이 화면 안에서만 쓰이며, 떼어 놓으면 '합계가 즉시 바뀐다'를 혼자 검증할 수 없다.

## 바뀔 수 있는 지점
없음
