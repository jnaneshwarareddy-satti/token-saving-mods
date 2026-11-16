declare module 'claude-code' {
  interface PluginState {
    'savings-proof': { counts: Shaped<Record<string, number>>; seenTurns: Shaped<Record<string, true>> }
  }
}
