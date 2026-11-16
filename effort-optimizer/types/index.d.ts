export type EffortDecision = { effort?: 'low'; reason: string }

declare module 'claude-code' {
  interface PluginState {
    'effort-optimizer': { decisions: Shaped<Record<string, EffortDecision>> }
  }
}
