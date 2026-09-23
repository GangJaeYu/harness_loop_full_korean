---
id: phase-04-task-11
phase: "04"
title: 인보이스 메일 발송
priority: P1
goal: 클라이언트 담당자 이메일로 공유 링크가 담긴 메일을 보내고 실패 시 상태를 그대로 둔다
depends_on: [phase-04-task-08, phase-02-task-09]
files: [src/modules/invoices/mail.ts, src/modules/invoices/mail.test.ts]
architecture: [backend.md §3.12, frontend.md §3.7]
acceptance_criteria:
  - '메일로 보내기'를 누르면 클라이언트 담당자 이메일이 수신자로 채워진 발송 화면이 열린다
  - 발송에 성공하면 인보이스 상세에 발송 시각과 수신자 주소가 기록된다
  - 수신자 이메일이 비어 있거나 형식이 올바르지 않으면 어댑터를 호출하기 전에 400으로 거부된다
  - 어댑터가 예외를 던지도록 강제하면 화면에 사유가 표시되고 인보이스 상태·발송 시각이 그대로다
  - 메일 본문에 PDF가 첨부되지 않고 링크만 담긴다
status: pending
verification: [lint, unit, e2e, task_validation]
blocked_by: []
---

# phase-04-task-11 — 인보이스 메일 발송

## Goal
클라이언트 담당자 이메일로 공유 링크가 담긴 메일을 보내고 실패 시 상태를 그대로 둔다.

## Context
메일 본문이 담을 공유 링크는 phase-06-task-09(차단)가 만든다. 그때까지 이 태스크는 인보이스 상세 주소만 담아 발송 경로와 실패 처리를 완성한다 — 링크 치환은 공유 링크 태스크가 해소되면 한 줄이다.

## PRD 근거
- FR-017: 발송에 실패하면 실패 사실과 사유가 화면에 표시되고 인보이스 상태는 바뀌지 않는다
- NFR-015: 개인정보가 외부로 나가는 경로를 늘리지 않는다

## TRD 근거
- TD-009 (잠정) — 메일 어댑터
- TD-006 (확정) — 파일을 만들지 않는다

## Architecture
- `backend.md §3.12`
- `frontend.md §3.7`

## Scope
### In Scope
- 발송 service·route
- 수신자 검증
- 실패 시 상태 불변
### Out of Scope
- 공유 링크 발급 — phase-06-task-09 (차단)
- 메일 제공자 확정 — PRD OQ-011

## Acceptance Criteria
1. '메일로 보내기'를 누르면 클라이언트 담당자 이메일이 수신자로 채워진 발송 화면이 열린다
2. 발송에 성공하면 인보이스 상세에 발송 시각과 수신자 주소가 기록된다
3. 수신자 이메일이 비어 있거나 형식이 올바르지 않으면 어댑터를 호출하기 전에 400으로 거부된다
4. 어댑터가 예외를 던지도록 강제하면 화면에 사유가 표시되고 인보이스 상태·발송 시각이 그대로다
5. 메일 본문에 PDF가 첨부되지 않고 링크만 담긴다

## Dependencies
- phase-04-task-08
- phase-02-task-09

## Files
- `src/modules/invoices/mail.ts` — 새로 만든다
- `src/modules/invoices/mail.test.ts` — 새로 만든다

## 바뀔 수 있는 지점
PRD OQ-011 미해소. phase-01-task-10 의 스파이크가 '도달 실패'로 판정되면 FR-017을 P2로 내리고 링크 복사만 남기게 되며 이 태스크는 폐기 대상이다. 또한 공유 링크(phase-06-task-09)가 차단 해소될 때까지 메일 본문의 링크는 인보이스 상세 주소다.
