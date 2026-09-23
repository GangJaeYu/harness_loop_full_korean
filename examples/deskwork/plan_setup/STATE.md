# Current Status
* **Current Phase:** 1
* **Current Task:** (병렬 — 도는 태스크의 원본은 아래 `Assignments`. 첫 태스크 phase-01-task-01)

---

# Phase Overview
* **01-foundation:** pending
* **02-authentication:** pending
* **03-clients-and-projects:** pending
* **04-invoicing:** pending
* **05-dashboard-search-and-retention:** pending
* **06-contracts-and-sharing:** pending

---

# Task Status
* **phase-01-task-01:** pending
* **phase-01-task-02:** pending
* **phase-01-task-03:** pending
* **phase-01-task-04:** pending
* **phase-01-task-05:** pending
* **phase-01-task-06:** pending
* **phase-01-task-07:** pending
* **phase-01-task-08:** pending
* **phase-01-task-09:** pending
* **phase-01-task-10:** pending

---

# Last Verification
(병렬 — 태스크별 한 줄 `* **<ID>:** <결과> / <사유>`. 코디네이터만 쓴다. 완료 시 `PASS / —` 로 덮어쓴다)
* (없음)

---

# Retry
(병렬 — 태스크별 블록. 태스크가 완료되거나 건너뛰어지면 그 블록을 지운다. `Cycle` 은 진짜 결함만 센다)
* (없음)

<!-- 블록 형식
## phase-NN-task-MM
* **Cycle:** 0 / 3
* **Gate:** —
* **Classification:** —
* **History:**
  * 1) <게이트> <검사 ID> / <분류> / <무엇을 했나>
-->

---

# Standing Decisions
* **미활성 lint 로 완료 허용:** phase-01-task-01 완료(lint 활성 시점)까지 (2026-09-23 승인, loop-setup 세팅 질문)
* **미활성 unit 로 완료 허용:** phase-01-task-01 완료(unit 활성 시점)까지 (2026-09-23 승인)
* **unit 의 통합 테스트(실제 DB) 부분 미활성 허용:** phase-01-task-02 완료(통합 테스트 활성 시점)까지 — 그 사이 unit 은 부분 활성 (2026-09-23 승인)
* **미활성 e2e 로 완료 허용:** phase-02-task-07 완료(e2e 활성 시점)까지 (2026-09-23 승인)
* **미활성 task_validation 로 완료 허용:** phase-01-task-01 완료(HARNESS.md 1절 표의 활성 시점)까지 (2026-09-23 승인)

---

# Assignments
동시: 0 / 상한 3 · 워크트리: coordinator
| 태스크 | 워커 | 토막 | 시작 |
|---|---|---|---|
| (없음) | | | |

---

# Next Action
* 차단 12건이 phase-06 전체를 세우고 있다. OQ-001·OQ-007·OQ-009·OQ-010을 먼저 해소하는 것을 권한다.
* phase-01-task-01 부터 시작한다 — 루프는 loop_setup/LOOP.md 를 따른다(구동: 오르카 터미널에서 node harness_setup/scripts/loop-drive.mjs).
* 알림(사람, ~첫 구동 전): pwsh(PowerShell 7) 설치 또는 harness-update 로 local-dev 명령 교체 (LOOP.md 9절 OQ-026)
* 알림(사람, ~첫 구동 전): 코디네이터 트리 .env.local 의 비밀값(DATABASE_URL·POSTGRES_PASSWORD·SESSION_SECRET·JOB_SHARED_SECRET·MAIL_FROM) 채우기, 오르카 스모크 테스트(loop-drive.mjs --smoke)
