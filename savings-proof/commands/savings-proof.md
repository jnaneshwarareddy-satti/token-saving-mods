---
description: Show what fraction of turns used a cheaper model
---

Read `~/.claude/plugin-data/savings-proof/counts.json` (the `savings-proof` hook writes it on every `turn.step`).

- If the file doesn't exist or is empty, say plainly that no data has been recorded yet — don't invent numbers.
- Otherwise, parse its `counts` map (model name → turn count) and `updatedAt`, compute each model's percentage of the total, and report it as a short breakdown, e.g.:

  Model mix (as of <updatedAt>):
    haiku: N (X%)
    sonnet: N (X%)

Only report what's actually in the file. If the file looks stale (old `updatedAt`), mention that too.
