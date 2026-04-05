import { describe, expect, it } from 'bun:test'
import { createHash } from 'node:crypto'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

const manifestPath = join(import.meta.dir, '../../patches/manifest.json')

describe('patches manifest', () => {
  it('manifest is valid JSON', () => {
    const raw = readFileSync(manifestPath, 'utf8')
    expect(() => JSON.parse(raw)).not.toThrow()
  })

  it('packages array is empty', () => {
    const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'))
    expect(manifest.packages).toEqual([])
  })

  it('referenceFixtures contains not-claude-code-emulator', () => {
    const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'))
    const emulator = (manifest.referenceFixtures ?? []).find(
      (f: { name: string }) => f.name === 'not-claude-code-emulator',
    )
    expect(emulator).toBeDefined()
  })

  it('emulator fixture file exists and SHA matches', () => {
    const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'))
    const emulator = (manifest.referenceFixtures ?? []).find(
      (f: { name: string }) => f.name === 'not-claude-code-emulator',
    )
    const fileEntry = emulator?.files?.[0]
    expect(fileEntry).toBeDefined()

    const repoRoot = join(import.meta.dir, '../..')
    const fixturePath = join(repoRoot, fileEntry.fixturePath)
    const fileContent = readFileSync(fixturePath)
    const hash = createHash('sha256').update(fileContent).digest('hex')
    expect(hash).toBe(fileEntry.sha256)
  })

  it('no opencode-anthropic-auth references in manifest', () => {
    const raw = readFileSync(manifestPath, 'utf8')
    expect(raw).not.toContain('opencode-anthropic-auth')
  })
})
