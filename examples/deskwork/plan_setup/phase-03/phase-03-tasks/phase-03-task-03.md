---
id: phase-03-task-03
phase: "03"
title: 클라이언트 목록·상세 화면
priority: P0
goal: 클라이언트 목록과 상세·편집 화면을 만들고 빈 상태와 인라인 오류를 붙인다
depends_on: [phase-03-task-02, phase-02-task-08]
files: [src/app/(app)/clients/page.tsx, src/app/(app)/clients/[id]/page.tsx, tests/e2e/clients.spec.ts]
architecture: [frontend.md §3.1, frontend.md §3.7, frontend.md §3.8, frontend.md §3.6]
acceptance_criteria:
  - 클라이언트가 0건이면 목록 자리에 빈 상태 문구와 생성 버튼이 표시된다
  - 사업자등록번호를 9자리로 입력해 저장하면 그 입력란 아래에 메시지가 표시된다
  - 저장된 사업자등록번호가 목록·상세에서 '000-00-00000' 형식으로 표시된다
  - 프로젝트가 연결된 클라이언트를 삭제하려 하면 연결된 프로젝트 수가 화면에 표시되고 삭제되지 않는다
  - 초기 표시에 '/api/*' 요청이 0건이다(첫 HTML에 데이터가 들어 있다)
status: pending
verification: [lint, unit, e2e, task_validation]
blocked_by: []
---

# phase-03-task-03 — 클라이언트 목록·상세 화면

## Goal
클라이언트 목록과 상세·편집 화면을 만들고 빈 상태와 인라인 오류를 붙인다.

## Context
서버 쪽 클라이언트 기능이 끝났다. 이 태스크가 화면을 붙여 FR-003을 사용자 눈에 보이게 만든다.

## PRD 근거
- FR-003: 상호를 입력하고 저장하면 클라이언트 목록에 나타난다
- FR-003: 상호가 비어 있으면 저장되지 않고 해당 입력란에 오류가 표시된다

## TRD 근거
- TD-002 (확정) — 서버 렌더
- TD-015 (확정)

## Architecture
- `frontend.md §3.1`
- `frontend.md §3.7`
- `frontend.md §3.8`
- `frontend.md §3.6`

## Scope
### In Scope
- 목록·상세·편집 화면
- 삭제 확인 창
### Out of Scope
- 검색 — phase-05-task-07

## Acceptance Criteria
1. 클라이언트가 0건이면 목록 자리에 빈 상태 문구와 생성 버튼이 표시된다
2. 사업자등록번호를 9자리로 입력해 저장하면 그 입력란 아래에 메시지가 표시된다
3. 저장된 사업자등록번호가 목록·상세에서 `000-00-00000` 형식으로 표시된다
4. 프로젝트가 연결된 클라이언트를 삭제하려 하면 연결된 프로젝트 수가 화면에 표시되고 삭제되지 않는다
5. 초기 표시에 `/api/*` 요청이 0건이다(첫 HTML에 데이터가 들어 있다)

## Dependencies
- phase-03-task-02
- phase-02-task-08

## Files
- `src/app/(app)/clients/page.tsx` — 새로 만든다
- `src/app/(app)/clients/[id]/page.tsx` — 새로 만든다
- `tests/e2e/clients.spec.ts` — 새로 만든다

> **파일이 하나가 아닌 이유**: 목록과 상세가 서로를 오가는 흐름 하나로 검증된다.

## 바뀔 수 있는 지점
없음
