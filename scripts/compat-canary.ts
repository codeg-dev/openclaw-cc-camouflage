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
    repo: string
    sha: string
  }
  files: ManifestFile[]
}

interface Manifest {
  schemaVersion: number
  packages: unknown[]
  referenceFixtures?: ReferenceFixture[]
}

type CheckStatus = 'ok' | 'fail' | 'warn' | 'skip'

interface CheckResult {
  name: string
  status: CheckStatus
  message: string
  /** @deprecated Use status === 'ok' */
  passed: boolean
}

interface GitHubRepoResponse {
  archived?: boolean
  message?: string
}

const PROJECT_ROOT = resolve(import.meta.dir, '..')
const MANIFEST_PATH = resolve(PROJECT_ROOT, 'patches', 'manifest.json')
const SUPPORTED_PLATFORMS = new Set(['darwin', 'linux', 'win32'])
const PINNED = {
  'not-claude-code-emulator': '5541e5c1cb0895cfd4390391dc642c74fc5d0a1a',
} as const

const UPSTREAM_REPOS: Record<string, string> = {
  'not-claude-code-emulator': 'https://api.github.com/repos/code-yeongyu/not-claude-code-emulator',
}

function ok(name: string, message: string): CheckResult {
  return { name, status: 'ok', passed: true, message }
}

function fail(name: string, message: string): CheckResult {
  return { name, status: 'fail', passed: false, message }
}

function warn(name: string, message: string): CheckResult {
  return { name, status: 'warn', passed: true, message }
}

function skip(name: string, message: string): CheckResult {
  return { name, status: 'skip', passed: true, message }
}

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
  const supported = SUPPORTED_PLATFORMS.has(platform)

  return supported
    ? ok('platform-support', `Platform ${platform} is supported`)
    : fail(
        'platform-support',
        `Platform ${platform} is not supported (expected one of ${[...SUPPORTED_PLATFORMS].join(', ')})`,
      )
}

function checkManifestExists(): CheckResult {
  return existsSync(MANIFEST_PATH)
    ? ok('manifest-exists', 'Manifest file exists')
    : fail('manifest-exists', `Manifest not found at ${MANIFEST_PATH}`)
}

function checkManifestShape(manifest: Manifest | null): CheckResult[] {
  if (!manifest) {
    return [fail('manifest-shape', 'Manifest could not be loaded')]
  }

  const referenceFixtures = manifest.referenceFixtures ?? []
  const schemaOk = manifest.schemaVersion === 1
  const packagesOk = Array.isArray(manifest.packages) && manifest.packages.length === 0
  const fixturesOk =
    referenceFixtures.length === 1 && referenceFixtures[0]?.name === 'not-claude-code-emulator'

  return [
    schemaOk
      ? ok('manifest-schema', 'Manifest schemaVersion is 1')
      : fail('manifest-schema', `Manifest schemaVersion mismatch: ${manifest.schemaVersion}`),
    packagesOk
      ? ok('manifest-packages-empty', 'Manifest packages array is empty')
      : fail(
          'manifest-packages-empty',
          `Manifest packages must be empty (got ${manifest.packages?.length ?? 'invalid'})`,
        ),
    fixturesOk
      ? ok('reference-fixtures-only-emulator', 'Manifest contains only the emulator reference fixture')
      : fail(
          'reference-fixtures-only-emulator',
          `Unexpected reference fixture set: ${referenceFixtures.map((f) => f.name).join(', ') || '<none>'}`,
        ),
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
    return [fail(`reference-fixture:${expectedName}`, `Reference fixture ${expectedName} not found`)]
  }

  const results: CheckResult[] = [
    fixture.upstream.sha === expectedSha
      ? ok(`reference-fixture-sha:${expectedName}`, `Reference fixture is pinned to ${expectedSha}`)
      : fail(
          `reference-fixture-sha:${expectedName}`,
          `Reference fixture SHA mismatch: expected ${expectedSha}, got ${fixture.upstream.sha}`,
        ),
  ]

  for (const file of fixture.files) {
    const fullPath = resolve(PROJECT_ROOT, file.fixturePath)
    const exists = existsSync(fullPath)

    results.push(
      exists
        ? ok(`reference-fixture-exists:${file.upstreamPath}`, `Fixture exists: ${file.fixturePath}`)
        : fail(`reference-fixture-exists:${file.upstreamPath}`, `Fixture missing: ${file.fixturePath}`),
    )

    if (!exists) {
      continue
    }

    const actualHash = sha256File(fullPath)
    results.push(
      actualHash === file.sha256
        ? ok(`reference-fixture-hash:${file.upstreamPath}`, `Fixture hash matches for ${file.upstreamPath}`)
        : fail(
            `reference-fixture-hash:${file.upstreamPath}`,
            `Fixture hash mismatch for ${file.upstreamPath}: expected ${file.sha256}, got ${actualHash}`,
          ),
    )
  }

  return results
}

