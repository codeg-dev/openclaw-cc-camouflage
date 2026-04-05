# Installation Guide

This document explains how to install `openclaw-cc-camouflage` and its
prerequisites.

## Prerequisites

You need two components installed in order:

1. `not-claude-code-emulator` - Message runtime
2. `openclaw-cc-camouflage` - This maintenance plugin

Note: Unlike the OpenCode variant, OpenClaw provides native Anthropic auth
and does not require a separate auth peer plugin.

## Step 1: Install the emulator

You have two options for installing the emulator:

### Option A: npm global install (recommended)

The easiest way to install the emulator:

```bash
npm install -g not-claude-code-emulator
```

### Option B: git clone (still supported)

Clone the message runtime that provides Anthropic-compatible interfaces:

```bash
cd ~/github
git clone https://github.com/code-yeongyu/not-claude-code-emulator.git
cd not-claude-code-emulator
git checkout 5541e5c1cb0895cfd4390391dc642c74fc5d0a1a
```

This specific commit is the pinned v1 target. Do not use a different version
unless you understand the compatibility implications.

Both methods are supported. npm global install is recommended for simplicity.

### Environment variable

If you installed via npm global, set the environment variable to tell the
plugin where to find the emulator:

```bash
export OC_CAMOUFLAGE_EMULATOR_ROOT=$(npm root -g)/not-claude-code-emulator
```

Add this to your shell profile (`.bashrc`, `.zshrc`, etc.) for persistence.

## Step 2: Install this plugin

Clone this repository:

```bash
cd ~/github
git clone https://github.com/codeg-dev/openclaw-cc-camouflage.git
cd openclaw-cc-camouflage
```

Install dependencies:

```bash
bun install
```

Install it as an OpenClaw plugin:

```bash
# Add to your openclaw.json or openclaw.jsonc:
# {
#   "plugins": [
#     {
#       "name": "openclaw-cc-camouflage",
#       "path": "~/github/openclaw-cc-camouflage"
#     }
#   ]
# }
```

## Verify the installation

Run the status tool to check if everything is detected:

```bash
bun run status
```

Expected output for a healthy installation:

```
emulator=present
patch=clean
install_mode=local-folder
support=supported
```

Run the doctor tool for diagnostic guidance:

```bash
bun run doctor
```

If you see `emulator=missing`, the emulator is not discoverable. Check your
environment variables and ensure the path is correct.

If you see `support=unsupported`, you are on a platform not covered by v1.

## OAuth source precedence

OpenClaw provides native Anthropic OAuth. The precedence is:

1. Claude desktop cache
2. System keychain
3. OpenClaw native auth store

On headless machines, or whenever Claude Safe Storage is unavailable, the desktop
cache and keychain are not treated as canonical. In that exception path, the
OpenClaw auth store becomes the canonical fallback.

## Local-folder vs cache installs

This plugin supports both installation modes:

| Mode | Discovery | Notes |
|------|-----------|-------|
| local-folder | Config-declared path in openclaw.json(c) | Preferred; exact path control |
| cache | OpenClaw plugin cache heuristics | Fallback; may vary by setup |

Local-folder installs are prioritized. If you have both, the config-declared
path takes precedence.

## Platform notes

### macOS

Primary supported environment. All features work as documented.

### Linux

Supported with the same pinned upstream fixtures. The plugin uses standard
POSIX utilities (`patch`, `git apply`) that should be available on most
distributions.

### Windows

Supported in v1 for the same pinned fixtures. Config-declared paths and
`node_modules`-style discovery accept Windows drive letters and backslashes.

## Troubleshooting

### "emulator=missing" after install

1. Check that `not-claude-code-emulator` is installed globally
2. Verify `OC_CAMOUFLAGE_EMULATOR_ROOT` is set correctly
3. Restart OpenClaw to pick up config changes
4. Run `bun run doctor` for detailed diagnostics

### "patch=drift"

For OpenClaw, patch functionality is stubbed and no active patch targets exist.
If you see `patch=drift`, this indicates a configuration issue rather than
an actual patch state. Run `bun run doctor` for guidance.

### "support=unsupported"

You are on an unsupported platform. For v1, macOS, Linux, and Windows are supported.
Do not proceed with workflows on unsupported platforms.

## Next steps

Once installed and healthy, you can:

- Run `bun run status` to check state
- Run `bun run doctor` for diagnostics
- Run OpenClaw tool `patch_apply` (stub, no active targets)
- Run OpenClaw tool `patch_revert` (stub, no active targets)

See [rollback.md](rollback.md) for details on emulator recovery procedures.
