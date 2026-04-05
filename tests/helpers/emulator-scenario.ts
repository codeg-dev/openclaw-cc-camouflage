import { mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

const EMULATOR_PACKAGE_NAME = 'not-claude-code-emulator'

export interface TempHomeFixture {
  root: string
  cleanup: () => Promise<void>
}

export async function createTempHome(homeSuffix: string): Promise<TempHomeFixture> {
  const root = await mkdtemp(join(tmpdir(), `openclaw-cc-camouflage-${homeSuffix}-`))

  return {
    root,
    cleanup: async () => {
      await rm(root, { recursive: true, force: true })
    },
  }
}

export async function writeRecognizedEmulatorRoot(root: string): Promise<string> {
  await mkdir(root, { recursive: true })
  await writeFile(
    join(root, 'package.json'),
    `${JSON.stringify({ name: EMULATOR_PACKAGE_NAME, private: true }, null, 2)}\n`,
    'utf8',
  )
  return root
}

export async function writeUnrecognizedEmulatorRoot(root: string): Promise<string> {
  await mkdir(root, { recursive: true })
  await writeFile(
    join(root, 'package.json'),
    `${JSON.stringify({ name: 'wrong-package', private: true }, null, 2)}\n`,
    'utf8',
  )
  return root
}
