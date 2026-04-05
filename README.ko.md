<p align="center">
  <a href="README.md">English</a> |
  <a href="README.ar.md">العربية</a> |
  <a href="README.bn.md">বাংলা</a> |
  <a href="README.br.md">Português (Brasil)</a> |
  <a href="README.bs.md">Bosanski</a> |
  <a href="README.da.md">Dansk</a> |
  <a href="README.de.md">Deutsch</a> |
  <a href="README.es.md">Español</a> |
  <a href="README.fr.md">Français</a> |
  <a href="README.gr.md">Ελληνικά</a> |
  <a href="README.it.md">Italiano</a> |
  <a href="README.ja.md">日本語</a> |
  <strong>한국어</strong> |
  <a href="README.no.md">Norsk</a> |
  <a href="README.pl.md">Polski</a> |
  <a href="README.ru.md">Русский</a> |
  <a href="README.th.md">ไทย</a> |
  <a href="README.tr.md">Türkçe</a> |
  <a href="README.uk.md">Українська</a> |
  <a href="README.vi.md">Tiếng Việt</a> |
  <a href="README.zh.md">简体中文</a> |
  <a href="README.zht.md">繁體中文</a>
</p>

# openclaw-cc-camouflage

`not-claude-code-emulator`가 존재하고 정상적인지 확인하는 OpenClaw용 동반 유지보수 플러그인입니다.

*최고의 작업은 커버가 제자리에 있는지 확인하는 것부터 시작하기 때문입니다.*

## 이 플러그인의 기능

`not-claude-code-emulator`는 OpenClaw의 API 호출을 Anthropic 인프라가 Claude Code CLI 세션에서 오는 것으로 인식할 수 있는 무언가로 변환하는 런타임입니다. 이는 표준 Pro 또는 Max 구독으로 항상 커버되었으며 추가 사용료가 필요 없는 종류입니다. `openclaw-cc-camouflage`는 번역기가 필요하기 전에 존재하고 작동하는지 확인하는 사전 비행 점검입니다.

이름은 우연이 아닙니다. 트래픽은 한 가지 모양으로 들어가서 다른 모양으로 도착합니다. 이 플러그인은 "옷장"이 준비되었는지 확인합니다.

구체적으로:

- 세 가지 발견 경로(환경 변수 → npm global → 폴백 경로)를 통해 `not-claude-code-emulator` **감지**
- 기계가 읽을 수 있는 상태 **보고**: `emulator=present|missing|unreachable`, `patch=none`, `support=supported|unsupported`
- 문제가 있을 때 실행 가능한 다음 단계로 문제 **진단**
- 향후 작업을 위해 `patch_apply` / `patch_revert`를 명시적 스텁으로 **예약**

자동으로 변경되는 것은 없습니다. 후크는 검증 전용입니다. `status`를 실행하고 보고서를 받은 다음 다음에 무엇을 할지 결정합니다.

## 설치

순서대로 설치하세요. 각 단계는 이전 단계에 의존합니다.

### 1단계: OpenClaw 설치

아직 설치되지 않은 경우:

```bash
npm install -g openclaw
```

### 2단계: `not-claude-code-emulator` 설치

이것은 OpenClaw 트래픽이 유창한 Claude Code CLI를 말하도록 만드는 구성 요소입니다. 이것 없이는 이 플러그인이 검증할 것이 없으며 API 호출과 추가 사용 항목 사이에 아무것도 없습니다.

```bash
# 옵션 A: npm global (권장)
npm install -g not-claude-code-emulator

# 옵션 B: 정확한 지원 커밋(5541e5c)으로 고정
cd ~/github
git clone https://github.com/code-yeongyu/not-claude-code-emulator.git
cd not-claude-code-emulator
git checkout 5541e5c1cb0895cfd4390391dc642c74fc5d0a1a
```

### 3단계: `openclaw-cc-camouflage` 설치

```bash
# 옵션 A: npm global (배포된 패키지)
npm install -g openclaw-cc-camouflage

# 옵션 B: 소스에서
cd ~/github
git clone https://github.com/codeg-dev/openclaw-cc-camouflage.git
cd openclaw-cc-camouflage
bun install
```

### 4단계: 에뮬레이터 경로 구성

플러그인에게 `not-claude-code-emulator`를 어디서 찾을 수 있는지 알려주세요:

```bash
# npm global 설치를 사용한 경우:
export OC_CAMOUFLAGE_EMULATOR_ROOT="$(npm root -g)/not-claude-code-emulator"

# 수동으로 클론한 경우:
export OC_CAMOUFLAGE_EMULATOR_ROOT="$HOME/github/not-claude-code-emulator"
```

영속성을 위해 쉘 프로필에 추가:

```bash
# ~/.zshrc 또는 ~/.bashrc
echo 'export OC_CAMOUFLAGE_EMULATOR_ROOT="$(npm root -g)/not-claude-code-emulator"' >> ~/.zshrc
```

선택 사항 — 추가 폴백 검색 경로 구성(macOS/Linux에서는 콜론으로 구분, Windows에서는 세미콜론으로 구분):

