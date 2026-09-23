---
id: phase-01-task-03
phase: "01"
title: 오류 응답 단일 형식
priority: P0
goal: 모든 오류 응답이 쓰는 `{error:{code,message,fields?}}` 형식과 일곱 개 이하의 코드 집합을 한 모듈로 고정한다
depends_on: [phase-01-task-01]
files: [src/lib/errors.ts, src/lib/errors.test.ts]
architecture: [backend.md §3.4, security.md §3.2]
acceptance_criteria:
  - 'VALIDATION_FAILED' 를 만들면 응답이 HTTP 400이고 'error.fields' 가 비어 있지 않다
  - 'NOT_FOUND' 를 만들면 HTTP 404이고 본문에 대상 자원의 어떤 값도 들어가지 않는다
  - 'fields' 없이 'VALIDATION_FAILED' 를 만들려 하면 함수가 거부한다
  - 정의된 코드 목록에 없는 코드로 오류를 만들려 하면 타입 검사에서 걸린다
  - 서버 내부 예외를 넘기면 'INTERNAL' 로 변환되고 응답 본문에 스택 추적·SQL 문자열이 없다
status: pending
verification: [lint, unit, e2e, task_validation]
blocked_by: []
---

# phase-01-task-03 — 오류 응답 단일 형식

## Goal
모든 오류 응답이 쓰는 `{error:{code,message,fields?}}` 형식과 일곱 개 이하의 코드 집합을 한 모듈로 고정한다.

## Context
화면과 서버가 오류를 주고받는 유일한 규약이다. 이후 모든 route 태스크가 이 모듈만 쓴다.

## PRD 근거
- FR-003: 사업자등록번호를 10자리 숫자가 아닌 값으로 입력하면 저장되지 않고 형식 오류가 표시된다
- NFR-004: 다른 계정의 상세 주소에 접근하면 404가 반환된다

## TRD 근거
- TD-008 (확정) — 단일 오류 형식
- TD-012 (확정) — 권한 위반과 부재를 구분하지 않고 404

## Architecture
- `backend.md §3.4`
- `security.md §3.2`

## Scope
### In Scope
- 오류 코드 집합과 생성 함수
- HTTP 상태 코드 대응
- 직렬화
### Out of Scope
- 화면에서 오류를 입력란에 붙이는 처리 — phase-02-task-07
- 코드별 한국어 문구의 최종 카피

## Acceptance Criteria
1. `VALIDATION_FAILED` 를 만들면 응답이 HTTP 400이고 `error.fields` 가 비어 있지 않다
2. `NOT_FOUND` 를 만들면 HTTP 404이고 본문에 대상 자원의 어떤 값도 들어가지 않는다
3. `fields` 없이 `VALIDATION_FAILED` 를 만들려 하면 함수가 거부한다
4. 정의된 코드 목록에 없는 코드로 오류를 만들려 하면 타입 검사에서 걸린다
5. 서버 내부 예외를 넘기면 `INTERNAL` 로 변환되고 응답 본문에 스택 추적·SQL 문자열이 없다

## Dependencies
- phase-01-task-01

## Files
- `src/lib/errors.ts` — 새로 만든다
- `src/lib/errors.test.ts` — 새로 만든다

## 바뀔 수 있는 지점
없음
