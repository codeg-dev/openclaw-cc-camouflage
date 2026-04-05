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

not-claude-code-emulator 상태를 확인하는 데 도움이 되는 OpenClaw용 컴패니언 유지보수 플러그인입니다. 이 패키지는 업스트림 프로젝트의 포크가 아닙니다. 자동 훅 없이 명시적인 도구를 제공합니다.

## 이것은 무엇인가

`openclaw-cc-camouflage`는 다음을 수행하는 유지보수 플러그인입니다:

- 모든 작업 전에 에뮬레이터 존재 여부와 상태를 확인
- 상태를 보고하고 진단 가이던스를 제공
- 향후 패치 작업을 위한 스텁 구현 제공

설치 시 자동으로 패치를 적용하지 않습니다. 모든 변경에는 명시적인 도구 호출이 필요합니다.

## 전제조건 및 설치 순서

설치 순서가 중요합니다. 이 플러그인이 작동하기 전에 다음이 준비되어 있어야 합니다:

1. **`not-claude-code-emulator`** (커밋 `5541e5c`)
   - Anthropic 호환 인터페이스를 제공하는 메시지 런타임
   - npm을 통해 설치: `npm install -g not-claude-code-emulator`
   - 또는 `~/github/not-claude-code-emulator`에 클론

2. **`openclaw-cc-camouflage`** (이 패키지)
   - 에뮬레이터가 준비된 후 마지막에 설치

환경 변수 구성:

```bash
export OC_CAMOUFLAGE_EMULATOR_ROOT="$HOME/github/not-claude-code-emulator"
```

또는 대체 경로 사용:

```bash
export OC_CAMOUFLAGE_EMULATOR_FALLBACK_PATHS="/opt/emulator:$HOME/.local/share/emulator"
```

## 사용 가능한 도구

이 플러그인은 4가지 명시적인 도구를 노출합니다. 자동 훅이 아닙니다.

### `status`

에뮬레이터 설치의 현재 상태를 보고합니다.

```bash
bun run status
```

출력 형식은 기계가 읽을 수 있습니다:

```
emulator=present
emulator_version=5541e5c
emulator_path=/Users/you/github/not-claude-code-emulator
install_mode=local-folder
support=supported
```

종료 코드 0은 정상을 의미합니다. 종료 코드 1은 주의가 필요함을 의미합니다.

### `doctor`

현재 상태를 기반으로 진단 가이던스를 제공합니다.

```bash
bun run doctor
```

이것은 파일을 검사하고 실행 가능한 다음 단계를 보고합니다. 설치, 패치 또는 수정은 하지 않습니다. 읽기와 보고만 수행합니다.

### `patch_apply`

대상에 패치를 적용합니다 (현재는 향후 확장을 위한 스텁).

```bash
bun run patch:apply
```

현재 버전에서는 환경을 검증하지만 피어 상태를 수정하지 않습니다. 향후 버전에서는 롤백 마커를 사용하여 실제 패칭을 구현할 수 있습니다.

### `patch_revert`

이전에 적용된 패치를 되돌립니다 (현재는 향후 확장을 위한 스텁).

```bash
bun run patch:revert
```

현재 버전에서는 환경을 검증하지만 피어 상태를 수정하지 않습니다. 향후 버전에서는 롤백 마커를 사용하여 실제 복원을 구현할 수 있습니다.

## 자동 훅이 검증 전용인 이유

이 플러그인의 자동 훅은 검증과 메타데이터로만 제한됩니다. 자동으로 패치를 적용하지 않는 이유:

1. 명시적인 사용자 의도 없이 피어를 변경하는 것은 최소 놀람의 원칙을 위반합니다
2. 패치 실패는 조용한 재시도가 아닌 인간의 검토가 필요합니다
3. 롤백은 상태를 복원하기 위한 명시적 동의가 필요합니다

훅은 드리프트가 감지되면 경고합니다. 적용, 되돌리기, 또는 환경을 변경하지 않고 유지할지 결정합니다.

## 플랫폼 지원

| 플랫폼 | 상태 | 참고 |
|----------|--------|-------|
| macOS    | 지원됨 | 기본 데스크톱 환경 |
| Linux    | 지원됨 | 동일한 고정 업스트림 픽스처 |
| Windows  | 지원됨 | 드라이브 문자 및 백슬래시 기반 플러그인 검색 지원 |

## 호환성 카나리아

고정된 대상에 대한 업스트림 드리프트를 확인하려면:

```bash
bun run compat:canary
```

이것은 읽기 전용 검사로, 아무것도 수정하지 않고 픽스처 무결성과 업스트림 참조를 검증합니다. 고정된 지원 대상에서 0으로 종료됩니다.

## 문서

- `docs/install.md` - 전제조건 및 설치 단계
- `docs/compatibility.md` - 호환성 경계
- `docs/support-matrix.md` - 잠긴 픽스처 버전
- `docs/non-goals.md` - 명시적인 범위 외 항목

## 개발

```bash
# 의존성 설치
bun install

# 타입 체크
bun run typecheck

# 테스트 실행
bun run test:unit
bun run test:integration

# 픽스처 대비 패치 검증
bun run verify:patches

# 게시 안전성 확인
bun run check:publish-safety
```

## 라이선스

MIT

<!-- i18n:source-hash:5f30ef48aef04d659e3bd2e705b8b9250abb30ea042f84797e5d8997182de1af -->