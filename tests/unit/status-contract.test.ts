import { describe, expect, it } from 'bun:test'
import type { StatusContract, PatchStatus, EmulatorStatus, SupportStatus } from '../../src/contracts/status'

describe('StatusContract v2', () => {
  it('StatusContract has exactly emulator, patch, support fields', () => {
    const contract: StatusContract = {
      emulator: 'present',
      patch: 'none',
      support: 'supported',
    }
    expect(Object.keys(contract)).toEqual(['emulator', 'patch', 'support'])
    expect(Object.keys(contract)).not.toContain('peer')
    expect(Object.keys(contract)).not.toContain('install_mode')
  })

  it('PatchStatus includes none', () => {
    const status: PatchStatus = 'none'
    expect(status).toBe('none')
  })

  it('PatchStatus includes future patch states', () => {
    const statuses: PatchStatus[] = ['none', 'clean', 'drift', 'incompatible']
    expect(statuses).toHaveLength(4)
  })

  it('EmulatorStatus has present, missing, unreachable', () => {
    const statuses: EmulatorStatus[] = ['present', 'missing', 'unreachable']
    expect(statuses).toHaveLength(3)
  })

  it('SupportStatus has supported, unsupported', () => {
    const statuses: SupportStatus[] = ['supported', 'unsupported']
    expect(statuses).toHaveLength(2)
  })
})
