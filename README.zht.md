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
  <a href="README.ko.md">한국어</a> |
  <a href="README.no.md">Norsk</a> |
  <a href="README.pl.md">Polski</a> |
  <a href="README.ru.md">Русский</a> |
  <a href="README.th.md">ไทย</a> |
  <a href="README.tr.md">Türkçe</a> |
  <a href="README.uk.md">Українська</a> |
  <a href="README.vi.md">Tiếng Việt</a> |
  <a href="README.zh.md">简体中文</a> |
  <strong>繁體中文</strong>
</p>

# openclaw-cc-camouflage

用於 OpenClaw 的配套維護插件，幫助驗證 not-claude-code-emulator 狀態。此套件不是上游專案的分支。它提供明確工具，沒有自動鉤子。

## 這是什麼

`openclaw-cc-camouflage` 是一個維護插件，可以：

- 在任何操作之前驗證模擬器的存在和健康狀況
- 報告狀態並提供診斷指導
- 為未來的修補操作提供虛設常式實作

它在安裝過程中不會自動套用修補程式。所有變更都需要明確呼叫工具。

## 先決條件和安裝順序

安裝順序很重要。在此插件可以運作之前，您必須準備好以下內容：

1. **`not-claude-code-emulator`**（提交 `5541e5c`）
   - 提供 Anthropic 相容介面的訊息執行階段
   - 透過 npm 安裝：`npm install -g not-claude-code-emulator`
   - 或複製到 `~/github/not-claude-code-emulator`

2. **`openclaw-cc-camouflage`**（此套件）
   - 最後安裝，在模擬器存在之後

設定環境變數：

```bash
export OC_CAMOUFLAGE_EMULATOR_ROOT="$HOME/github/not-claude-code-emulator"
```

或使用備援路徑：

```bash
export OC_CAMOUFLAGE_EMULATOR_FALLBACK_PATHS="/opt/emulator:$HOME/.local/share/emulator"
```

## 可用工具

此插件公開四個明確工具。它們不是自動鉤子。

### `status`

報告模擬器安裝的目前狀態。

```bash
bun run status
```

輸出格式為機器可讀：

```
emulator=present
emulator_version=5541e5c
emulator_path=/Users/you/github/not-claude-code-emulator
install_mode=local-folder
support=supported
```

結束代碼 0 表示正常。結束代碼 1 表示需要注意某些問題。

### `doctor`

根據目前狀態提供診斷指導。

```bash
bun run doctor
```

這會檢查檔案並報告可執行的後續步驟。它不會安裝、修補或修改任何內容。只會讀取和報告。

### `patch_apply`

將修補程式套用到目標（目前是為未來擴充預留的虛設常式）。

```bash
bun run patch:apply
```

在目前版本中，這會驗證環境，但不會修改任何對等狀態。未來版本可能會使用回復標記實作實際的修補。

### `patch_revert`

還原先前套用的修補程式（目前是為未來擴充預留的虛設常式）。

```bash
bun run patch:revert
```

在目前版本中，這會驗證環境，但不會修改任何對等狀態。未來版本可能會使用回復標記實作實際的還原。

## 為什麼自動鉤子僅用於驗證

此插件中的自動鉤子僅限於驗證和詮釋資料。它們不會自動套用修補程式，因為：

1. 在沒有明確使用者意圖的情況下修改對等方違反了最小驚訝原則
2. 修補失敗需要人工審查，而不是靜默重試
3. 回復需要明確同意才能還原狀態

當偵測到漂移時，鉤子會發出警告。由您決定要套用、還原或保持環境不變。

## 平台支援

| 平台 | 狀態 | 備註 |
|----------|--------|-------|
| macOS    | 支援 | 主要桌面環境 |
| Linux    | 支援 | 相同的固定上游固定裝置 |
| Windows  | 支援 | 支援基於磁碟機代號和反斜線的外掛程式探索 |

## 相容性金絲雀

要檢查與固定目標的漂移：

```bash
bun run compat:canary
```

這是一個唯讀檢查，可在不修改任何內容的情況下驗證固定裝置完整性和上游參考。它在固定的受支援目標上以 0 結束。

## 文件

- `docs/install.md` - 先決條件和安裝步驟
- `docs/compatibility.md` - 相容性邊界
- `docs/support-matrix.md` - 鎖定的固定裝置版本
- `docs/non-goals.md` - 明確超出範圍的項目

## 開發

```bash
# 安裝相依性
bun install

# 類型檢查
bun run typecheck

# 執行測試
bun run test:unit
bun run test:integration

# 針對固定裝置驗證修補程式
bun run verify:patches

# 檢查發布安全性
bun run check:publish-safety
```

## 授權

MIT

<!-- i18n:source-hash:5f30ef48aef04d659e3bd2e705b8b9250abb30ea042f84797e5d8997182de1af -->