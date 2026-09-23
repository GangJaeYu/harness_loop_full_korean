---
id: phase-02-task-11
phase: "02"
title: 개인정보 처리방침 화면과 공통 하단 링크
priority: P0
goal: `/privacy` 화면과 앱 공통 레이아웃 하단의 처리방침 링크를 만들어 FR-024의 접근 경로를 세운다
depends_on: [phase-02-task-08]
files: [src/app/(public)/privacy/page.tsx, tests/e2e/privacy-access.spec.ts]
architecture: [frontend.md §3.12, frontend.md §3.1]
acceptance_criteria:
  - 로그인 후 임의의 화면 하단에서 처리방침으로 이동할 수 있다
  - 로그인하지 않은 상태에서도 '/privacy' 가 열린다(비인증 경로 목록에 있다)
  - 가입 화면의 처리방침 링크가 이 경로를 가리킨다
  - 처리방침 본문 문안이 아직 확정되지 않았음을 화면이 자리표시자로 드러내고, 빈 화면이 아니다
status: pending
verification: [lint, unit, e2e, task_validation]
blocked_by: []
---

# phase-02-task-11 — 개인정보 처리방침 화면과 공통 하단 링크

## Goal
`/privacy` 화면과 앱 공통 레이아웃 하단의 처리방침 링크를 만들어 FR-024의 접근 경로를 세운다.

## Context
FR-024의 네 수용 기준 중 접근 경로 두 개가 여기서 처리된다. 문안 내용(수집 항목·보관 기간·파기 시점·문의처)은 PRD OQ-010이 막고 있어 phase-06-task-12 로 분리했다.

## PRD 근거
- FR-024: 로그인 후에도 모든 화면 하단에서 개인정보 처리방침에 접근할 수 있다

## TRD 근거
- TD-002 (확정)

## Architecture
- `frontend.md §3.12`
- `frontend.md §3.1`

## Scope
### In Scope
- 처리방침 화면 껍데기와 라우팅
- 공통 레이아웃 하단 링크
### Out of Scope
- 처리방침 문안 — phase-06-task-12 (차단, OQ-010)
- 계정 해지 화면의 파기 시점 표시 — phase-05-task-10

## Acceptance Criteria
1. 로그인 후 임의의 화면 하단에서 처리방침으로 이동할 수 있다
2. 로그인하지 않은 상태에서도 `/privacy` 가 열린다(비인증 경로 목록에 있다)
3. 가입 화면의 처리방침 링크가 이 경로를 가리킨다
4. 처리방침 본문 문안이 아직 확정되지 않았음을 화면이 자리표시자로 드러내고, 빈 화면이 아니다

## Dependencies
- phase-02-task-08

## Files
- `src/app/(public)/privacy/page.tsx` — 새로 만든다
- `tests/e2e/privacy-access.spec.ts` — 새로 만든다

## 바뀔 수 있는 지점
PRD OQ-010(개인정보 국내 저장 강제 여부)이 미해소다. 답에 따라 이 화면에 들어갈 문안이 정해진다 — 구조는 유지되고 문안만 phase-06-task-12 에서 채운다.
