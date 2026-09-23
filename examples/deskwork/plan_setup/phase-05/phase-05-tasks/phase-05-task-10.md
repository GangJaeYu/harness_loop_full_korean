---
id: phase-05-task-10
phase: "05"
title: 계정 해지와 파기 예정일 표시
priority: P0
goal: 비밀번호 재확인 → 해지 기록 → 세션 삭제 → 공유 링크 폐기를 한 트랜잭션에서 하고 파기 예정일을 화면에 보여 준다
depends_on: [phase-05-task-09, phase-02-task-11]
files: [src/modules/accounts/close.ts, src/app/(app)/settings/account/page.tsx, src/modules/accounts/close.test.ts]
architecture: [auth.md §3.6, frontend.md §3.1, backend.md §3.3]
acceptance_criteria:
  - 비밀번호를 다시 입력해야 해지가 진행된다
  - 해지 후 같은 계정으로 로그인하면 실패한다
  - 해지 화면에 '30일 뒤 파기됩니다'와 파기 예정일이 표시된다
  - 해지 직전에 발급된 공유 링크를 해지 직후 열면 무효 안내가 표시된다
  - 해지 30일 뒤 정기 작업을 돌리면 그 계정의 모든 행이 사라지고 'audit_events' 만 남는다
status: pending
verification: [lint, unit, e2e, task_validation]
blocked_by: []
---

# phase-05-task-10 — 계정 해지와 파기 예정일 표시

## Goal
비밀번호 재확인 → 해지 기록 → 세션 삭제 → 공유 링크 폐기를 한 트랜잭션에서 하고 파기 예정일을 화면에 보여 준다.

## Context
PRD에 계정 해지 FR이 없다. FR-024의 수용 기준과 NFR-007이 문자 그대로 요구하는 최소한만 구현한다(`auth.md §3.6`). 공유 링크 폐기 부분은 phase-06-task-08 이 차단 해소될 때까지 대상이 0건이라 통과한다.

## PRD 근거
- FR-024: 계정 삭제 화면에서 삭제 후 데이터가 파기되는 시점이 표시된다
- NFR-007: 계정을 해지하면 30일 뒤 모든 개인정보가 파기된다

## TRD 근거
- TD-005 (확정)
- TD-010 (확정)

## Architecture
- `auth.md §3.6`
- `frontend.md §3.1`
- `backend.md §3.3`

## Scope
### In Scope
- 해지 경로와 화면
- 세션 무효화
- 파기 예정일 표시
### Out of Scope
- 해지 철회 — 만들지 않는다
- 공유 링크 테이블 — phase-06-task-08 (차단)

## Acceptance Criteria
1. 비밀번호를 다시 입력해야 해지가 진행된다
2. 해지 후 같은 계정으로 로그인하면 실패한다
3. 해지 화면에 "30일 뒤 파기됩니다"와 파기 예정일이 표시된다
4. 해지 직전에 발급된 공유 링크를 해지 직후 열면 무효 안내가 표시된다
5. 해지 30일 뒤 정기 작업을 돌리면 그 계정의 모든 행이 사라지고 `audit_events` 만 남는다

## Dependencies
- phase-05-task-09
- phase-02-task-11

## Files
- `src/modules/accounts/close.ts` — 새로 만든다
- `src/app/(app)/settings/account/page.tsx` — 새로 만든다
- `src/modules/accounts/close.test.ts` — 새로 만든다

> **파일이 하나가 아닌 이유**: 해지 로직과 파기 예정일을 보여 주는 화면이 함께 있어야 FR-024의 수용 기준이 관찰된다.

## 바뀔 수 있는 지점
**CF-004 미해소.** PRD에 계정 해지 FR이 없어 재확인 방식·철회 가능 여부·해지 후 공유 링크 처리를 잠정으로 정했다(`auth.md §3.6`). PRD가 해지 FR을 신설하면 이 태스크와 화면을 다시 쓴다. CF-004는 `P0 뼈대: 아니오` 라 차단하지 않는다.
