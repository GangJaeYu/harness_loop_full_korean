# Claude Code에서 하네스 준비

현재 Claude Code로 실행할 때만 이 차이를 확인한다.

- 현재 노출된 파일·셸·브라우저·Agent 도구와 권한을 확인한다.
- 셸이 Bash인지 PowerShell인지 확인하고 프로젝트의 기존 실행 명령을 사용한다.
- 브라우저 연결이 없으면 설치된 E2E 도구가 실제 화면을 관찰할 수 있는지 확인한다.
- 제품 task_validation 경로를 준비할 때 현재 Agent 도구 또는 설치된 CLI의 지원 여부를 확인한다.
- CLI를 쓸 때는 `claude --help`로 비대화형 실행·출력·예산·허용 도구 옵션을 확인한다.
- 자식 실행이 필요하면 실제 작업 디렉터리의 `CLAUDE.md`와 하네스 참조를 확인한다.
- 부모의 브라우저 연결·권한이 자식에도 있다고 가정하지 말고 필요한 관찰 경로를 시험한다.
- 현재 권한을 벗어나는 옵션을 켜거나 사용자에게 수동 세션 개설을 넘기지 않는다.

- Claude Agent/CLI의 실제 대화 상속·재개 동작을 확인해 task_validation에는 구현 이력이 없는 실행을 사용한다. Agent `fork`는 부모 대화를 상속하므로 쓰지 않고 `general-purpose` 등 새 Agent나 새 `claude -p`(`--resume`·`--continue` 없이)를 쓴다.
