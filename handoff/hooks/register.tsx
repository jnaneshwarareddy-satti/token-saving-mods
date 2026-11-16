import type { Register } from 'claude-code'

const MAX_TRANSCRIPT_CHARS = 20000

export const register: Register = on => {
  on('session.start', async ($, e, next) => {
    await $.command.register({
      name: 'handoff',
      description: 'Write a compact handoff note to start a fresh session from',
    })

    return next(e)
  })

  on('command.run', { command: 'handoff' }, async $ => {
    const messages = await $.session.messages()
    const transcript = messages
      .map(m => `${m.role}: ${m.text}`)
      .join('\n\n')
      .slice(-MAX_TRANSCRIPT_CHARS)

    if (transcript.trim().length === 0) {
      return { text: 'Nothing to hand off yet.' }
    }

    const result = await $.model.complete({
      model: 'haiku',
      effort: 'low',
      maxTokens: 800,
      prompt: `Write a compact handoff note for starting a fresh session from this conversation: what's been done, key decisions made, open items, and relevant file paths. Be terse, use bullet points, no preamble.\n\n${transcript}`,
    })

    if (!result.isAnswered) {
      return { text: `${$.plugin.name}: could not write a handoff note (${result.reason}).` }
    }

    return { text: result.text }
  })
}
