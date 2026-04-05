import { afterEach, describe, expect, mock, test } from 'bun:test'
import { delimiter, join } from 'node:path'

import {
  detectStatus,
  resetDetectSpawnSyncForTests,
  setDetectSpawnSyncForTests,
} from '../../src/runtime/detect'
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

type SpawnSyncImplementation = (
  command: string,
  args: string[],
  options: {
    encoding: string
    timeout: number
  },
) => SpawnSyncResult

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

function installSpawnSyncMock(implementation: SpawnSyncImplementation) {
  const spawnSyncMock = mock(implementation)
  setDetectSpawnSyncForTests((command, args, options) => spawnSyncMock(command, args, options))
  return spawnSyncMock
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

describe('emulator discovery', () => {
  test('finds emulator from OC_CAMOUFLAGE_EMULATOR_ROOT', async () => {
    const fixture = await createTempHome('emulator-env-root')

    try {
      const explicitRoot = join(fixture.root, 'custom-emulator')
      await writeRecognizedEmulatorRoot(explicitRoot)

      process.env.OC_CAMOUFLAGE_EMULATOR_ROOT = explicitRoot
      delete process.env.OC_CAMOUFLAGE_EMULATOR_FALLBACK_PATHS

      const spawnSyncMock = installSpawnSyncMock(() => createSpawnSyncResult())
      const status = detectStatus({ homeDir: fixture.root, platform: 'darwin' })

      expect(status).toEqual({
        emulator: 'present',
        patch: 'none',
        support: 'supported',
      })
      expect(spawnSyncMock).not.toHaveBeenCalled()
    } finally {
      await fixture.cleanup()
    }
  })

  test('returns missing when OC_CAMOUFLAGE_EMULATOR_ROOT points to an absent path', async () => {
    const fixture = await createTempHome('emulator-missing-root')

    try {
      process.env.OC_CAMOUFLAGE_EMULATOR_ROOT = join(fixture.root, 'missing-emulator')
      delete process.env.OC_CAMOUFLAGE_EMULATOR_FALLBACK_PATHS

      const spawnSyncMock = installSpawnSyncMock(() => {
        throw createEnoentError()
      })

      const status = detectStatus({ homeDir: fixture.root, platform: 'darwin' })

      expect(status.emulator).toBe('missing')
      expect(status.patch).toBe('none')
      expect(spawnSyncMock).toHaveBeenCalledTimes(1)
    } finally {
      await fixture.cleanup()
    }
  })

  test('detects emulator from npm root -g output', async () => {
    const fixture = await createTempHome('emulator-npm-root')

    try {
      const npmGlobalRoot = join(fixture.root, 'npm-global')
      await writeRecognizedEmulatorRoot(join(npmGlobalRoot, 'not-claude-code-emulator'))

      delete process.env.OC_CAMOUFLAGE_EMULATOR_ROOT
      delete process.env.OC_CAMOUFLAGE_EMULATOR_FALLBACK_PATHS

      const spawnSyncMock = installSpawnSyncMock((command, args, options) => {
        expect(command).toBe('npm')
        expect(args).toEqual(['root', '-g'])
        expect(options).toEqual({ encoding: 'utf8', timeout: 5000 })

        return createSpawnSyncResult({ stdout: `${npmGlobalRoot}\n` })
      })

      const status = detectStatus({ homeDir: fixture.root, platform: 'darwin' })

      expect(status.emulator).toBe('present')
      expect(spawnSyncMock).toHaveBeenCalledTimes(1)
    } finally {
      await fixture.cleanup()
    }
  })

  test('uses OC_CAMOUFLAGE_EMULATOR_FALLBACK_PATHS after npm discovery misses', async () => {
    const fixture = await createTempHome('emulator-fallback-paths')

    try {
      const fallbackRoot = join(fixture.root, 'fallbacks', 'preferred-emulator')
      await writeRecognizedEmulatorRoot(fallbackRoot)

      delete process.env.OC_CAMOUFLAGE_EMULATOR_ROOT
      process.env.OC_CAMOUFLAGE_EMULATOR_FALLBACK_PATHS = [
        join(fixture.root, 'fallbacks', 'missing-emulator'),
        '~/fallbacks/preferred-emulator',
      ].join(delimiter)

      const spawnSyncMock = installSpawnSyncMock(() => createSpawnSyncResult({ status: 1 }))
      const status = detectStatus({ homeDir: fixture.root, platform: 'darwin' })

      expect(status.emulator).toBe('present')
      expect(spawnSyncMock).toHaveBeenCalledTimes(1)
    } finally {
      await fixture.cleanup()
    }
  })

  test('returns missing when emulator cannot be found', async () => {
    const fixture = await createTempHome('emulator-missing-everywhere')

    try {
      delete process.env.OC_CAMOUFLAGE_EMULATOR_ROOT
      delete process.env.OC_CAMOUFLAGE_EMULATOR_FALLBACK_PATHS

      const spawnSyncMock = installSpawnSyncMock(() => {
        throw createEnoentError()
      })

      const status = detectStatus({ homeDir: fixture.root, platform: 'darwin' })

      expect(status.emulator).toBe('missing')
      expect(spawnSyncMock).toHaveBeenCalledTimes(1)
    } finally {
      await fixture.cleanup()
    }
  })

  test('returns unreachable when package name does not match emulator package', async () => {
    const fixture = await createTempHome('emulator-unrecognized-package')

    try {
      const explicitRoot = join(fixture.root, 'wrong-emulator')
      await writeUnrecognizedEmulatorRoot(explicitRoot)

      process.env.OC_CAMOUFLAGE_EMULATOR_ROOT = explicitRoot
      delete process.env.OC_CAMOUFLAGE_EMULATOR_FALLBACK_PATHS

      const spawnSyncMock = installSpawnSyncMock(() => createSpawnSyncResult())
      const status = detectStatus({ homeDir: fixture.root, platform: 'darwin' })

      expect(status.emulator).toBe('unreachable')
      expect(spawnSyncMock).not.toHaveBeenCalled()
    } finally {
      await fixture.cleanup()
    }
  })

  test('reflects OC_CAMOUFLAGE_PLATFORM in support field', async () => {
    const fixture = await createTempHome('emulator-platform-env')

    try {
      delete process.env.OC_CAMOUFLAGE_EMULATOR_ROOT
      delete process.env.OC_CAMOUFLAGE_EMULATOR_FALLBACK_PATHS
      process.env.OC_CAMOUFLAGE_PLATFORM = 'bsd'

      installSpawnSyncMock(() => {
        throw createEnoentError()
      })

      const status = detectStatus({ homeDir: fixture.root })

      expect(status.support).toBe('unsupported')
      expect(status.patch).toBe('none')
    } finally {
      await fixture.cleanup()
    }
  })
})
