#!/usr/bin/env bun

import { createHash } from 'node:crypto'
import { existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'

interface ManifestFile {
  upstreamPath: string
  fixturePath: string
  sha256: string
}

interface ReferenceFixture {
  name: string
  upstream: {
    sha: string
  }
  files: ManifestFile[]
}

interface Manifest {
  schemaVersion: number
  packages: unknown[]
  referenceFixtures?: ReferenceFixture[]
}

interface CheckResult {
  name: string
  passed: boolean
  message: string
}

const PROJECT_ROOT = resolve(import.meta.dir, '..')
const MANIFEST_PATH = resolve(PROJECT_ROOT, 'patches', 'manifest.json')
const SUPPORTED_PLATFORMS = new Set(['darwin', 'linux', 'win32'])
const PINNED = {
  'not-claude-code-emulator': '5541e5c1cb0895cfd4390391dc642c74fc5d0a1a',
} as const

function sha256File(path: string): string {
  return createHash('sha256').update(readFileSync(path)).digest('hex')
}

function loadManifest(): Manifest {
  return JSON.parse(readFileSync(MANIFEST_PATH, 'utf8')) as Manifest
}

function currentPlatform(): string {
  return process.env.OC_CAMOUFLAGE_PLATFORM?.trim() || process.platform
}

function checkPlatform(): CheckResult {
  const platform = currentPlatform()
  const passed = SUPPORTED_PLATFORMS.has(platform)

  return {
    name: 'platform-support',
    passed,
    message: passed
      ? `Platform ${platform} is supported`
      : `Platform ${platform} is not supported (expected one of ${[...SUPPORTED_PLATFORMS].join(', ')})`,
  }
}

function checkManifestExists(): CheckResult {
  const passed = existsSync(MANIFEST_PATH)
  return {
    name: 'manifest-exists',
    passed,
    message: passed ? 'Manifest file exists' : `Manifest not found at ${MANIFEST_PATH}`,
  }
}

function checkManifestShape(manifest: Manifest | null): CheckResult[] {
  if (!manifest) {
    return [
      {
        name: 'manifest-shape',
        passed: false,
        message: 'Manifest could not be loaded',
      },
    ]
  }

  const referenceFixtures = manifest.referenceFixtures ?? []

  return [
    {
      name: 'manifest-schema',
      passed: manifest.schemaVersion === 1,
      message:
        manifest.schemaVersion === 1
          ? 'Manifest schemaVersion is 1'
          : `Manifest schemaVersion mismatch: ${manifest.schemaVersion}`,
    },
    {
      name: 'manifest-packages-empty',
      passed: Array.isArray(manifest.packages) && manifest.packages.length === 0,
      message:
        Array.isArray(manifest.packages) && manifest.packages.length === 0
          ? 'Manifest packages array is empty'
          : `Manifest packages must be empty (got ${manifest.packages?.length ?? 'invalid'})`,
    },
    {
      name: 'reference-fixtures-only-emulator',
      passed: referenceFixtures.length === 1 && referenceFixtures[0]?.name === 'not-claude-code-emulator',
      message:
        referenceFixtures.length === 1 && referenceFixtures[0]?.name === 'not-claude-code-emulator'
          ? 'Manifest contains only the emulator reference fixture'
          : `Unexpected reference fixture set: ${referenceFixtures.map((fixture) => fixture.name).join(', ') || '<none>'}`,
    },
  ]
}

function checkPinnedFixture(manifest: Manifest | null): CheckResult[] {
  if (!manifest) {
    return []
  }

  const expectedName = 'not-claude-code-emulator'
  const expectedSha = PINNED[expectedName]
  const fixture = (manifest.referenceFixtures ?? []).find((entry) => entry.name === expectedName)

  if (!fixture) {
    return [
      {
        name: `reference-fixture:${expectedName}`,
        passed: false,
        message: `Reference fixture ${expectedName} not found`,
      },
    ]
  }

  const results: CheckResult[] = [
    {
      name: `reference-fixture-sha:${expectedName}`,
      passed: fixture.upstream.sha === expectedSha,
      message:
        fixture.upstream.sha === expectedSha
          ? `Reference fixture is pinned to ${expectedSha}`
          : `Reference fixture SHA mismatch: expected ${expectedSha}, got ${fixture.upstream.sha}`,
    },
  ]

  for (const file of fixture.files) {
    const fullPath = resolve(PROJECT_ROOT, file.fixturePath)
    const exists = existsSync(fullPath)
    results.push({
      name: `reference-fixture-exists:${file.upstreamPath}`,
      passed: exists,
      message: exists ? `Fixture exists: ${file.fixturePath}` : `Fixture missing: ${file.fixturePath}`,
    })

    if (!exists) {
      continue
    }

    const actualHash = sha256File(fullPath)
    results.push({
      name: `reference-fixture-hash:${file.upstreamPath}`,
      passed: actualHash === file.sha256,
      message:
        actualHash === file.sha256
          ? `Fixture hash matches for ${file.upstreamPath}`
          : `Fixture hash mismatch for ${file.upstreamPath}: expected ${file.sha256}, got ${actualHash}`,
    })
  }

  return results
}

function runAllChecks(): CheckResult[] {
  const results: CheckResult[] = [checkPlatform(), checkManifestExists()]

  let manifest: Manifest | null = null
  try {
    manifest = loadManifest()
  } catch {
    manifest = null
  }

  results.push(...checkManifestShape(manifest))
  results.push(...checkPinnedFixture(manifest))
  return results
}

function main(): number {
  console.log('openclaw-cc-camouflage compatibility canary')
  console.log('============================================')

  const results = runAllChecks()
  const failed = results.filter((result) => !result.passed)

  for (const result of results) {
    console.log(`${result.passed ? 'OK' : 'FAIL'} ${result.name}: ${result.message}`)
  }

  console.log('--------------------------------------------')
  console.log(`results=${results.length}`)
  console.log(`failed=${failed.length}`)

  if (failed.length > 0) {
    console.log('compat_canary=fail')
    return 1
  }

  console.log('compat_canary=ok')
  return 0
}

process.exit(main())
