---
id: phase-02-task-08
phase: "02"
title: 공통 레이아웃 — 빈·오류 상태와 반응형 기준
priority: P0
goal: 빈 상태·오류 상태·로딩 규칙을 공통 컴포넌트로 고정하고 브레이크포인트 하나(768px)를 세운다
depends_on: [phase-02-task-07, phase-01-task-06]
files: [src/app/(app)/layout.tsx, src/components/states.tsx, tests/e2e/responsive.spec.ts]
architecture: [frontend.md §3.6, frontend.md §3.11]
acceptance_criteria:
  - 빈 상태 컴포넌트는 한 줄 설명과 다음 행동 버튼을 받고, 버튼 없이도 렌더된다
  - 서버가 400을 돌려주면 전체 화면 오류가 아니라 인라인 필드 오류로 표시된다
  - 폭 375px에서 공통 레이아웃을 열면 문서 폭이 뷰포트 폭을 넘지 않는다(가로 스크롤바 없음)
  - 768px 미만에서 다열 배치가 1열로 접힌다
  - 정의되지 않은 브레이크포인트 값을 쓰면 테스트가 실패한다
status: pending
verification: [lint, unit, e2e, task_validation]
blocked_by: []
---

# phase-02-task-08 — 공통 레이아웃 — 빈·오류 상태와 반응형 기준

## Goal
빈 상태·오류 상태·로딩 규칙을 공통 컴포넌트로 고정하고 브레이크포인트 하나(768px)를 세운다.

## Context
화면이 늘어나기 전에 빈 상태와 반응형 기준을 한 곳에 둔다. `frontend.md §3.6` 이 빈 상태가 필요한 자리 7곳을 열거해 두었으므로 이후 태스크가 그 자리를 채운다.

## PRD 근거
- NFR-011: 폭 375px 화면에서 대시보드 확인, 인보이스 목록 확인, 입금 완료 표시, 공유 문서 열람이 가로 스크롤 없이 동작한다
- NFR-010: 데스크톱 최신 2개 버전의 주요 브라우저 3종에서 모든 기능이 동작한다
- FR-020: 데이터가 하나도 없는 신규 계정에서는 0원과 함께 안내가 표시된다

## TRD 근거
- TD-002 (확정) — 유틸리티 CSS
- TD-015 (확정) — Playwright 뷰포트 검증

## Architecture
- `frontend.md §3.6`
- `frontend.md §3.11`

## Scope
### In Scope
- 앱 공통 레이아웃
- 빈·오류·로딩 공통 컴포넌트
- 브레이크포인트 하나
### Out of Scope
- 알림 배지 — phase-05-task-06
- 처리방침 하단 링크 — phase-02-task-11
- 브라우저 3종 실행 구성 — Layer 4 하네스

## Acceptance Criteria
1. 빈 상태 컴포넌트는 한 줄 설명과 다음 행동 버튼을 받고, 버튼 없이도 렌더된다
2. 서버가 400을 돌려주면 전체 화면 오류가 아니라 인라인 필드 오류로 표시된다
3. 폭 375px에서 공통 레이아웃을 열면 문서 폭이 뷰포트 폭을 넘지 않는다(가로 스크롤바 없음)
4. 768px 미만에서 다열 배치가 1열로 접힌다
5. 정의되지 않은 브레이크포인트 값을 쓰면 테스트가 실패한다

## Dependencies
- phase-02-task-07
- phase-01-task-06

## Files
- `src/app/(app)/layout.tsx` — 새로 만든다
- `src/components/states.tsx` — 새로 만든다
- `tests/e2e/responsive.spec.ts` — 새로 만든다

> **파일이 하나가 아닌 이유**: 레이아웃과 공통 상태 컴포넌트를 떼면 어느 쪽도 화면에서 관찰되지 않는다.

## 바뀔 수 있는 지점
없음
