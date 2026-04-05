# v1 non-goals

This document locks the v1 non-goals for `openclaw-cc-camouflage`.

v1 stays aligned with the exact Task 1 fixture locks:

- `not-claude-code-emulator` -> `5541e5c1cb0895cfd4390391dc642c74fc5d0a1a`

Note: Unlike the OpenCode variant, there is no auth peer plugin fixture because
OpenClaw provides native Anthropic auth.

`openclaw-cc-camouflage` remains a companion maintenance plugin. The following
items are explicitly out of scope for v1.

## Locked non-goals

- Emulator fork: v1 must not fork `not-claude-code-emulator` or re-home the
  Anthropic-compatible message runtime into this repository.
- Auth peer plugin: v1 must not require or implement an auth peer plugin.
  OpenClaw provides native Anthropic auth, so there is no need for a separate
  auth plugin or patches to one.
- Binary patching: v1 must not patch upstream binaries as a supported primary
  strategy.
- Live OAuth CI: v1 must not require live OAuth credentials or live OAuth flows
  in CI.
- Generic multi-provider engine: v1 must not become a general provider-routing
  framework beyond the locked companion-plugin maintenance scope.
- Install-time mutation: v1 must not mutate peer installations during install.
  Any patching or maintenance action must remain an explicit runtime operation,
  not an install side effect.
- Active patch targets: The patch_apply and patch_revert tools are stubs with no
  active targets. v1 must not add active patch targets (OpenClaw has native auth).

## Boundary Consequences

- Future work may integrate with upstream projects, but integration does not
  permit absorbing upstream ownership.
- If a proposal requires breaking one of the non-goals above, it is outside the
  v1 contract until the project intentionally re-scopes it.
- The stub nature of patch tools is intentional and aligns with OpenClaw's
  native auth capability.

## Comparison with OpenCode Variant

The OpenCode variant has additional non-goals related to the auth peer plugin:

| Non-goal | OpenCode variant | OpenClaw variant |
|----------|-----------------|------------------|
| Auth-plugin fork | Explicit non-goal | Not applicable (no auth peer) |
| Auth peer patches | Active concern | Stub (no targets) |
| Auth peer management | Required | Not required |

This difference reflects the architectural distinction: OpenClaw provides native
Anthropic auth, while OpenCode requires a separate auth peer plugin.
