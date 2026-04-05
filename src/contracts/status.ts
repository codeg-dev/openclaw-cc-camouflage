export type SupportStatus = 'supported' | 'unsupported'

export type EmulatorStatus = 'present' | 'missing' | 'unreachable'

export type PatchStatus = 'none' | 'clean' | 'drift' | 'incompatible'

export interface StatusContract {
  emulator: EmulatorStatus
  patch: PatchStatus
  support: SupportStatus
}
