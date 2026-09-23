---
id: phase-01-task-10
phase: "01"
title: 스파이크 — 트랜잭션 메일 도달 확인 (OQ-011)
priority: P1
goal: 주요 메일 서비스 3곳에 테스트 메일을 보내 스팸으로 분류되는지 확인하고 판정을 남긴다
depends_on: [phase-01-task-07]
files: [scripts/spike-mail.ts, spikes/oq-011-mail.md]
architecture: [backend.md §3.12]
acceptance_criteria:
  - 메일 서비스 3곳으로 발송한 결과(수신함/스팸/미도달)가 결과 문서에 서비스별로 기록된다
  - 발신 도메인 인증 설정의 적용 여부가 기록된다
  - 3곳 중 한 곳이라도 스팸으로 분류되면 결과 문서가 그 사실을 실패로 명시하고 FR-017을 P2로 내릴지 사용자에게 물어야 한다고 적는다
  - 결과 문서에 어느 제공자로 측정했는지가 적혀 있다
status: pending
verification: [lint, unit, e2e, task_validation]
blocked_by: []
---

# phase-01-task-10 — 스파이크 — 트랜잭션 메일 도달 확인 (OQ-011)

## Goal
주요 메일 서비스 3곳에 테스트 메일을 보내 스팸으로 분류되는지 확인하고 판정을 남긴다.

## Context
PRD 8절이 OQ-011의 해소 방법으로 '스파이크를 Layer 3에서 검증 태스크로 생성'을 지목했다. 그래서 FR-002·FR-017을 blocked 로 두지 않고 이 태스크를 먼저 둔다.

## PRD 근거
- OQ-011(PRD 8절): 서비스가 보낸 메일이 실제로 수신함에 도착하는가 — 스파이크. **Layer 3에서 검증 태스크로 생성**
- FR-002: 가입된 이메일을 입력하면 재설정 링크가 담긴 메일이 발송된다
- FR-017: 인보이스 공유 링크가 담긴 메일 발송

## TRD 근거
- TD-009 (잠정, PRD OQ-011·OQ-010 대기) — 외부 연동은 트랜잭션 메일 발송 서비스 1개

## Architecture
- `backend.md §3.12`

## Scope
### In Scope
- 발송 스크립트와 도달 결과 기록
### Out of Scope
- 메일 어댑터 인터페이스 — phase-02-task-09
- 실제 재설정 흐름 — phase-02-task-10

## Acceptance Criteria
1. 메일 서비스 3곳으로 발송한 결과(수신함/스팸/미도달)가 결과 문서에 서비스별로 기록된다
2. 발신 도메인 인증 설정의 적용 여부가 기록된다
3. 3곳 중 한 곳이라도 스팸으로 분류되면 결과 문서가 그 사실을 실패로 명시하고 FR-017을 P2로 내릴지 사용자에게 물어야 한다고 적는다
4. 결과 문서에 어느 제공자로 측정했는지가 적혀 있다

## Dependencies
- phase-01-task-07

## Files
- `scripts/spike-mail.ts` — 새로 만든다
- `spikes/oq-011-mail.md` — 새로 만든다(측정 결과)

> **파일이 하나가 아닌 이유**: 발송 스크립트와 결과 기록이 함께 있어야 판정이 남는다.

## 바뀔 수 있는 지점
TD-009 가 잠정이다. 이 스파이크 결과로 제공자가 바뀌면 phase-02-task-09 의 구현체만 교체한다(인터페이스는 유지).
