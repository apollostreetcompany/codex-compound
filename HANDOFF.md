# HANDOFF.md - Codex-Compound

## Current Status
Bead 1 is implemented and validated locally: the root package, CLI identity, default GitHub source, and root-facing metadata now point at Codex-Compound, while downstream plugin IDs remain unchanged. The next step is Bead 2, the workflow rewrite for Codex-first continuity and beads.

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
- Rebranded the root package/bin/docs/marketplace identity to `codex-compound`.
- Exported the default GitHub install source and override resolution so the new root identity is testable.
- Added targeted identity coverage in `tests/root-identity.test.ts`.

## Validation Evidence
- `bun test` -> pass (364 tests)
- `bun run release:validate` -> pass
- `bd doctor` -> pass with two environment-level warnings:
  - local `bd` CLI is older than the latest upstream release
  - `LastBdVersion` metadata remains empty on this local install
- `bun test tests/root-identity.test.ts` -> pass
- `bun test tests/cli.test.ts` -> pass
- `bun run release:validate` -> pass after the root rename surface changes

## Current Defaults
- Codex owns the session and PTY.
- OpenClaw is a relay/orchestrator surface.
- `AGENTS.md` is canonical; `CLAUDE.md` remains a shim only.
- `.beads/` will be the backlog source of truth.
- `handoff/beads.jsonl` will hold per-bead evidence.
- RES Snatcher planning is the first dogfood acceptance scenario and will run in a separate scratch test case.

## Immediate Follow-Ups
1. Rewrite the core `ce:*` workflows around `AGENTS.md`, `CONTINUITY.md`, learnings, and bead-aware execution.
2. Decide which imported surfaces remain core versus compatibility.
3. Create the separate scratch test case for the RES Snatcher planning demo.
4. Add the initial OpenClaw relay and Codex PTY bridge skeleton after the Codex-first planning flow is stable.

## Recent Bead Commits
- `5745021375474b0f0370c42cba709339834eed49` contains Bead 1, which renames the root package/bin/docs/marketplace identity to Codex-Compound and adds targeted identity coverage.
- `1b6ade8323abbcf10a4024877a11c62069036d85` contains the imported upstream baseline plus the Codex-Compound scaffold on `codex/feat/bead-0-import-bootstrap`.
