export type PatchApplyResult = {
  output: string
  exitCode: number
  state: 'none'
}

export function runPatchApply(): PatchApplyResult {
  return {
    output: 'no patch target configured: openclaw-cc-camouflage has no active patch targets.',
    exitCode: 0,
    state: 'none',
  }
}
