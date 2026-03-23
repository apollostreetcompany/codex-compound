# CONTINUITY.md - RES Snatcher Test Case

## Goal (incl. success criteria)
Produce a brainstorm artifact and a bead-aware implementation plan for RES Snatcher that clearly says whether a hackathon-level MVP using ElevenLabs and Firecrawl is feasible.

Success criteria:
- Requirements are explicit enough for planning.
- The plan includes feasibility boundaries and fallbacks.
- The plan is honest about what must be validated early.

## Constraints/Assumptions
- Planning-only workspace; no code implementation in this test case yet.
- Hackathon scope, not production launch scope.
- Firecrawl may need seeded fallback restaurants if live extraction is unreliable.
- ElevenLabs / ElevenAgents call quality must be validated early and may require a backup demo video.

## Key Decisions
1. Treat this as a hackathon demo product, not a production booking platform.
2. Scope the first market to Japanese restaurant calls where a tightly scripted reservation request is acceptable.
3. Preserve fallback paths for both restaurant data and demo execution.
4. Anchor the outbound calling assumption to ElevenLabs Twilio native integration, with Twilio verified caller ID accepted for outbound-only demo calls.
5. Anchor restaurant discovery to a two-step Firecrawl flow: `/search` for candidate pages, then `/extract` for structured phone and reservation details.

## State

### Done
- [x] Imported the source brief into the planning context.
- [x] Created this scratch workspace for dogfooding the Codex-first planning flow.
- [x] Added canonical handoff and research files so the test case matches the parent Codex-first memory model.

### Now
- Requirements, research, and plan artifacts are ready for review.

### Next
- Compare this Codex-first planning result against an OpenClaw-driven planning pass.
- Decide whether to prototype implementation beads locally or only use the result as a planning benchmark.

## Open Questions
- How much live restaurant discovery should rely on Firecrawl versus a seeded fallback list for the first demo? (UNCONFIRMED)
- Should the first demo actually place a live call or rely on a previously recorded successful call? (UNCONFIRMED)

## Working Set
- `AGENTS.md`
- `CONTINUITY.md`
- `HANDOFF.md`
- `handoff/beads.jsonl`
- `docs/brainstorms/2026-03-23-res-snatcher-requirements.md`
- `docs/plans/2026-03-23-001-feat-res-snatcher-hackathon-plan.md`
- `docs/research/official-sources.md`
