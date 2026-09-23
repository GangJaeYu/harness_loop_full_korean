---
id: phase-01-task-01
phase: "01"
title: 프로젝트 뼈대와 계층 경계
priority: P0
goal: route/service/data/adapter 네 계층의 디렉터리와 의존 방향 규칙을 세우고 타입 검사가 통과하는 빈 애플리케이션을 만든다
depends_on: []
files: [package.json, tsconfig.json, tests/architecture/layering.test.ts]
architecture: [backend.md §3.1, frontend.md §3.5]
acceptance_criteria:
  - 타입 검사 명령이 오류 0건으로 끝난다
  - 'src/modules/*/route.ts' 에 SQL 문자열이나 DB 클라이언트 호출이 있으면 계층 테스트가 실패한다
  - 한 모듈의 'data' 를 다른 모듈에서 import 하면 계층 테스트가 실패한다
  - 'src/lib/money.ts'·'errors.ts'·'audit.ts' 가 도메인 모듈을 import 하면 계층 테스트가 실패한다
status: pending
verification: [lint, unit, e2e, task_validation]
blocked_by: []
---

# phase-01-task-01 — 프로젝트 뼈대와 계층 경계

## Goal
route/service/data/adapter 네 계층의 디렉터리와 의존 방향 규칙을 세우고 타입 검사가 통과하는 빈 애플리케이션을 만든다.

## Context
플랜의 첫 태스크다. 앞선 태스크가 없다. 이후 모든 태스크가 이 디렉터리 구조 안에 파일을 하나씩 놓는다.

## PRD 근거
- 특정 FR·NFR을 직접 구현하지 않는 뼈대 태스크다. 이 태스크가 없으면 이후 태스크가 놓일 자리가 없다.

## TRD 근거
- TD-001 (확정) — TypeScript / Node.js LTS
- TD-002 (확정) — Next.js 단일 배포 단위

## Architecture
- `backend.md §3.1`
- `frontend.md §3.5`

## Scope
### In Scope
- 네 계층의 디렉터리와 모듈 여덟 개(accounts·clients·projects·contracts·invoices·sharing·notifications·search)의 빈 자리
- 공용 요소 네 개(money·errors·audit·session)의 빈 자리
- 의존 방향을 검사하는 테스트
### Out of Scope
- 린트·테스트 러너의 구체 구성과 실행 명령 — Layer 4 하네스
- 로컬 개발 환경 스크립트(DB·메일 캡처 컨테이너) — TRD 9.3절이 Layer 4로 넘겼다

## Acceptance Criteria
1. 타입 검사 명령이 오류 0건으로 끝난다
2. `src/modules/*/route.ts` 에 SQL 문자열이나 DB 클라이언트 호출이 있으면 계층 테스트가 실패한다
3. 한 모듈의 `data` 를 다른 모듈에서 import 하면 계층 테스트가 실패한다
4. `src/lib/money.ts`·`errors.ts`·`audit.ts` 가 도메인 모듈을 import 하면 계층 테스트가 실패한다

## Dependencies
- 없음

## Files
- `package.json` — 새로 만든다
- `tsconfig.json` — 새로 만든다
- `tests/architecture/layering.test.ts` — 새로 만든다

> **파일이 하나가 아닌 이유**: 프로젝트를 처음 세우는 태스크라 매니페스트·타입 설정·경계 테스트가 한 묶음이어야 검증된다. 셋 중 하나만 있으면 관찰 가능한 결과가 없다.

## 바뀔 수 있는 지점
없음
