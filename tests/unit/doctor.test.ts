import { afterEach, describe, expect, test } from 'bun:test'
import { join } from 'node:path'

import { resetDetectSpawnSyncForTests, setDetectSpawnSyncForTests } from '../../src/runtime/detect'
import { runDoctorTool } from '../../src/tools/doctor'
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

function createEnoentError(): NodeJS.ErrnoException {
  const error = new Error('npm not found') as NodeJS.ErrnoException
  error.code = 'ENOENT'
  return error
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

describe('runDoctorTool', () => {
  test('reports healthy when emulator is present on a supported platform', async () => {
    const fixture = await createTempHome('doctor-healthy')

    try {
      const emulatorRoot = join(fixture.root, 'emulator')
      await writeRecognizedEmulatorRoot(emulatorRoot)
      process.env.OC_CAMOUFLAGE_EMULATOR_ROOT = emulatorRoot
      delete process.env.OC_CAMOUFLAGE_EMULATOR_FALLBACK_PATHS

      setDetectSpawnSyncForTests(() => createSpawnSyncResult())

      const result = runDoctorTool({ homeDir: fixture.root, platform: 'darwin' })

      expect(result.diagnosis).toBe('healthy')
      expect(result.exitCode).toBe(0)
      expect(result.output).toContain('Maintenance status is healthy.')
      expect(result.output).toContain('All tools are available.')
    } finally {
      await fixture.cleanup()
    }
  })

  test('prints install guidance when emulator is missing', async () => {
    const fixture = await createTempHome('doctor-missing')

    try {
      delete process.env.OC_CAMOUFLAGE_EMULATOR_ROOT
      delete process.env.OC_CAMOUFLAGE_EMULATOR_FALLBACK_PATHS
      setDetectSpawnSyncForTests(() => {
        throw createEnoentError()
      })

      const result = runDoctorTool({ homeDir: fixture.root, platform: 'darwin' })

      expect(result.diagnosis).toBe('broken')
      expect(result.exitCode).toBe(1)
      expect(result.output).toContain('not-claude-code-emulator')
      expect(result.output).toContain('OC_CAMOUFLAGE_EMULATOR_ROOT')
    } finally {
      await fixture.cleanup()
    }
  })

  test('prints permission guidance when emulator root is unreachable', async () => {
    const fixture = await createTempHome('doctor-unreachable')

    try {
      const emulatorRoot = join(fixture.root, 'broken-emulator')
      await writeUnrecognizedEmulatorRoot(emulatorRoot)
      process.env.OC_CAMOUFLAGE_EMULATOR_ROOT = emulatorRoot
      delete process.env.OC_CAMOUFLAGE_EMULATOR_FALLBACK_PATHS
      setDetectSpawnSyncForTests(() => createSpawnSyncResult())

      const result = runDoctorTool({ homeDir: fixture.root, platform: 'darwin' })

      expect(result.diagnosis).toBe('degraded')
      expect(result.exitCode).toBe(1)
      expect(result.output).toContain('Emulator root is unreachable. Check permissions.')
    } finally {
      await fixture.cleanup()
    }
  })

  test('never mentions opencode auth peer in output', async () => {
    const fixture = await createTempHome('doctor-no-peer-text')

    try {
      delete process.env.OC_CAMOUFLAGE_EMULATOR_ROOT
      delete process.env.OC_CAMOUFLAGE_EMULATOR_FALLBACK_PATHS
      setDetectSpawnSyncForTests(() => {
        throw createEnoentError()
      })

      const result = runDoctorTool({ homeDir: fixture.root, platform: 'darwin' })

      expect(result.output).not.toContain('opencode-anthropic-auth')
      expect(result.output).not.toContain('@ex-machina')
    } finally {
      await fixture.cleanup()
    }
  })

  test('never mentions CC_CAMOUFLAGE-prefixed variables in output', async () => {
    const fixture = await createTempHome('doctor-no-legacy-env')

    try {
      delete process.env.OC_CAMOUFLAGE_EMULATOR_ROOT
      delete process.env.OC_CAMOUFLAGE_EMULATOR_FALLBACK_PATHS
      setDetectSpawnSyncForTests(() => {
        throw createEnoentError()
      })

      const result = runDoctorTool({ homeDir: fixture.root, platform: 'darwin' })

      expect(result.output).not.toContain('CC_CAMOUFLAGE_')
    } finally {
      await fixture.cleanup()
    }
  })
})
