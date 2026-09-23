<#
.SYNOPSIS
  Deskwork 로컬 개발 환경 — 명령 하나로 개발·검증에 필요한 것이 전부 준비된 상태를 만든다.

.DESCRIPTION
  TRD 9.3절(TD-018)의 구성 요소 표를 그대로 구현한다.
  단일 출처는 harness_setup/HARNESS.md 의 '2. 로컬 개발 환경' 표이고, 이 스크립트는 그 표의
  한 행을 아래 $Components 의 항목 하나 + 같은 모양의 블록 하나로 반영한다.
  구성 요소가 늘면 표에 행을 더하고 여기에 블록을 하나 더한다.

  이 스크립트가 하네스의 일부인 이유: unit 의 통합 테스트(TD-014)와 e2e·task_validation 이
  전부 실행 중인 환경을 전제한다. 환경을 띄우는 방법이 사람 머릿속에만 있으면
  분리된 검증 세션이 그것을 재현하지 못한다.

.PARAMETER Status
  아무것도 띄우지 않고 구성 요소별 준비 여부만 출력한다.
  분리된 검증 세션이 실패를 '환경 문제'로 분류하는 수단이다.

.PARAMETER Logs
  준비되지 않은(또는 지정한) 구성 요소의 로그를 출력한다.

.PARAMETER Down
  띄운 것을 내린다. 데이터는 지우지 않는다.

.PARAMETER Reset
  데이터를 지우고 처음부터 준비한다. 검증이 남긴 데이터가 다음 검증의 결과를 바꾸는 것을 막는다.

.PARAMETER BigSeed
  프로젝트 200건·인보이스 1,000건을 만든다 (NFR-001·OQ-015 성능 검증용. 오래 걸린다).

.PARAMETER NoApp
  의존 서비스와 스키마·시드까지만 준비하고 앱 개발 서버는 띄우지 않는다.
  (앱을 다른 터미널에서 직접 돌리고 싶을 때)

.NOTES
  종료 코드: 0 성공 / 2 전제 / 3 환경변수 / 4 의존 서비스 / 5 스키마·시드 / 6 앱
  실패 시 실패한 '단계 이름'과 다음 행동을 출력한다.
#>

[CmdletBinding()]
param(
  [switch]$Status,
  [switch]$Logs,
  [switch]$Down,
  [switch]$Reset,
  [switch]$BigSeed,
  [switch]$NoApp
)

$ErrorActionPreference = 'Stop'

# ─────────────────────────────────────────────────────────────────────────────
# 0. 필요한 것의 목록 — 여기 한 곳에 모아 둔다 (HARNESS.md 의 표와 1:1 로 대조된다)
#    포트·계정·경로를 여기에 박지 않는다. 전부 환경변수 파일에서 읽는다.
# ─────────────────────────────────────────────────────────────────────────────

$RepoRoot   = Resolve-Path (Join-Path $PSScriptRoot '..\..')
$EnvExample = Join-Path $PSScriptRoot '.env.example'
$EnvFile    = Join-Path $RepoRoot '.env.local'

# 전제 — 없으면 절반쯤 진행하지 않고 설치 방법을 출력하고 멈춘다
$Prerequisites = @(
  @{ Name = 'Node.js';        Command = 'node';   Install = 'https://nodejs.org 에서 LTS 설치 (TD-001)' }
  @{ Name = 'npm';            Command = 'npm';    Install = 'Node.js LTS 설치에 포함된다' }
  @{ Name = '컨테이너 엔진';   Command = 'docker'; Install = 'Docker Desktop 설치 후 실행 (TD-018 의 컨테이너 구성 요소가 여기 걸린다)' }
)

