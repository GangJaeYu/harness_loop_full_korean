---
id: phase-04-task-03
phase: "04"
title: audit_events 테이블과 추가 전용 audit 모듈
priority: P0
goal: 수정·삭제 경로가 없는 이력 테이블과 `record()` 하나만 노출하는 공용 모듈을 만든다
depends_on: [phase-02-task-01]
files: [migrations/0008_audit_events.sql, src/lib/audit.ts, src/lib/audit.test.ts]
architecture: [database.md §3.9, backend.md §3.15, security.md §3.5]
acceptance_criteria:
  - 'record()' 로 3건을 남기면 3건이 시각·전후 상태와 함께 조회된다
  - 애플리케이션 DB 계정으로 'audit_events' 를 UPDATE 하면 권한 오류가 난다
  - 코드 전체에 'audit_events' 에 대한 INSERT가 이 모듈 밖에 0건이다
  - 이력 행에 IP·User-Agent·이메일·클라이언트 정보 컬럼이 존재하지 않는다
  - 정의된 'event_type' 네 개 외의 값을 넣으면 CHECK 제약에서 거부된다
status: pending
verification: [lint, unit, e2e, task_validation]
blocked_by: []
---

# phase-04-task-03 — audit_events 테이블과 추가 전용 audit 모듈

## Goal
수정·삭제 경로가 없는 이력 테이블과 `record()` 하나만 노출하는 공용 모듈을 만든다.

## Context
상태 전이(phase-04-task-06)와 공유 링크(phase-06)가 이 모듈을 쓴다. 기록 지점이 흩어지기 전에 먼저 세운다.

## PRD 근거
- NFR-009: 인보이스 상태 변경, 공유 링크 발급·폐기, 공유 링크 열람에 대해 시각과 행위가 기록되고 최소 1년 보존된다
- FR-018: 상태 변경 시각과 변경 전후 상태가 인보이스 이력에 남는다

## TRD 근거
- TD-007 (확정) — 감사 이력은 같은 DB의 추가 전용 테이블에 1년 보존

## Architecture
- `database.md §3.9`
- `backend.md §3.15`
- `security.md §3.5`

## Scope
### In Scope
- `audit_events` 테이블과 DB 권한
- `record()` 함수
- 조회 함수
### Out of Scope
- 1년 경과분 삭제 — phase-05-task-09 (정기 작업)
- 열람 기록 표시 — phase-06-task-11 (차단)

## Acceptance Criteria
1. `record()` 로 3건을 남기면 3건이 시각·전후 상태와 함께 조회된다
2. 애플리케이션 DB 계정으로 `audit_events` 를 UPDATE 하면 권한 오류가 난다
3. 코드 전체에 `audit_events` 에 대한 INSERT가 이 모듈 밖에 0건이다
4. 이력 행에 IP·User-Agent·이메일·클라이언트 정보 컬럼이 존재하지 않는다
5. 정의된 `event_type` 네 개 외의 값을 넣으면 CHECK 제약에서 거부된다

## Dependencies
- phase-02-task-01

## Files
- `migrations/0008_audit_events.sql` — 새로 만든다
- `src/lib/audit.ts` — 새로 만든다
- `src/lib/audit.test.ts` — 새로 만든다

> **파일이 하나가 아닌 이유**: 테이블 권한과 모듈이 함께 있어야 '수정할 수 없다'가 관찰된다.

## 바뀔 수 있는 지점
없음
