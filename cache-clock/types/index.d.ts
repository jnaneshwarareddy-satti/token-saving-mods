declare module 'claude-code' {
  interface PluginState {
    'cache-clock': { lastAt: Shaped<number | null> }
  }
}