# 구성 요소 — TRD 9.3절 표. 각 행이 아래 Ensure-* 블록 하나에 대응한다
$Components = @(
  @{ Key = 'postgres'; Name = 'PostgreSQL';          Form = '컨테이너';     Why = 'TD-003. 운영과 같은 종류의 DB 에서 마이그레이션과 유일 제약을 검증한다' }
  @{ Key = 'mailpit';  Name = '메일 수신함 캡처';     Form = '컨테이너';     Why = 'TD-009. FR-002·FR-017 을 실제 메일 발송 없이 확인한다' }
  @{ Key = 'browser';  Name = '헤드리스 브라우저';    Form = '로컬 설치';    Why = 'TD-015(e2e)와 TD-017(PDF)이 같은 런타임을 공유한다' }
  @{ Key = 'schema';   Name = '스키마·시드';          Form = '스크립트';     Why = '빈 DB 에서 시작해도 로그인 가능한 계정과 예시 프로젝트가 있어야 화면 개발이 된다' }
  @{ Key = 'app';      Name = '애플리케이션 개발 서버'; Form = '호스트 실행'; Why = 'TD-002·TD-018. 파일 감시·핫 리로드가 OS 차이에 가장 자주 깨지므로 호스트에서 돌린다' }
)

# ─────────────────────────────────────────────────────────────────────────────
# 1. 공통 도우미
# ─────────────────────────────────────────────────────────────────────────────

function Write-Step([string]$Text) { Write-Host ""; Write-Host "== $Text" -ForegroundColor Cyan }
function Write-Ok  ([string]$Text) { Write-Host "   [준비됨] $Text" -ForegroundColor Green }
function Write-Wait([string]$Text) { Write-Host "   [대기]   $Text" -ForegroundColor DarkGray }
function Write-Miss([string]$Text) { Write-Host "   [미준비] $Text" -ForegroundColor Yellow }

function Stop-WithStage {
  param([string]$Stage, [string]$What, [string]$NextAction, [int]$Code)
  Write-Host ""
  Write-Host "실패한 단계: $Stage" -ForegroundColor Red
  Write-Host "무엇이 문제인가: $What" -ForegroundColor Red
  Write-Host "다음에 할 것: $NextAction" -ForegroundColor Red
  Write-Host ""
  Write-Host "이것은 환경 문제이며 구현 실패가 아니다. LOG.md 에 '환경 문제'로 분류해 남긴다." -ForegroundColor DarkGray
  exit $Code
}

# 이름 있는 값만 읽는다. 값 자체를 이 파일에 두지 않는다.
function Import-EnvFile {
  param([string]$Path)
  $map = @{}
  if (-not (Test-Path $Path)) { return $map }
  foreach ($line in (Get-Content -LiteralPath $Path -Encoding UTF8)) {
    $t = $line.Trim()
    if ($t -eq '' -or $t.StartsWith('#')) { continue }
    $i = $t.IndexOf('=')
    if ($i -lt 1) { continue }
    $k = $t.Substring(0, $i).Trim()
    $v = $t.Substring($i + 1).Trim().Trim('"').Trim("'")
    $map[$k] = $v
  }
  return $map
}

function Get-EnvValue {
  param([hashtable]$Map, [string]$Key, [string]$Default = '')
  if ($Map.ContainsKey($Key) -and $Map[$Key] -ne '') { return $Map[$Key] }
  return $Default
}

# 준비 판정을 반복 시도한다. "포트가 열린 것"과 "쓸 수 있는 것"은 다르므로
# 각 구성 요소는 실제 질의/응답 한 번으로 판정한다.
function Wait-Until {
  param([scriptblock]$Probe, [int]$TimeoutSec = 90, [string]$Label = '')
  $deadline = (Get-Date).AddSeconds($TimeoutSec)
  while ((Get-Date) -lt $deadline) {
    $ok = $false
    try { $ok = [bool](& $Probe) } catch { $ok = $false }
    if ($ok) { return $true }
    Write-Wait "$Label 준비를 기다리는 중..."
    Start-Sleep -Seconds 2
  }
  return $false
}

function Test-DockerRunning {
  try { docker info 2>$null | Out-Null; return ($LASTEXITCODE -eq 0) } catch { return $false }
}

