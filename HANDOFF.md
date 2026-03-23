# HANDOFF.md - Codex-Compound

## Current Status
Bead 6 is implemented and validated locally: the OpenClaw converter now normalizes namespaced command registrations and generated command skill directories with the same helper, and the writer test suite now exercises the written `index.ts` runtime path to confirm those commands resolve correctly from disk. All scheduled beads are complete; the next practical step is to run the OpenClaw-driven comparison pass against the RES Snatcher test case.

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
- Fixed `install` path resolution so separator-containing relative inputs are treated as local plugin paths instead of GitHub names.
- Added CLI coverage for relative local plugin installs and root-identity coverage for plugin manifest repo URLs.
- Extended the OpenClaw bundle type so it can emit bridge support files alongside generated skills.
- Added `openclaw-codex-acp-bridge` generation for `compound-engineering`, including bridge instructions and `bridge/codex-acp-bridge.example.json`.
- Updated root and plugin docs to describe the ACP-backed OpenClaw -> Codex planning handoff path and its limits.
- Normalized OpenClaw command skill directories and command registration names through the same converter helper so namespaced commands preserve one runtime lookup key.
- Added an end-to-end OpenClaw writer/runtime regression that writes a bundle, imports the generated `index.ts`, and verifies a namespaced command returns the expected skill body.

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
- `bun test tests/cli.test.ts tests/root-identity.test.ts` -> pass
- `bun test tests/openclaw-converter.test.ts tests/openclaw-writer.test.ts tests/sync-openclaw.test.ts` -> pass
- `bun test` -> pass (381 tests)
- `bun run release:validate` -> pass after the OpenClaw bridge skeleton
- `bun test tests/openclaw-converter.test.ts tests/openclaw-writer.test.ts tests/sync-openclaw.test.ts tests/cli.test.ts` -> pass (33 tests)
- `bun test` -> pass (383 tests)
- `bun run release:validate` -> pass after the OpenClaw command normalization follow-up

## Current Defaults
- Codex owns the session and PTY.
- OpenClaw is a relay/orchestrator surface.
- `AGENTS.md` is canonical; `CLAUDE.md` remains a shim only.
- `.beads/` will be the backlog source of truth.
- `handoff/beads.jsonl` will hold per-bead evidence.
- RES Snatcher planning is the first dogfood acceptance scenario and will run in a separate scratch test case.
- Relative local plugin paths with separators now resolve locally while bare plugin names still prefer GitHub.
- The first OpenClaw bridge cut is ACP-first. It assumes `@openclaw/acpx`, Codex CLI on the OpenClaw host, and thread-bound ACP sessions rather than a custom plugin-managed PTY.
- Generated OpenClaw command identity is canonicalized at conversion time, so namespaced command registrations and `skills/cmd-*` directories cannot drift apart.

## Immediate Follow-Ups
1. Compare the RES Snatcher Codex-first plan against an OpenClaw-driven pass using the new ACP bridge skeleton.
2. Decide whether attach/resume support belongs in the next bridge bead.
3. Decide whether OpenClaw personal command sync remains a warning path or gains a documented conversion surface.
4. Decide which imported surfaces remain core versus compatibility.

## Recent Bead Commits
- `a1b099ddf6bb15807c2768cb28055d51ae2a3bf3` contains Bead 4, which adds the ACP-backed OpenClaw -> Codex relay skeleton, generated bridge skill, example ACP config, and documentation updates.
- `84edeb229ddba1940cd93321cc742f1b09fd9481` contains Bead 5, which fixes relative local plugin path resolution and adds compatibility coverage for plugin-manifest repo URLs.
- `2de3af0b1bfabfa943c648b751ee676cac78dcd2` contains Bead 3, which adds the RES Snatcher scratch planning workspace, official-source research notes, and the feasibility-quality hackathon plan.
- `5745021375474b0f0370c42cba709339834eed49` contains Bead 1, which renames the root package/bin/docs/marketplace identity to Codex-Compound and adds targeted identity coverage.
- `1b6ade8323abbcf10a4024877a11c62069036d85` contains the imported upstream baseline plus the Codex-Compound scaffold on `codex/feat/bead-0-import-bootstrap`.
