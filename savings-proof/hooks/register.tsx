import { atom, read, update } from 'claude-code'
import type { Register } from 'claude-code'
import { mkdirSync, writeFileSync } from 'node:fs'
import { homedir } from 'node:os'
import { dirname, join } from 'node:path'

const counts = atom(
  { plugin: 'savings-proof', key: 'counts' } as const,
  {},
  { shape: 'counts-1' },
)
const seenTurns = atom(
  { plugin: 'savings-proof', key: 'seenTurns' } as const,
  {},
  { shape: 'seenTurns-1' },
)

const COUNTS_FILE = join(homedir(), '.claude', 'plugin-data', 'savings-proof', 'counts.json')

function persistCounts(all: Record<string, number>): void {
  try {
    mkdirSync(dirname(COUNTS_FILE), { recursive: true })
    writeFileSync(COUNTS_FILE, JSON.stringify({ counts: all, updatedAt: new Date().toISOString() }, null, 2))
  } catch {
    // best-effort: in-memory atom is still the source of truth within this session
  }
}

export const register: Register = on => {
  on('session.start', async ($, e, next) => {
    await $.command.register({
      name: 'savings-proof',
      description: 'Show what fraction of turns used a cheaper model',
    })

    return next(e)
  })

  on('turn.step', async function* ($, e, next) {
    if (e.agentId === undefined && e.index === 0) {
      const seen = await read($, seenTurns)
      if (seen[e.turnId] === undefined) {
        await update($, seenTurns, map => {
          const entries = Object.entries(map)
          const next = entries.length >= 200 ? entries.slice(1) : entries
          return { ...Object.fromEntries(next), [e.turnId]: true as const }
        })
        const all = await update($, counts, map => ({ ...map, [e.model]: (map[e.model] ?? 0) + 1 }))
        persistCounts(all)
      }
    }

    return yield* next(e)
  })

  on('command.run', { command: 'savings-proof' }, async $ => {
    const all = await read($, counts)
    const total = Object.values(all).reduce((sum, n) => sum + n, 0)

    if (total === 0) return { text: 'No turns recorded yet.' }

    const lines = Object.entries(all)
      .sort((a, b) => b[1] - a[1])
      .map(([model, n]) => `  ${model}: ${n} (${Math.round((n / total) * 100)}%)`)

    return { text: ['Model mix this session:', ...lines].join('\n') }
  })
}
