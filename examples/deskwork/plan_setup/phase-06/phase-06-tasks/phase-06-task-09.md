---
id: phase-06-task-09
phase: "06"
title: 공유 링크 발급·폐기와 존재 여부 비노출
priority: P0
goal: 링크를 발급·폐기하고 부재·폐기·삭제 세 경우를 같은 응답으로 만든다
depends_on: [phase-06-task-08, phase-04-task-03]
files: [src/modules/sharing/service.ts, src/modules/sharing/service.test.ts]
architecture: [backend.md §3.11, backend.md §3.15]
acceptance_criteria:
  - '공유 링크 만들기'를 부르면 토큰 원문이 한 번만 반환되고 이후 조회로는 얻을 수 없다
  - 초안 인보이스의 공유 링크 발급 요청이 409와 '발송 상태로 바꾼 뒤 공유할 수 있습니다'를 돌려준다
  - 폐기된 토큰, 삭제된 문서의 토큰, 존재하지 않는 토큰 세 경우의 응답 상태 코드와 본문이 동일하다
  - 링크를 폐기한 직후 같은 주소로 열면 무효 안내가 나온다
  - 발급·폐기가 각각 감사 이력 1건을 남긴다
status: blocked
verification: [lint, unit, e2e, task_validation]
blocked_by: [CF-006, OQ-009]
---

# phase-06-task-09 — 공유 링크 발급·폐기와 존재 여부 비노출

## Goal
링크를 발급·폐기하고 부재·폐기·삭제 세 경우를 같은 응답으로 만든다.

## Context
이 태스크는 **막혀 있다.** OQ-009가 공유 화면에서 클라이언트가 무엇까지 할 수 있는지를 정하지 않았고, `backend.md §3.11` 은 "'확인 버튼'이 추가되면 열람자 쓰기 경로가 처음 생기고 이 절과 `security.md §3.1` 의 신뢰 경계를 다시 그린다"고 적었다.

**무엇이 정해지면 풀리는가**: PRD OQ-009에 답이 오면 풀린다.

## PRD 근거
- FR-009: 링크를 폐기하면 같은 주소로 접근했을 때 문서가 표시되지 않는다
- FR-009: 존재하지 않는 링크 주소로 접근하면 404 화면이 표시되고, 문서의 존재 여부를 알 수 있는 정보는 노출되지 않는다
- FR-016: 초안 상태의 인보이스는 공유 링크가 만들어지지 않는다
- NFR-009: 공유 링크 발급·폐기가 기록된다

## TRD 근거
- TD-011 (확정)
- TD-007 (확정)

## Architecture
- `backend.md §3.11`
- `backend.md §3.15`

## Scope
### In Scope
- 발급·폐기 service
- 동일 응답 생성
- 감사 이력 연결
### Out of Scope
- 열람 화면 — phase-06-task-10 (차단)
- 열람 기록 표시 — phase-06-task-11 (차단)

## Acceptance Criteria
1. '공유 링크 만들기'를 부르면 토큰 원문이 한 번만 반환되고 이후 조회로는 얻을 수 없다
2. 초안 인보이스의 공유 링크 발급 요청이 409와 "발송 상태로 바꾼 뒤 공유할 수 있습니다"를 돌려준다
3. 폐기된 토큰, 삭제된 문서의 토큰, 존재하지 않는 토큰 세 경우의 응답 상태 코드와 본문이 동일하다
4. 링크를 폐기한 직후 같은 주소로 열면 무효 안내가 나온다
5. 발급·폐기가 각각 감사 이력 1건을 남긴다

## Dependencies
- phase-06-task-08
- phase-04-task-03

## Files
- `src/modules/sharing/service.ts` — 새로 만든다
- `src/modules/sharing/service.test.ts` — 새로 만든다

## 바뀔 수 있는 지점
없음