async function checkUpstreamArchived(packageName: string): Promise<CheckResult> {
  const checkName = `upstream-archive-status:${packageName}`
  const apiUrl = UPSTREAM_REPOS[packageName]

  if (!apiUrl) {
    return skip(checkName, `No upstream repo URL configured for ${packageName}`)
  }

  try {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 8000)

    let response: Response
    try {
      response = await fetch(apiUrl, {
        headers: { Accept: 'application/vnd.github+json', 'User-Agent': 'openclaw-cc-camouflage-canary/1' },
        signal: controller.signal,
      })
    } finally {
      clearTimeout(timeout)
    }

    if (response.status === 403 || response.status === 429) {
      return skip(checkName, `GitHub API rate-limited (${response.status}); archive check skipped`)
    }

    if (!response.ok) {
      return skip(checkName, `GitHub API returned ${response.status}; archive check skipped`)
    }

    const data = (await response.json()) as GitHubRepoResponse

    if (data.archived === true) {
      return warn(
        checkName,
        `Upstream repository '${packageName}' is archived. No future patches or security fixes expected. Existing installs are unaffected.`,
      )
    }

    return ok(checkName, `Upstream repository '${packageName}' is active`)
  } catch (err) {
    const isNetwork =
      err instanceof TypeError || (err instanceof DOMException && err.name === 'AbortError')
    if (isNetwork) {
      return skip(checkName, `Network unavailable or timed out; archive check skipped`)
    }
    return skip(checkName, `Archive check skipped: ${(err as Error).message}`)
  }
}

async function runAllChecks(): Promise<CheckResult[]> {
  const results: CheckResult[] = [checkPlatform(), checkManifestExists()]

  let manifest: Manifest | null = null
  try {
    manifest = loadManifest()
  } catch {
    manifest = null
  }

  results.push(...checkManifestShape(manifest))
  results.push(...checkPinnedFixture(manifest))

  const archiveChecks = await Promise.all(
    Object.keys(UPSTREAM_REPOS).map((pkg) => checkUpstreamArchived(pkg)),
  )
  results.push(...archiveChecks)

  return results
}

function statusLabel(status: CheckStatus): string {
  switch (status) {
    case 'ok':
      return 'OK  '
    case 'fail':
      return 'FAIL'
    case 'warn':
      return 'WARN'
    case 'skip':
      return 'SKIP'
  }
}

async function main(): Promise<number> {
  console.log('openclaw-cc-camouflage compatibility canary')
  console.log('============================================')

  const results = await runAllChecks()
  const failed = results.filter((r) => r.status === 'fail')
  const warned = results.filter((r) => r.status === 'warn')
  const skipped = results.filter((r) => r.status === 'skip')

  for (const result of results) {
    console.log(`${statusLabel(result.status)} ${result.name}: ${result.message}`)
  }

  console.log('--------------------------------------------')
  console.log(`results=${results.length}`)
  console.log(`failed=${failed.length}`)
  if (warned.length > 0) {
    console.log(`warnings=${warned.length}`)
  }
  if (skipped.length > 0) {
    console.log(`skipped=${skipped.length}`)
  }

  if (failed.length > 0) {
    console.log('compat_canary=fail')
    return 1
  }

  if (warned.length > 0) {
    console.log('compat_canary=ok_with_warnings')
  } else {
    console.log('compat_canary=ok')
  }

  return 0
}

main().then((code) => process.exit(code))
