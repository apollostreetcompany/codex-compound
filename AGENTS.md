# AGENTS.md - Codex-Compound

## 1. Mission (North Star)
Build a Codex-first derivative of Compound Engineering that preserves the `ce:*` workflow surface while making Codex the authored and operational canon.

Goals:
1. Make the workflow directly usable in Codex App and Codex CLI with `AGENTS.md`, `CONTINUITY.md`, `.beads/`, and `handoff/beads.jsonl` as first-class primitives.
2. Provide an OpenClaw adapter so an Opus-driven OpenClaw session can start, mirror, and relay a Codex-owned PTY planning session.
3. Keep the full CLI architecture intact initially, but optimize, document, and validate Codex and OpenClaw as the first-class targets.
4. Capture compounding learnings across project, project-type, and global scopes without losing file-level relevance.
5. Dogfood the workflow on separate scratch test cases, starting with planning the RES Snatcher concept to a feasibility-quality plan before implementation.

## 2. Core Architecture
Current repo shape:

```text
repo/
├── AGENTS.md
├── CONTINUITY.md
├── HANDOFF.md
├── MISTAKES.md
├── DEPLOYMENT.md
├── Makefile
├── .beads/                      # bd backlog / issue inventory
├── handoff/
│   ├── beads.jsonl              # per-bead execution evidence
│   └── beads.schema.json
├── docs/
│   ├── brainstorms/
│   ├── plans/
│   ├── solutions/
│   ├── specs/
│   └── learnings/
│       ├── projects/
│       ├── project-types/
│       └── global/
├── plugins/
│   └── compound-engineering/    # core workflow/plugin surface
├── src/                         # CLI entry, parsers, converters, targets, sync
├── tests/                       # converter/writer/CLI coverage
└── scripts/                     # release + repo automation
```

Design intent:
- `AGENTS.md` is canonical.
- `CLAUDE.md` is a compatibility shim only.
- `.beads/` owns backlog and issue inventory.
- `handoff/beads.jsonl` owns execution evidence.
- `CONTINUITY.md` owns current state.
- `docs/learnings/` owns durable learnings.

## 3. Tech Stack
| Layer | Choice | Specifics |
| --- | --- | --- |
| CLI/runtime | Bun + TypeScript | Imported from upstream `compound-engineering-plugin` main branch |
| Codex surface | Markdown + YAML + TOML | Prompts, skills, `AGENTS.md`, `config.toml` |
| OpenClaw surface | TypeScript + JSON | Extension bundle plus future PTY relay/adapter |
| Memory/learning | Markdown + JSONL | `CONTINUITY.md`, `HANDOFF.md`, `MISTAKES.md`, `docs/learnings/`, `handoff/beads.jsonl` |
| Issue tracking | `bd` | `.beads/` backlog, dependency tracking, ready/blocked views |
| SCM | Git + GitHub | `origin=https://github.com/apollostreetcompany/codex-compound.git`, branch prefix `codex/` |

## 4. Agent and Sub-Agent Profiles

### Hybrid Agent Selection Policy (Mandatory)
Default behavior:
- Use contextual/dynamic agent selection for low-risk and single-domain beads.

Hard guardrails (must override dynamic choice):
- If a bead changes public CLI contracts, target conversion semantics, prompt/skill entrypoint contracts, or PTY/session bridge behavior:
  - Required path: Architect review -> domain Engineer implementation -> Analyst review.
- If a bead changes auth/policy/security logic, schema/migrations, or deployment/runtime behavior:
  - Required path: Architect review -> domain Engineer implementation -> Analyst review.
- If a bead includes Figma URL/node or visual parity requirement:
  - Required implementer: Frontend Engineer with Figma tool access.

Selection protocol per bead:
1. Primary agent is chosen by context.
2. Record selection rationale in the bead summary with: chosen agent, why chosen, confidence, fallback.
3. If confidence is low or the bead spans multiple domains, split the bead or escalate to Architect before implementation.

Non-negotiable:
- Dynamic selection cannot bypass hard guardrails.

## 5. Branching & Commits
Convention: `<type>(bead-N): description`

Types:
- `feat`
- `optimization`
- `fix`
- `test`
- `docs`
- `chore`

Branch naming:
- `codex/feat/bead-N-description`
- `codex/fix/bead-N-description`
- `codex/chore/bead-N-description`

Rules:
- No direct commits to `main`.
- Keep commits atomic and scoped to one bead.
- Push after each completed bead.
- Preserve upstream attribution and license context when copying or reshaping imported content.

## 6. Continuity Ledger
Protocol for `CONTINUITY.md`:
- Read at the start of every turn.
- Update during decisions, not only at completion.
- Keep append-only decision history.
- Mark uncertain items as `UNCONFIRMED`.
- Include Ledger Snapshot in implementation/review replies.

Memory model:
- `CONTINUITY.md` = current state and next moves.
- `.beads/` = backlog and dependencies.
- `handoff/beads.jsonl` = bead execution evidence.
- `docs/learnings/projects/` = repo-specific durable learnings.
- `docs/learnings/project-types/` = cross-project-type learnings.
- `docs/learnings/global/` = global durable learnings.

## 7. Workflow

### Bead Entry Gate (Mandatory)
Before implementation starts:
1. Bead scope and acceptance tests are explicit.
2. Agent is selected using the Hybrid Agent Selection Policy.
3. Required tools are declared.
   - Default tools here: RepoPrompt, `bd`, Bun, git, and web research when a referenced external source must be verified.
4. Risk class is declared as one of:
   - `Low`: single-domain, no contract/security/deploy impact
   - `Medium`: multi-file/domain, no hard-guardrail impact
   - `High`: any hard-guardrail trigger

If any item is missing, the bead is not started.

### Bead Exit Gate (Mandatory)
Before a bead is marked complete:
1. Required validations pass for the bead risk class.
2. Reviewer checklist is completed: completeness, quality, consistency, tests, security.
3. `CONTINUITY.md` is updated.
4. `handoff/beads.jsonl` is appended.
5. Chat bead summary is posted.

Validation matrix:
- `code`: lint/format checks; relevant unit/integration tests; risk-based scope.
- `docs/process`: markdown/path consistency; policy consistency across `AGENTS.md`, `CONTINUITY.md`, `HANDOFF.md`, `MISTAKES.md`, `DEPLOYMENT.md`.
- `research/analysis`: source list; explicit assumptions; tradeoff summary.
- `ops/deploy`: preflight, runtime bind verification, health and rollback notes.

Risk/Test matrix:
- `Low`: changed-module checks only; targeted tests.
- `Medium`: changed-module checks; relevant integration/contract checks.
- `High`: full required suite; security/contract checks; reviewer sign-off.

Operational workflow:
1. `bd` owns the task/backlog graph.
2. Plans emit execution beads, with planning beads used rarely and only early.
3. `ce:*` names stay stable while their internal instructions are rewritten for Codex-first behavior.
4. Dogfood major workflow changes on a separate scratch "test case" project before relying on passthrough automation.

## 8. Orchestration

### Spawn Contract (Mandatory)
Each spawned agent prompt must include:
1. Owned files/paths.
2. In-scope and out-of-scope work.
3. Required tools and constraints.
4. Acceptance tests and expected outputs.
5. Report format: changes made; test commands/results; assumptions/risks; follow-up recommendations.

### Escalation Rules
Architect sign-off is required before implementation if:
1. Public CLI shape changes.
2. Prompt/skill entrypoint contracts change.
3. OpenClaw relay or Codex PTY ownership semantics change.
4. Security/policy semantics change.
5. Deployment architecture/runtime behavior changes.
