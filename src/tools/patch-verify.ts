import { createHash } from 'node:crypto'
import { existsSync, readFileSync } from 'node:fs'
import { join, resolve } from 'node:path'

type ReferenceFixture = {
  name: string
  upstream?: { repo?: string; sha?: string }
  files?: Array<{
    upstreamPath?: string
    fixturePath?: string
    sha256?: string
  }>
}

type ManifestShape = {
  referenceFixtures?: ReferenceFixture[]
}

function sha256File(filePath: string): string {
  return createHash('sha256').update(readFileSync(filePath)).digest('hex')
}

function main(): number {
  const repoRoot = resolve(import.meta.dir, '../..')
  const manifestPath = join(repoRoot, 'patches/manifest.json')

  if (!existsSync(manifestPath)) {
    process.stdout.write('fixture=not-claude-code-emulator\nstatus=missing\nreason=manifest_missing\n')
    return 1
  }

  const manifest = JSON.parse(readFileSync(manifestPath, 'utf8')) as ManifestShape
  const fixture = manifest.referenceFixtures?.find((entry) => entry.name === 'not-claude-code-emulator')

  if (!fixture) {
    process.stdout.write('fixture=not-claude-code-emulator\nstatus=missing\nreason=fixture_missing\n')
    return 1
  }

  const fileEntry = fixture.files?.[0]
  if (!fileEntry?.fixturePath || !fileEntry.sha256) {
    process.stdout.write('fixture=not-claude-code-emulator\nstatus=invalid\nreason=fixture_entry_invalid\n')
    return 1
  }

  const fixturePath = join(repoRoot, fileEntry.fixturePath)
  if (!existsSync(fixturePath)) {
    process.stdout.write(
      [
        'fixture=not-claude-code-emulator',
        `fixture_path=${fileEntry.fixturePath}`,
        'status=missing',
        'reason=fixture_file_missing',
      ].join('\n') + '\n',
    )
    return 1
  }

  const actualSha256 = sha256File(fixturePath)
  const lines = [
    'fixture=not-claude-code-emulator',
    `fixture_path=${fileEntry.fixturePath}`,
    `upstream_path=${fileEntry.upstreamPath ?? ''}`,
    `upstream_sha=${fixture.upstream?.sha ?? ''}`,
    `expected_sha256=${fileEntry.sha256}`,
    `actual_sha256=${actualSha256}`,
    `status=${actualSha256 === fileEntry.sha256 ? 'ok' : 'mismatch'}`,
  ]

  process.stdout.write(`${lines.join('\n')}\n`)
  return actualSha256 === fileEntry.sha256 ? 0 : 1
}

process.exitCode = main()
