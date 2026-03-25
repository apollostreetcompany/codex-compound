# HANDOFF.md - Codex-Compound

## Current Status
Bead 9 is complete: the Codex target now behaves like a real Codex-native workflow pack with explicit `#$ARGUMENTS` prompt wrappers, portable ask-user guidance in installed skills, repo-local helper-skill recipes, and a clean full-pack install path into `~/.codex`. The global Codex home now contains the full `compound-engineering` skill surface plus direct prompt entrypoints for the `ce:*` workflows and selected utilities. The clean OpenClaw upload artifact remains available at `/Users/borker/Downloads/codex-compound-openclaw-upload/compound-engineering-openclaw-clean.zip`. The next practical step is to run the OpenClaw-driven comparison pass against the RES Snatcher test case.

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
- Installed only `ce-plan` and `ce-brainstorm` into the global `~/.codex` as prompts plus copied skills, leaving helper skills and agents out of the global surface on purpose.
- Installed the requested documentation and deeper-planning workflows into the global `~/.codex` as prompts plus copied skills:
  - `ce:compound`
  - `ce:compound-refresh`
  - `deepen-plan`
  - `deepen-plan-beta`
  - `document-review`
  - `compound-docs`
- Generated a clean OpenClaw extension bundle under `/Users/borker/Downloads/codex-compound-openclaw-upload/compound-engineering` and zipped it as `compound-engineering-openclaw-clean.zip`.
- Confirmed the upload artifact contains generated extension files only and no repo scaffolding files such as `AGENTS.md`, `CONTINUITY.md`, `HANDOFF.md`, or `MISTAKES.md`.
- Historical packaging caveat (resolved in Bead 9): `plugins/compound-engineering/skills/frontend-design/SKILL.md` previously had malformed YAML frontmatter, so earlier packaging used a tolerant loader fallback for that one skill instead of the standard strict plugin loader.
- Historical global-install caveat (resolved in Bead 9): strict plugin loading previously failed on the malformed `frontend-design` skill frontmatter, so the Bead 8 install read only the selected skill directories instead of parsing the full plugin tree.
- Added `compound-engineering.recipes.yaml` as the repo-local helper-skill recipe registry for Codex workflows.
- Added a Codex recipe loader/formatter that surfaces RepoPrompt-first helper guidance in direct prompt wrappers.
- Expanded the Codex prompt surface so the full plugin now emits prompt wrappers for all `ce:*` workflows plus documented utility entrypoints with backing skill sources, while still excluding `/sync`.
- Reworked Codex prompt wrappers to bind `#$ARGUMENTS` explicitly and to tell Codex to ask and wait when required input is missing.
- Added Codex content normalization for AskUserQuestion-only skill text so installed skills mention `request_user_input` first and fall back to numbered-list chat guidance cleanly.
- Made full plugin loading resilient to malformed skill frontmatter and fixed the source `frontend-design` frontmatter so the standard full-pack Codex install path succeeds again.
- Updated Codex sync so it always preserves the managed `~/.codex/AGENTS.md` compatibility block.
- Performed the real global Codex full-pack install into `/Users/borker/.codex`, which now includes:
  - prompt wrappers such as `ce-plan`, `ce-brainstorm`, `ce-work`, `ce-work-beta`, `ce-compound`, `ce-compound-refresh`, `deepen-plan`, `document-review`, `setup`, `lfg`, `test-browser`, and `test-xcode`
  - copied skills under `/Users/borker/.codex/skills/`
  - converted agent skills such as `repo-research-analyst`
  - no `/Users/borker/.codex/prompts/sync.md`

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
- `bun test tests/claude-parser.test.ts tests/codex-converter.test.ts tests/codex-writer.test.ts tests/sync-codex.test.ts tests/compound-engineering-recipes.test.ts tests/cli.test.ts` -> pass (48 tests)
- `bun test` -> pass (389 tests)
- `bun run release:validate` -> pass after the Codex prompt/recipe upgrade
- minimal Codex global install wrote:
  - `/Users/borker/.codex/prompts/ce-plan.md`
  - `/Users/borker/.codex/prompts/ce-brainstorm.md`
  - `/Users/borker/.codex/skills/ce:plan/SKILL.md`
  - `/Users/borker/.codex/skills/ce:brainstorm/SKILL.md`
- expanded Codex global install wrote:
  - `/Users/borker/.codex/prompts/ce-compound.md`
  - `/Users/borker/.codex/prompts/ce-compound-refresh.md`
  - `/Users/borker/.codex/prompts/deepen-plan.md`
  - `/Users/borker/.codex/prompts/deepen-plan-beta.md`
  - `/Users/borker/.codex/prompts/document-review.md`
  - `/Users/borker/.codex/prompts/compound-docs.md`
  - `/Users/borker/.codex/skills/ce:compound/SKILL.md`
  - `/Users/borker/.codex/skills/ce:compound-refresh/SKILL.md`
  - `/Users/borker/.codex/skills/deepen-plan/SKILL.md`
  - `/Users/borker/.codex/skills/deepen-plan-beta/SKILL.md`
  - `/Users/borker/.codex/skills/document-review/SKILL.md`
  - `/Users/borker/.codex/skills/compound-docs/SKILL.md`
