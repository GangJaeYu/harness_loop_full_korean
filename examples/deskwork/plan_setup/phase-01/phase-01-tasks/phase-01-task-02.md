---
id: phase-01-task-02
phase: "01"
title: 마이그레이션 러너와 되돌리기 규칙
priority: P0
goal: 순번이 붙은 마이그레이션 파일로만 스키마를 바꾸고 모든 파일이 되돌리기를 갖도록 하는 실행기를 만든다
depends_on: [phase-01-task-01]
files: [scripts/migrate.ts, migrations/0001_baseline.sql, tests/migrations/reversible.test.ts]
architecture: [database.md §3.15]
acceptance_criteria:
  - 빈 DB에 전체 마이그레이션을 처음부터 적용하면 오류 없이 끝난다
  - 마지막 마이그레이션을 되돌린 뒤 다시 적용해도 오류가 없다
  - 되돌리기 구문이 없는 마이그레이션 파일을 추가하면 테스트가 실패한다
status: pending
verification: [lint, unit, e2e, task_validation]
blocked_by: []
---

# phase-01-task-02 — 마이그레이션 러너와 되돌리기 규칙

## Goal
순번이 붙은 마이그레이션 파일로만 스키마를 바꾸고 모든 파일이 되돌리기를 갖도록 하는 실행기를 만든다.

## Context
phase-01-task-01 이 디렉터리를 세웠다. 이후 모든 테이블 태스크가 이 러너 위에 마이그레이션 파일을 하나씩 얹는다.

## PRD 근거
- NFR-013: 월간 가동률 99% 이상 — 롤백이 직전 이미지로 되돌리기이므로 되돌릴 수 없는 마이그레이션은 롤백 수단을 없앤다

## TRD 근거
- TD-003 (확정) — 스키마 변경은 마이그레이션 파일로만
- TRD 9.2절 — 되돌릴 수 있는 마이그레이션만 운영에 올린다

## Architecture
- `database.md §3.15`

## Scope
### In Scope
- 마이그레이션 적용·되돌리기 실행기
- 되돌리기 정의 여부를 검사하는 테스트
- 빈 baseline 마이그레이션
### Out of Scope
- 개별 테이블 정의 — 각 도메인 태스크
- 시드 스크립트 — Layer 4 (TD-018)

## Acceptance Criteria
1. 빈 DB에 전체 마이그레이션을 처음부터 적용하면 오류 없이 끝난다
2. 마지막 마이그레이션을 되돌린 뒤 다시 적용해도 오류가 없다
3. 되돌리기 구문이 없는 마이그레이션 파일을 추가하면 테스트가 실패한다

## Dependencies
- phase-01-task-01

## Files
- `scripts/migrate.ts` — 새로 만든다
- `migrations/0001_baseline.sql` — 새로 만든다
- `tests/migrations/reversible.test.ts` — 새로 만든다

> **파일이 하나가 아닌 이유**: 실행기와 검사 테스트, 그리고 적용 대상 파일 하나가 함께 있어야 '적용되고 되돌아간다'를 관찰할 수 있다.

## 바뀔 수 있는 지점
없음
