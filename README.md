<p align="center">
  <strong>English</strong> |
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
  <a href="README.zht.md">繁體中文</a>
</p>

# openclaw-cc-camouflage

A companion maintenance plugin for OpenClaw that helps verify not-claude-code-emulator status. This package is not a fork of upstream projects. It provides explicit tooling without automatic hooks.

## What this is

`openclaw-cc-camouflage` is a maintenance plugin that:

- Verifies emulator presence and health before any operations
- Reports status and provides diagnostic guidance
- Provides stub implementations for future patch operations

It does not automatically patch during install. All mutation requires explicit tool invocation.

## Prerequisites and install order

The install order matters. You must have the following in place before this plugin can function:

1. **`not-claude-code-emulator`** (commit `5541e5c`)
   - The message runtime that provides Anthropic-compatible interfaces
   - Install via npm: `npm install -g not-claude-code-emulator`
   - Or clone into `~/github/not-claude-code-emulator`

2. **`openclaw-cc-camouflage`** (this package)
   - Install last, after the emulator is present

Configure the environment variable:

```bash
export OC_CAMOUFLAGE_EMULATOR_ROOT="$HOME/github/not-claude-code-emulator"
```

Or use fallback paths:

```bash
export OC_CAMOUFLAGE_EMULATOR_FALLBACK_PATHS="/opt/emulator:$HOME/.local/share/emulator"
```

## Available tools

This plugin exposes four explicit tools. They are not automatic hooks.

### `status`

Reports the current state of the emulator installation.

```bash
bun run status
```

Output format is machine-readable:

```
emulator=present
emulator_version=5541e5c
emulator_path=/Users/you/github/not-claude-code-emulator
install_mode=local-folder
support=supported
```

Exit code 0 means healthy. Exit code 1 means something needs attention.

### `doctor`

Provides diagnostic guidance based on the current state.

```bash
bun run doctor
```

This inspects files and reports actionable next steps. It does not install, patch, or modify anything. It only reads and reports.

### `patch_apply`

Applies patches to the target (currently a stub for future extension).

```bash
bun run patch:apply
```

In the current version, this validates the environment but does not modify any peer state. Future versions may implement actual patching with rollback markers.

### `patch_revert`

Reverts previously applied patches (currently a stub for future extension).

```bash
bun run patch:revert
```

In the current version, this validates the environment but does not modify any peer state. Future versions may implement actual reversion using rollback markers.

## Why automatic hooks are verify-only

Automatic hooks in this plugin are limited to verification and metadata only. They do not apply patches automatically because:

1. Mutating a peer without explicit user intent violates the principle of least surprise
2. Patching failures need human review, not silent retries
3. Rollback requires explicit consent to restore state

The hooks warn when drift is detected. You decide whether to apply, revert, or leave the environment unchanged.

## Platform support

| Platform | Status | Notes |
|----------|--------|-------|
| macOS    | Supported | Primary desktop environment |
| Linux    | Supported | Same pinned upstream fixtures |
| Windows  | Supported | Supports drive-letter and backslash-based plugin discovery |

## Compatibility canary

To check for upstream drift against pinned targets:

```bash
bun run compat:canary
```

This is a read-only check that validates fixture integrity and upstream references without modifying anything. It exits 0 on pinned supported targets.

## Documentation

- `docs/install.md` - Prerequisites and install steps
- `docs/compatibility.md` - Compatibility boundaries
- `docs/support-matrix.md` - Locked fixture versions
- `docs/non-goals.md` - Explicit out-of-scope items

## Development

```bash
# Install dependencies
bun install

# Type check
bun run typecheck

# Run tests
bun run test:unit
bun run test:integration

# Verify patches against fixtures
bun run verify:patches

# Check publish safety
bun run check:publish-safety
```

## License

MIT