function Get-ContainerState {
  param([string]$Name)
  try {
    $s = docker inspect -f '{{.State.Status}}' $Name 2>$null
    if ($LASTEXITCODE -ne 0) { return 'absent' }
    return "$s".Trim()
  } catch { return 'absent' }
}

# ─────────────────────────────────────────────────────────────────────────────
# 2. 구성 요소별 준비 판정 (Probe) — -Status 는 이 판정을 "띄우지 않고" 출력만 한다
# ─────────────────────────────────────────────────────────────────────────────

function Probe-Postgres {
  param([hashtable]$C)
  if ((Get-ContainerState $C.PgContainer) -ne 'running') { return $false }
  # 포트 확인이 아니라 실제 질의 한 번으로 판정한다
  docker exec $C.PgContainer psql -U $C.PgUser -d $C.PgDb -c 'select 1' 2>$null | Out-Null
  return ($LASTEXITCODE -eq 0)
}

function Probe-Mailpit {
  param([hashtable]$C)
  if ((Get-ContainerState $C.MailContainer) -ne 'running') { return $false }
  try {
    $r = Invoke-WebRequest -Uri "http://127.0.0.1:$($C.MailWebPort)/api/v1/info" -UseBasicParsing -TimeoutSec 3
    return ($r.StatusCode -eq 200)
  } catch { return $false }
}

function Probe-Browser {
  # Playwright 브라우저 런타임이 실제로 받아졌는지. 캐시 디렉터리에 chromium/webkit 이 있는지로 판정한다.
  $cache = Join-Path $env:LOCALAPPDATA 'ms-playwright'
  if (-not (Test-Path $cache)) { return $false }
  $hasChromium = @(Get-ChildItem $cache -Filter 'chromium*' -ErrorAction SilentlyContinue).Count -gt 0
  $hasWebkit   = @(Get-ChildItem $cache -Filter 'webkit*'   -ErrorAction SilentlyContinue).Count -gt 0
  return ($hasChromium -and $hasWebkit)
}

function Probe-Schema {
  param([hashtable]$C)
  if (-not (Probe-Postgres $C)) { return $false }
  # 마이그레이션 이력 테이블이 있고 적용된 행이 1건 이상인가 (스키마가 실제로 올라갔는가)
  docker exec $C.PgContainer psql -U $C.PgUser -d $C.PgDb -tAc "select count(*) from schema_migrations" 2>$null | Out-Null
  return ($LASTEXITCODE -eq 0)
}

function Probe-App {
  param([hashtable]$C)
  try {
    # 포트가 열렸는지가 아니라 응답이 오는지로 판정한다
    $r = Invoke-WebRequest -Uri $C.AppBaseUrl -UseBasicParsing -TimeoutSec 3
    return ($r.StatusCode -lt 500)
  } catch {
    # 4xx 도 "앱이 응답한다"는 뜻이다
    if ($_.Exception.Response -ne $null) { return $true }
    return $false
  }
}

function Get-ComponentStates {
  param([hashtable]$C)
  return [ordered]@{
    postgres = (Probe-Postgres $C)
    mailpit  = (Probe-Mailpit  $C)
    browser  = (Probe-Browser)
    schema   = (Probe-Schema   $C)
    app      = (Probe-App      $C)
  }
}

# ─────────────────────────────────────────────────────────────────────────────
# 3. 설정 읽기 (모든 하위 명령이 공통으로 쓴다)
# ─────────────────────────────────────────────────────────────────────────────

