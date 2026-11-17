import { atom, read, update } from 'claude-code'
import type { Register } from 'claude-code'

import type { EffortDecision } from '../types'

const MAX_SIMPLE_LENGTH = 140
const MULTI_STEP = /\b(then|also|refactor|implement|architect|design|debug|investigate|analyze|migrate|optimize|plan|review)\b/i

const decisions = atom(
  { plugin: 'effort-optimizer', key: 'decisions' } as const,
  {},
  { shape: 'decisions-1' },
)

function classify(text: string): EffortDecision {
  const trimmed = text.trim()

  if (trimmed.length === 0) return { reason: 'empty prompt' }
  if (trimmed.length > MAX_SIMPLE_LENGTH) return { reason: 'long prompt' }
  if (trimmed.includes('```')) return { reason: 'contains code' }
  if (MULTI_STEP.test(trimmed)) return { reason: 'multi-step task' }

  return { effort: 'low', reason: 'short, single-step prompt' }
}

export const register: Register = on => {
  on('turn.step', async function* ($, e, next) {
    if (e.agentId !== undefined) return yield* next(e)

    let all = await read($, decisions)
    let decision = all[e.turnId]

    if (decision === undefined) {
      const messages = await $.session.messages()
      const lastUser = [...messages].reverse().find(m => m.role === 'user')
      decision = classify(lastUser?.text ?? '')

      all = await update($, decisions, map => {
        const entries = Object.entries(map)
        const next = entries.length >= 50 ? entries.slice(1) : entries
        return { ...Object.fromEntries(next), [e.turnId]: decision! }
      })
    }

    $.ui.status(
      decision.effort
        ? `${$.plugin.name}: effort ${decision.effort} (${decision.reason})`
        : undefined,
    )

    return yield* next(decision.effort ? { ...e, effort: decision.effort } : e)
  })
}
