---
id: phase-01-task-06
phase: "01"
title: 표시 규약 유틸 — 금액·날짜·사업자번호
priority: P0
goal: 금액·시각·날짜·사업자등록번호의 표시 서식을 한 모듈에 모아 화면과 인쇄 템플릿이 같은 함수를 쓰게 한다
depends_on: [phase-01-task-01]
files: [src/lib/format.ts, src/lib/format.test.ts]
architecture: [frontend.md §3.8]
acceptance_criteria:
  - 정수 1000003 을 넣으면 '1,000,003원' 이 반환된다
  - UTC 시각을 넣으면 KST로 변환된 'YYYY-MM-DD HH:mm' 이 반환된다
  - 저장값 '1234567890' 을 넣으면 '123-45-6789' 가 반환된다
  - 모듈이 금액을 다시 계산하는 함수를 노출하지 않는다(곱셈·나눗셈 연산이 없다)
  - 숫자가 아닌 값을 금액 서식 함수에 넣으면 예외를 던진다
status: pending
verification: [lint, unit, e2e, task_validation]
blocked_by: []
---

# phase-01-task-06 — 표시 규약 유틸 — 금액·날짜·사업자번호

## Goal
금액·시각·날짜·사업자등록번호의 표시 서식을 한 모듈에 모아 화면과 인쇄 템플릿이 같은 함수를 쓰게 한다.

## Context
phase-01-task-05 가 계산을 한 곳으로 모았다. 이 태스크는 표시를 한 곳으로 모아 '계산은 서버, 표시는 유틸' 경계를 완성한다.

## PRD 근거
- NFR-008: 표시·PDF·합계 어디서도 반올림 오차가 발생하지 않는다
- NFR-016: 화면·문서·PDF의 언어는 한국어 단일, 통화는 원(KRW) 단일
- FR-003: 사업자등록번호 표시

## TRD 근거
- TD-004 (확정)
- TD-003 (확정) — UTC 저장·KST 표시

## Architecture
- `frontend.md §3.8`

## Scope
### In Scope
- 금액·시각·날짜·사업자등록번호 서식 함수
### Out of Scope
- 연체 배지와 상태 라벨의 화면 배치 — phase-04-task-08
- 통화 선택 UI(만들지 않는다)

## Acceptance Criteria
1. 정수 1000003 을 넣으면 `1,000,003원` 이 반환된다
2. UTC 시각을 넣으면 KST로 변환된 `YYYY-MM-DD HH:mm` 이 반환된다
3. 저장값 `1234567890` 을 넣으면 `123-45-6789` 가 반환된다
4. 모듈이 금액을 다시 계산하는 함수를 노출하지 않는다(곱셈·나눗셈 연산이 없다)
5. 숫자가 아닌 값을 금액 서식 함수에 넣으면 예외를 던진다

## Dependencies
- phase-01-task-01

## Files
- `src/lib/format.ts` — 새로 만든다
- `src/lib/format.test.ts` — 새로 만든다

## 바뀔 수 있는 지점
없음
