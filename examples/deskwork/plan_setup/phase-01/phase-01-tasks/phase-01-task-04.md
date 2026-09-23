---
id: phase-01-task-04
phase: "01"
title: 서버 경계 입력 검증 스키마
priority: P0
goal: route 진입 직후 한 번만 도는 스키마 검증 지점을 만들고 화면과 서버가 같은 스키마 정의를 참조하게 한다
depends_on: [phase-01-task-03]
files: [src/lib/validation.ts, src/lib/validation.test.ts]
architecture: [security.md §3.1, backend.md §3.4]
acceptance_criteria:
  - 금액 필드에 음수를 보내면 검증에서 거부되고 'VALIDATION_FAILED' 와 해당 필드 경로가 반환된다
  - 사업자등록번호에 9자리를 보내면 거부되고 'fields[0].field' 가 'bizRegNo' 다
  - 사업자등록번호에 '123-45-6789' 를 보내면 '1234567890' 으로 정규화된 값이 통과한다
  - 스키마를 통과하지 않은 값을 service 함수에 넘기면 타입 검사에서 걸린다
  - 조항 본문에 '<script>alert(1)</script>' 를 넣으면 저장 시 가공되지 않고 원본 그대로 통과한다(이스케이프는 렌더 시점)
status: pending
verification: [lint, unit, e2e, task_validation]
blocked_by: []
---

# phase-01-task-04 — 서버 경계 입력 검증 스키마

## Goal
route 진입 직후 한 번만 도는 스키마 검증 지점을 만들고 화면과 서버가 같은 스키마 정의를 참조하게 한다.

## Context
phase-01-task-03 이 오류 형식을 정했다. 검증 실패는 그 형식으로만 나간다.

## PRD 근거
- FR-004: 총 계약금액에 음수 또는 숫자가 아닌 값을 넣으면 저장되지 않는다
- FR-014: 수량 또는 단가에 음수를 입력하면 저장되지 않는다

## TRD 근거
- TD-013 (확정) — 입력 검증은 서버 경계에서 스키마로 단일 수행

## Architecture
- `security.md §3.1`
- `backend.md §3.4`

## Scope
### In Scope
- 공통 스키마 원시 타입(금액·날짜·이메일·사업자등록번호)
- route 진입 검증 래퍼
### Out of Scope
- 집합 규칙(대금 조건 합계) — phase-03-task-05
- 상태 전이 규칙 — phase-04-task-06
- 유일성 — DB 제약

## Acceptance Criteria
1. 금액 필드에 음수를 보내면 검증에서 거부되고 `VALIDATION_FAILED` 와 해당 필드 경로가 반환된다
2. 사업자등록번호에 9자리를 보내면 거부되고 `fields[0].field` 가 `bizRegNo` 다
3. 사업자등록번호에 `123-45-6789` 를 보내면 `1234567890` 으로 정규화된 값이 통과한다
4. 스키마를 통과하지 않은 값을 service 함수에 넘기면 타입 검사에서 걸린다
5. 조항 본문에 `<script>alert(1)</script>` 를 넣으면 저장 시 가공되지 않고 원본 그대로 통과한다(이스케이프는 렌더 시점)

## Dependencies
- phase-01-task-03

## Files
- `src/lib/validation.ts` — 새로 만든다
- `src/lib/validation.test.ts` — 새로 만든다

## 바뀔 수 있는 지점
없음
