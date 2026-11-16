import type { Register } from 'claude-code'

const MAX_SIMPLE_LENGTH = 60
const RESEARCH_HEAVY = /\b(compare|vs\.?|trend|research|history|pros and cons|which is better|analysis|comprehensive|survey)\b/i

function looksSimple(query: string): boolean {
  const trimmed = query.trim()
  return trimmed.length <= MAX_SIMPLE_LENGTH && !RESEARCH_HEAVY.test(trimmed)
}

export const register: Register = on => {
  on('tool.call', async ($, e, next) => {
    if (e.tool !== 'WebSearch') return next(e)

    const args = e as unknown as { mode?: string; query?: string }
    if (args.mode !== 'extended' || args.query === undefined || !looksSimple(args.query)) {
      return next(e)
    }

    $.ui.status(`${$.plugin.name}: downgraded to standard search (looked like a simple lookup)`)

    return next({ ...e, mode: 'standard' } as typeof e)
  })
}
