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

用于 OpenClaw 的配套维护插件，帮助验证 not-claude-code-emulator 状态。此软件包不是上游项目的分支。它提供显式工具，没有自动钩子。

## 这是什么

`openclaw-cc-camouflage` 是一个维护插件，可以：

- 在任何操作之前验证模拟器的存在和健康状况
- 报告状态并提供诊断指导
- 为未来的补丁操作提供存根实现

它在安装过程中不会自动应用补丁。所有变更都需要显式调用工具。

## 先决条件和安装顺序

安装顺序很重要。在此插件可以运行之前，您必须准备好以下内容：

1. **`not-claude-code-emulator`**（提交 `5541e5c`）
   - 提供 Anthropic 兼容接口的消息运行时
   - 通过 npm 安装：`npm install -g not-claude-code-emulator`
   - 或克隆到 `~/github/not-claude-code-emulator`

2. **`openclaw-cc-camouflage`**（此软件包）
   - 最后安装，在模拟器存在之后

配置环境变量：

```bash
export OC_CAMOUFLAGE_EMULATOR_ROOT="$HOME/github/not-claude-code-emulator"
```

或使用回退路径：

```bash
export OC_CAMOUFLAGE_EMULATOR_FALLBACK_PATHS="/opt/emulator:$HOME/.local/share/emulator"
```

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
emulator_version=5541e5c
emulator_path=/Users/you/github/not-claude-code-emulator
install_mode=local-folder
support=supported
```

退出代码 0 表示正常。退出代码 1 表示需要注意某些问题。

### `doctor`

根据当前状态提供诊断指导。

```bash
bun run doctor
```

这将检查文件并报告可执行的后续步骤。它不安装、修补或修改任何内容。只读取和报告。

### `patch_apply`

将补丁应用到目标（目前是为未来扩展预留的存根）。

```bash
bun run patch:apply
```

在当前版本中，这会验证环境，但不会修改任何对等状态。未来版本可能会使用回滚标记实现实际的修补。

### `patch_revert`

恢复先前应用的补丁（目前是为未来扩展预留的存根）。

```bash
bun run patch:revert
```

在当前版本中，这会验证环境，但不会修改任何对等状态。未来版本可能会使用回滚标记实现实际的恢复。

## 为什么自动钩子仅用于验证

此插件中的自动钩子仅限于验证和元数据。它们不会自动应用补丁，因为：

1. 在没有明确用户意图的情况下修改对等方违反了最小意外原则
2. 修补失败需要人工审查，而不是静默重试
3. 回滚需要明确的同意才能恢复状态

当检测到漂移时，钩子会发出警告。由您决定是否应用、恢复或保持环境不变。

## 平台支持

| 平台 | 状态 | 备注 |
|----------|--------|-------|
| macOS    | 支持 | 主要桌面环境 |
| Linux    | 支持 | 相同的固定上游固定装置 |
| Windows  | 支持 | 支持基于驱动器号和反斜杠的插件发现 |

## 兼容性金丝雀

要检查与固定目标的漂移：

```bash
bun run compat:canary
```

这是一个只读检查，可在不修改任何内容的情况下验证固定装置完整性和上游引用。它在固定的受支持目标上以 0 退出。

## 文档

- `docs/install.md` - 先决条件和安装步骤
- `docs/compatibility.md` - 兼容性边界
- `docs/support-matrix.md` - 锁定的固定装置版本
- `docs/non-goals.md` - 明确超出范围的项目

## 开发

```bash
# 安装依赖项
bun install

# 类型检查
bun run typecheck

# 运行测试
bun run test:unit
bun run test:integration

# 针对固定装置验证补丁
bun run verify:patches

# 检查发布安全性
bun run check:publish-safety
```

## 许可证

MIT

<!-- i18n:source-hash:5f30ef48aef04d659e3bd2e705b8b9250abb30ea042f84797e5d8997182de1af -->