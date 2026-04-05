import { runDoctorTool } from './doctor'

function main(): number {
  const result = runDoctorTool({
    homeDir: process.env.HOME,
    platform: process.env.OC_CAMOUFLAGE_PLATFORM,
  })
  process.stdout.write(`${result.output}\n`)
  return result.exitCode
}

process.exitCode = main()
