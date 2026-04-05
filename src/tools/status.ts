import { detectStatus } from '../runtime/detect'
import type { StatusContract } from '../contracts/status'

export type StatusResult = {
  output: string
  exitCode: number
  status: StatusContract
}

export type StatusToolOptions = {
  homeDir?: string
  platform?: string
}

export function formatStatus(status: StatusContract): string {
  return [
    `emulator=${status.emulator}`,
    `patch=${status.patch}`,
    `support=${status.support}`,
  ].join('\n')
}

export function isStatusHealthy(status: StatusContract): boolean {
  return status.emulator === 'present' && status.support === 'supported'
}

export function runStatusTool(options: StatusToolOptions = {}): StatusResult {
  const status = detectStatus(options)
  const output = formatStatus(status)
  const exitCode = isStatusHealthy(status) ? 0 : 1

  return { output, exitCode, status }
}
