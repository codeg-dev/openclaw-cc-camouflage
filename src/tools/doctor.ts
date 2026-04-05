import type { StatusContract } from '../contracts/status'
import { detectStatus } from '../runtime/detect'

export type DoctorResult = {
  output: string
  diagnosis: 'healthy' | 'degraded' | 'broken'
  exitCode: number
}

export type DoctorOptions = {
  homeDir?: string
  platform?: string
}

function formatStatusLines(status: StatusContract): string[] {
  return [`emulator=${status.emulator}`, `patch=${status.patch}`, `support=${status.support}`]
}

function buildResult(
  status: StatusContract,
  diagnosis: DoctorResult['diagnosis'],
  summary: string,
  nextSteps: string[],
): DoctorResult {
  const lines = [...formatStatusLines(status), `doctor=${diagnosis}`, '', summary]

  for (const nextStep of nextSteps) {
    lines.push(`next: ${nextStep}`)
  }

  return {
    output: lines.join('\n'),
    diagnosis,
    exitCode: diagnosis === 'healthy' ? 0 : 1,
  }
}

export function runDoctorTool(options: DoctorOptions = {}): DoctorResult {
  const status = detectStatus(options)

  if (status.emulator === 'present' && status.support === 'supported') {
    return buildResult(status, 'healthy', 'Maintenance status is healthy.', [
      'Emulator prerequisite is readable and the current platform is supported.',
      'All tools are available.',
    ])
  }

  if (status.emulator === 'missing') {
    return buildResult(status, 'broken', 'The emulator prerequisite is missing.', [
      'Clone or restore not-claude-code-emulator under ~/github/not-claude-code-emulator, or point OC_CAMOUFLAGE_EMULATOR_ROOT at a readable checkout.',
      'Re-run doctor after the emulator checkout becomes readable.',
    ])
  }

  if (status.emulator === 'unreachable') {
    return buildResult(status, 'degraded', 'Emulator root is unreachable. Check permissions.', [
      'Make sure the configured emulator checkout is readable and still contains the expected package files.',
      'Re-run doctor after the checkout is accessible.',
    ])
  }

  return buildResult(status, 'degraded', 'The current platform is unsupported for this maintenance workflow.', [
    'Run doctor on darwin, linux, or win32 with a readable emulator checkout.',
  ])
}
