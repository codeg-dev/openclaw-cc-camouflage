> [!WARNING]
> **This repository is archived.**
>
> The upstream emulator `not-claude-code-emulator` was archived and stopped
> successfully spoofing Anthropic around midnight KST on 2026-04-06. Without a
> working emulator the patch lifecycle this plugin maintains has no effect.
> This repository is therefore also archived and is no longer maintained.
> No further updates or bug fixes will be issued.

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

A companion maintenance plugin for OpenClaw that verifies `not-claude-code-emulator` is present and healthy.

*Because the best operation starts with confirming your cover is in place.*

## What this does

`not-claude-code-emulator` is the runtime that translates OpenClaw's API calls into something Anthropic's infrastructure recognises as coming from a Claude Code CLI session — the kind that has always been covered by a standard Pro or Max subscription, no extra usage charges required. `openclaw-cc-camouflage` is the pre-flight check that confirms the translator is present and operational before you need it.

The name is not a coincidence. Your traffic goes in looking like one thing, arrives looking like another. This plugin verifies the wardrobe is ready.

Concretely:

- **Detects** `not-claude-code-emulator` via three discovery paths (env var → npm global → fallback paths)
- **Reports** machine-readable status: `emulator=present|missing|unreachable`, `patch=none`, `support=supported|unsupported`
- **Diagnoses** issues with actionable next steps when something's wrong
- **Reserves** `patch_apply` / `patch_revert` as explicit stubs for future operations

Nothing mutates automatically. The hooks are verify-only. You run `status`, get the report, and decide what to do next.

## Installation

Install in order. Each step depends on the previous one.

### Step 1: Install OpenClaw

If not already installed:

```bash
npm install -g openclaw
```

### Step 2: Install `not-claude-code-emulator`

This is the component that makes your OpenClaw traffic speak fluent Claude Code CLI. Without it, there is nothing for this plugin to verify — and nothing standing between your API calls and an extra-usage line item.

```bash
# Option A: npm global (recommended)
npm install -g not-claude-code-emulator

# Option B: pin to the exact supported commit (5541e5c)
cd ~/github
git clone https://github.com/code-yeongyu/not-claude-code-emulator.git
cd not-claude-code-emulator
git checkout 5541e5c1cb0895cfd4390391dc642c74fc5d0a1a
```

### Step 3: Install `openclaw-cc-camouflage`

```bash
# Option A: npm global (published package)
npm install -g openclaw-cc-camouflage

# Option B: from source
cd ~/github
git clone https://github.com/codeg-dev/openclaw-cc-camouflage.git
cd openclaw-cc-camouflage
bun install
```

### Step 4: Configure the emulator path

Tell the plugin where to find `not-claude-code-emulator`:

```bash
# If you used npm global install:
export OC_CAMOUFLAGE_EMULATOR_ROOT="$(npm root -g)/not-claude-code-emulator"

# If you cloned manually:
export OC_CAMOUFLAGE_EMULATOR_ROOT="$HOME/github/not-claude-code-emulator"
```

Add to your shell profile for persistence:

```bash
# ~/.zshrc or ~/.bashrc
echo 'export OC_CAMOUFLAGE_EMULATOR_ROOT="$(npm root -g)/not-claude-code-emulator"' >> ~/.zshrc
```

Optional — configure additional fallback search paths (colon-separated on macOS/Linux, semicolon on Windows):

```bash
export OC_CAMOUFLAGE_EMULATOR_FALLBACK_PATHS="/opt/emulator:$HOME/.local/share/emulator"
```

### Step 5: Register the plugin in OpenClaw

Add to your `openclaw.json` or `openclaw.jsonc`:

```json
{
  "plugins": ["openclaw-cc-camouflage"]
}
```

If you installed from source, use the local path:

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

### Step 6: Verify the installation

```bash
bun run status
```

A healthy installation reports:

```
emulator=present
patch=none
support=supported
```

Exit code 0 means everything is in order. Exit code 1 means something needs attention.

For a more detailed picture:

```bash
bun run doctor
# emulator=present
# patch=none
# support=supported
# doctor=healthy
#
# Maintenance status is healthy.
# next: Emulator prerequisite is readable and the current platform is supported.
# next: All tools are available.
```

If you see `emulator=missing`, verify `OC_CAMOUFLAGE_EMULATOR_ROOT` points to a directory containing `not-claude-code-emulator`'s `package.json`.

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
patch=none
support=supported
```

Exit code 0 means healthy. Exit code 1 means something needs attention.

### `doctor`

Provides diagnostic guidance based on the current state.

```bash
bun run doctor
```

Inspects files and reports actionable next steps. Does not install, patch, or modify anything. Reads and reports only.

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

In the current version, this validates the environment but does not modify any peer state.

## Why automatic hooks are verify-only

Automatic hooks in this plugin are limited to verification and metadata only. They do not apply patches automatically because:

1. Mutating a peer without explicit user intent violates the principle of least surprise
2. Patching failures need human review, not silent retries
3. Rollback requires explicit consent to restore state

The hooks warn when drift is detected. You decide whether to apply, revert, or leave the environment unchanged.

The plugin verifies readiness. What you do with a properly-maintained setup is between you and your subscription plan.

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

Read-only check. Validates fixture integrity and upstream references without modifying anything. Exits 0 on pinned supported targets.

## Documentation

- `docs/install.md` - Prerequisites and install steps
- `docs/compatibility.md` - Compatibility boundaries
- `docs/support-matrix.md` - Locked fixture versions
- `docs/non-goals.md` - Explicit out-of-scope items
- `docs/rollback.md` - Emulator recovery procedures

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
