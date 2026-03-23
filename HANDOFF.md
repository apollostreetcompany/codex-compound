# HANDOFF.md - Codex-Compound

## Current Status
Upstream `compound-engineering-plugin` `main` has been copied into a new independent repo, bead 0 has been committed and pushed, and the next step is the actual Codex-first rename/rewrite work.

## Delivered
- Imported upstream baseline content into `/Users/borker/dev/codex-compound`.
- Initialized git with origin `https://github.com/apollostreetcompany/codex-compound.git`.
- Created working branch `codex/feat/bead-0-import-bootstrap`.
- Archived the imported root `AGENTS.md` as `AGENTS-archive-v1.md`.
- Replaced the root project contract with a Codex-Compound-specific `AGENTS.md`.
- Initialized `.beads/` with issue prefix `codex-compound`.
- Created bead `codex-compound-dwe` for the import/scaffold work and marked it `in_progress`.
- Installed recommended `bd` git hooks and configured sync branch `beads-sync`.
- Created canonical memory files:
  - `CONTINUITY.md`
  - `HANDOFF.md`
  - `MISTAKES.md`
  - `DEPLOYMENT.md`
  - `handoff/beads.schema.json`
  - `handoff/beads.jsonl`
- Created the durable learning hierarchy under `docs/learnings/`.

## Validation Evidence
- `bun test` -> pass (364 tests)
- `bun run release:validate` -> pass
- `bd doctor` -> pass with two environment-level warnings:
  - local `bd` CLI is older than the latest upstream release
  - `LastBdVersion` metadata remains empty on this local install

## Current Defaults
- Codex owns the session and PTY.
- OpenClaw is a relay/orchestrator surface.
- `AGENTS.md` is canonical; `CLAUDE.md` remains a shim only.
- `.beads/` will be the backlog source of truth.
- `handoff/beads.jsonl` will hold per-bead evidence.
- RES Snatcher planning is the first dogfood acceptance scenario and will run in a separate scratch test case.

## Immediate Follow-Ups
1. Initialize `bd` in this repo so `.beads/` exists and matches the current workflow.
2. Rename package/docs surfaces toward `Codex-Compound`.
3. Rework the imported workflow/plugin docs for Codex-first behavior.
4. Decide which imported surfaces remain core versus compatibility.
5. Create the separate scratch test case for the RES Snatcher planning demo.

## Latest Commit
- `1b6ade8323abbcf10a4024877a11c62069036d85` on `codex/feat/bead-0-import-bootstrap`
