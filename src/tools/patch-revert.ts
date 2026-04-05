import { runPatchRevert } from '../patch/revert'

function main(): number {
  const result = runPatchRevert()
  process.stdout.write(`${result.output}\n`)
  return result.exitCode
}

process.exitCode = main()
