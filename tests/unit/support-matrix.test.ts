import { describe, expect, it } from 'bun:test'
import { detectSupport } from '../../src/runtime/support-matrix'

describe('detectSupport', () => {
  it('darwin is supported', () => {
    expect(detectSupport('darwin').support).toBe('supported')
  })
  it('linux is supported', () => {
    expect(detectSupport('linux').support).toBe('supported')
  })
  it('win32 is supported', () => {
    expect(detectSupport('win32').support).toBe('supported')
  })
  it('unknown platform is unsupported', () => {
    expect(detectSupport('bsd').support).toBe('unsupported')
  })
  it('returns platform name', () => {
    expect(detectSupport('darwin').platform).toBe('darwin')
  })
})