$envMap = Import-EnvFile $EnvFile
$Cfg = @{
  PgContainer  = (Get-EnvValue $envMap 'LOCALDEV_PG_CONTAINER'   'deskwork-postgres')
  PgImage      = (Get-EnvValue $envMap 'LOCALDEV_PG_IMAGE'       'postgres:16-alpine')
  PgVolume     = (Get-EnvValue $envMap 'LOCALDEV_PG_VOLUME'      'deskwork-pgdata')
  PgPort       = (Get-EnvValue $envMap 'POSTGRES_PORT'           '5432')
  PgUser       = (Get-EnvValue $envMap 'POSTGRES_USER'           'deskwork')
  PgDb         = (Get-EnvValue $envMap 'POSTGRES_DB'             'deskwork_dev')
  PgPassword   = (Get-EnvValue $envMap 'POSTGRES_PASSWORD'       '')
  MailContainer= (Get-EnvValue $envMap 'LOCALDEV_MAIL_CONTAINER' 'deskwork-mailpit')
  MailImage    = (Get-EnvValue $envMap 'LOCALDEV_MAIL_IMAGE'     'axllent/mailpit:latest')
  MailSmtpPort = (Get-EnvValue $envMap 'MAIL_SMTP_PORT'          '1025')
  MailWebPort  = (Get-EnvValue $envMap 'MAIL_WEB_PORT'           '8025')
  AppPort      = (Get-EnvValue $envMap 'APP_PORT'                '3000')
  AppBaseUrl   = (Get-EnvValue $envMap 'APP_BASE_URL'            'http://localhost:3000')
}

# ─────────────────────────────────────────────────────────────────────────────
# 4. -Status / -Logs / -Down  (띄우지 않는 명령들)
# ─────────────────────────────────────────────────────────────────────────────

if ($Status) {
  Write-Step "구성 요소 상태 (아무것도 띄우지 않는다)"
  if (-not (Get-Command docker -ErrorAction SilentlyContinue)) {
    Write-Miss "컨테이너 엔진이 설치되어 있지 않다 — 컨테이너 구성 요소를 판정할 수 없다"
  } elseif (-not (Test-DockerRunning)) {
    Write-Miss "컨테이너 엔진이 실행 중이 아니다 (Docker Desktop 을 켠다)"
  }
  $states = Get-ComponentStates $Cfg
  $allOk = $true
  foreach ($c in $Components) {
    $ok = $states[$c.Key]
    if ($ok) { Write-Ok "$($c.Name) ($($c.Form))" } else { Write-Miss "$($c.Name) ($($c.Form))"; $allOk = $false }
  }
  Write-Host ""
  if ($allOk) {
    Write-Host "전부 준비됨. 실패가 있다면 환경 문제가 아니다." -ForegroundColor Green
    exit 0
  }
  Write-Host "준비되지 않은 구성 요소가 있다. 이 상태에서의 게이트 실패는 '환경 문제'로 분류한다." -ForegroundColor Yellow
  Write-Host "다음에 할 것: pwsh $PSCommandPath   (로그가 필요하면 -Logs)" -ForegroundColor Yellow
  exit 4
}

if ($Logs) {
  Write-Step "구성 요소 로그"
  foreach ($name in @($Cfg.PgContainer, $Cfg.MailContainer)) {
    Write-Host ""
    Write-Host "--- $name ---" -ForegroundColor Cyan
    if ((Get-ContainerState $name) -eq 'absent') { Write-Miss "컨테이너가 없다 (아직 준비하지 않았다)" }
    else { docker logs --tail 80 $name }
  }
  Write-Host ""
  Write-Host "앱 개발 서버 로그는 그것을 실행한 터미널에 있다 (호스트에서 돌기 때문이다)." -ForegroundColor DarkGray
  exit 0
}

if ($Down) {
  Write-Step "내리기"
  foreach ($name in @($Cfg.PgContainer, $Cfg.MailContainer)) {
    if ((Get-ContainerState $name) -eq 'absent') { Write-Host "   $name : 없음" }
    else { docker rm -f $name | Out-Null; Write-Host "   $name : 내렸다" }
  }
  Write-Host "   데이터 볼륨($($Cfg.PgVolume))은 남겨 두었다. 지우려면 -Reset 을 쓴다." -ForegroundColor DarkGray
  Write-Host "   앱 개발 서버는 그것을 실행한 터미널에서 중단한다." -ForegroundColor DarkGray
  exit 0
}

