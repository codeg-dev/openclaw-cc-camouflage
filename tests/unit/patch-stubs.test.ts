import { describe, expect, it } from 'bun:test'

import { runPatchApply } from '../../src/patch/apply'
import { runPatchRevert } from '../../src/patch/revert'

describe('patch stubs', () => {
  describe('runPatchApply', () => {
    it('returns stub message', () => {
      const result = runPatchApply()
      expect(result.output).toContain('no patch target configured')
      expect(result.exitCode).toBe(0)
      expect(result.state).toBe('none')
    })

    it('returns exitCode 0', () => {
      expect(runPatchApply().exitCode).toBe(0)
    })
  })

  describe('runPatchRevert', () => {
    it('returns stub message', () => {
      const result = runPatchRevert()
      expect(result.output).toContain('no patch target configured')
      expect(result.exitCode).toBe(0)
      expect(result.state).toBe('none')
    })

    it('returns exitCode 0', () => {
      expect(runPatchRevert().exitCode).toBe(0)
    })
  })
})
