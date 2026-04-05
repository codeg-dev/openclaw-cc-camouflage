import { runStatusTool } from './status'

function main(): number {
  const result = runStatusTool({
    homeDir: process.env.HOME,
    platform: process.env.OC_CAMOUFLAGE_PLATFORM,
  })
  process.stdout.write(`${result.output}\n`)
  return result.exitCode
}

process.exitCode = main()
