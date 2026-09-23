---
id: phase-04-task-09
phase: "04"
title: 헤드리스 렌더 어댑터와 동시 생성 2건 제한
priority: P0
goal: 브라우저 인스턴스를 재사용하고 동시 렌더를 2건으로 제한하는 PDF 어댑터를 만든다
depends_on: [phase-01-task-09, phase-02-task-02]
files: [src/adapters/pdf-renderer.ts, src/adapters/pdf-renderer.test.ts]
architecture: [backend.md §3.10]
acceptance_criteria:
  - PDF 생성 3건을 동시에 요청하면 세 번째가 대기한 뒤 성공한다
  - 동시 렌더 중에도 대시보드 응답이 1.5초를 넘지 않는다
  - 브라우저 인스턴스가 프로세스당 하나만 만들어지고 페이지만 새로 열린다
  - 권한 검사가 통과하지 않은 요청에 대해 렌더가 시작되지 않는다(브라우저 페이지 열림 횟수 0)
  - 어댑터가 도메인 모듈이나 data 계층을 import 하면 계층 테스트가 실패한다
status: pending
verification: [lint, unit, e2e, task_validation]
blocked_by: []
---

# phase-04-task-09 — 헤드리스 렌더 어댑터와 동시 생성 2건 제한

## Goal
브라우저 인스턴스를 재사용하고 동시 렌더를 2건으로 제한하는 PDF 어댑터를 만든다.

## Context
phase-01-task-09 의 스파이크가 실행 가능성과 시간을 판정했다. 이 태스크가 그 결과 위에 실제 어댑터를 세운다. 단일 인스턴스에서 무제한 동시 렌더는 NFR-001을 함께 무너뜨린다.

## PRD 근거
- NFR-002: PDF 생성 완료까지 10초 이내. 3초를 넘으면 진행 표시가 노출된다
- NFR-004: 다른 계정의 PDF 생성 주소에 접근하면 파일이 생성되지 않는다
- NFR-001: 대시보드와 프로젝트 상세의 응답 P95 1.5초 이내

## TRD 근거
- TD-017 (스파이크 필요, OQ-014)
- TD-006 (확정) — PDF를 저장하지 않는다
- TD-012 (확정)

## Architecture
- `backend.md §3.10`

## Scope
### In Scope
- 렌더 어댑터
- 인스턴스 재사용과 동시 2건 제한
- 권한 검사 이후에만 렌더 시작
### Out of Scope
- 인쇄 템플릿 — phase-04-task-10, phase-06-task-07 (차단)
- 한글 폰트를 컨테이너 이미지에 넣는 것 — 배포 구성(TD-017)

## Acceptance Criteria
1. PDF 생성 3건을 동시에 요청하면 세 번째가 대기한 뒤 성공한다
2. 동시 렌더 중에도 대시보드 응답이 1.5초를 넘지 않는다
3. 브라우저 인스턴스가 프로세스당 하나만 만들어지고 페이지만 새로 열린다
4. 권한 검사가 통과하지 않은 요청에 대해 렌더가 시작되지 않는다(브라우저 페이지 열림 횟수 0)
5. 어댑터가 도메인 모듈이나 data 계층을 import 하면 계층 테스트가 실패한다

## Dependencies
- phase-01-task-09
- phase-02-task-02

## Files
- `src/adapters/pdf-renderer.ts` — 새로 만든다
- `src/adapters/pdf-renderer.test.ts` — 새로 만든다

## 바뀔 수 있는 지점
TD-017 이 스파이크 필요 상태다(OQ-014). phase-01-task-09 가 '10초 초과' 또는 '컨테이너 미실행'으로 판정하면 PDF 작성 라이브러리로 교체되며 이 어댑터와 인쇄 템플릿을 다시 그린다.
