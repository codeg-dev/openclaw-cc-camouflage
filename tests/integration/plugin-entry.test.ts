import { describe, expect, it } from 'bun:test'
import pluginEntry from '../../src/index'

describe('definePluginEntry integration', () => {
  it('returns a plugin entry object with register function', () => {
    expect(pluginEntry).toBeDefined()
    expect(pluginEntry).toHaveProperty('register')
    expect(typeof pluginEntry.register).toBe('function')
  })

  it('sets plugin id to openclaw-cc-camouflage', () => {
    expect(pluginEntry.id).toBe('openclaw-cc-camouflage')
  })

  it('registers four tools through api.registerTool', () => {
    const registeredTools: Array<{ name?: string }> = []

    pluginEntry.register({
      registerTool(tool: { name?: string }) {
        registeredTools.push(tool)
      },
      registerHook() {
        return
      },
    } as any)

    expect(registeredTools).toHaveLength(4)
    expect(registeredTools.map((tool) => tool.name)).toEqual([
      'status',
      'doctor',
      'patch_apply',
      'patch_revert',
    ])
  })
})
