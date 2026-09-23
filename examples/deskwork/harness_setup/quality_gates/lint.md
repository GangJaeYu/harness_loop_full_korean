# 게이트 1 — lint

## 무엇을 판정하는가

코드가 프로젝트의 **형식·타입·구조 규칙**을 지켰는가, 그리고 의존하는 **남의 코드**에 알려진 결함이 있는가.
동작은 보지 않는다 — 함수가 옳은 값을 내는지는 unit 이, 화면이 이어 붙는지는 e2e 가 본다.

이 게이트에 타입 검사가 들어가는 이유가 하나 더 있다. `backend.md §3.2` 가 소유자 조건을
**함수 시그니처의 첫 인자(`accountId`)** 로 강제하기로 했으므로, 그 조건을 빠뜨린 곳은
런타임이 아니라 타입 검사에서 걸린다. 타입 검사를 빼면 NFR-004 의 강제 수단이 사라진다.

## 명령

```
npm run gate:lint
```

`package.json` 의 `scripts.gate:lint` 는 아래와 정확히 같아야 한다(한 줄, 자동 수정 없음).

```
tsc --noEmit && eslint . --max-warnings=0 && prettier --check . && npm audit --audit-level=high
```

> 게이트가 도구를 직접 부르지 않고 패키지 스크립트를 부르는 이유: 프로젝트가 `npm run lint` 로,
> 게이트가 `eslint .` 로 각각 돌면 두 실행이 다른 설정을 볼 수 있고, 그러면 무엇이 통과한 것인지 알 수 없다.

## 통과 조건

- 종료 코드 0
- `tsc --noEmit` 오류 0건 (`phase-01-task-01` 수용 기준 1)
- ESLint 오류 0건, **경고도 0건** (`--max-warnings=0`) — 경고로 남은 규칙은 아무도 고치지 않는다
- Prettier 형식 위반 0건 (`--check` 는 검사만 한다)
- `npm audit` 에서 `high` 이상 심각도 0건

## 활성 시점

- **`phase-01-task-01` 완료 시부터.** 그전에는 `미활성`
- `phase-01-task-01` 이 `package.json`·`tsconfig.json` 과 계층 테스트를 만든다. 그 전에는 명령을 돌릴 대상이 없다
- **`package.json` 이 없어 명령이 실패하는 것을 `실패` 로 기록하지 않는다. `미활성` 로 기록한다.**
  미활성은 통과가 아니라 "아직 판정하지 않음"이고, 그 상태로 태스크를 완료시킬지는 루프가 아니라 사람이 정한다

## 무엇을 검사하는가

| 검사 | 근거 | 설정 파일 (프로젝트 루트) |
|---|---|---|
| 타입 검사 (`tsc --noEmit`) | TD-001 검증 방법 / `backend.md §3.2` (소유자 조건을 시그니처로 강제) | `tsconfig.json` — `phase-01-task-01` 이 만든다 |
| 정적 검사 (ESLint) | TD-001 ("린터는 이 결정에 따라오는 것") **(하네스 결정: ESLint)** | `eslint.config.mjs` |
| 형식 검사 (Prettier `--check`) | TD-001 ("포매터는 이 결정에 따라오는 것") **(하네스 결정: Prettier)** | `.prettierrc` |
| 계층 의존 방향 — route→service→data, 역방향·건너뛰기 금지 | `overview.md §3`, `backend.md §2`, `backend.md §3.1` | `eslint.config.mjs` 의 import 경계 규칙 |
| 모듈 간 `data` 직접 import 금지 | `backend.md §3.1` 검증 기준 / `phase-01-task-01` 수용 기준 3 | `eslint.config.mjs` |
| 공용 요소(`money`·`errors`·`audit`)가 도메인 모듈을 import 하지 않음 | `backend.md §3.1` / `phase-01-task-01` 수용 기준 4 | `eslint.config.mjs` |
| `route` 파일에 SQL 문자열·DB 클라이언트 호출 없음 | `backend.md §3.1` 검증 기준 / `phase-01-task-01` 수용 기준 2 | `tests/architecture/layering.test.ts` (**unit 게이트에서 실행**) |
| 의존성 취약점 (`npm audit --audit-level=high`) | **(하네스 결정)** — PRD·TRD 에 의존성 심각도 기준이 없다. 임계 `high` 는 하네스가 정한 값이다 | 없음 (레지스트리 조회) |

### 구조 규칙의 오류 메시지

계층 규칙 위반 메시지에는 **고치는 방법을 함께 넣는다.** 예:

```
'src/modules/invoices/route.ts' 는 'src/modules/clients/data.ts' 를 import 할 수 없습니다.
다른 모듈에는 service 를 통해 접근하세요: clients/service.ts (backend.md §3.1)
```

"이 import 는 금지됨"만 나오면 규칙을 우회하는 쪽으로 고치게 되고, 그건 규칙이 막으려던 것
(소유자 조건·삭제 필터를 거치지 않는 경로)을 그대로 통과시킨다.

### 계층 검사가 두 군데로 나뉜 이유

`backend.md §3.1` 의 검증 기준 셋 중 **import 방향 두 개는 ESLint 로, "route 에 SQL 문자열이 없다" 하나는
테스트로** 검사한다. 후자는 문자열 내용 검사라 import 그래프로는 잡히지 않고,
`phase-01-task-01` 이 `tests/architecture/layering.test.ts` 로 이미 만들기로 했다.
같은 것을 두 곳에서 만들지 않기 위해 그 파일은 unit 게이트가 실행한다.

## 범위

**수정한 파일이 아니라 프로젝트 전체를 돈다.** 태스크는 파일 하나의 수정이지만 그 영향은 하나가 아니고,
`tsc --noEmit` 은 다른 파일이 깨진 것을 여기서만 잡는다.

## 전제

없음. 의존 서비스가 떠 있지 않아도 이 게이트는 돈다 (`npm audit` 은 네트워크만 쓴다).
네트워크가 없어 `npm audit` 이 실패하면 그것은 게이트 실패가 아니라 **환경 문제**이고,
`LOG.md` 에 환경 문제로 분류해 남긴다.

## 하지 않는 것

- **자동 수정 0건** — `eslint --fix`, `prettier --write`, `npm audit fix` 를 게이트 안에서 돌리지 않는다.
  게이트가 코드를 고치면 고친 결과를 자기가 검사해 항상 통과한다. 자동 수정은 구현 단계에서 돌린다
- 커버리지·성능·동작 판정 — 각각 unit·e2e 의 몫이다
