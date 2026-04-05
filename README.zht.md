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

用於 OpenClaw 的配套維護外掛程式，可驗證 `not-claude-code-emulator` 是否存在且運行正常。

*因為最佳操作始於確認您的掩護已就位。*

## 功能說明

`not-claude-code-emulator` 是一個執行環境，可將 OpenClaw 的 API 呼叫轉換為 Anthropic 基礎設施可識別為來自 Claude Code CLI 工作階段的內容——這種類型一直包含在標準 Pro 或 Max 訂閱中，無需額外使用費用。`openclaw-cc-camouflage` 是飛行前檢查，可在您需要使用之前確認翻譯器已存在且運作正常。

這個名稱並非巧合。您的流量以一種形態進入，以另一種形態到達。此外掛程式驗證「衣櫥」是否已準備好。

具體功能：

- 透過三種發現路徑（環境變數 → npm 全域 → 備用路徑）**檢測** `not-claude-code-emulator`
- **報告**機器可讀狀態：`emulator=present|missing|unreachable`，`patch=none`，`support=supported|unsupported`
- 當出現問題時，**診斷**問題並提供可執行的後續步驟
- 將 `patch_apply` / `patch_revert` **預留**為未來操作的明確存根

沒有任何內容會自動變更。鉤子僅用於驗證。您執行 `status`，獲取報告，然後決定接下來做什麼。

## 安裝

依序安裝。每個步驟都依賴於前一個步驟。

### 步驟 1：安裝 OpenClaw

如果尚未安裝：

```bash
npm install -g openclaw
```

### 步驟 2：安裝 `not-claude-code-emulator`

這是使您的 OpenClaw 流量能夠流利使用 Claude Code CLI 的元件。沒有它，此外掛程式就無從驗證——您的 API 呼叫和額外使用項目之間將沒有任何屏障。

```bash
# 選項 A：npm 全域安裝（推薦）
npm install -g not-claude-code-emulator

# 選項 B：固定到精確支援的提交版本 (5541e5c)
cd ~/github
git clone https://github.com/code-yeongyu/not-claude-code-emulator.git
cd not-claude-code-emulator
git checkout 5541e5c1cb0895cfd4390391dc642c74fc5d0a1a
```

### 步驟 3：安裝 `openclaw-cc-camouflage`

```bash
# 選項 A：npm 全域安裝（已發布套件）
npm install -g openclaw-cc-camouflage

# 選項 B：從原始碼安裝
cd ~/github
git clone https://github.com/codeg-dev/openclaw-cc-camouflage.git
cd openclaw-cc-camouflage
bun install
```

### 步驟 4：配置模擬器路徑

告訴外掛程式在哪裡找到 `not-claude-code-emulator`：

```bash
# 如果您使用了 npm 全域安裝：
export OC_CAMOUFLAGE_EMULATOR_ROOT="$(npm root -g)/not-claude-code-emulator"

# 如果您手動克隆：
export OC_CAMOUFLAGE_EMULATOR_ROOT="$HOME/github/not-claude-code-emulator"
```

新增到您的 shell 設定檔以持久化：

```bash
# ~/.zshrc 或 ~/.bashrc
echo 'export OC_CAMOUFLAGE_EMULATOR_ROOT="$(npm root -g)/not-claude-code-emulator"' >> ~/.zshrc
```

可選 — 配置額外的備用搜尋路徑（macOS/Linux 上用冒號分隔，Windows 上用分號分隔）：

```bash
export OC_CAMOUFLAGE_EMULATOR_FALLBACK_PATHS="/opt/emulator:$HOME/.local/share/emulator"
```

### 步驟 5：在 OpenClaw 中註冊外掛程式

新增到您的 `openclaw.json` 或 `openclaw.jsonc`：

```json
{
  "plugins": ["openclaw-cc-camouflage"]
}
```

如果從原始碼安裝，請使用本機路徑：

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

### 步驟 6：驗證安裝

```bash
bun run status
```

健康安裝報告：

```
emulator=present
patch=none
support=supported
```

退出代碼 0 表示一切正常。退出代碼 1 表示需要注意某些問題。

取得更詳細的資訊：

```bash
bun run doctor
# emulator=present
# patch=none
# support=supported
# doctor=healthy
#
# 維護狀態健康。
# next: 模擬器先決條件可讀且目前平台受支援。
# next: 所有工具均可用。
```

如果看到 `emulator=missing`，請驗證 `OC_CAMOUFLAGE_EMULATOR_ROOT` 是否指向包含 `not-claude-code-emulator` 的 `package.json` 的目錄。

## 可用工具

此外掛程式公開四個明確工具。它們不是自動鉤子。

### `status`

報告模擬器安裝的目前狀態。

```bash
bun run status
```

輸出格式為機器可讀：

```
emulator=present
patch=none
support=supported
```

退出代碼 0 表示健康。退出代碼 1 表示需要注意某些問題。

### `doctor`

根據目前狀態提供診斷指導。

```bash
bun run doctor
```

檢查檔案並報告可執行的後續步驟。不安裝、不修補、不修改任何內容。只讀取和報告。

### `patch_apply`

將修補程式套用至目標（目前為未來擴展的存根）。

```bash
bun run patch:apply
```

在目前版本中，這會驗證環境但不修改任何對等狀態。未來版本可能實作帶回滾標記的實際修補。

### `patch_revert`

還原先前套用的修補程式（目前為未來擴展的存根）。

```bash
bun run patch:revert
```

在目前版本中，這會驗證環境但不修改任何對等狀態。

## 為什麼自動鉤子僅用於驗證

此外掛程式中的自動鉤子僅限於驗證和中繼資料。它們不會自動套用修補程式，因為：

1. 在沒有明確使用者意圖的情況下變更對等方違反了最小驚訝原則
2. 修補失敗需要人工審查，而不是靜默重試
3. 回滾需要明確同意才能恢復狀態

當檢測到漂移時，鉤子會發出警告。您決定是否套用、還原或保持環境不變。

外掛程式驗證準備情況。您使用正確維護的設定做什麼取決於您和您的訂閱計劃。

## 平台支援

| 平台 | 狀態 | 備註 |
|------|------|------|
| macOS | 受支援 | 主要桌面環境 |
| Linux | 受支援 | 相同的固定上游 fixtures |
| Windows | 受支援 | 支援基於磁碟機號和反斜線的外掛程式發現 |

## 相容性預警

檢查針對固定目標的上游漂移：

```bash
bun run compat:canary
```

唯讀檢查。驗證 fixtures 完整性和上游引用而不修改任何內容。在固定的受支援目標上返回 0。

## 文件

- `docs/install.md` - 先決條件和安裝步驟
- `docs/compatibility.md` - 相容性邊界
- `docs/support-matrix.md` - 鎖定的 fixtures 版本
- `docs/non-goals.md` - 明確超出範圍的項目
- `docs/rollback.md` - 模擬器恢復程序

## 開發

```bash
# 安裝依賴
bun install

# 類型檢查
bun run typecheck

# 執行測試
bun run test:unit
bun run test:integration

# 驗證修補程式與 fixtures
bun run verify:patches

# 檢查發布安全性
bun run check:publish-safety
```

## 授權

MIT

<!-- i18n:source-hash:a56b7af1f4a33a4d0553898a6602fee41a701faaa9cfdc5f4e759407ff545b7d -->
