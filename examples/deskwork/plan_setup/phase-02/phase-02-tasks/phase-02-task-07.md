---
id: phase-02-task-07
phase: "02"
title: 로그인·가입 화면과 인라인 오류 표시
priority: P0
goal: 서버 오류 응답의 `fields[].field` 를 입력란 `name` 에 붙여 인라인 오류를 띄우는 폼 화면을 만든다
depends_on: [phase-02-task-05, phase-02-task-06, phase-01-task-03]
files: [src/app/(public)/login/page.tsx, src/app/(public)/signup/page.tsx, src/lib/api-client.ts, tests/e2e/auth-forms.spec.ts]
architecture: [frontend.md §3.1, frontend.md §3.7, frontend.md §3.5]
acceptance_criteria:
  - 가입 화면에서 비밀번호 7자로 제출하면 그 입력란 아래에 사유가 표시된다
  - 화면 검증을 우회해 서버에서 온 응답으로도 같은 입력란에 메시지가 표시된다
  - 잘못된 비밀번호로 로그인하면 이메일·비밀번호 어느 쪽이 틀렸는지 화면에서 알 수 없다
  - 컴포넌트 파일에서 직접 'fetch(' 를 호출한 곳이 0건이다
  - 가입 화면에 처리방침 링크가 있고 동의 체크 없이 제출하면 진행되지 않는다
status: pending
verification: [lint, unit, e2e, task_validation]
blocked_by: []
---

# phase-02-task-07 — 로그인·가입 화면과 인라인 오류 표시

## Goal
서버 오류 응답의 `fields[].field` 를 입력란 `name` 에 붙여 인라인 오류를 띄우는 폼 화면을 만든다.

## Context
서버 쪽 가입·로그인이 끝났다. 이 태스크가 화면과 오류 표시 규약(필드명 일치)을 처음으로 세우고, 이후 모든 폼 화면이 이 규약을 따른다.

## PRD 근거
- FR-001: 이메일과 비밀번호를 입력해 가입하면 ... 대시보드가 열린다
- FR-024: 가입 화면에서 개인정보 처리방침 문서로 이동하는 링크가 표시되고, 동의하지 않으면 가입이 진행되지 않는다

## TRD 근거
- TD-002 (확정) — 서버 렌더
- TD-008 (확정) — 화면이 오류 형식을 그대로 쓴다

## Architecture
- `frontend.md §3.1`
- `frontend.md §3.7`
- `frontend.md §3.5`

## Scope
### In Scope
- 로그인·가입 화면
- 모듈별 API 클라이언트 함수의 첫 형태
- 오류 필드명 → 입력란 매핑
### Out of Scope
- 처리방침 화면 자체 — phase-02-task-11
- 재설정 화면 — phase-02-task-10

## Acceptance Criteria
1. 가입 화면에서 비밀번호 7자로 제출하면 그 입력란 아래에 사유가 표시된다
2. 화면 검증을 우회해 서버에서 온 응답으로도 같은 입력란에 메시지가 표시된다
3. 잘못된 비밀번호로 로그인하면 이메일·비밀번호 어느 쪽이 틀렸는지 화면에서 알 수 없다
4. 컴포넌트 파일에서 직접 `fetch(` 를 호출한 곳이 0건이다
5. 가입 화면에 처리방침 링크가 있고 동의 체크 없이 제출하면 진행되지 않는다

## Dependencies
- phase-02-task-05
- phase-02-task-06
- phase-01-task-03

## Files
- `src/app/(public)/login/page.tsx` — 새로 만든다
- `src/app/(public)/signup/page.tsx` — 새로 만든다
- `src/lib/api-client.ts` — 새로 만든다
- `tests/e2e/auth-forms.spec.ts` — 새로 만든다

> **파일이 하나가 아닌 이유**: 오류 표시 규약이 화면과 API 클라이언트에 걸쳐 있어서, 셋 중 하나만 만들면 '입력란에 메시지가 붙는다'를 관찰할 수 없다.

## 바뀔 수 있는 지점
없음
