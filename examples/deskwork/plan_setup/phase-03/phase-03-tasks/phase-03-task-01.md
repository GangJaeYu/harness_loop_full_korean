---
id: phase-03-task-01
phase: "03"
title: clients 테이블과 data 계층
priority: P0
goal: 클라이언트 테이블을 만들고 소유자 조건이 붙은 조회·저장 함수를 세운다
depends_on: [phase-02-task-02]
files: [migrations/0004_clients.sql, src/modules/clients/data.ts, src/modules/clients/data.test.ts]
architecture: [database.md §3.3, database.md §3.1]
acceptance_criteria:
  - 상호만 채운 행을 저장하면 성공하고 나머지 컬럼은 NULL로 남는다
  - 상호를 공백 한 칸으로 저장하면 CHECK 제약에서 거부된다
  - 사업자등록번호를 9자리로 저장하면 'char(10)' CHECK에서 거부된다
  - 다른 계정 id로 조회하면 결과가 0건이다
  - 'deleted_at' 이 채워진 행은 조회 결과에 나오지 않는다
status: pending
verification: [lint, unit, e2e, task_validation]
blocked_by: []
---

# phase-03-task-01 — clients 테이블과 data 계층

## Goal
클라이언트 테이블을 만들고 소유자 조건이 붙은 조회·저장 함수를 세운다.

## Context
phase-02-task-02 가 소유자 조건 규약을 세웠다. 이 태스크가 그 규약을 따르는 첫 도메인 테이블이다.

## PRD 근거
- FR-003: 항목은 상호, 담당자명, 연락처(이메일·전화), 사업자등록번호, 주소, 메모다
- FR-003: 상호를 입력하고 저장하면 클라이언트 목록에 나타난다(상호 외 항목은 비워도 저장된다)
- NFR-015: 클라이언트 개인정보를 국외로 이전하지 않는다

## TRD 근거
- TD-003 (확정)
- TD-005 (확정) — 논리 삭제
- TD-013 (확정) — DB 제약 이중화

## Architecture
- `database.md §3.3`
- `database.md §3.1`

## Scope
### In Scope
- `clients` 테이블
- 조회·생성·수정·논리삭제 data 함수
### Out of Scope
- 삭제 제한(연결 프로젝트 개수) — phase-03-task-02 (서비스 계층에서 검사한다)

## Acceptance Criteria
1. 상호만 채운 행을 저장하면 성공하고 나머지 컬럼은 NULL로 남는다
2. 상호를 공백 한 칸으로 저장하면 CHECK 제약에서 거부된다
3. 사업자등록번호를 9자리로 저장하면 `char(10)` CHECK에서 거부된다
4. 다른 계정 id로 조회하면 결과가 0건이다
5. `deleted_at` 이 채워진 행은 조회 결과에 나오지 않는다

## Dependencies
- phase-02-task-02

## Files
- `migrations/0004_clients.sql` — 새로 만든다
- `src/modules/clients/data.ts` — 새로 만든다
- `src/modules/clients/data.test.ts` — 새로 만든다

> **파일이 하나가 아닌 이유**: 테이블 제약과 접근 함수를 떼어 놓으면 어느 쪽도 혼자 검증되지 않는다.

## 바뀔 수 있는 지점
없음
