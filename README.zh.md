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
  <strong>简体中文</strong> |
  <a href="README.zht.md">繁體中文</a>
</p>

# openclaw-cc-camouflage

用于 OpenClaw 的配套维护插件，可验证 `not-claude-code-emulator` 是否存在且运行正常。

*因为最佳操作始于确认您的掩护已就位。*

## 功能说明

`not-claude-code-emulator` 是一个运行时，可将 OpenClaw 的 API 调用转换为 Anthropic 基础设施可识别为来自 Claude Code CLI 会话的内容——这种类型一直包含在标准 Pro 或 Max 订阅中，无需额外使用费用。`openclaw-cc-camouflage` 是预检程序，可在您需要使用之前确认翻译器已存在且运行正常。

这个名称并非巧合。您的流量以一种形态进入，以另一种形态到达。此插件验证"衣橱"是否已准备好。

具体功能：

- 通过三种发现路径（环境变量 → npm 全局 → 备用路径）**检测** `not-claude-code-emulator`
- **报告**机器可读状态：`emulator=present|missing|unreachable`，`patch=none`，`support=supported|unsupported`
- 当出现问题时，**诊断**问题并提供可执行的后续步骤
- 将 `patch_apply` / `patch_revert` **预留**为未来操作的显式存根

没有任何内容会自动变更。钩子仅用于验证。您运行 `status`，获取报告，然后决定接下来做什么。

## 安装

按顺序安装。每个步骤都依赖于前一个步骤。

### 步骤 1：安装 OpenClaw

如果尚未安装：

```bash
npm install -g openclaw
```

### 步骤 2：安装 `not-claude-code-emulator`

这是使您的 OpenClaw 流量能够流利使用 Claude Code CLI 的组件。没有它，此插件就无从验证——您的 API 调用和额外使用条目之间将没有任何屏障。

```bash
# 选项 A：npm 全局安装（推荐）
npm install -g not-claude-code-emulator

# 选项 B：固定到精确支持的提交版本 (5541e5c)
cd ~/github
git clone https://github.com/code-yeongyu/not-claude-code-emulator.git
cd not-claude-code-emulator
git checkout 5541e5c1cb0895cfd4390391dc642c74fc5d0a1a
```

### 步骤 3：安装 `openclaw-cc-camouflage`

```bash
# 选项 A：npm 全局安装（已发布包）
npm install -g openclaw-cc-camouflage

# 选项 B：从源代码安装
cd ~/github
git clone https://github.com/codeg-dev/openclaw-cc-camouflage.git
cd openclaw-cc-camouflage
bun install
```

### 步骤 4：配置模拟器路径

告诉插件在哪里找到 `not-claude-code-emulator`：

```bash
# 如果您使用了 npm 全局安装：
export OC_CAMOUFLAGE_EMULATOR_ROOT="$(npm root -g)/not-claude-code-emulator"

# 如果您手动克隆：
export OC_CAMOUFLAGE_EMULATOR_ROOT="$HOME/github/not-claude-code-emulator"
```

添加到您的 shell 配置文件以持久化：

```bash
# ~/.zshrc 或 ~/.bashrc
echo 'export OC_CAMOUFLAGE_EMULATOR_ROOT="$(npm root -g)/not-claude-code-emulator"' >> ~/.zshrc
```

可选 — 配置额外的备用搜索路径（macOS/Linux 上用冒号分隔，Windows 上用分号分隔）：

```bash
export OC_CAMOUFLAGE_EMULATOR_FALLBACK_PATHS="/opt/emulator:$HOME/.local/share/emulator"
```

### 步骤 5：在 OpenClaw 中注册插件

添加到您的 `openclaw.json` 或 `openclaw.jsonc`：

```json
{
  "plugins": ["openclaw-cc-camouflage"]
}
```

如果从源代码安装，请使用本地路径：

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

### 步骤 6：验证安装

```bash
bun run status
```

健康安装报告：

```
emulator=present
patch=none
support=supported
```

退出代码 0 表示一切正常。退出代码 1 表示需要注意某些问题。

获取更详细的信息：

```bash
bun run doctor
# emulator=present
# patch=none
# support=supported
# doctor=healthy
#
# 维护状态健康。
# next: 模拟器先决条件可读且当前平台受支持。
# next: 所有工具均可用。
```

如果看到 `emulator=missing`，请验证 `OC_CAMOUFLAGE_EMULATOR_ROOT` 是否指向包含 `not-claude-code-emulator` 的 `package.json` 的目录。

## 可用工具

此插件公开四个显式工具。它们不是自动钩子。

### `status`

报告模拟器安装的当前状态。

```bash
bun run status
```

输出格式为机器可读：

```
emulator=present
patch=none
support=supported
```

退出代码 0 表示健康。退出代码 1 表示需要注意某些问题。

### `doctor`

根据当前状态提供诊断指导。

```bash
bun run doctor
```

检查文件并报告可执行的后续步骤。不安装、不修补、不修改任何内容。只读取和报告。

### `patch_apply`

将补丁应用于目标（目前为未来扩展的存根）。

```bash
bun run patch:apply
```

在当前版本中，这会验证环境但不修改任何对等状态。未来版本可能实现带回滚标记的实际修补。

### `patch_revert`

恢复先前应用的补丁（目前为未来扩展的存根）。

```bash
bun run patch:revert
```

在当前版本中，这会验证环境但不修改任何对等状态。

## 为什么自动钩子仅用于验证

此插件中的自动钩子仅限于验证和元数据。它们不会自动应用补丁，因为：

1. 在没有明确用户意图的情况下更改对等方违反了最小惊讶原则
2. 修补失败需要人工审查，而不是静默重试
3. 回滚需要明确同意才能恢复状态

当检测到漂移时，钩子会发出警告。您决定是否应用、恢复或保持环境不变。

插件验证准备情况。您使用正确维护的设置做什么取决于您和您的订阅计划。

## 平台支持

| 平台 | 状态 | 备注 |
|------|------|------|
| macOS | 受支持 | 主要桌面环境 |
| Linux | 受支持 | 相同的固定上游 fixtures |
| Windows | 受支持 | 支持基于驱动器号和反斜杠的插件发现 |

## 兼容性预警

检查针对固定目标的上游漂移：

```bash
bun run compat:canary
```

只读检查。验证 fixtures 完整性和上游引用而不修改任何内容。在固定的受支持目标上返回 0。

## 文档

- `docs/install.md` - 先决条件和安装步骤
- `docs/compatibility.md` - 兼容性边界
- `docs/support-matrix.md` - 锁定的 fixtures 版本
- `docs/non-goals.md` - 明确超出范围的项目
- `docs/rollback.md` - 模拟器恢复程序

## 开发

```bash
# 安装依赖
bun install

# 类型检查
bun run typecheck

# 运行测试
bun run test:unit
bun run test:integration

# 验证补丁与 fixtures
bun run verify:patches

# 检查发布安全性
bun run check:publish-safety
```

## 许可证

MIT

<!-- i18n:source-hash:a56b7af1f4a33a4d0553898a6602fee41a701faaa9cfdc5f4e759407ff545b7d -->