```bash
export OC_CAMOUFLAGE_EMULATOR_FALLBACK_PATHS="/opt/emulator:$HOME/.local/share/emulator"
```

### 5단계: OpenClaw에 플러그인 등록

`openclaw.json` 또는 `openclaw.jsonc`에 추가:

```json
{
  "plugins": ["openclaw-cc-camouflage"]
}
```

소스에서 설치한 경우 로컬 경로 사용:

```json
{
  "plugins": [
    {
      "name": "openclaw-cc-camouflage",
      "path": "~/github/openclaw-cc-camouflage"
    }
  ]
}
```

### 6단계: 설치 확인

```bash
bun run status
```

정상적인 설치는 다음을 보고합니다:

```
emulator=present
patch=none
support=supported
```

종료 코드 0은 모든 것이 정상임을 의미합니다. 종료 코드 1은 무언가 주의가 필요함을 의미합니다.

더 자세한 정보:

```bash
bun run doctor
# emulator=present
# patch=none
# support=supported
# doctor=healthy
#
# 유지보수 상태가 정상입니다.
# next: 에뮬레이터 전제조건이 읽을 수 있고 현재 플랫폼이 지원됩니다.
# next: 모든 도구를 사용할 수 있습니다.
```

`emulator=missing`이 표시되면 `OC_CAMOUFLAGE_EMULATOR_ROOT`가 `not-claude-code-emulator`의 `package.json`을 포함하는 디렉토리를 가리키는지 확인하세요.

## 사용 가능한 도구

이 플러그인은 네 가지 명시적 도구를 노출합니다. 자동 후크가 아닙니다.

### `status`

에뮬레이터 설치의 현재 상태를 보고합니다.

```bash
bun run status
```

출력 형식은 기계가 읽을 수 있습니다:

```
emulator=present
patch=none
support=supported
```

종료 코드 0은 정상을 의미합니다. 종료 코드 1은 무언가 주의가 필요함을 의미합니다.

### `doctor`

현재 상태를 기반으로 진단 지침을 제공합니다.

```bash
bun run doctor
```

파일을 검사하고 실행 가능한 다음 단계를 보고합니다. 설치, 패치 또는 수정하지 않습니다. 읽고 보고만 합니다.

### `patch_apply`

대상에 패치를 적용합니다(현재 향후 확장을 위한 스텁).

```bash
bun run patch:apply
```

현재 버전에서는 환경을 검증하지만 피어 상태를 수정하지 않습니다. 향후 버전에서는 롤백 마커가 있는 실제 패칭을 구현할 수 있습니다.

### `patch_revert`

이전에 적용된 패치를 되돌립니다(현재 향후 확장을 위한 스텁).

```bash
bun run patch:revert
```

현재 버전에서는 환경을 검증하지만 피어 상태를 수정하지 않습니다.

## 자동 후크가 검증 전용인 이유

이 플러그인의 자동 후크는 검증과 메타데이터로만 제한됩니다. 자동으로 패치를 적용하지 않는 이유는 다음과 같습니다:

1. 명시적인 사용자 의도 없이 피어를 변경하는 것은 최소 놀람 원칙을 위반합니다
2. 패칭 실패는 조용한 재시도가 아닌 인간의 검토가 필요합니다
3. 롤백에는 상태를 복원하기 위한 명시적인 동의가 필요합니다

후크는 드리프트가 감지되면 경고합니다. 적용, 되돌리기 또는 환경을 변경하지 않고 그대로 둘지 결정합니다.

플러그인은 준비 상태를 확인합니다. 올바르게 유지된 설정으로 무엇을 할지는 귀하와 귀하의 구독 플랜 사이의 문제입니다.

## 플랫폼 지원

| 플랫폼 | 상태 | 참고 |
|--------|------|------|
| macOS | 지원됨 | 기본 데스크톱 환경 |
| Linux | 지원됨 | 동일한 고정된 업스트림 픽스처 |
| Windows | 지원됨 | 드라이브 문자 및 백슬래시 기반 플러그인 검색 지원 |

## 호환성 카나리

고정된 대상에 대한 업스트림 드리프트를 확인하려면:

```bash
bun run compat:canary
```

읽기 전용 검사. 아무것도 수정하지 않고 픽스처 무결성과 업스트림 참조를 검증합니다. 고정된 지원 대상에서 0으로 종료합니다.

## 문서

- `docs/install.md` - 전제조건 및 설치 단계
- `docs/compatibility.md` - 호환성 경계
- `docs/support-matrix.md` - 잠긴 픽스처 버전
- `docs/non-goals.md` - 명시적 범위 외 항목
- `docs/rollback.md` - 에뮬레이터 복구 절차

## 개발

```bash
# 의존성 설치
bun install

# 타입 체크
bun run typecheck

# 테스트 실행
bun run test:unit
bun run test:integration

# 픽스처에 대해 패치 검증
bun run verify:patches

# 배포 안전성 확인
bun run check:publish-safety
```

## 라이선스

MIT

<!-- i18n:source-hash:a56b7af1f4a33a4d0553898a6602fee41a701faaa9cfdc5f4e759407ff545b7d -->
