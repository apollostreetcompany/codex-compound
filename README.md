# Codex-Compound

[![Build Status](https://github.com/apollostreetcompany/codex-compound/actions/workflows/ci.yml/badge.svg)](https://github.com/apollostreetcompany/codex-compound/actions/workflows/ci.yml)
[![npm](https://img.shields.io/npm/v/codex-compound)](https://www.npmjs.com/package/codex-compound)

A Codex-first derivative of Compound Engineering that preserves the `ce:*` workflow surface while making `AGENTS.md`, `CONTINUITY.md`, `.beads/`, and `handoff/beads.jsonl` first-class.

## Claude Code Install

```bash
/plugin marketplace add apollostreetcompany/codex-compound
/plugin install compound-engineering
```

## Cursor Install

```text
/add-plugin compound-engineering
```

## OpenCode, Codex, Droid, Pi, Gemini, Copilot, Kiro, Windsurf, OpenClaw & Qwen (experimental) Install

This repo includes a Bun/TypeScript CLI that converts Claude Code plugins to OpenCode, Codex, Factory Droid, Pi, Gemini CLI, GitHub Copilot, Kiro CLI, Windsurf, OpenClaw, and Qwen Code.

Until the standalone npm package is published, run these commands from a checkout with `bun run src/index.ts ...`. The examples below show the intended installed command name.

```bash
# convert the compound-engineering plugin into OpenCode format
bunx codex-compound install compound-engineering --to opencode

# convert to Codex format
bunx codex-compound install compound-engineering --to codex

# convert to Factory Droid format
bunx codex-compound install compound-engineering --to droid

# convert to Pi format
bunx codex-compound install compound-engineering --to pi

# convert to Gemini CLI format
bunx codex-compound install compound-engineering --to gemini

# convert to GitHub Copilot format
bunx codex-compound install compound-engineering --to copilot

# convert to Kiro CLI format
bunx codex-compound install compound-engineering --to kiro

# convert to OpenClaw format
bunx codex-compound install compound-engineering --to openclaw

# convert to Windsurf format (global scope by default)
bunx codex-compound install compound-engineering --to windsurf

# convert to Windsurf workspace scope
bunx codex-compound install compound-engineering --to windsurf --scope workspace

# convert to Qwen Code format
bunx codex-compound install compound-engineering --to qwen

# auto-detect installed tools and install to all
bunx codex-compound install compound-engineering --to all
```

### Local Development

When developing and testing local changes to the plugin:

**Claude Code** — add a shell alias so your local copy loads alongside your normal plugins:

```bash
# add to ~/.zshrc or ~/.bashrc
alias claude-dev-ce='claude --plugin-dir ~/code/codex-compound/plugins/compound-engineering'
```

One-liner to append it:

```bash
echo "alias claude-dev-ce='claude --plugin-dir ~/code/codex-compound/plugins/compound-engineering'" >> ~/.zshrc
```

Then run `claude-dev-ce` instead of `claude` to test your changes. Your production install stays untouched.

**Codex** — point the install command at your local path:

```bash
bun run src/index.ts install ./plugins/compound-engineering --to codex
```

**Other targets** — same pattern, swap the target:

```bash
bun run src/index.ts install ./plugins/compound-engineering --to opencode
```

### OpenClaw ACP Bridge Skeleton

When you install `compound-engineering` to `openclaw`, the bundle now includes:

- `skills/openclaw-codex-acp-bridge/SKILL.md`
- `bridge/codex-acp-bridge.example.json`

This is an ACP-first relay skeleton, not a custom plugin-managed PTY. It assumes the OpenClaw host machine has Codex CLI installed plus the `@openclaw/acpx` backend plugin, and it documents the handoff path where Codex owns the planning session while OpenClaw remains the operator-facing relay:

- `/acp spawn codex --mode persistent --thread auto --cwd /absolute/path/to/repo`
- `/acp steer ...`
- `/acp status`
- `/acp close`

Attach-to-existing sessions and durable resume are intentionally deferred from this first bridge cut.

<details>
<summary>Output format details per target</summary>

| Target | Output path | Notes |
|--------|------------|-------|
| `opencode` | `~/.config/opencode/` | Commands as `.md` files; `opencode.json` MCP config deep-merged; backups made before overwriting |
| `codex` | `~/.codex/prompts` + `~/.codex/skills` | Claude commands become prompt + skill pairs; canonical `ce:*` workflow skills also get prompt wrappers; deprecated `workflows:*` aliases are omitted |
| `droid` | `~/.factory/` | Tool names mapped (`Bash`→`Execute`, `Write`→`Create`); namespace prefixes stripped |
| `pi` | `~/.pi/agent/` | Prompts, skills, extensions, and `mcporter.json` for MCPorter interoperability |
| `gemini` | `.gemini/` | Skills from agents; commands as `.toml`; namespaced commands become directories (`workflows:plan` → `commands/workflows/plan.toml`) |
| `copilot` | `.github/` | Agents as `.agent.md` with Copilot frontmatter; MCP env vars prefixed with `COPILOT_MCP_` |
| `kiro` | `.kiro/` | Agents as JSON configs + prompt `.md` files; only stdio MCP servers supported |
| `openclaw` | `~/.openclaw/extensions/<plugin>/` | Entry-point TypeScript skill file; `openclaw.plugin.json`; optional `openclaw.json`; `compound-engineering` also emits ACP bridge scaffolding under `bridge/` |
| `windsurf` | `~/.codeium/windsurf/` (global) or `.windsurf/` (workspace) | Agents become skills; commands become flat workflows; `mcp_config.json` merged |
| `qwen` | `~/.qwen/extensions/<plugin>/` | Agents as `.yaml`; env vars with placeholders extracted as settings; colon separator for nested commands |

All provider targets are experimental and may change as the formats evolve.

</details>

## Sync Personal Config

Sync your personal Claude Code config (`~/.claude/`) to other AI coding tools. Omit `--target` to sync to all detected supported tools automatically:

Until the standalone npm package is published, run these commands from a checkout with `bun run src/index.ts sync ...`.

```bash
# Sync to all detected tools (default)
bunx codex-compound sync

# Sync skills and MCP servers to OpenCode
bunx codex-compound sync --target opencode

# Sync to Codex
bunx codex-compound sync --target codex

# Sync to Pi
bunx codex-compound sync --target pi

# Sync to Droid
bunx codex-compound sync --target droid

# Sync to GitHub Copilot (skills + MCP servers)
bunx codex-compound sync --target copilot

# Sync to Gemini (skills + MCP servers)
bunx codex-compound sync --target gemini

# Sync to Windsurf
bunx codex-compound sync --target windsurf

# Sync to Kiro
bunx codex-compound sync --target kiro

# Sync to Qwen
bunx codex-compound sync --target qwen

# Sync to OpenClaw (skills only; MCP is validation-gated)
bunx codex-compound sync --target openclaw

# Sync to all detected tools
bunx codex-compound sync --target all
```

This syncs:
- Personal skills from `~/.claude/skills/` (as symlinks)
- Personal slash commands from `~/.claude/commands/` (as provider-native prompts, workflows, or converted skills where supported)
- MCP servers from `~/.claude/settings.json`

Skills are symlinked (not copied) so changes in Claude Code are reflected immediately.

Supported sync targets:
- `opencode`
- `codex`
- `pi`
- `droid`
- `copilot`
- `gemini`
- `windsurf`
- `kiro`
- `qwen`
- `openclaw`

Notes:
- Codex sync preserves non-managed `config.toml` content and now includes remote MCP servers.
- Command sync reuses each provider's existing Claude command conversion, so some targets receive prompts or workflows while others receive converted skills.
- Copilot sync writes personal skills to `~/.copilot/skills/` and MCP config to `~/.copilot/mcp-config.json`.
- Gemini sync writes MCP config to `~/.gemini/` and avoids mirroring skills that Gemini already discovers from `~/.agents/skills`, which prevents duplicate-skill warnings.
- Droid, Windsurf, Kiro, and Qwen sync merge MCP servers into the provider's documented user config.
- OpenClaw currently syncs skills only. Personal command sync is skipped because this repo does not yet map Claude personal commands into a documented OpenClaw user-level command surface, and MCP sync is still skipped because this repo does not yet translate Claude personal MCP settings into a documented OpenClaw user config contract.

## Workflow

```
Brainstorm → Plan → Work → Review → Compound → Repeat
    ↑
  Ideate (optional — when you need ideas)
```

| Command | Purpose |
|---------|---------|
| `/ce:ideate` | Discover high-impact project improvements through divergent ideation and adversarial filtering |
| `/ce:brainstorm` | Explore requirements and approaches before planning |
| `/ce:plan` | Turn feature ideas into detailed implementation plans |
| `/ce:work` | Execute plans with worktrees and task tracking |
| `/ce:review` | Multi-agent code review before merging |
| `/ce:compound` | Document learnings to make future work easier |

The `/ce:ideate` skill proactively surfaces strong improvement ideas, and `/ce:brainstorm` then clarifies the selected one before committing to a plan.

Each cycle compounds: brainstorms sharpen plans, plans inform future plans, reviews catch more issues, patterns get documented.

> **Beta:** Experimental versions of `/ce:plan` and `/deepen-plan` are available as `/ce:plan-beta` and `/deepen-plan-beta`. See the [plugin README](plugins/compound-engineering/README.md#beta-skills) for details.

## Philosophy

**Each unit of engineering work should make subsequent units easier—not harder.**

Traditional development accumulates technical debt. Every feature adds complexity. The codebase becomes harder to work with over time.

Compound engineering inverts this. 80% is in planning and review, 20% is in execution:
- Plan thoroughly before writing code
- Review to catch issues and capture learnings
- Codify knowledge so it's reusable
- Keep quality high so future changes are easy

## Learn More

- [Full component reference](plugins/compound-engineering/README.md) - all agents, commands, skills
- [Compound engineering: how Every codes with agents](https://every.to/chain-of-thought/compound-engineering-how-every-codes-with-agents)
- [The story behind compounding engineering](https://every.to/source-code/my-ai-had-already-fixed-the-code-before-i-saw-it)
