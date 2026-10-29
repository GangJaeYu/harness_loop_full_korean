# Claude Code에서 루프 실행

현재 실행 환경이 Claude Code일 때만 읽는다.

- 현재 Agent·브라우저·셸 도구와 권한을 확인하고 필요한 수단을 고른다.
- 구현은 같은 세션에서 이어도 되며 제품 task_validation은 본문의 비상속 별도 세션 계약을 적용한다.
- CLI를 쓸 때는 `claude --help`에서 비대화형 실행·출력·모델·예산·허용 도구 옵션을 확인한다.
- 모델·사용량은 기존 합의를 따르며 새 자식도 남은 전체 예산에 포함한다.
- 구현·재개 자식의 작업 폴더와 `CLAUDE.md`, LOOP·STATE 참조를 준다. task_validation에는 본문의 최소 운영 인계만 주고 STATE·LOG 전체는 제외한다.
- 자식의 브라우저 연결과 실행 권한은 실제로 확인한다.
- task_validation 실행은 구현 대화를 상속하지 않는 경로를 확인하고 본문의 최소 인계만 전달한다.
- 백그라운드 실행은 시작 확인과 실제 종료·완전한 결과 확인까지 책임진다.
- 결과가 잘리거나 거부되면 합의 안에서 복구하고 사용자 수동 조작을 요구하지 않는다.

- Claude Agent/CLI의 실제 대화 상속·재개 동작을 확인해 task_validation에는 구현 이력이 없는 실행을 사용한다. Agent `fork`는 부모 대화를 상속하므로 쓰지 않고 `general-purpose` 등 새 Agent나 새 `claude -p`(`--resume`·`--continue` 없이)를 쓴다.
