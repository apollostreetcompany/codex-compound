---
title: feat: RES Snatcher hackathon MVP
type: feat
status: active
date: 2026-03-23
origin: docs/brainstorms/2026-03-23-res-snatcher-requirements.md
---

# feat: RES Snatcher hackathon MVP

## Overview
Build a hackathon-level MVP that accepts a reservation request, finds a callable restaurant candidate, and attempts a Japanese reservation call while remaining honest about demo fallbacks.

## Feasibility Decision
- **Feasible with constraints:** yes.
- The constrained path is real enough for a hackathon because Firecrawl can cover discovery plus extraction, and ElevenLabs documents a Twilio native outbound calling path for ElevenAgents.
- The plan is not production-ready. It is only credible if the demo is explicit about fallback data and fallback call presentation.

## Assumptions
- ElevenLabs outbound calling will use the documented Twilio native integration rather than an undocumented direct telephony shortcut.
- A Twilio `verified caller ID` is acceptable for the first outbound-only demo if a purchased Twilio number is not available yet.
- Firecrawl `/search` is used to gather restaurant candidate pages from cuisine and area queries.
- Firecrawl `/extract` is used to structure phone numbers and reservation-relevant facts from the shortlisted pages.
- Human review of the reservation script and the first few call outcomes is acceptable in a hackathon setting.

## Feasibility Boundaries
- The MVP only supports a narrow reservation intent: party size, date, time, and caller name.
- The MVP does not promise live negotiation, waitlist handling, allergy discussion, or production reliability.
- Firecrawl may fail to produce clean phone numbers from live pages; a seeded fallback dataset is therefore part of the plan, not a hidden rescue.
- ElevenLabs may prove brittle in live calling conditions; the demo therefore requires a backup path that can use a previously validated call recording without changing the product story.
- The outbound path depends on Twilio-backed number setup and the documented ElevenLabs workflow. If Twilio import or `verified caller ID` setup is blocked, the implementation bead must stop and re-scope instead of improvising a fake integration.

## Architecture Sketch
- **Frontend intake:** a minimal form for restaurant or cuisine, area, party size, date, and time.
- **Discovery stage:** `Firecrawl /search` to find candidate restaurant pages.
- **Extraction stage:** `Firecrawl /extract` to normalize phone numbers and booking cues from those pages.
- **Calling stage:** ElevenLabs / ElevenAgents outbound call via Twilio native integration.
- **Result stage:** normalize the outcome into booked, declined, unreachable, or unknown and display it with source context.

## Planning Bead 0: Validate the critical external path
- **Goal:** verify that the riskiest vendor boundary is genuinely available before broader implementation.
- **Why first:** without a proven Twilio-backed call path or a credible Firecrawl discovery flow, the rest of the demo is story polish on top of a blocker.
- **Verification:** document a real Twilio import path in ElevenLabs, verify the `verified caller ID` fallback, and confirm that `Firecrawl /search` plus `Firecrawl /extract` can yield at least one callable restaurant record.

## Implementation Beads

### Bead 1: Seed and search candidate restaurants
- **Goal:** return at least one candidate restaurant with a callable phone number.
- **Approach:** start with a curated fallback list of Tokyo restaurants, then layer live `Firecrawl /search` results on top for dynamic discovery.
- **Verification:** one booking request yields one or more candidates with source attribution and a phone number.

### Bead 2: Build the lightweight booking intake flow
- **Goal:** capture the minimum reservation request needed for a demo.
- **Approach:** collect only restaurant or cuisine, area, party size, date, time, and caller name.
- **Verification:** the request normalizes into a call-ready payload with no extra operator cleanup.

### Bead 3: Integrate ElevenLabs reservation calling
- **Goal:** place a simple outbound Japanese reservation request.
- **Approach:** use ElevenLabs / ElevenAgents with Twilio native integration and keep the prompt tightly scripted.
- **Verification:** a live or controlled outbound call reaches one of the supported result states.

### Bead 4: Present results and lock the fallback path
- **Goal:** make the demo resilient without pretending it is more mature than it is.
- **Approach:** show live results when available, and store a previously successful call recording as a fallback demo asset.
- **Verification:** the team can demo the same story with either a live call or the fallback asset.

## Risks and Tradeoffs
- **High risk:** Twilio setup or ElevenLabs outbound calling fails in the target environment.
- **Medium risk:** Firecrawl returns pages but not clean phone numbers or reservation cues.
- **Medium risk:** the Japanese reservation prompt is good enough for a narrow script but not for recovery from unexpected dialogue.
- **Tradeoff:** the plan chooses honesty and demo resilience over full automation purity.

## Sources & References
- `docs/brainstorms/2026-03-23-res-snatcher-requirements.md`
- `/Users/borker/Downloads/RES-SNATCHER-SUMMARY.md`
- `docs/research/official-sources.md`

## Execution Notes
- Start implementation only after the vendor-boundary validation bead is complete.
- If OpenClaw produces a materially different plan, compare the feasibility boundaries first rather than the wording.
