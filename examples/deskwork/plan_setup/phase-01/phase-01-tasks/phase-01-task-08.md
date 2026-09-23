---
id: phase-01-task-08
phase: "01"
title: 구조화 로그와 비노출 필드
priority: P0
goal: 요청 로그를 JSON으로 표준 출력에 내보내되 개인정보·비밀값이 로그에 들어가지 못하게 막는다
depends_on: [phase-01-task-07]
files: [src/lib/logger.ts, src/lib/logger.test.ts]
architecture: [security.md §3.4]
acceptance_criteria:
  - 로그 한 줄에 요청 식별자·계정 uuid·경로·메서드·상태 코드·소요 시간·오류 코드가 들어간다
  - 비밀번호·세션 id·토큰 원문을 담아 로그를 부르면 그 값이 출력에서 마스킹되거나 호출이 거부된다
  - 클라이언트 상호·담당자명·이메일·전화·사업자등록번호·주소를 담아 로그를 부르면 출력에 그 값이 없다
  - 검증 실패를 로그에 남기면 필드명은 있고 값은 없다
  - 요청 본문 전체를 통째로 넘기는 호출 형태가 타입 검사에서 막힌다
status: pending
verification: [lint, unit, e2e, task_validation]
blocked_by: []
---

# phase-01-task-08 — 구조화 로그와 비노출 필드

## Goal
요청 로그를 JSON으로 표준 출력에 내보내되 개인정보·비밀값이 로그에 들어가지 못하게 막는다.

## Context
로그는 호스팅의 수집 기능으로 흘러가고 보존 기간이 우리 파기 정책과 무관하게 정해진다. 개인정보를 처음부터 넣지 않는 것이 가장 싸다.

## PRD 근거
- NFR-006: 비밀번호는 평문으로 저장·전송되지 않는다
- NFR-015: 클라이언트 개인정보를 국외로 이전하지 않는다 — 로그 수집처도 포함된다

## TRD 근거
- TD-016 (잠정) — 구조화 JSON 로그를 표준 출력으로
- TRD 9.4절

## Architecture
- `security.md §3.4`

## Scope
### In Scope
- 구조화 로그 함수와 허용 필드 목록
- 금지 필드 마스킹
### Out of Scope
- 감사 이력 — phase-04-task-03 (로그가 아니라 DB다)
- 로그 수집·보존 설정 — 운영(TD-016)

## Acceptance Criteria
1. 로그 한 줄에 요청 식별자·계정 uuid·경로·메서드·상태 코드·소요 시간·오류 코드가 들어간다
2. 비밀번호·세션 id·토큰 원문을 담아 로그를 부르면 그 값이 출력에서 마스킹되거나 호출이 거부된다
3. 클라이언트 상호·담당자명·이메일·전화·사업자등록번호·주소를 담아 로그를 부르면 출력에 그 값이 없다
4. 검증 실패를 로그에 남기면 필드명은 있고 값은 없다
5. 요청 본문 전체를 통째로 넘기는 호출 형태가 타입 검사에서 막힌다

## Dependencies
- phase-01-task-07

## Files
- `src/lib/logger.ts` — 새로 만든다
- `src/lib/logger.test.ts` — 새로 만든다

## 바뀔 수 있는 지점
TD-016 이 잠정(PRD OQ-010·TRD OQ-013)이다. 호스팅이 바뀌어도 이 모듈의 출력 형태는 그대로이고 수집 쪽만 바뀐다.
