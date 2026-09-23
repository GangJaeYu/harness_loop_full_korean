---
id: phase-06-task-08
phase: "06"
title: share_links 테이블과 토큰 해시 저장
priority: P0
goal: 128비트 CSPRNG 토큰의 해시만 저장하고 폐기를 상태로 표현하는 테이블을 만든다
depends_on: [phase-04-task-01]
files: [migrations/0012_share_links.sql, src/modules/sharing/data.ts, src/modules/sharing/data.test.ts]
architecture: [database.md §3.8, database.md §3.1]
acceptance_criteria:
  - 링크를 발급하면 DB에서 토큰 원문 문자열이 검색되지 않는다
  - 발급된 토큰 1,000개에서 순차적 규칙이 발견되지 않고 길이가 128비트 이상이다
  - 같은 'token_hash' 를 두 번 넣으려 하면 UNIQUE 위반으로 거부된다
  - 'doc_type' 에 'contract'·'invoice' 외의 값을 넣으면 CHECK 제약에서 거부된다
  - 폐기는 행 삭제가 아니라 'revoked_at' 기록이며 발급·폐기 이력이 남는다
status: blocked
verification: [lint, unit, e2e, task_validation]
blocked_by: [CF-006, OQ-009]
---

# phase-06-task-08 — share_links 테이블과 토큰 해시 저장

## Goal
128비트 CSPRNG 토큰의 해시만 저장하고 폐기를 상태로 표현하는 테이블을 만든다.

## Context
이 태스크는 **막혀 있다.** CF-006(`P0 뼈대: 예`)이 공유 경로를 걸고 있고 PRD OQ-009(클라이언트가 링크에서 무엇까지 할 수 있는지)가 미해소다. `database.md §3.8` 은 "OQ-009가 '확인 버튼' 또는 '코멘트'로 오면 링크에 열람자 행동 테이블이 붙는다"고 적었다.

**무엇이 정해지면 풀리는가**: PRD OQ-009와 OQ-001에 답이 오면 풀린다.

## PRD 근거
- NFR-005: 링크 토큰은 128비트 이상의 난수이며 순차·예측 가능한 값이 아니다. 폐기된 토큰은 즉시 접근 불가

## TRD 근거
- TD-011 (확정) — 128비트 CSPRNG, 해시 저장, 폐기 즉시 반영

## Architecture
- `database.md §3.8`
- `database.md §3.1`

## Scope
### In Scope
- `share_links` 테이블
- 토큰 생성·해시·조회 data 함수
### Out of Scope
- 발급·폐기 규칙 — phase-06-task-09 (차단)

## Acceptance Criteria
1. 링크를 발급하면 DB에서 토큰 원문 문자열이 검색되지 않는다
2. 발급된 토큰 1,000개에서 순차적 규칙이 발견되지 않고 길이가 128비트 이상이다
3. 같은 `token_hash` 를 두 번 넣으려 하면 UNIQUE 위반으로 거부된다
4. `doc_type` 에 `contract`·`invoice` 외의 값을 넣으면 CHECK 제약에서 거부된다
5. 폐기는 행 삭제가 아니라 `revoked_at` 기록이며 발급·폐기 이력이 남는다

## Dependencies
- phase-04-task-01

## Files
- `migrations/0012_share_links.sql` — 새로 만든다
- `src/modules/sharing/data.ts` — 새로 만든다
- `src/modules/sharing/data.test.ts` — 새로 만든다

> **파일이 하나가 아닌 이유**: 테이블과 토큰 생성·해시 함수를 떼면 '원문이 저장되지 않는다'를 검증할 수 없다.

## 바뀔 수 있는 지점
없음
