# Deskwork (가칭)

> harness-loop-fullstack 스킬이 만들고 갱신하는 파일이다. 각 절은 그 레이어의 스킬만 고친다.
> `CLAUDE.md` 와 `AGENTS.md` 는 같은 내용이다. 한쪽을 손으로 고치면 다른 쪽도 같이 고친다.
> 세부 규칙은 각 문서에 있다 — 여기에는 어느 세션에서든 반드시 지킬 것만 둔다. 200줄을 넘기지 않는다.

## 문서 지도
- `docs/IDEA.md` → `docs/PRD.md` → `docs/TRD.md` → `docs/ARCHITECTURE/` → `plan_setup/` → `harness_setup/` → `loop_setup/LOOP.md`
- 뒤 문서는 앞 문서를 근거로 한다. 충돌하면 앞 문서가 이기고, 앞 문서를 고치려면 그 레이어의 스킬을 다시 부른다
- 현재 단계: loop-setup → 다음: 첫 사이클(`phase-01-task-01`, `loop_setup/LOOP.md` 가 안내)

## 공통 규칙
- 앞 레이어의 **파일**만 입력이다. 대화 기억이나 추측으로 요구사항·기술 결정을 만들지 않는다
- ID(`FR-`·`NFR-`·`US-`·`OQ-`·`TD-`·`phase-NN-task-MM`)는 참조만 한다. 새 ID 는 그 레이어의 스킬만 만든다
- 사용자가 말하지 않은 값은 `(가정)` 으로 표시한다. 모호하면 추측하지 말고 묻는다
- 요청된 범위를 조용히 넓히거나 줄이지 않는다. 범위 판단은 보고한다

## 루프 (loop_setup/LOOP.md)
- 세션을 열면 `loop_setup/LOOP.md` 0절부터 따른다. 이 절은 요약이 아니다 — LOOP.md 가 규칙이다. **단 검증 토막(task_validation)은 받은 지시문만 따르고 LOOP.md·STATE.md·LOG.md 를 읽지 않는다**
- 완료는 네 게이트를 통과한 뒤다. 코드가 끝난 것은 완료가 아니다
- 실패→수정→재검증은 3회까지. 소진하면 STATE.md `Next Action` 에 `질문:` 을 적고 멈춘다
- 커밋은 네 게이트 통과 뒤. 시점과 횟수는 LOOP.md 5절. 검증 세션은 STATE.md·LOG.md 를 쓰지 않는다
- 병렬이면 자기 슬롯 워크트리 밖을 고치지 않고, 워커는 STATE.md·LOG.md·태스크 문서·하네스 문서를 쓰지 않는다(출력 블록으로 넘긴다). merge 는 코디네이터 몫. `main` 에서는 아무도 작업하지 않는다
- 구동: 오르카(② loop-drive.mjs) · 동시 3 · 격리 1(슬롯별 .env.local) · 모델 코디 opus / 구현 sonnet / 검증 sonnet ← loop-update 가 갱신
