---
id: phase-06-task-11
phase: "06"
title: 공유 링크 열람 기록과 표시
priority: P1
goal: 열람 시각을 이력으로 남기고 최초·최근 열람 시각과 총 횟수를 소유자 화면에 보여 준다
depends_on: [phase-06-task-10, phase-04-task-03]
files: [src/modules/sharing/view-log.ts, src/modules/sharing/view-log.test.ts]
architecture: [backend.md §3.11, backend.md §3.15, database.md §3.9]
acceptance_criteria:
  - 공유 링크를 로그아웃 상태에서 5회 열면 'actor='anonymous'' 이력이 5건 쌓인다
  - 소유자가 로그인 상태로 같은 문서를 열어도 열람 횟수는 5로 유지된다
  - 계약서 상세에 최초 열람 시각·최근 열람 시각·총 열람 횟수가 KST로 표시된다
  - 한 번도 열리지 않았다면 '아직 열람되지 않음'이 표시된다
  - 열람 이력 삽입을 강제로 실패시켜도 공유 화면은 정상 표시된다
status: blocked
verification: [lint, unit, e2e, task_validation]
blocked_by: [CF-006, OQ-009]
---

# phase-06-task-11 — 공유 링크 열람 기록과 표시

## Goal
열람 시각을 이력으로 남기고 최초·최근 열람 시각과 총 횟수를 소유자 화면에 보여 준다.

## Context
이 태스크는 **막혀 있다.** 공유 열람 화면(phase-06-task-10)이 막혀 있고, PRD 8절이 OQ-009가 FR-010에도 영향을 준다고 적었다.

**무엇이 정해지면 풀리는가**: OQ-009가 풀리고 phase-06-task-10 이 완료되면 풀린다.

## PRD 근거
- FR-010: 공유 링크가 열리면 열람 기록이 1건 추가된다
- FR-010: 소유자 본인이 로그인 상태로 문서를 열어본 것은 열람 횟수에 포함되지 않는다
- FR-010: 한 번도 열리지 않았다면 "아직 열람되지 않음"이 표시된다

## TRD 근거
- TD-007 (확정)

## Architecture
- `backend.md §3.11`
- `backend.md §3.15`
- `database.md §3.9`

## Scope
### In Scope
- 열람 이력 기록(응답 이후 별도 트랜잭션)
- 열람 요약 조회와 표시
### Out of Scope
- 이력 1년 정리 — phase-05-task-09

## Acceptance Criteria
1. 공유 링크를 로그아웃 상태에서 5회 열면 `actor='anonymous'` 이력이 5건 쌓인다
2. 소유자가 로그인 상태로 같은 문서를 열어도 열람 횟수는 5로 유지된다
3. 계약서 상세에 최초 열람 시각·최근 열람 시각·총 열람 횟수가 KST로 표시된다
4. 한 번도 열리지 않았다면 "아직 열람되지 않음"이 표시된다
5. 열람 이력 삽입을 강제로 실패시켜도 공유 화면은 정상 표시된다

## Dependencies
- phase-06-task-10
- phase-04-task-03

## Files
- `src/modules/sharing/view-log.ts` — 새로 만든다
- `src/modules/sharing/view-log.test.ts` — 새로 만든다

## 바뀔 수 있는 지점
없음