- `sed -n '1,40p' /Users/borker/.codex/prompts/ce-compound.md /Users/borker/.codex/prompts/deepen-plan.md /Users/borker/.codex/prompts/document-review.md /Users/borker/.codex/prompts/compound-docs.md` -> pass; wrappers point at the expected skills
- `rg -n "/prompts:|/ce:|/deepen-plan|/compound-docs|/ce:compound-refresh" /Users/borker/.codex/skills/ce:compound/SKILL.md` -> pass; copied skill references are rewritten toward installed prompt names where targets exist
- `bun run src/index.ts convert ./plugins/compound-engineering --to codex --codex-home ~/.codex` -> pass; full plugin converted into `/Users/borker/.codex`
- `sed -n '1,80p' /Users/borker/.codex/prompts/ce-plan.md /Users/borker/.codex/prompts/deepen-plan.md /Users/borker/.codex/prompts/lfg.md` -> pass; wrappers now contain explicit `#$ARGUMENTS` sections and recipe guidance where configured
- `rg -n "request_user_input|compound-engineering\\.recipes\\.yaml|rp-investigate|AskUserQuestion" /Users/borker/.codex/skills/ce:plan/SKILL.md /Users/borker/.codex/skills/deepen-plan/SKILL.md /Users/borker/.codex/skills/setup/SKILL.md` -> pass; installed skills now mention `request_user_input` and preserve already-compliant cross-platform guidance
- `unzip -l /Users/borker/Downloads/codex-compound-openclaw-upload/compound-engineering-openclaw-clean.zip` -> pass; archive contains only generated extension content
- `find /Users/borker/Downloads/codex-compound-openclaw-upload/compound-engineering -maxdepth 2 \\( -name 'AGENTS.md' -o -name 'CONTINUITY.md' -o -name 'HANDOFF.md' -o -name 'MISTAKES.md' \\)` -> no output

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
- The Codex install path in this repo writes user-facing prompts and skills only under `~/.codex/prompts` and `~/.codex/skills`.
- RepoPrompt is the mandatory helper baseline in `compound-engineering.recipes.yaml`. External vetted-library entries (`prompt-cache-maximizer`, `swiftui-pro`, `skill-audit`) are recommendations only, not auto-installed surfaces.

## Immediate Follow-Ups
1. Compare the RES Snatcher Codex-first plan against an OpenClaw-driven pass using the new ACP bridge skeleton.
2. Decide whether Codex target installs should respect `disable-model-invocation` for skills.
3. Decide whether install profiles should narrow the global Codex action surface now that the full pack is available.
4. Decide whether attach/resume support belongs in the next bridge bead.
5. Decide whether OpenClaw personal command sync remains a warning path or gains a documented conversion surface.
6. Decide which imported surfaces remain core versus compatibility.

## Recent Bead Commits
- `debcedb1aaff51b4ddc04ca8968b7cdca9f9e7f4` contains the Bead 9 implementation, which ports the full Codex prompt and skill surface, adds explicit `#$ARGUMENTS` prompt wrappers, recipe-guided helper skill recommendations, portable ask-user normalization, tolerant skill loading, and the repaired `frontend-design` frontmatter.
- `41902bff49e6316a021a90fe2fda9fbee0d4b8b9` contains Bead 8, which records the expanded global Codex prompt/skill surface for documentation and deeper-planning workflows plus the targeted-installer caveat around the malformed `frontend-design` skill frontmatter.
- `5504f975a02a58d50a241624e3d3ddc0fce3ddd7` contains Bead 7, which records the minimal global Codex visibility install and the clean OpenClaw upload artifact path and caveats.
- `9ec45ea29e99ebd81ea873fc2875962aa8bc90ca` contains Bead 6, which normalizes OpenClaw command registration and command-skill directory names together and adds a written-bundle runtime regression for namespaced commands.
- `a1b099ddf6bb15807c2768cb28055d51ae2a3bf3` contains Bead 4, which adds the ACP-backed OpenClaw -> Codex relay skeleton, generated bridge skill, example ACP config, and documentation updates.
- `84edeb229ddba1940cd93321cc742f1b09fd9481` contains Bead 5, which fixes relative local plugin path resolution and adds compatibility coverage for plugin-manifest repo URLs.
- `2de3af0b1bfabfa943c648b751ee676cac78dcd2` contains Bead 3, which adds the RES Snatcher scratch planning workspace, official-source research notes, and the feasibility-quality hackathon plan.
- `5745021375474b0f0370c42cba709339834eed49` contains Bead 1, which renames the root package/bin/docs/marketplace identity to Codex-Compound and adds targeted identity coverage.
- `1b6ade8323abbcf10a4024877a11c62069036d85` contains the imported upstream baseline plus the Codex-Compound scaffold on `codex/feat/bead-0-import-bootstrap`.
