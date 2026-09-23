---
id: phase-05-task-06
phase: "05"
title: 연체 알림 — 테이블·API·헤더 배지
priority: P1
goal: UNIQUE 제약으로 중복이 생기지 않는 알림을 저장하고 읽지 않은 개수를 모든 화면 상단에 보여 준다
depends_on: [phase-05-task-05]
files: [migrations/0010_notifications.sql, src/modules/notifications/service.ts, src/components/notification-badge.tsx, tests/e2e/notifications.spec.ts]
architecture: [database.md §3.11, backend.md §3.3, frontend.md §3.13]
acceptance_criteria:
  - 같은 인보이스에 대해 알림 생성을 두 번 호출해도 알림은 1건이다
  - 연체 알림이 2건 생성된 뒤 아무 화면이나 열면 상단에 2가 표시된다
  - 알림 하나를 누르면 그 인보이스 상세로 이동하고 배지가 1로 줄어든다
  - 인보이스를 입금 완료로 바꾼 뒤 알림 생성을 호출해도 새 알림이 생기지 않는다
  - 화면을 열어 둔 상태에서 주기적으로 발생하는 네트워크 요청이 없다
status: pending
verification: [lint, unit, e2e, task_validation]
blocked_by: []
---

# phase-05-task-06 — 연체 알림 — 테이블·API·헤더 배지

## Goal
UNIQUE 제약으로 중복이 생기지 않는 알림을 저장하고 읽지 않은 개수를 모든 화면 상단에 보여 준다.

## Context
연체 판정(phase-04-task-07)이 파생 조건이므로 저장이 필요한 것은 알림 중복 방지뿐이다. 실제 생성 호출은 정기 작업(phase-05-task-09)이 한다.

## PRD 근거
- FR-021: 인보이스가 새로 연체로 판정되면 알림 1건이 생성된다
- FR-021: 읽지 않은 알림 개수가 모든 화면의 상단에 표시된다
- FR-021: 같은 인보이스에 대해 중복 알림이 생성되지 않는다

## TRD 근거
- TD-003 (확정)
- TRD 1.2절 — 실시간 통신을 넣지 않는다

## Architecture
- `database.md §3.11`
- `backend.md §3.3`
- `frontend.md §3.13`

## Scope
### In Scope
- `notifications` 테이블과 UNIQUE 제약
- 알림 조회·읽음 API
- 헤더 배지
- 알림 목록 화면
### Out of Scope
- 알림을 만드는 스케줄 실행 — phase-05-task-09

## Acceptance Criteria
1. 같은 인보이스에 대해 알림 생성을 두 번 호출해도 알림은 1건이다
2. 연체 알림이 2건 생성된 뒤 아무 화면이나 열면 상단에 2가 표시된다
3. 알림 하나를 누르면 그 인보이스 상세로 이동하고 배지가 1로 줄어든다
4. 인보이스를 입금 완료로 바꾼 뒤 알림 생성을 호출해도 새 알림이 생기지 않는다
5. 화면을 열어 둔 상태에서 주기적으로 발생하는 네트워크 요청이 없다

## Dependencies
- phase-05-task-05

## Files
- `migrations/0010_notifications.sql` — 새로 만든다
- `src/modules/notifications/service.ts` — 새로 만든다
- `src/components/notification-badge.tsx` — 새로 만든다
- `tests/e2e/notifications.spec.ts` — 새로 만든다

> **파일이 하나가 아닌 이유**: 중복 방지는 DB 제약이고 개수 표시는 화면이라, 둘을 떼면 FR-021의 수용 기준 중 어느 것도 혼자 검증되지 않는다.

## 바뀔 수 있는 지점
없음
