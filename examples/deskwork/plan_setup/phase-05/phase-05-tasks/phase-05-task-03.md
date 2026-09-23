---
id: phase-05-task-03
phase: "05"
title: 인덱스와 근거 질의
priority: P0
goal: 아키텍처가 열거한 열 개의 인덱스만 만들고 근거 질의가 없는 인덱스를 금지한다
depends_on: [phase-05-task-02]
files: [migrations/0009_indexes.sql, tests/migrations/index-inventory.test.ts]
architecture: [database.md §3.14]
acceptance_criteria:
  - 프로젝트 200건·인보이스 1,000건 시드에서 대시보드와 프로젝트 상세 조회를 각 20회 측정해 P95가 1.5초 이내다
  - 'database.md §3.14' 목록에 없는 인덱스가 마이그레이션에 존재하면 테스트가 실패한다
  - 검색어 2글자로 검색했을 때 응답이 1.5초 이내다
  - 검색용 전문 인덱스가 존재하지 않는다
status: pending
verification: [lint, unit, e2e, task_validation]
blocked_by: []
---

# phase-05-task-03 — 인덱스와 근거 질의

## Goal
아키텍처가 열거한 열 개의 인덱스만 만들고 근거 질의가 없는 인덱스를 금지한다.

## Context
phase-05-task-01 의 측정 결과가 이 태스크의 목표값을 정한다. 인덱스는 쓰기 비용과 마이그레이션 대상을 늘리므로 근거 질의에서 출발한 것만 만든다.

## PRD 근거
- NFR-001: 대시보드와 프로젝트 상세의 응답 P95 1.5초 이내

## TRD 근거
- TD-003 (확정)

## Architecture
- `database.md §3.14`

## Scope
### In Scope
- 열 개 인덱스 마이그레이션
- 목록 일치 검사
### Out of Scope
- 저장 집계 전환 — 아키텍처 소관

## Acceptance Criteria
1. 프로젝트 200건·인보이스 1,000건 시드에서 대시보드와 프로젝트 상세 조회를 각 20회 측정해 P95가 1.5초 이내다
2. `database.md §3.14` 목록에 없는 인덱스가 마이그레이션에 존재하면 테스트가 실패한다
3. 검색어 2글자로 검색했을 때 응답이 1.5초 이내다
4. 검색용 전문 인덱스가 존재하지 않는다

## Dependencies
- phase-05-task-02

## Files
- `migrations/0009_indexes.sql` — 새로 만든다
- `tests/migrations/index-inventory.test.ts` — 새로 만든다

> **파일이 하나가 아닌 이유**: 인덱스 목록과 그 목록을 강제하는 검사가 함께 있어야 '근거 없는 인덱스 0건'이 지켜진다.

## 바뀔 수 있는 지점
OQ-015 스파이크가 P95를 못 맞추면 인덱스를 추가하거나 `database.md §3.10` 을 저장 집계로 바꾼다 — 후자는 아키텍처로 되돌려 보낼 일이다.