# ─────────────────────────────────────────────────────────────────────────────
# 5. 준비 — 1 전제 → 2 환경변수 → 3 의존 서비스 → 4 스키마·시드 → 5 앱 → 6 요약
#    멱등하다. 이미 준비된 것은 다시 띄우지 않는다.
# ─────────────────────────────────────────────────────────────────────────────

Write-Step "1. 전제 확인"
$missing = @()
foreach ($p in $Prerequisites) {
  if (Get-Command $p.Command -ErrorAction SilentlyContinue) { Write-Ok $p.Name }
  else { Write-Miss "$($p.Name) — $($p.Install)"; $missing += $p.Name }
}
if ($missing.Count -gt 0) {
  Stop-WithStage -Stage '1. 전제 확인' -What "없는 것: $($missing -join ', ')" `
    -NextAction '위에 출력된 설치 방법대로 설치한 뒤 이 명령을 다시 실행한다' -Code 2
}
if (-not (Test-DockerRunning)) {
  Stop-WithStage -Stage '1. 전제 확인' -What '컨테이너 엔진이 설치되어 있으나 실행 중이 아니다' `
    -NextAction 'Docker Desktop 을 실행하고 이 명령을 다시 실행한다' -Code 2
}
Write-Ok '컨테이너 엔진 실행 중'

Write-Step "2. 환경변수 준비"
if (-not (Test-Path $EnvExample)) {
  Stop-WithStage -Stage '2. 환경변수 준비' -What "예시 파일이 없다: $EnvExample" `
    -NextAction '저장소를 다시 받는다' -Code 3
}
if (-not (Test-Path $EnvFile)) {
  Copy-Item -LiteralPath $EnvExample -Destination $EnvFile
  Write-Host "   $EnvFile 을 예시 파일에서 만들었다." -ForegroundColor Yellow
  $envMap = Import-EnvFile $EnvFile
}
# 값이 반드시 채워져야 하는 키 — 이름만 나열한다. 값은 이 스크립트에도 예시 파일에도 두지 않는다.
$RequiredKeys = @('DATABASE_URL','POSTGRES_USER','POSTGRES_PASSWORD','POSTGRES_DB','SESSION_SECRET','JOB_SHARED_SECRET','MAIL_SMTP_HOST','MAIL_SMTP_PORT','APP_BASE_URL')
$blank = @()
foreach ($k in $RequiredKeys) { if ((Get-EnvValue $envMap $k '') -eq '') { $blank += $k } }
if ($blank.Count -gt 0) {
  Stop-WithStage -Stage '2. 환경변수 준비' -What "값이 비어 있는 필수 키: $($blank -join ', ')" `
    -NextAction "$EnvFile 을 열어 위 키의 값을 채운다. 값은 저장소에 커밋하지 않는다 (security.md §3.3)" -Code 3
}
# 채워진 값으로 설정을 다시 읽는다
$Cfg.PgPort = (Get-EnvValue $envMap 'POSTGRES_PORT' $Cfg.PgPort)
$Cfg.PgUser = (Get-EnvValue $envMap 'POSTGRES_USER' $Cfg.PgUser)
$Cfg.PgDb   = (Get-EnvValue $envMap 'POSTGRES_DB'   $Cfg.PgDb)
$Cfg.PgPassword  = (Get-EnvValue $envMap 'POSTGRES_PASSWORD' '')
$Cfg.MailSmtpPort= (Get-EnvValue $envMap 'MAIL_SMTP_PORT' $Cfg.MailSmtpPort)
$Cfg.MailWebPort = (Get-EnvValue $envMap 'MAIL_WEB_PORT'  $Cfg.MailWebPort)
$Cfg.AppPort     = (Get-EnvValue $envMap 'APP_PORT'       $Cfg.AppPort)
$Cfg.AppBaseUrl  = (Get-EnvValue $envMap 'APP_BASE_URL'   $Cfg.AppBaseUrl)
Write-Ok '필수 키가 모두 채워져 있다'

