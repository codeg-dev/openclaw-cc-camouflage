# Compatibility

This document defines the compatibility boundaries for `openclaw-cc-camouflage`.

## Pinned upstream fixtures

v1 is locked to a specific upstream commit. This is not a semver range. It is
an exact SHA.

| Upstream | Commit | Status |
|----------|--------|--------|
| `not-claude-code-emulator` | `5541e5c1cb0895cfd4390391dc642c74fc5d0a1a` | Fixture-locked |

Note: Unlike the OpenCode variant, there is no auth peer plugin fixture. OpenClaw
provides native Anthropic auth.

This commit is verified through SHA256 checksums in `patches/manifest.json`.
Any deviation from this fixture is classified as drift.

## Platform compatibility

| Platform | v1 Status | Notes |
|----------|-----------|-------|
| macOS | Supported | Primary development and test environment |
| Linux | Supported | CI and server deployments |
| Windows | Supported | Drive-letter, backslash, and `node_modules` path discovery are supported |

Windows support is explicit. Config-declared paths and cache-style installs are
recognized with Windows drive letters and path separators.

## Toolchain compatibility

| Tool | Requirement | Notes |
|------|-------------|-------|
| Bun | Required | Development, test, and runtime |
| Node.js | Not supported | Do not attempt Node-only workflows |
| npm/pnpm/yarn | Not tested | Use Bun exclusively |

This package is built for Bun. While some parts may work with Node, this is
not a support target.

## Plugin compatibility

The plugin must be discoverable at one of these locations:

1. Config-declared path in `~/.config/openclaw/openclaw.json(c)`
2. OpenClaw plugin cache under `~/.config/openclaw/plugins/`

Local-folder installs (option 1) are preferred and prioritized over cache
discovery.

## Patch compatibility

For OpenClaw, patch functionality is stubbed. The patch_apply and patch_revert
tools exist for API compatibility but have no active targets:

- No peer plugin requires patches (OpenClaw has native auth)
- Tools perform validation and reporting only
- They do not modify any files

The stub behavior is compatible when:

1. The platform is supported
2. The emulator is at the pinned commit or compatible version

## What constitutes drift

Drift is detected when:

- The emulator does not match expected configuration
- The fixture SHA256 values do not match the manifest
- Environment variables are misconfigured

Drift is not an error in itself. It is a signal that the environment differs
from the tested baseline. You decide how to proceed:

1. Reinstall the emulator at the pinned commit
2. Update environment variables
3. Verify the configuration

## Forward compatibility

This package does not promise forward compatibility with:

- Newer commits of upstream repositories
- Different patch formats
- Additional platforms
- Alternate toolchains

Each of these would require explicit testing and updated fixture locks.

## Patch engine note

The patch engine exists for API compatibility with the OpenCode variant but
has no active targets in OpenClaw. The implementation uses the same `diff`
package (jsdiff) but performs validation only, never modification.

### What is different from OpenCode variant

| Aspect | OpenCode variant | OpenClaw variant |
|--------|-----------------|------------------|
| Auth peer | Required (auth plugin) | Not required (native auth) |
| Patch targets | Active (auth peer) | Stub (no targets) |
| Environment vars | Claude Code prefix | OC_CAMOUFLAGE_* |
| Peer patches | Supported | Not applicable |

## Checking compatibility

Run the compatibility canary to verify fixture integrity:

```bash
bun run compat:canary
```

This validates:
- Fixture files exist and have correct SHA256 values
- Manifest structure is valid
- Upstream references match the locked commits
- Platform support

Exit code 0 means the environment matches the pinned expectations.

## Compatibility matrix summary

| Component | Compatible Version | Detection Method |
|-----------|-------------------|------------------|
| Emulator | `5541e5c` | Fixture hash in manifest |
| Auth | Native (OpenClaw) | Platform capability |
| Platform | macOS, Linux, Windows | `process.platform` |
| Toolchain | Bun latest | `bun --version` |

Any deviation from this matrix will be reported by `status`, `doctor`, or
`compat:canary` tools.
