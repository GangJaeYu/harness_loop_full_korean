---
id: phase-05-task-01
phase: "05"
title: 스파이크 — 집계 질의 P95 측정 (OQ-015)
priority: P0
goal: 프로젝트 200건·인보이스 1,000건 상태에서 대시보드와 프로젝트 상세 집계 질의의 P95를 재고 판정을 남긴다
depends_on: [phase-04-task-06]
files: [scripts/spike-aggregate.ts, spikes/oq-015-aggregate.md]
architecture: [database.md §3.10, database.md §3.14]
acceptance_criteria:
  - 프로젝트 200건·인보이스 1,000건 시드를 만든 뒤 두 질의를 각 20회 측정한 값이 결과 문서에 기록된다
  - 두 P95가 1.5초 이내인지 아닌지가 결과 문서에 '판정' 한 줄로 적힌다
  - 1.5초를 넘으면 결과 문서가 그것을 실패로 명시하고 인덱스 추가 또는 저장 집계 전환 중 무엇이 필요한지 적는다
  - 측정에 쓴 질의문이 결과 문서에 그대로 들어 있다
status: pending
verification: [lint, unit, e2e, task_validation]
blocked_by: []
---

# phase-05-task-01 — 스파이크 — 집계 질의 P95 측정 (OQ-015)

## Goal
프로젝트 200건·인보이스 1,000건 상태에서 대시보드와 프로젝트 상세 집계 질의의 P95를 재고 판정을 남긴다.

## Context
인보이스 테이블과 상태가 생긴 직후가 이 측정을 할 수 있는 가장 이른 시점이다. TRD 11절이 이 스파이크를 'Layer 3 초기'로 지목했다.

## PRD 근거
- NFR-001: 프로젝트 200건·인보이스 1,000건이 있는 계정에서 대시보드와 프로젝트 상세의 응답 P95 1.5초 이내

## TRD 근거
- TD-003 (확정)
- TD-002 (확정)
- OQ-015 — 실험, Layer 3 초기

## Architecture
- `database.md §3.10`
- `database.md §3.14`

## Scope
### In Scope
- 시드 생성과 측정 스크립트
- 결과 기록과 판정
### Out of Scope
- 인덱스 확정 — phase-05-task-03
- 저장 집계 전환(필요할 때만) — 아키텍처로 되돌려 보낼 일이다

## Acceptance Criteria
1. 프로젝트 200건·인보이스 1,000건 시드를 만든 뒤 두 질의를 각 20회 측정한 값이 결과 문서에 기록된다
2. 두 P95가 1.5초 이내인지 아닌지가 결과 문서에 '판정' 한 줄로 적힌다
3. 1.5초를 넘으면 결과 문서가 그것을 실패로 명시하고 인덱스 추가 또는 저장 집계 전환 중 무엇이 필요한지 적는다
4. 측정에 쓴 질의문이 결과 문서에 그대로 들어 있다

## Dependencies
- phase-04-task-06

## Files
- `scripts/spike-aggregate.ts` — 새로 만든다
- `spikes/oq-015-aggregate.md` — 새로 만든다(측정 결과)

> **파일이 하나가 아닌 이유**: 측정 스크립트와 결과 기록이 함께 있어야 판정이 남는다.

## 바뀔 수 있는 지점
OQ-015가 실패로 판정되면 `database.md §3.10` 과 `backend.md §3.8` 을 저장 집계로 다시 그려야 하고, 그건 아키텍처의 일이다 — 태스크 안에서 설계를 바꾸지 않는다.
