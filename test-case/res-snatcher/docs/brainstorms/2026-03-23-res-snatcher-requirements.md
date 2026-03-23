---
date: 2026-03-23
topic: res-snatcher
---

# RES Snatcher

## Problem Frame
Travelers often cannot reserve restaurants because the venue only accepts phone bookings in a language the traveler does not speak. RES Snatcher is a hackathon-scale attempt to remove that language barrier by letting a user request a reservation, then having an AI system find a phone number and place the call in the venue's language.

## Requirements
- R1. The user can submit a lightweight booking request containing restaurant name or cuisine plus area, party size, desired date, and desired time.
- R2. The system can identify at least one candidate restaurant and a callable phone number using Firecrawl or a seeded fallback list.
- R3. The system can invoke ElevenLabs / ElevenAgents to place a scripted reservation call in Japanese for a simple booking request.
- R4. The system can return a clear result state: booked, declined, unreachable, or unknown.
- R5. The demo must include an explicit fallback path when live discovery or live calling fails.

## Success Criteria
- A live or recorded demo shows a booking request flowing from input to call attempt to result.
- The MVP uses both Firecrawl and ElevenLabs in a way that is materially real, not decorative.
- The team can explain the demo honestly without implying broad production reliability.

## Scope Boundaries
- No payments, deposits, waitlists, or itinerary management.
- No guarantee of live negotiation for complex dining requirements.
- No production-grade compliance, localization, CRM, or restaurant onboarding.
- No claim that the product works for every country or every venue.

## Key Decisions
- Keep the first demo narrowly focused on Japanese restaurant booking because the source brief is strongest there.
- Treat a seeded fallback restaurant list as acceptable if Firecrawl cannot reliably extract phone numbers live.
- Treat a backup demo video as mandatory for the first serious demo attempt.

## Dependencies / Assumptions
- Firecrawl can either extract live phone numbers or enrich a pre-researched restaurant list.
- ElevenLabs / ElevenAgents can place an outbound call with a tight reservation script.
- Human review of the script and call outcome is acceptable for the first hackathon demo.

## Outstanding Questions

### Resolve Before Planning
- None.

### Deferred to Planning
- [Affects R2][Needs research] What is the smallest reliable Firecrawl flow for candidate restaurant discovery plus phone extraction?
- [Affects R3][Technical] What exact ElevenLabs call path is available for outbound reservation calls in the target environment?
- [Affects R5][Technical] What is the cleanest fallback between live call, recorded call, and synthetic replay?

## Next Steps
→ `/ce:plan` for structured implementation planning
