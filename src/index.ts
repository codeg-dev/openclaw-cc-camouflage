import { Type } from '@sinclair/typebox'
import { definePluginEntry } from 'openclaw/plugin-sdk/plugin-entry'

import { runPatchApply } from './patch/apply'
import { runPatchRevert } from './patch/revert'
import { runDoctorTool } from './tools/doctor'
import { runStatusTool } from './tools/status'

export const pluginName = 'openclaw-cc-camouflage'

export const explicitToolIds = ['status', 'doctor', 'patch_apply', 'patch_revert'] as const
export const verifyOnlyToolIds = ['status', 'doctor'] as const

export const verifyOnlyCommandNote = [
  'openclaw-cc-camouflage automatic hooks are verify-only.',
  'They may add safety context, but they never apply or revert patches automatically.',
  'Use the explicit tools status, doctor, patch_apply, and patch_revert when you want maintenance actions.',
].join(' ')

const emptyParameters = Type.Object({})

function textResult(text: string, exitCode: number) {
  return {
    content: [{ type: 'text' as const, text }],
    details: { exitCode },
  }
}

export default definePluginEntry({
  id: pluginName,
  name: 'OpenClaw CC Camouflage',
  description: 'Companion maintenance plugin for not-claude-code-emulator presence verification.',
  register(api) {
    api.registerTool({
      name: 'status',
      label: 'Status',
      description: 'Report machine-readable maintenance status. Read-only.',
      parameters: emptyParameters,
      async execute(_id, _params) {
        const result = runStatusTool({
          homeDir: process.env.HOME,
          platform: process.env.OC_CAMOUFLAGE_PLATFORM,
        })
        return textResult(result.output, result.exitCode)
      },
    })

    api.registerTool({
      name: 'doctor',
      label: 'Doctor',
      description: 'Explain the current maintenance diagnosis and next steps without changes.',
      parameters: emptyParameters,
      async execute(_id, _params) {
        const result = runDoctorTool({
          homeDir: process.env.HOME,
          platform: process.env.OC_CAMOUFLAGE_PLATFORM,
        })
        return textResult(result.output, result.exitCode)
      },
    })

    api.registerTool({
      name: 'patch_apply',
      label: 'Patch Apply',
      description: 'Explicitly apply the pinned peer patch.',
      parameters: emptyParameters,
      async execute(_id, _params) {
        const result = runPatchApply()
        return textResult(result.output, result.exitCode)
      },
    })

    api.registerTool({
      name: 'patch_revert',
      label: 'Patch Revert',
      description: 'Explicitly revert the pinned peer patch using rollback marker.',
      parameters: emptyParameters,
      async execute(_id, _params) {
        const result = runPatchRevert()
        return textResult(result.output, result.exitCode)
      },
    })

    api.registerHook(
      'command:new',
      async (_event) => {
        return
      },
      {
        name: 'openclaw-cc-camouflage.verify-only',
        description: 'Verify-only command hook',
      },
    )
  },
})
