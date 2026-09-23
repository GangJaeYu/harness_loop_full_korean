---
id: phase-01-task-07
phase: "01"
title: 비밀값 주입과 기동 검사
priority: P0
goal: 네 종류의 비밀값을 환경변수로만 받고, 하나라도 없으면 요청을 받기 전에 기동에 실패하게 한다
depends_on: [phase-01-task-01]
files: [src/lib/env.ts, .env.example, src/lib/env.test.ts]
architecture: [security.md §3.3]
acceptance_criteria:
  - 필수 비밀값 하나를 비우고 서버를 띄우면 요청을 받기 전에 기동이 실패하고 어느 키가 없는지 표준 오류에 나온다
  - '.env.example' 에 값이 채워진 줄이 0개다(키 이름만 있다)
  - 저장소 전체 검색에서 실제 비밀값 문자열이 발견되지 않는다
  - 비밀값을 읽는 경로가 이 모듈 밖에 0건이다
status: pending
verification: [lint, unit, e2e, task_validation]
blocked_by: []
---

# phase-01-task-07 — 비밀값 주입과 기동 검사

## Goal
네 종류의 비밀값을 환경변수로만 받고, 하나라도 없으면 요청을 받기 전에 기동에 실패하게 한다.

## Context
DB 접속 정보·메일 제공자 키·세션 서명 키·정기 작업 호출 비밀값 네 가지가 이후 태스크에서 필요해진다. 그 통로를 먼저 하나로 만든다.

## PRD 근거
- NFR-006: 비밀번호는 평문으로 저장·전송되지 않는다

## TRD 근거
- TD-013 (확정) — 비밀값은 환경·시크릿으로만 주입
- TD-018 (확정) — 예시 환경변수 파일

## Architecture
- `security.md §3.3`

## Scope
### In Scope
- 환경변수 읽기와 기동 시점 검사
- `.env.example` 키 목록
### Out of Scope
- 호스팅 시크릿 저장소 설정 — 운영(TD-016, OQ-013)
- TLS 리다이렉트 설정 — 호스팅

## Acceptance Criteria
1. 필수 비밀값 하나를 비우고 서버를 띄우면 요청을 받기 전에 기동이 실패하고 어느 키가 없는지 표준 오류에 나온다
2. `.env.example` 에 값이 채워진 줄이 0개다(키 이름만 있다)
3. 저장소 전체 검색에서 실제 비밀값 문자열이 발견되지 않는다
4. 비밀값을 읽는 경로가 이 모듈 밖에 0건이다

## Dependencies
- phase-01-task-01

## Files
- `src/lib/env.ts` — 새로 만든다
- `.env.example` — 새로 만든다
- `src/lib/env.test.ts` — 새로 만든다

> **파일이 하나가 아닌 이유**: 예시 파일과 검사 코드가 함께 있어야 '키 이름은 있고 값은 없다'를 검증할 수 있다.

## 바뀔 수 있는 지점
없음
