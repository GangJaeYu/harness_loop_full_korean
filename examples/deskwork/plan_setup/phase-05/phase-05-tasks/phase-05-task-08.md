---
id: phase-05-task-08
phase: "05"
title: 논리 삭제와 프로젝트 동반 삭제
priority: P1
goal: 삭제를 `deleted_at` 기록으로 바꾸고 프로젝트 삭제 시 계약서·인보이스를 같은 트랜잭션에서 함께 삭제한다
depends_on: [phase-05-task-05]
files: [src/lib/soft-delete.ts, src/modules/projects/delete.ts, src/modules/projects/delete.test.ts]
architecture: [database.md §3.13, backend.md §3.5, frontend.md §3.7]
acceptance_criteria:
  - 삭제를 요청하면 대상 이름이 포함된 확인이 필요하고, 확인해야 삭제된다
  - 인보이스 2건이 있는 프로젝트를 삭제하면 확인 응답에 '2' 가 포함된다
  - 삭제 후 목록·검색·대시보드 어디에서도 해당 문서가 나오지 않으며 DB에는 'deleted_at' 이 채워진 행이 남아 있다
  - 프로젝트와 그 인보이스의 'deleted_at' 값이 같다
  - 삭제된 문서의 감사 이력 행은 그대로 남아 있다
status: pending
verification: [lint, unit, e2e, task_validation]
blocked_by: []
---

# phase-05-task-08 — 논리 삭제와 프로젝트 동반 삭제

## Goal
삭제를 `deleted_at` 기록으로 바꾸고 프로젝트 삭제 시 계약서·인보이스를 같은 트랜잭션에서 함께 삭제한다.

## Context
phase-02-task-02 가 조회 기본 조건에 `deleted_at IS NULL` 을 넣어 두었다. 이 태스크는 그 조건을 켜는 쪽, 즉 삭제 기록을 만든다.

## PRD 근거
- FR-023: 삭제를 누르면 대상 이름이 포함된 확인 창이 표시되고, 확인해야 삭제된다
- FR-023: 인보이스가 1건 이상 있는 프로젝트를 삭제하면 그 인보이스도 함께 삭제되며, 확인 창에 삭제될 인보이스 건수가 표시된다
- NFR-007: 사용자가 삭제한 문서는 30일간 복구 가능 영역에 있다가 자동 파기된다

## TRD 근거
- TD-005 (확정) — 논리 삭제 + 30일 뒤 물리 파기
- TD-007 (확정)

## Architecture
- `database.md §3.13`
- `backend.md §3.5`
- `frontend.md §3.7`

## Scope
### In Scope
- 논리 삭제 헬퍼
- 프로젝트 동반 삭제 트랜잭션
- 삭제 확인 흐름
### Out of Scope
- 30일 경과 물리 파기 — phase-05-task-09
- 삭제된 문서의 공유 링크 차단 — phase-06-task-09 (차단)
- 복구(휴지통) 화면 — 만들지 않는다

## Acceptance Criteria
1. 삭제를 요청하면 대상 이름이 포함된 확인이 필요하고, 확인해야 삭제된다
2. 인보이스 2건이 있는 프로젝트를 삭제하면 확인 응답에 `2` 가 포함된다
3. 삭제 후 목록·검색·대시보드 어디에서도 해당 문서가 나오지 않으며 DB에는 `deleted_at` 이 채워진 행이 남아 있다
4. 프로젝트와 그 인보이스의 `deleted_at` 값이 같다
5. 삭제된 문서의 감사 이력 행은 그대로 남아 있다

## Dependencies
- phase-05-task-05

## Files
- `src/lib/soft-delete.ts` — 새로 만든다
- `src/modules/projects/delete.ts` — 새로 만든다
- `src/modules/projects/delete.test.ts` — 새로 만든다

> **파일이 하나가 아닌 이유**: 공통 헬퍼와 프로젝트 동반 삭제가 함께 있어야 '같은 `deleted_at` 값'을 관찰할 수 있다.

## 바뀔 수 있는 지점
**CF-003 미해소.** NFR-007의 '복구 가능'에 대응하는 복구 FR이 PRD에 없어 복구 경로를 만들지 않고 '30일 유예 후 파기'로 잠정 해석했다(`database.md §3.13`). 복구 FR이 신설되면 휴지통 화면과 복원 경로가 추가된다. CF-003은 `P0 뼈대: 아니오` 라 차단하지 않는다.
