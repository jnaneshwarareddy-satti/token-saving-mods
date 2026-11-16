import { atom, read, update } from 'claude-code'
import type { Register } from 'claude-code'

const IDLE_THRESHOLD_MS = 5 * 60 * 1000

const lastAt = atom(
  { plugin: 'cache-clock', key: 'lastAt' } as const,
  null,
  { shape: 'lastAt-1' },
)

export const register: Register = on => {
  on('prompt.submit', async ($, e, next) => {
    if (e.command !== undefined || e.isMeta) return next(e)

    const now = Date.now()
    const previous = await read($, lastAt)

    if (previous !== null && now - previous > IDLE_THRESHOLD_MS) {
      const minutes = Math.round((now - previous) / 60000)
      $.ui.toast(
        `${$.plugin.name}: idle ${minutes}m — prompt cache is likely cold, this message may re-read full context`,
      )
    }

    await update($, lastAt, () => now)

    return next(e)
  })
}
