declare module 'claude-code' {
  interface PluginState {
    'model-router': {
      pending: Shaped<string | null>
      decisions: Shaped<Record<string, string>>
    }
  }
}
