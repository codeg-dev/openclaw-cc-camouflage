# Support Matrix

This document locks the v1 support contract for `openclaw-cc-camouflage`.
Version drift is not allowed in this scope: v1 is pinned to the exact Task 1
fixture locks below.

- `not-claude-code-emulator` -> `5541e5c1cb0895cfd4390391dc642c74fc5d0a1a`

Note: Unlike the OpenCode variant, there is no auth peer plugin fixture. OpenClaw
provides native Anthropic auth, eliminating the need for a separate auth plugin.

## Prerequisites

- **Node.js** - Required for all platforms. Install from [nodejs.org](https://nodejs.org/) or use a version manager.

## Platform Support

| Area | v1 status | Notes |
| --- | --- | --- |
| macOS | Supported | Primary supported desktop environment for local plugin maintenance flows. |
| Linux | Supported | Supported for local plugin maintenance flows with the same pinned upstream fixtures. |
| Windows | Supported | Supported for local plugin maintenance flows, including drive-letter and backslash path discovery. |

## Toolchain Support

| Area | v1 status | Notes |
| --- | --- | --- |
| Bun | required for development and test | Bun is the development and test toolchain for v1. |
| Node.js-only workflow | not a v1 support target | Documentation and verification should not imply an alternate Node-only development contract. |

## Installation Boundary

- Package-style plugin distribution may exist later, but v1 must also handle
  local-folder plugin installs.
- Local-folder installs must either be supported end to end or fail explicitly
  with a clear reason; v1 documentation must not imply a cache-only install
  model.
- Plugin behavior must remain compatible with the pinned upstream fixture above.

## Environment Variables

The following environment variables are supported:

| Variable | Purpose | Required |
|----------|---------|----------|
| `OC_CAMOUFLAGE_EMULATOR_ROOT` | Path to the emulator installation | Yes (for npm global installs) |
| `OC_CAMOUFLAGE_EMULATOR_FALLBACK_PATHS` | Additional paths to search for emulator | No |
| `OC_CAMOUFLAGE_PLATFORM` | Override platform detection | No |

Note: Environment variables use the `OC_` prefix (OpenClaw) instead of `CC_`
(Claude Code) used by the OpenCode variant.

## Support Notes

- v1 support is limited to companion-plugin maintenance behavior owned by
  `openclaw-cc-camouflage`.
- v1 support remains limited to the platforms listed above; other platforms
  outside this locked contract remain unsupported.
- Unlike the OpenCode variant, there are no auth peer plugin support concerns
  because OpenClaw provides native Anthropic auth.

## Patch Support

For OpenClaw, the patch_apply and patch_revert tools are stubs:

- They perform validation and reporting
- They do not modify any files
- No active patch targets exist (no auth peer to patch)

This is by design. OpenClaw's native auth eliminates the need for auth plugin
patches that the OpenCode variant requires.

## Feature Comparison with OpenCode Variant

| Feature | OpenCode variant | OpenClaw variant |
|---------|-----------------|------------------|
| Auth peer | Required (auth plugin) | Not required (native) |
| Patch targets | Active | Stub (no targets) |
| Environment prefix | Claude Code prefix | OC_CAMOUFLAGE_* |
| Emulator support | Yes | Yes |
| Platforms | macOS, Linux, Windows | macOS, Linux, Windows |
