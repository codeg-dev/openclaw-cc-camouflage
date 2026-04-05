export type PatchRevertResult = {
  output: string
  exitCode: number
  state: 'none'
}

export function runPatchRevert(): PatchRevertResult {
  return {
    output: 'no patch target configured: openclaw-cc-camouflage has no active patch targets.',
    exitCode: 0,
    state: 'none',
  }
}
