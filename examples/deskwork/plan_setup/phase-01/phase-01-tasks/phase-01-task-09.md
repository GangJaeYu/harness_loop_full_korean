---
id: phase-01-task-09
phase: "01"
title: 스파이크 — 헤드리스 Chromium PDF 생성 시간 측정 (OQ-014)
priority: P0
goal: 조항 30개·항목 20개 규모의 인쇄 HTML을 헤드리스 Chromium으로 렌더해 생성 시간을 재고 컨테이너에서 실행되는지 판정한다
depends_on: [phase-01-task-01]
files: [scripts/spike-pdf.ts, spikes/oq-014-pdf.md]
architecture: [backend.md §3.10]
acceptance_criteria:
  - 조항 30개 규모 문서와 항목 20개 규모 문서의 PDF 생성 시간을 각 5회 측정한 값이 결과 문서에 기록된다
  - 두 중앙값이 10초 이내인지 아닌지가 결과 문서에 '판정' 한 줄로 적힌다
  - 컨테이너 이미지 안에서 같은 스크립트를 돌린 결과(성공/실패)가 기록된다
  - 중앙값이 10초를 넘거나 컨테이너에서 실행되지 않으면 결과 문서가 그 사실을 실패로 명시하고 TD-017 대안(PDF 작성 라이브러리) 검토가 필요하다고 적는다
status: pending
verification: [lint, unit, e2e, task_validation]
blocked_by: []
---

# phase-01-task-09 — 스파이크 — 헤드리스 Chromium PDF 생성 시간 측정 (OQ-014)

## Goal
조항 30개·항목 20개 규모의 인쇄 HTML을 헤드리스 Chromium으로 렌더해 생성 시간을 재고 컨테이너에서 실행되는지 판정한다.

## Context
TRD 11절이 이 스파이크를 'Layer 3 첫 phase에 배치'하라고 지목했다. 이 결과가 나쁘면 인보이스 PDF와 계약서 PDF의 설계가 함께 바뀐다.

## PRD 근거
- NFR-002: 조항 30개 계약서, 항목 20개 인보이스 기준 PDF 생성 완료까지 10초 이내

## TRD 근거
- TD-017 (스파이크 필요, OQ-014) — PDF는 서버의 헤드리스 Chromium이 HTML을 렌더해 생성

## Architecture
- `backend.md §3.10`

## Scope
### In Scope
- 측정 스크립트와 결과 기록
### Out of Scope
- 실제 인쇄 템플릿 — phase-04-task-10
- 동시 생성 제한 — phase-04-task-09

## Acceptance Criteria
1. 조항 30개 규모 문서와 항목 20개 규모 문서의 PDF 생성 시간을 각 5회 측정한 값이 결과 문서에 기록된다
2. 두 중앙값이 10초 이내인지 아닌지가 결과 문서에 '판정' 한 줄로 적힌다
3. 컨테이너 이미지 안에서 같은 스크립트를 돌린 결과(성공/실패)가 기록된다
4. 중앙값이 10초를 넘거나 컨테이너에서 실행되지 않으면 결과 문서가 그 사실을 실패로 명시하고 TD-017 대안(PDF 작성 라이브러리) 검토가 필요하다고 적는다

## Dependencies
- phase-01-task-01

## Files
- `scripts/spike-pdf.ts` — 새로 만든다
- `spikes/oq-014-pdf.md` — 새로 만든다(측정 결과)

> **파일이 하나가 아닌 이유**: 측정 스크립트와 그 결과 기록은 함께 있어야 판정이 남는다.

## 바뀔 수 있는 지점
TD-017 자체가 '스파이크 필요' 상태다. 이 태스크의 결과가 TD-017을 확정하거나 뒤집는다.