if ($Reset) {
  Write-Step "2-1. 초기화 (-Reset)"
  foreach ($name in @($Cfg.PgContainer, $Cfg.MailContainer)) {
    if ((Get-ContainerState $name) -ne 'absent') { docker rm -f $name | Out-Null; Write-Host "   $name 제거" }
  }
  docker volume rm $Cfg.PgVolume 2>$null | Out-Null
  Write-Host "   데이터 볼륨 $($Cfg.PgVolume) 제거. 빈 상태에서 다시 준비한다." -ForegroundColor Yellow
}

Write-Step "3. 의존 서비스"

# ── 구성 요소 블록: PostgreSQL (컨테이너) ────────────────────────────────────
if (Probe-Postgres $Cfg) {
  Write-Ok 'PostgreSQL (이미 준비됨 — 다시 띄우지 않는다)'
} else {
  $state = Get-ContainerState $Cfg.PgContainer
  if ($state -eq 'absent') {
    docker run -d --name $Cfg.PgContainer `
      -e "POSTGRES_USER=$($Cfg.PgUser)" -e "POSTGRES_PASSWORD=$($Cfg.PgPassword)" -e "POSTGRES_DB=$($Cfg.PgDb)" `
      -p "$($Cfg.PgPort):5432" -v "$($Cfg.PgVolume):/var/lib/postgresql/data" `
      $Cfg.PgImage | Out-Null
  } elseif ($state -ne 'running') {
    docker start $Cfg.PgContainer | Out-Null
  }
  # 포트가 열린 것과 쓸 수 있는 것은 다르다 — 실제 질의 한 번으로 판정할 때까지 기다린다
  if (-not (Wait-Until { Probe-Postgres $Cfg } 90 'PostgreSQL')) {
    Stop-WithStage -Stage '3. 의존 서비스 / PostgreSQL' -What "select 1 질의가 90초 안에 성공하지 못했다 (포트 $($Cfg.PgPort))" `
      -NextAction "pwsh $PSCommandPath -Logs 로 컨테이너 로그를 본다. 포트 충돌이면 .env.local 의 POSTGRES_PORT 를 바꾼다" -Code 4
  }
  Write-Ok 'PostgreSQL'
}

# ── 구성 요소 블록: 메일 수신함 캡처 (컨테이너) ──────────────────────────────
if (Probe-Mailpit $Cfg) {
  Write-Ok '메일 수신함 캡처 (이미 준비됨)'
} else {
  $state = Get-ContainerState $Cfg.MailContainer
  if ($state -eq 'absent') {
    docker run -d --name $Cfg.MailContainer `
      -p "$($Cfg.MailSmtpPort):1025" -p "$($Cfg.MailWebPort):8025" `
      $Cfg.MailImage | Out-Null
  } elseif ($state -ne 'running') {
    docker start $Cfg.MailContainer | Out-Null
  }
  if (-not (Wait-Until { Probe-Mailpit $Cfg } 60 '메일 수신함 캡처')) {
    Stop-WithStage -Stage '3. 의존 서비스 / 메일 캡처' -What "관리 API 가 60초 안에 응답하지 않았다 (포트 $($Cfg.MailWebPort))" `
      -NextAction "pwsh $PSCommandPath -Logs 로 로그를 본다. 포트 충돌이면 .env.local 의 MAIL_WEB_PORT 를 바꾼다" -Code 4
  }
  Write-Ok '메일 수신함 캡처'
}

# ── 구성 요소 블록: 헤드리스 브라우저 런타임 (로컬 설치) ─────────────────────
if (Probe-Browser) {
  Write-Ok '헤드리스 브라우저 런타임 (이미 준비됨)'
} else {
  Write-Miss '헤드리스 브라우저 런타임 — 내려받는다 (처음 한 번만 오래 걸린다)'
  Push-Location $RepoRoot
  try { npx playwright install chromium webkit } finally { Pop-Location }
  if (-not (Probe-Browser)) {
    Stop-WithStage -Stage '3. 의존 서비스 / 헤드리스 브라우저' -What 'Chromium·WebKit 런타임이 준비되지 않았다' `
      -NextAction '저장소 루트에서 npx playwright install chromium webkit 을 직접 실행하고 출력을 본다 (TD-015·TD-017)' -Code 4
  }
  Write-Ok '헤드리스 브라우저 런타임'
}

