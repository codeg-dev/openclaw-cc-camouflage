import { afterEach, describe, expect, it } from 'bun:test'
import { join } from 'node:path'

import { resetDetectSpawnSyncForTests, setDetectSpawnSyncForTests } from '../../src/runtime/detect'
import { formatStatus, isStatusHealthy, runStatusTool } from '../../src/tools/status'
import {
  createTempHome,
  writeRecognizedEmulatorRoot,
  writeUnrecognizedEmulatorRoot,
} from '../helpers/emulator-scenario'

type SpawnSyncResult = {
  error?: NodeJS.ErrnoException
  status: number | null
  stdout: string
}

const originalEmulatorRoot = process.env.OC_CAMOUFLAGE_EMULATOR_ROOT
const originalFallbackPaths = process.env.OC_CAMOUFLAGE_EMULATOR_FALLBACK_PATHS
const originalPlatform = process.env.OC_CAMOUFLAGE_PLATFORM

function createSpawnSyncResult(overrides: Partial<SpawnSyncResult> = {}): SpawnSyncResult {
  return {
    status: 0,
    stdout: '',
    ...overrides,
  }
}

afterEach(() => {
  if (originalEmulatorRoot === undefined) {
    delete process.env.OC_CAMOUFLAGE_EMULATOR_ROOT
  } else {
    process.env.OC_CAMOUFLAGE_EMULATOR_ROOT = originalEmulatorRoot
  }

  if (originalFallbackPaths === undefined) {
    delete process.env.OC_CAMOUFLAGE_EMULATOR_FALLBACK_PATHS
  } else {
    process.env.OC_CAMOUFLAGE_EMULATOR_FALLBACK_PATHS = originalFallbackPaths
  }

  if (originalPlatform === undefined) {
    delete process.env.OC_CAMOUFLAGE_PLATFORM
  } else {
    process.env.OC_CAMOUFLAGE_PLATFORM = originalPlatform
  }

  resetDetectSpawnSyncForTests()
})

describe('status tool', () => {
  it('formats only emulator, patch, and support as key=value lines', () => {
    const output = formatStatus({
      emulator: 'present',
      patch: 'none',
      support: 'supported',
    })

    expect(output.split('\n')).toEqual([
      'emulator=present',
      'patch=none',
      'support=supported',
    ])
    expect(output).not.toContain('peer=')
    expect(output).not.toContain('install_mode=')
    expect(output.split('\n').every((line: string) => /^[a-z_]+=[a-z]+$/.test(line))).toBe(true)
  })

  it('treats present emulator on supported platform as healthy', () => {
    expect(
      isStatusHealthy({
        emulator: 'present',
        patch: 'none',
        support: 'supported',
      }),
    ).toBe(true)
  })

  it('treats unreachable emulator as unhealthy', () => {
    expect(
      isStatusHealthy({
        emulator: 'unreachable',
        patch: 'none',
        support: 'supported',
      }),
    ).toBe(false)
  })

  it('returns machine-readable output and exit code 0 when emulator is present', async () => {
    const fixture = await createTempHome('status-present')

    try {
      const emulatorRoot = join(fixture.root, 'custom-emulator')
      await writeRecognizedEmulatorRoot(emulatorRoot)

      process.env.OC_CAMOUFLAGE_EMULATOR_ROOT = emulatorRoot
      delete process.env.OC_CAMOUFLAGE_EMULATOR_FALLBACK_PATHS
      setDetectSpawnSyncForTests(() => createSpawnSyncResult({ status: 1 }))

      const result = runStatusTool({ homeDir: fixture.root, platform: 'darwin' })

      expect(result.status).toEqual({
        emulator: 'present',
        patch: 'none',
        support: 'supported',
      })
      expect(result.output).toBe('emulator=present\npatch=none\nsupport=supported')
      expect(result.exitCode).toBe(0)
    } finally {
      await fixture.cleanup()
    }
  })

  it('returns exit code 1 when emulator is missing', async () => {
    const fixture = await createTempHome('status-missing')

    try {
      process.env.OC_CAMOUFLAGE_EMULATOR_ROOT = join(fixture.root, 'missing-emulator')
      delete process.env.OC_CAMOUFLAGE_EMULATOR_FALLBACK_PATHS
      setDetectSpawnSyncForTests(() => createSpawnSyncResult({ status: 1 }))

      const result = runStatusTool({ homeDir: fixture.root, platform: 'darwin' })

      expect(result.status.emulator).toBe('missing')
      expect(result.output).toContain('emulator=missing')
      expect(result.exitCode).toBe(1)
    } finally {
      await fixture.cleanup()
    }
  })

  it('returns exit code 1 when emulator is unreachable', async () => {
    const fixture = await createTempHome('status-unreachable')

    try {
      const emulatorRoot = join(fixture.root, 'wrong-emulator')
      await writeUnrecognizedEmulatorRoot(emulatorRoot)

      process.env.OC_CAMOUFLAGE_EMULATOR_ROOT = emulatorRoot
      delete process.env.OC_CAMOUFLAGE_EMULATOR_FALLBACK_PATHS
      setDetectSpawnSyncForTests(() => createSpawnSyncResult({ status: 1 }))

      const result = runStatusTool({ homeDir: fixture.root, platform: 'darwin' })

      expect(result.status.emulator).toBe('unreachable')
      expect(result.output).toContain('emulator=unreachable')
      expect(result.exitCode).toBe(1)
    } finally {
      await fixture.cleanup()
    }
  })

  it('reflects OC_CAMOUFLAGE_PLATFORM in support output when no platform option is passed', async () => {
    const fixture = await createTempHome('status-platform-env')

    try {
      const emulatorRoot = join(fixture.root, 'custom-emulator')
      await writeRecognizedEmulatorRoot(emulatorRoot)

      process.env.OC_CAMOUFLAGE_EMULATOR_ROOT = emulatorRoot
      process.env.OC_CAMOUFLAGE_PLATFORM = 'bsd'
      delete process.env.OC_CAMOUFLAGE_EMULATOR_FALLBACK_PATHS
      setDetectSpawnSyncForTests(() => createSpawnSyncResult({ status: 1 }))

      const result = runStatusTool({ homeDir: fixture.root })

      expect(result.status.support).toBe('unsupported')
      expect(result.output).toContain('support=unsupported')
      expect(result.exitCode).toBe(1)
    } finally {
      await fixture.cleanup()
    }
  })
})
