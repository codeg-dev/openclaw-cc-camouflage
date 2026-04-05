# Rollback Guide

This document provides concrete steps for rolling back changes and recovering
from issues.

## Important: No Active Patch Targets

For `openclaw-cc-camouflage`, the patch_apply and patch_revert tools are stubs
with no active targets. OpenClaw provides native Anthropic auth, so there is
no peer plugin requiring patches. This document covers emulator recovery and
clean state restoration instead.

## When to roll back

You should consider rolling back when:

1. The emulator is in an unexpected state
2. You need to reset to a known-good emulator version
3. You are debugging and need a clean baseline
4. The doctor tool reports issues with the emulator

## Rollback methods

### Method 1: Reinstall emulator (recommended)

For a clean emulator at the pinned commit:

```bash
# Remove existing emulator
npm uninstall -g not-claude-code-emulator

# Reinstall at latest (or specific version)
npm install -g not-claude-code-emulator

# If you need the exact pinned commit, use git clone instead
cd ~/github
rm -rf not-claude-code-emulator
git clone https://github.com/code-yeongyu/not-claude-code-emulator.git
cd not-claude-code-emulator
git checkout 5541e5c1cb0895cfd4390391dc642c74fc5d0a1a
```

### Method 2: Reset environment variables

If environment variables are misconfigured:

```bash
# Check current setting
echo $OC_CAMOUFLAGE_EMULATOR_ROOT

# Reset to correct value
export OC_CAMOUFLAGE_EMULATOR_ROOT=$(npm root -g)/not-claude-code-emulator

# Add to shell profile for persistence
echo 'export OC_CAMOUFLAGE_EMULATOR_ROOT=$(npm root -g)/not-claude-code-emulator' >> ~/.zshrc
```

### Method 3: Re-clone the entire setup

For a complete reset:

```bash
# Backup any local changes you want to keep
cp -r ~/github/openclaw-cc-camouflage ~/github/openclaw-cc-camouflage.backup

# Remove and re-clone
rm -rf ~/github/openclaw-cc-camouflage
cd ~/github
git clone https://github.com/codeg-dev/openclaw-cc-camouflage.git
cd openclaw-cc-camouflage
bun install
```

This gives you a completely clean installation.

## Verification after rollback

After any rollback method, verify the state:

```bash
# Check status
bun run status

# Expected output for clean state
# emulator=present
# patch=clean
# install_mode=local-folder
# support=supported

# Run doctor for confirmation
bun run doctor

# Expected: diagnosis=clean
```

## Troubleshooting rollback

### "emulator=missing"

The emulator is not discoverable. Check:

1. Is `not-claude-code-emulator` installed? Run `npm list -g not-claude-code-emulator`
2. Is `OC_CAMOUFLAGE_EMULATOR_ROOT` set? Run `echo $OC_CAMOUFLAGE_EMULATOR_ROOT`
3. Does the path exist? Run `ls -la $OC_CAMOUFLAGE_EMULATOR_ROOT`

### "patch=drift"

For OpenClaw, this should always show `patch=clean` since there are no active
patch targets. If you see `patch=drift`, it indicates a configuration issue.

Run the doctor tool:

```bash
bun run doctor
```

### "Read-only path detected"

The emulator root or a parent directory is not writable. Check permissions:

```bash
ls -la ~/github/not-claude-code-emulator
```

Fix permissions or run from a writable location.

## Preventing rollback needs

To minimize rollback scenarios:

1. Always run `bun run status` before starting work
2. Keep the emulator at the pinned commit unless you understand the implications
3. Check the doctor output when issues arise
4. Maintain the `OC_CAMOUFLAGE_EMULATOR_ROOT` environment variable

## Emergency recovery

If everything is broken and you need a known-good state:

```bash
# 1. Remove the plugin entirely
rm -rf ~/github/openclaw-cc-camouflage

# 2. Re-clone and install
cd ~/github
git clone https://github.com/codeg-dev/openclaw-cc-camouflage.git
cd openclaw-cc-camouflage
bun install

# 3. Verify the emulator is present
bun run status
bun run doctor
```

This is the nuclear option but guarantees a clean starting point.

## Note on Patch Tools

The `patch_apply` and `patch_revert` tools in this plugin are stubs:

- They perform validation and reporting
- They do not modify any files (no active targets)
- They exit with informational messages

This is by design. OpenClaw provides native Anthropic auth, eliminating the
need for auth peer patches that the OpenCode variant requires.
