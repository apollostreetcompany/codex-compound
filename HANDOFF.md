# HANDOFF.md - Codex-Compound

## Current Status
Bead 3 is implemented and validated locally: the RES Snatcher scratch workspace now exercises the Codex-first planning path with canonical memory files, official-source research notes, and a feasibility-quality hackathon plan. The next scheduled major item is Bead 4, the initial OpenClaw relay and Codex PTY bridge skeleton, with one small CLI regression bead queued separately.

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
- Reworked the core workflow skill docs (`ce:brainstorm`, `ce:plan`, `ce:work`, `ce:review`, `ce:compound`, `ce:ideate`) around Codex-first memory and bead execution.
- Updated plugin-level docs in `plugins/compound-engineering/AGENTS.md` and `plugins/compound-engineering/README.md` to describe the Codex-first memory primitives.
- Added workflow contract tests to lock the new behavior in place.
- Created `test-case/res-snatcher/` as a standalone scratch workspace for dogfooding the Codex-first planning flow.
- Added local `HANDOFF.md`, `MISTAKES.md`, `Makefile`, `handoff/beads.jsonl`, and `handoff/beads.schema.json` inside the RES Snatcher test case.
- Added official-source research notes for ElevenLabs Twilio native integration and Firecrawl `search` / `extract`.
- Replaced the draft RES Snatcher plan with `docs/plans/2026-03-23-001-feat-res-snatcher-hackathon-plan.md`, which records assumptions, feasibility boundaries, and implementation beads.

## Validation Evidence
- `bun test` -> pass (364 tests)
- `bun run release:validate` -> pass
- `bd doctor` -> pass with two environment-level warnings:
  - local `bd` CLI is older than the latest upstream release
  - `LastBdVersion` metadata remains empty on this local install
- `bun test tests/root-identity.test.ts` -> pass
- `bun test tests/cli.test.ts` -> pass
- `bun run release:validate` -> pass after the root rename surface changes
- `bun test tests/compound-workflow-docs.test.ts tests/workflow-skill-contract.test.ts` -> pass
- `bun test tests/codex-converter.test.ts tests/codex-writer.test.ts` -> pass
- `bun test` -> pass (375 tests)
- `bun run release:validate` -> pass after the workflow rewrite
- `bun test tests/res-snatcher-test-case.test.ts` -> pass

## Current Defaults
- Codex owns the session and PTY.
- OpenClaw is a relay/orchestrator surface.
- `AGENTS.md` is canonical; `CLAUDE.md` remains a shim only.
- `.beads/` will be the backlog source of truth.
- `handoff/beads.jsonl` will hold per-bead evidence.
- RES Snatcher planning is the first dogfood acceptance scenario and will run in a separate scratch test case.
- Relative local plugin paths with separators need a small follow-up fix bead so `install tests/fixtures/sample-plugin` resolves locally while bare plugin names still prefer GitHub.

## Immediate Follow-Ups
1. Land the small CLI path-resolution regression bead.
2. Add the initial OpenClaw relay and Codex PTY bridge skeleton after the Codex-first planning flow is stable.
3. Decide which imported surfaces remain core versus compatibility.
4. Compare the RES Snatcher Codex-first plan against an OpenClaw-driven pass once the bridge exists.

## Recent Bead Commits
- `5745021375474b0f0370c42cba709339834eed49` contains Bead 1, which renames the root package/bin/docs/marketplace identity to Codex-Compound and adds targeted identity coverage.
- `1b6ade8323abbcf10a4024877a11c62069036d85` contains the imported upstream baseline plus the Codex-Compound scaffold on `codex/feat/bead-0-import-bootstrap`.
