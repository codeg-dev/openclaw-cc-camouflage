# openclaw-cc-camouflage Ownership Matrix

This document locks singular ownership for user-visible behavior in v1 of
`openclaw-cc-camouflage`. Task 1 fixture locks remain authoritative:

- `not-claude-code-emulator` -> `5541e5c1cb0895cfd4390391dc642c74fc5d0a1a`

Note: Unlike the OpenCode variant, there is no auth peer plugin fixture because
OpenClaw provides native Anthropic auth.

`openclaw-cc-camouflage` is a companion maintenance plugin. It is not an
emulator fork and it does not require an auth peer plugin.

## Ownership Rules

- Every user-visible behavior has exactly one owner.
- Cross-project integration may exist, but responsibility does not float.
- If behavior spans multiple components, the owner below remains the final
  authority for the v1 contract.

## Behavior Matrix

| User-visible behavior | Single owner | Why this owner is locked |
| --- | --- | --- |
| Anthropic-compatible message runtime | `not-claude-code-emulator` @ `5541e5c1cb0895cfd4390391dc642c74fc5d0a1a` | Runtime request and response behavior belongs to the emulator fixture, so `openclaw-cc-camouflage` must treat it as an upstream dependency instead of re-owning message execution semantics. |
| Auth loader and transform semantics | OpenClaw native | OpenClaw provides native Anthropic auth, so there is no separate auth plugin fixture. Token loading and auth wiring are handled by the platform natively. |
| Emulator detection | `openclaw-cc-camouflage` | Detecting the local companion plugin environment and deciding whether the emulator installation is present is plugin-specific orchestration, not upstream runtime behavior. |
| Doctor and status UX | `openclaw-cc-camouflage` | User-facing maintenance and health reporting are the companion plugin surface and must stay in this repo rather than inside the emulator. |
| Patch inventory | `openclaw-cc-camouflage` | Tracking which maintenance patches exist is a plugin-owned concern, though for OpenClaw this is stub behavior with no active targets. |
| Patch apply and revert orchestration | `openclaw-cc-camouflage` | The companion plugin owns orchestration over apply and revert flows, though for OpenClaw these are stubs with no active targets. |
| Verify-only automatic hooks | `openclaw-cc-camouflage` | Automatic verify-only hooks are a local maintenance policy surface and therefore belong to this repo, not to the emulator fixture. |

## Scope Boundary

- `openclaw-cc-camouflage` may observe or coordinate upstream components, but it
  does not take over emulator runtime semantics.
- Any later implementation task that conflicts with this matrix must be treated
  as out of scope for v1 unless this document is deliberately revised.
- The stub nature of patch tools is intentional: OpenClaw provides native auth,
  eliminating the need for auth peer patches.

## Comparison with OpenCode Variant

| Aspect | OpenCode variant | OpenClaw variant |
|--------|-----------------|------------------|
| Auth owner | Auth peer plugin | OpenClaw native |
| Patch targets | Active (auth peer) | Stub (no targets) |
| Peer detection | Detects auth peer + emulator | Detects emulator only |
| Patch orchestration | Active patching | Stub (validation only) |

This matrix reflects the architectural simplification in OpenClaw: native auth
eliminates the need for an auth peer plugin and its associated patch management.

## Environment Variables

The following ownership applies to environment variable handling:

| Variable | Owner | Purpose |
|----------|-------|---------|
| `OC_CAMOUFLAGE_EMULATOR_ROOT` | `openclaw-cc-camouflage` | Emulator discovery |
| `OC_CAMOUFLAGE_EMULATOR_FALLBACK_PATHS` | `openclaw-cc-camouflage` | Fallback paths |
| `OC_CAMOUFLAGE_PLATFORM` | `openclaw-cc-camouflage` | Platform override |

Note: The `OC_` prefix distinguishes OpenClaw variables from the `CC_` prefix
used by the OpenCode variant.