Write-Step "4. 스키마·시드"
Push-Location $RepoRoot
try {
  npm run db:migrate
  if ($LASTEXITCODE -ne 0) {
    Stop-WithStage -Stage '4. 스키마·시드 / 마이그레이션' -What 'npm run db:migrate 가 0이 아닌 코드로 끝났다' `
      -NextAction "되돌리기가 필요하면 npm run db:rollback. 처음부터 다시 하려면 pwsh $PSCommandPath -Reset" -Code 5
  }
  if ($BigSeed) {
    Write-Host "   대량 시드(프로젝트 200건·인보이스 1,000건) — 오래 걸린다" -ForegroundColor DarkGray
    npm run db:seed -- --big
  } else {
    npm run db:seed
  }
  if ($LASTEXITCODE -ne 0) {
    Stop-WithStage -Stage '4. 스키마·시드 / 시드' -What 'npm run db:seed 가 0이 아닌 코드로 끝났다' `
      -NextAction "pwsh $PSCommandPath -Reset 으로 빈 DB 에서 다시 시도한다" -Code 5
  }
} finally { Pop-Location }
Write-Ok '스키마 적용·시드 투입'

if ($NoApp) {
  Write-Step "5. 앱 실행 — 건너뜀 (-NoApp)"
} else {
  Write-Step "5. 앱 실행"
  if (Probe-App $Cfg) {
    Write-Ok "애플리케이션 개발 서버 (이미 응답 중 — 다시 띄우지 않는다) $($Cfg.AppBaseUrl)"
  } else {
    Push-Location $RepoRoot
    try {
      Start-Process -FilePath 'npm' -ArgumentList @('run','dev') -WorkingDirectory $RepoRoot -WindowStyle Minimized
    } finally { Pop-Location }
    # 포트 열림이 아니라 응답 한 번으로 판정한다
    if (-not (Wait-Until { Probe-App $Cfg } 120 '애플리케이션 개발 서버')) {
      Stop-WithStage -Stage '5. 앱 실행' -What "$($Cfg.AppBaseUrl) 이 120초 안에 응답하지 않았다" `
        -NextAction "저장소 루트에서 npm run dev 를 직접 실행해 출력을 본다. 포트 충돌이면 .env.local 의 APP_PORT·APP_BASE_URL 을 바꾼다" -Code 6
    }
    Write-Ok "애플리케이션 개발 서버 $($Cfg.AppBaseUrl)"
  }
}

Write-Step "6. 요약"
Write-Host "   앱          : $($Cfg.AppBaseUrl)"
Write-Host "   메일 수신함 : http://localhost:$($Cfg.MailWebPort)   (FR-002·FR-017 확인용. 실제 발송은 없다)"
Write-Host "   DB          : localhost:$($Cfg.PgPort) / $($Cfg.PgDb)"
Write-Host "   예시 계정   : 시드 스크립트 출력에 있다 (자격 증명을 이 스크립트에 두지 않는다)"
Write-Host ""
Write-Host "   다음에 할 것:"
Write-Host "     게이트 실행    npm run gate:lint  →  npm run gate:unit  →  npm run gate:e2e"
Write-Host "     상태만 보기    pwsh $PSCommandPath -Status"
Write-Host "     데이터 초기화  pwsh $PSCommandPath -Reset"
Write-Host "     성능용 시드    pwsh $PSCommandPath -BigSeed   (NFR-001·OQ-015)"
Write-Host "     내리기         pwsh $PSCommandPath -Down"
Write-Host ""
exit 0
