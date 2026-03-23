# AGENTS.md - RES Snatcher Test Case

## 1. Mission (North Star)
Use the Codex-first workflow to turn the RES Snatcher brief into a feasibility-quality brainstorm and plan for a hackathon-level implementation.

Goals:
1. Prove the workflow can take a simple but technically complex idea from brief to requirements to bead-aware plan.
2. Decide whether a constrained RES Snatcher MVP is feasible with ElevenLabs and Firecrawl in hackathon conditions.
3. Preserve explicit feasibility boundaries so later implementation does not quietly drift into a fake production promise.

## 2. Core Architecture
Planning-only workspace:

```text
test-case/res-snatcher/
├── AGENTS.md
├── CONTINUITY.md
├── HANDOFF.md
├── MISTAKES.md
├── Makefile
├── README.md
├── handoff/
│   ├── beads.jsonl
│   └── beads.schema.json
└── docs/
    ├── brainstorms/
    ├── plans/
    ├── research/
    └── learnings/
        ├── projects/
        ├── project-types/
        └── global/
```

Target implementation shape described by the plan:
- lightweight web intake flow
- restaurant discovery/phone extraction via Firecrawl
- outbound reservation call via ElevenLabs / ElevenAgents
- result capture and demo fallback path

## 3. Tech Stack
| Layer | Choice | Specifics |
| --- | --- | --- |
| Planning | Markdown | Requirements + plan artifacts only |
| Prospective frontend | Next.js | Fast demo-friendly web intake on Vercel |
| Prospective discovery | Firecrawl | Find candidate restaurants and extract phone numbers |
| Prospective calling | ElevenLabs / ElevenAgents | Scripted outbound reservation calls in Japanese |
| Memory | Markdown + JSONL | `CONTINUITY.md`, `HANDOFF.md`, `handoff/beads.jsonl`, `docs/learnings/` |

## 4. Agent and Sub-Agent Profiles

### Hybrid Agent Selection Policy (Mandatory)
Default behavior:
- Use a general planning agent for lightweight planning-only beads.

Hard guardrails:
- If the plan changes public calling behavior, legal/compliance assumptions, or vendor/runtime contracts, require explicit review before implementation.

Selection protocol:
1. Planner captures requirements and feasibility boundaries.
2. Reviewer checks whether the plan is honest about what is and is not proven.
3. Implementation only begins once the plan is explicit about demo fallbacks and unresolved risks.

## 5. Branching & Commits
Convention: `<type>(bead-N): description`

## 6. Continuity Ledger
- Read and update `CONTINUITY.md` on every touch.
- Record feasibility decisions and open questions explicitly.
- Keep `HANDOFF.md` and `handoff/beads.jsonl` current for planning evidence.
- Use `docs/learnings/` if this test case reveals reusable planning lessons.

## 7. Workflow

### Bead Entry Gate
Before work starts:
1. Brief is read.
2. Feasibility question is explicit.
3. Current state is recorded in `CONTINUITY.md`.

### Bead Exit Gate
Before work is considered complete:
1. Requirements artifact exists.
2. Plan artifact exists.
3. Feasibility boundaries are explicit.
4. Next step is clear enough for either Codex implementation or OpenClaw comparison.

## 8. Orchestration

### Spawn Contract
Sub-agents should work only on planning artifacts inside this test case.

### Escalation Rules
Escalate before implementation if the workflow cannot honestly support ElevenLabs and Firecrawl in the same plan without hidden manual steps.
