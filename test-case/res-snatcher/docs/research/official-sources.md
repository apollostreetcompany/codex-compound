# Official Sources

Source verification date: 2026-03-23

## ElevenLabs / ElevenAgents telephony
- Source: `https://elevenlabs.io/docs/eleven-agents/phone-numbers/twilio-integration/native-integration`
- Notes:
  - ElevenLabs documents a Twilio native integration for ElevenAgents.
  - Purchased Twilio numbers support inbound and outbound calling.
  - Twilio `verified caller ID` supports outbound only, which is enough for a hackathon reservation demo if inbound agent assignment is not required.
  - Outbound calls are initiated from the ElevenAgents phone number UI after importing the Twilio number and selecting the destination number.

## Firecrawl candidate discovery
- Source: `https://docs.firecrawl.dev/features/search`
- Notes:
  - Firecrawl `/search` can search the web and optionally scrape returned results in one operation.
  - This is the best first-stage fit for finding candidate restaurant pages from cuisine and area queries.
  - Search returns result metadata and can be constrained by source type and scrape options, which is useful for a small candidate set.

## Firecrawl structured extraction
- Source: `https://docs.firecrawl.dev/features/extract`
- Notes:
  - Firecrawl `/extract` is designed for structured data extraction from one or more URLs and supports wildcards.
  - `/extract` can use a prompt plus schema, which makes it a better second-stage fit for extracting phone numbers and reservation details from candidate pages.
  - Extraction can run as a job and be polled for completion, so the implementation plan should tolerate asynchronous completion and failures.

## Planning Implication
- The honest demo path is `Firecrawl /search` -> shortlist candidate pages -> `Firecrawl /extract` -> choose a phone number -> ElevenLabs Twilio outbound call.
- The honest fallback path is a seeded restaurant list plus a previously validated Twilio-backed call flow if live discovery or live calling proves brittle.
