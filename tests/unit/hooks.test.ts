import { describe, expect, it } from 'bun:test'
import pluginEntry, { explicitToolIds, pluginName } from '../../src/index'

describe('plugin entry exports', () => {
  it('has a default export', () => {
    expect(pluginEntry).toBeDefined()
  })

  it('exports pluginName as openclaw-cc-camouflage', () => {
    expect(pluginName).toBe('openclaw-cc-camouflage')
  })

  it('exports exactly four explicit tool ids', () => {
    expect(explicitToolIds).toEqual(['status', 'doctor', 'patch_apply', 'patch_revert'])
    expect(explicitToolIds).toHaveLength(4)
  })
})
