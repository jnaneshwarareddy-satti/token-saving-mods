import { atom, read, update } from 'claude-code'
import type { Register } from 'claude-code'

const PREFIX = /^\s*(haiku|sonnet|opus|fable)\s*:\s*/i

const pending = atom(
  { plugin: 'model-router', key: 'pending' } as const,
  null,
  { shape: 'pending-1' },
)
const decisions = atom(
  { plugin: 'model-router', key: 'decisions' } as const,
  {},
  { shape: 'decisions-1' },
)

export const register: Register = on => {
  on('prompt.submit', async ($, e, next) => {
    if (e.command !== undefined || e.isMeta) return next(e)

    const match = PREFIX.exec(e.text)
    if (match === null) return next(e)

    const model = match[1].toLowerCase()
    await update($, pending, () => model)
    $.ui.toast(`${$.plugin.name}: forcing ${model} for this turn`)

    return next({ ...e, text: e.text.slice(match[0].length) })
  })

  on('turn.step', async function* ($, e, next) {
    if (e.agentId !== undefined) return yield* next(e)

    let all = await read($, decisions)
    let model = all[e.turnId]

    if (model === undefined && e.index === 0) {
      const forced = await read($, pending)
      if (forced !== null) {
        model = forced
        await update($, pending, () => null)
        all = await update($, decisions, map => {
          const entries = Object.entries(map)
          const next = entries.length >= 50 ? entries.slice(1) : entries
          return { ...Object.fromEntries(next), [e.turnId]: model! }
        })
      }
    }

    $.ui.status(model ? `${$.plugin.name}: routed to ${model}` : undefined)

    return yield* next(model ? { ...e, model } : e)
  })
}
