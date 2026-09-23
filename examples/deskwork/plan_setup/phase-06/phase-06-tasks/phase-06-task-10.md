---
id: phase-06-task-10
phase: "06"
title: 공유 열람 화면 — JS 없이 보이는 서버 렌더
priority: P0
goal: `/s/:token` 을 서버 렌더 전용으로 만들어 JS 없이도 본문과 고지가 보이게 한다
depends_on: [phase-06-task-09, phase-06-task-06, phase-02-task-06]
files: [src/app/s/[token]/page.tsx, src/app/s/[token]/pdf/route.ts, tests/e2e/share-view.spec.ts]
architecture: [frontend.md §3.10, auth.md §3.7, backend.md §3.11]
acceptance_criteria:
  - JS를 끈 브라우저에서 공유 링크를 열면 계약서 본문과 고지 문구가 표시된다
  - 화면 HTML에 소유자의 다른 프로젝트·클라이언트·인보이스 식별자나 링크가 없다
  - 로그인하지 않은 새 브라우저 세션에서 열어도 200이 반환된다
  - 폐기된 링크와 존재하지 않는 링크가 같은 화면을 보여 준다
  - 폭 375px에서 가로 스크롤 없이 본문을 읽을 수 있다
  - 공유 화면의 PDF 버튼이 일반 링크이며 눌렀을 때 PDF가 내려받아진다
status: blocked
verification: [lint, unit, e2e, task_validation]
blocked_by: [CF-006, OQ-009]
---

# phase-06-task-10 — 공유 열람 화면 — JS 없이 보이는 서버 렌더

## Goal
`/s/:token` 을 서버 렌더 전용으로 만들어 JS 없이도 본문과 고지가 보이게 한다.

## Context
이 태스크는 **막혀 있다.** 발급 서비스(phase-06-task-09)와 고지(phase-06-task-06)가 모두 막혀 있다. NFR-012(P0)를 만족시키는 유일한 화면이 여기라서, 이 태스크가 막혀 있는 동안 NFR-012는 구현되지 않는다.

**무엇이 정해지면 풀리는가**: OQ-009와 OQ-001이 풀리면 함께 풀린다.

## PRD 근거
- FR-009: 로그인하지 않은 브라우저에서 그 링크를 열면 계약서 본문이 표시되고 PDF 내려받기 버튼이 동작한다
- FR-009: 공유 화면에는 계약서 본문과 당사자 정보만 표시되고, 소유자의 다른 정보는 표시되지 않는다
- NFR-012: 공유 링크 열람에 로그인·가입·앱 설치가 요구되지 않는다
- NFR-011: 폭 375px에서 공유 문서 열람이 가로 스크롤 없이 동작한다

## TRD 근거
- TD-002 (확정) — 서버 렌더
- TD-011 (확정)

## Architecture
- `frontend.md §3.10`
- `auth.md §3.7`
- `backend.md §3.11`

## Scope
### In Scope
- 공유 열람 화면
- 공유 PDF 링크
- 무효 안내 화면
### Out of Scope
- 열람자 확인 버튼·코멘트 — PRD OQ-009의 답에 달렸다(현재 범위 밖)

## Acceptance Criteria
1. JS를 끈 브라우저에서 공유 링크를 열면 계약서 본문과 고지 문구가 표시된다
2. 화면 HTML에 소유자의 다른 프로젝트·클라이언트·인보이스 식별자나 링크가 없다
3. 로그인하지 않은 새 브라우저 세션에서 열어도 200이 반환된다
4. 폐기된 링크와 존재하지 않는 링크가 같은 화면을 보여 준다
5. 폭 375px에서 가로 스크롤 없이 본문을 읽을 수 있다
6. 공유 화면의 PDF 버튼이 일반 링크이며 눌렀을 때 PDF가 내려받아진다

## Dependencies
- phase-06-task-09
- phase-06-task-06
- phase-02-task-06

## Files
- `src/app/s/[token]/page.tsx` — 새로 만든다
- `src/app/s/[token]/pdf/route.ts` — 새로 만든다
- `tests/e2e/share-view.spec.ts` — 새로 만든다

> **파일이 하나가 아닌 이유**: 열람 화면과 그 PDF 경로가 같은 토큰 검증을 공유하므로 떼면 어느 쪽도 혼자 검증되지 않는다.

## 바뀔 수 있는 지점
**CF-005 미해소.** JS 없이 동작해야 하는 공유 화면에서는 NFR-002의 진행 표시를 제공할 수 없어, 진행 표시 없이 즉시 다운로드로 잠정 처리했다(`frontend.md §3.9`). CF-005는 `P0 뼈대: 아니오` 라 이 태스크를 추가로 차단하지는 않는다.
