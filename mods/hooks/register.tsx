import type { Register } from 'claude-code'

const DIRECTORY: readonly [string, string][] = [
  ['input-router', 'Routes short, single-step prompts to a cheaper model'],
  ['effort-optimizer', "Lowers reasoning effort to 'low' for simple prompts"],
  ['model-router', "Force a model for one turn with a 'haiku:'/'opus:' prefix"],
  ['cache-clock', 'Warns when you have likely gone cold on prompt cache'],
  ['handoff', '/handoff writes a compact note to start a fresh session from'],
  ['research-router', 'Downgrades WebSearch to standard mode for simple lookups'],
  ['efficient-browser-use', 'Nudges away from repeated screenshots'],
  ['mods', 'This directory'],
  ['savings-proof', 'Tracks what fraction of turns used a cheaper model'],
]

export const register: Register = on => {
  on('session.start', async ($, e, next) => {
    await $.command.register({
      name: 'mods',
      description: 'List the token-saving-mods plugins and what each does',
    })

    return next(e)
  })

  on('command.run', { command: 'mods' }, async $ => ({
    text: [
      'token-saving-mods:',
      ...DIRECTORY.map(([name, description]) => `  ${name} — ${description}`),
    ].join('\n'),
  }))
}
