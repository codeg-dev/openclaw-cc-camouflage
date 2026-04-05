import { createHash } from 'node:crypto'
import { existsSync, readFileSync, readdirSync } from 'node:fs'
import { join, resolve } from 'node:path'

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

interface PackageJson {
  name?: string
  files?: string[]
  main?: string
  types?: string
  exports?: Record<string, string | Record<string, string>>
}

const PROJECT_ROOT = resolve(import.meta.dir, '..', '..')
const PACKAGE_JSON_PATH = join(PROJECT_ROOT, 'package.json')
const README_PATH = join(PROJECT_ROOT, 'README.md')
const MANIFEST_PATH = join(PROJECT_ROOT, 'patches', 'manifest.json')
const DIST_PATH = join(PROJECT_ROOT, 'dist')

const REQUIRED_FILE_ENTRIES = ['dist/', 'README.md', 'patches/manifest.json'] as const
const FORBIDDEN_FILE_PREFIXES = ['src/', 'tests/', 'fixtures/', '.sisyphus/', '.tmp/'] as const
const EMULATOR_NAME = 'not-claude-code-emulator'
const EMULATOR_SHA = '5541e5c1cb0895cfd4390391dc642c74fc5d0a1a'

function ensure(condition: unknown, message: string): asserts condition {
  if (!condition) {
    throw new Error(message)
  }
}

function loadJson<T>(path: string): T {
  return JSON.parse(readFileSync(path, 'utf8')) as T
}

function sha256File(path: string): string {
  return createHash('sha256').update(readFileSync(path)).digest('hex')
}

function countFiles(path: string): number {
  if (!existsSync(path)) {
    return 0
  }

  let count = 0
  for (const entry of readdirSync(path, { withFileTypes: true })) {
    const fullPath = join(path, entry.name)
    if (entry.isDirectory()) {
      count += countFiles(fullPath)
      continue
    }
    count += 1
  }

  return count
}

function collectExportTargets(exportsField: PackageJson['exports']): string[] {
  if (!exportsField || typeof exportsField !== 'object') {
    return []
  }

  const targets: string[] = []
  for (const value of Object.values(exportsField)) {
    if (typeof value === 'string') {
      targets.push(value)
      continue
    }

    for (const target of Object.values(value)) {
      if (typeof target === 'string') {
        targets.push(target)
      }
    }
  }

  return targets
}

function validatePackageJson(packageJson: PackageJson, distExists: boolean): void {
  ensure(packageJson.name === 'openclaw-cc-camouflage', 'Unexpected package name')
  ensure(Array.isArray(packageJson.files), 'package.json files array is missing')

  for (const entry of REQUIRED_FILE_ENTRIES) {
    ensure(packageJson.files.includes(entry), `package.json files is missing ${entry}`)
  }

  for (const entry of packageJson.files) {
    ensure(
      !FORBIDDEN_FILE_PREFIXES.some((prefix) => entry.startsWith(prefix)),
      `package.json files leaks forbidden entry ${entry}`,
    )
  }

  ensure(packageJson.main?.startsWith('./dist/'), 'package.json main must point to dist/')
  ensure(packageJson.types?.startsWith('./dist/'), 'package.json types must point to dist/')

  const exportTargets = collectExportTargets(packageJson.exports)
  for (const target of exportTargets) {
    if (target === './package.json') {
      continue
    }

    ensure(target.startsWith('./dist/'), `Export target must point to dist/: ${target}`)

    if (!distExists) {
      continue
    }

    const relativePath = target.startsWith('./') ? target.slice(2) : target
    ensure(existsSync(join(PROJECT_ROOT, relativePath)), `Missing published dist target ${relativePath}`)
  }
}

function validateManifest(manifest: Manifest): { fixtureCount: number } {
  ensure(manifest.schemaVersion === 1, `Unexpected manifest schema version ${manifest.schemaVersion}`)
  ensure(Array.isArray(manifest.packages), 'Manifest packages must be an array')
  ensure(manifest.packages.length === 0, 'Manifest packages must stay empty for publish safety')

  const referenceFixtures = manifest.referenceFixtures ?? []
  const emulator = referenceFixtures.find((fixture) => fixture.name === EMULATOR_NAME)
  ensure(emulator, `Missing ${EMULATOR_NAME} reference fixture`)
  ensure(emulator.upstream.sha === EMULATOR_SHA, 'Reference fixture SHA drifted')
  ensure(Array.isArray(emulator.files) && emulator.files.length > 0, 'Reference fixture must list files')

  for (const file of emulator.files) {
    const fixturePath = join(PROJECT_ROOT, file.fixturePath)
    ensure(existsSync(fixturePath), `Reference fixture is missing ${file.fixturePath}`)

    const actualHash = sha256File(fixturePath)
    ensure(
      actualHash === file.sha256,
      `Reference fixture hash mismatch for ${file.upstreamPath}: expected ${file.sha256}, got ${actualHash}`,
    )
  }

  return {
    fixtureCount: emulator.files.length,
  }
}

async function main(): Promise<number> {
  ensure(existsSync(PACKAGE_JSON_PATH), 'package.json is missing')
  ensure(existsSync(README_PATH), 'README.md is missing')
  ensure(existsSync(MANIFEST_PATH), 'patches/manifest.json is missing')

  const packageJson = loadJson<PackageJson>(PACKAGE_JSON_PATH)
  const manifest = loadJson<Manifest>(MANIFEST_PATH)
  const distExists = existsSync(DIST_PATH)

  validatePackageJson(packageJson, distExists)
  const { fixtureCount } = validateManifest(manifest)

  console.log('publish_safety=ok')
  console.log(`package=${packageJson.name ?? 'unknown'}`)
  console.log(`manifest_schema=${manifest.schemaVersion}`)
  console.log(`packages=${manifest.packages.length}`)
  console.log(`reference_fixture=${EMULATOR_NAME}`)
  console.log(`reference_fixture_files=${fixtureCount}`)
  console.log(`dist_present=${distExists ? 'true' : 'false'}`)
  console.log(`dist_file_count=${countFiles(DIST_PATH)}`)

  return 0
}

main()
  .then((code) => {
    process.exitCode = code
  })
  .catch((error) => {
    console.error(error)
    process.exitCode = 1
  })
