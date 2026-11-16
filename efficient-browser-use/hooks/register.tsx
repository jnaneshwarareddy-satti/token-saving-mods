import { atom, read, update } from 'claude-code'
import type { Register } from 'claude-code'

const REMINDER_AT = 3

const streak = atom(
  { plugin: 'efficient-browser-use', key: 'streak' } as const,
  0,
  { shape: 'streak-1' },
)

function isScreenshot(e: { tool: string }): boolean {
  const args = e as unknown as { action?: string }
  return e.tool.toLowerCase().includes('computer') && args.action === 'screenshot'
}

export const register: Register = on => {
  on('tool.call', async ($, e, next) => {
    if (!isScreenshot(e)) {
      if (e.tool.toLowerCase().includes('get_page_text') || e.tool.toLowerCase().includes('read_page')) {
        await update($, streak, () => 0)
      }
      return next(e)
    }

    const count = await update($, streak, n => n + 1)

    if (count === REMINDER_AT) {
      $.ui.toast(
        `${$.plugin.name}: ${count} screenshots in a row — prefer get_page_text/read_page to save tokens when you just need the text`,
      )
    }

    return next(e)
  })
}
