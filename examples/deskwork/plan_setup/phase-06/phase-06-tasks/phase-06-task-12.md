---
id: phase-06-task-12
phase: "06"
title: 개인정보 처리방침 문안
priority: P0
goal: 수집 항목·보관 기간·파기 시점·문의처를 실제 저장 위치와 일치하게 처리방침 문안으로 채운다
depends_on: [phase-02-task-11]
files: [src/content/privacy-policy.tsx, tests/content/privacy-policy.test.ts]
architecture: [security.md §3.6, frontend.md §3.12]
acceptance_criteria:
  - 처리방침 문안에 수집 항목·보관 기간·파기 시점·문의처가 모두 들어 있다
  - 문안의 수집 항목 목록이 'database.md §3.3' 의 클라이언트 컬럼 목록과 일치한다(불일치면 테스트가 실패한다)
  - 문안의 파기 시점이 정기 작업의 30일·1년 기준과 일치한다
  - 문안에 데이터 처리 위치(리전)가 명시되어 있다
  - 자리표시자 문자열이 문안에 남아 있으면 테스트가 실패한다
status: blocked
verification: [lint, unit, e2e, task_validation]
blocked_by: [OQ-010, CF-006]
---

# phase-06-task-12 — 개인정보 처리방침 문안

## Goal
수집 항목·보관 기간·파기 시점·문의처를 실제 저장 위치와 일치하게 처리방침 문안으로 채운다.

## Context
이 태스크는 **막혀 있다.** `security.md §3.6` 이 "PRD OQ-010 미해소 — 국내 저장이 강제가 아니라고 판명되면 NFR-015가 삭제되고 이 절의 처리 위치 제약과 처리방침 문구를 함께 고친다"고 적었다. 처리방침이 사실과 다르면 법적 문제가 되므로 저장 위치가 정해지기 전에 문안을 쓰지 않는다. 화면과 접근 경로는 phase-02-task-11 이 이미 만들어 두었다.

**무엇이 정해지면 풀리는가**: PRD OQ-010(개인정보 국내 저장이 법적으로 강제되는가)에 답이 오고 TD-016의 호스팅 리전이 확정되면 풀린다.

## PRD 근거
- FR-024: 처리방침에 수집 항목, 보관 기간, 파기 시점, 문의처가 명시되어 있다
- NFR-015: 클라이언트 개인정보를 국외로 이전하지 않는다 — OQ-010 확인 전까지의 잠정 제약

## TRD 근거
- TD-016 (잠정, PRD OQ-010 대기)
- TD-005 (확정)

## Architecture
- `security.md §3.6`
- `frontend.md §3.12`

## Scope
### In Scope
- 처리방침 문안
- 수집 항목 일치 검사
### Out of Scope
- 처리방침 화면과 링크 — phase-02-task-11 (완료 대상)

## Acceptance Criteria
1. 처리방침 문안에 수집 항목·보관 기간·파기 시점·문의처가 모두 들어 있다
2. 문안의 수집 항목 목록이 `database.md §3.3` 의 클라이언트 컬럼 목록과 일치한다(불일치면 테스트가 실패한다)
3. 문안의 파기 시점이 정기 작업의 30일·1년 기준과 일치한다
4. 문안에 데이터 처리 위치(리전)가 명시되어 있다
5. 자리표시자 문자열이 문안에 남아 있으면 테스트가 실패한다

## Dependencies
- phase-02-task-11

## Files
- `src/content/privacy-policy.tsx` — 새로 만든다
- `tests/content/privacy-policy.test.ts` — 새로 만든다

> **파일이 하나가 아닌 이유**: 문안과 그 문안이 실제 컬럼 목록과 맞는지 검사하는 테스트가 함께 있어야 '사실과 일치한다'가 관찰된다.

## 바뀔 수 있는 지점
OQ-010이 '국내 저장 강제 아님'으로 오면 NFR-015가 삭제되고 처리 위치 문구가 바뀐다.
