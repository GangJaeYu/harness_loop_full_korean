# Codex 환경 보조 지침 (bug-fix)

## 진입 조건 확인

`grep -n in_progress plan_setup/STATE.md`, `head -10 docs/PRD.md`(as-is 표기), `grep -n "활성" harness_setup/HARNESS.md | head`, `git status --porcelain`. 걸리면 선택지 없이 사실과 갈 곳을 알리고 멈춘다.

## 버그/요구 변경 판정의 질문

as-is 기준에 걸린 OQ 의 답을 모르면 평문 번호 목록으로 묻는다.

```
FR-00x 의 as-is 기준 n("…")에 OQ-0xx(의도 여부)가 걸려 있습니다. 이 동작이 의도였습니까?
1. 의도가 아니었다 (버그로 고칩니다)
2. 의도였다 (바꾸려면 feature-add 로 요구 변경)
3. 모른다 (코드가 드러낸 의도 — <파라미터·문구> — 로 판정합니다, 가정으로 기록)
```

질문 2(새 결정이 필요한가)는 묻지 않고 판정해 보고한다.

## 재현과 게이트 실행

앱은 `harness_setup/scripts/local-dev.*` 로 띄우고 종료 코드를 그대로 읽는다. 포트를 쓰는 남의 프로세스를 `kill`·`taskkill` 하지 않는다.
재현은 `curl` 또는 `node -e`. 앱을 못 띄우면 결함이 있는 식을 그 입력값으로 `node -e` 에서 돌려 "코드 단위" 로 적는다.
고치기 전에 게이트 명령을 돌려 회귀 검사의 실패(fail 수·메시지)를 확인한다.

## 분리 검증

`LOOP.md` 구동기대로 — 기본은 `codex exec "<6단계 지시문>"`(또는 LOOP.md 가 적은 CLI)을 읽기 전용 샌드박스로. 같은 세션에서 판정하지 않는다. 지시문에는 LOG.md 경로 대신 재현 줄의 문장을 넣는다.

## 다음 스킬 연결

스킬 자동 호출을 기대하지 말고 harness-update 를 명시적으로 진행한다 — `skills/harness-update/SKILL.md` 를 읽고 SKILL.md 4단계의 호출 지시(BUG-NN·파일·케이스를 채운 것)를 자기에게 적용한다. 끝나면 bug-fix 5단계로 돌아온다.
feature-add 로 돌릴 때는 판정과 넘길 요청 문장만 남기고 끝낸다.

## 파일 작성

`LOG.md` 는 `cat >> plan_setup/LOG.md <<'EOF'` 로 **덧붙인다.** 통째로 다시 쓰지 않는다.
커밋은 바뀐 파일 경로만 `git add` 한 뒤 `git commit -m "BUG-NN: <제목>"`. 승인 모드에 따라 쓰기·커밋 권한 요청이 필요할 수 있으니 직전에 경로를 알린다.
