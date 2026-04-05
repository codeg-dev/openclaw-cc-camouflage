import { runPatchApply } from '../patch/apply'

function main(): number {
  const result = runPatchApply()
  process.stdout.write(`${result.output}\n`)
  return result.exitCode
}

process.exitCode = main()
