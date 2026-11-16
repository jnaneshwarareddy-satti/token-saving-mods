export type RouteDecision = { model?: string; reason: string }

declare module 'claude-code' {
  interface PluginState {
    'input-router': { decisions: Shaped<Record<string, RouteDecision>> }
  }
}
