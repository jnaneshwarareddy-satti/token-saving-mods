# token-saving-mods

Claude Code mods that cut token/model spend: routing, effort, caching
awareness, and a couple of status/reporting commands.

## Install

At the prompt of a terminal session:

```
/plugin install input-router --marketplace jnaneshwarareddys-tech/token-saving-mods
/plugin install effort-optimizer --marketplace jnaneshwarareddys-tech/token-saving-mods
/plugin install model-router --marketplace jnaneshwarareddys-tech/token-saving-mods
/plugin install cache-clock --marketplace jnaneshwarareddys-tech/token-saving-mods
/plugin install handoff --marketplace jnaneshwarareddys-tech/token-saving-mods
/plugin install research-router --marketplace jnaneshwarareddys-tech/token-saving-mods
/plugin install efficient-browser-use --marketplace jnaneshwarareddys-tech/token-saving-mods
/plugin install mods --marketplace jnaneshwarareddys-tech/token-saving-mods
/plugin install savings-proof --marketplace jnaneshwarareddys-tech/token-saving-mods
```

The first install adds the marketplace (`y` to confirm); the rest reuse it.

## What's in here

- **input-router** — routes short, single-step prompts to a cheaper model (Haiku).
- **effort-optimizer** — lowers reasoning effort to `low` for simple prompts.
- **model-router** — type `haiku:`/`sonnet:`/`opus:` as a prefix to force that model for one turn.
- **cache-clock** — warns when you've likely gone idle long enough to lose prompt cache.
- **handoff** — `/handoff` writes a compact summary to start a fresh session from.
- **research-router** — downgrades `WebSearch` from extended to standard mode for simple lookups.
- **efficient-browser-use** — nudges away from repeated screenshots toward `get_page_text`/`read_page`.
- **mods** — `/mods` lists all of the above.
- **savings-proof** — `/savings-proof` shows the model mix for the session, as evidence the routing works.
