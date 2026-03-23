# CONTINUITY.md - Codex-Compound

## Goal (incl. success criteria)
Create a Codex-first derivative of Compound Engineering that is directly usable in Codex App and Codex CLI, preserves the `ce:*` workflow surface, and adds an OpenClaw relay path that mirrors a Codex-owned planning session.

Success criteria:
- Imported upstream baseline is reshaped into a new independent repo with canonical project memory files.
- `AGENTS.md` is canonical and `CLAUDE.md` is only a compatibility shim.
- `.beads/` and `handoff/beads.jsonl` match the current Codex workflow used elsewhere in this workspace.
- Durable learnings are split across project, project-type, and global paths.
- A separate scratch test case can use the Codex-first planning flow on the RES Snatcher concept before OpenClaw passthrough is wired.

## Constraints/Assumptions
- Start from upstream `compound-engineering-plugin` `main`, copied into this repo without upstream git history.
- Preserve Bun + TypeScript and the general CLI architecture initially.
- Core function only for now; secondary surfaces may remain temporarily until explicitly removed.
- OpenClaw is a relay/orchestrator surface; Codex owns the session and PTY.
- OpenClaw may need to clone/pull/check out the target repo on the machine where it runs.
- Current bead/backlog workflow in this environment uses `bd` directly from the CLI.
- UNCONFIRMED: whether all non-Codex/OpenClaw providers remain first-class or become compatibility surfaces later.

## Key Decisions
1. Initialize this repo as a new independent derivative named `Codex-Compound` with origin `https://github.com/apollostreetcompany/codex-compound.git`.
2. Copy upstream `compound-engineering-plugin` `main` into the workspace as the baseline rather than forking it.
3. Preserve the Bun + TypeScript CLI architecture initially instead of redesigning the runtime before behavior is stabilized.
4. Make `AGENTS.md` canonical and keep `CLAUDE.md` as a compatibility shim only.
5. Match the existing Codex workflow by using `.beads/` for backlog/issues and `handoff/beads.jsonl` for execution evidence.
6. Split state from learning:
   - `CONTINUITY.md` for current state
   - `docs/learnings/projects/` for repo-specific learnings
   - `docs/learnings/project-types/` for project-type learnings
   - `docs/learnings/global/` for global learnings
7. Preserve `ce:*` workflow names while rewriting their internals around Codex-first behavior.
8. Dogfood the planning flow on a separate scratch test case using the RES Snatcher concept before tackling live OpenClaw passthrough.
9. Planning beads are valid but should stay rare and appear only early in brainstorm/plan phases.
10. Preserve upstream license and attribution while reshaping the repo.
11. Initialize `bd` immediately in the repo so `.beads/` is present from the first bead, with sync branch `beads-sync` and recommended hooks installed.
12. Treat the import/scaffold bead as `Medium` risk because it changes many files and project-operating contracts, then validate it with `bun test`, `bun run release:validate`, and `bd doctor`.
13. Adopt `codex-compound` as the root package/bin identity and `https://github.com/apollostreetcompany/codex-compound(.git)` as the default repo source while preserving downstream plugin IDs like `compound-engineering`.
14. Make the core `ce:*` workflows Codex-first by explicitly grounding them in `AGENTS.md`, `CONTINUITY.md`, `.beads/`, `handoff/beads.jsonl`, and `docs/learnings/`, while treating `docs/solutions/` as legacy context during migration.
15. Keep the scratch RES Snatcher workspace planning-only, but make it follow the same memory contract as the parent repo with local `HANDOFF.md`, `MISTAKES.md`, `Makefile`, and `handoff/` files.
16. Anchor the RES Snatcher feasibility plan to official vendor docs: Firecrawl `/search` plus `/extract`, and ElevenLabs Twilio native integration with `verified caller ID` as the outbound-only fallback.

## State

### Done
- [x] Copied upstream `compound-engineering-plugin` `main` into this workspace.
- [x] Initialized a new git repo, set `origin`, and created branch `codex/feat/bead-0-import-bootstrap`.
- [x] Restored RepoPrompt context for the imported repo.
- [x] Replaced the imported root operating contract with Codex-Compound scaffolding files.
- [x] Initialized `.beads/`, created bead `codex-compound-dwe`, installed recommended hooks, and configured sync branch `beads-sync`.
- [x] Validated the imported baseline with `bun test`, `bun run release:validate`, and `bd doctor`.
- [x] Completed Bead 0 - import upstream baseline and scaffold Codex-Compound.
- [x] Completed Bead 1 - rename root package, CLI, repo source, and root metadata surfaces to Codex-Compound.
- [x] Completed Bead 2 - rewrite core workflow skills and plugin docs around Codex-first memory, learnings, and bead execution.
- [x] Completed Bead 3 - create the RES Snatcher scratch test case and capture a feasibility-quality Codex-first planning run.

### Now
- Ready for Bead 4 - define and implement the initial OpenClaw relay plus Codex PTY bridge skeleton.

### Next
- Land Bead 5 - the low-risk CLI fix so relative local plugin paths resolve correctly without shadowing bare GitHub plugin names.
- Design the OpenClaw relay/PTY bridge after the Codex-first planning flow is stable.
- Wire the initial OpenClaw relay and Codex PTY bridge skeleton after the dogfood planning path is proven.

## Open Questions
- Should all non-Codex/OpenClaw targets remain fully supported long-term, or become compatibility surfaces only? (UNCONFIRMED)
- What is the smallest reliable v1 bridge between OpenClaw and a Codex-owned PTY session? (UNCONFIRMED)
- How much of the imported marketplace/coding-tutor surface should remain once the core Codex-first workflow is stable? (UNCONFIRMED)

## Working Set
- `AGENTS.md`
- `AGENTS-archive-v1.md`
- `.beads/`
- `CONTINUITY.md`
- `HANDOFF.md`
- `MISTAKES.md`
- `DEPLOYMENT.md`
- `Makefile`
- `handoff/beads.schema.json`
- `handoff/beads.jsonl`
- `docs/learnings/projects/`
- `docs/learnings/project-types/`
- `docs/learnings/global/`
- `package.json`
- `README.md`
- `PRIVACY.md`
- `.claude-plugin/marketplace.json`
- `.cursor-plugin/marketplace.json`
- `plugins/compound-engineering/AGENTS.md`
- `plugins/compound-engineering/README.md`
- `plugins/compound-engineering/`
- `test-case/res-snatcher/`
- `src/`
- `tests/`
