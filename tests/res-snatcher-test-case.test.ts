import { describe, expect, test } from "bun:test"
import { promises as fs } from "fs"
import path from "path"

const repoRoot = path.join(import.meta.dir, "..")
const testCaseRoot = path.join(repoRoot, "test-case", "res-snatcher")

async function read(relativePath: string): Promise<string> {
  return fs.readFile(path.join(testCaseRoot, relativePath), "utf8")
}

async function exists(relativePath: string): Promise<boolean> {
  try {
    await fs.access(path.join(testCaseRoot, relativePath))
    return true
  } catch {
    return false
  }
}

describe("RES Snatcher test case", () => {
  test("scratch project scaffolding exists", async () => {
    expect(await exists("AGENTS.md")).toBe(true)
    expect(await exists("CONTINUITY.md")).toBe(true)
    expect(await exists("HANDOFF.md")).toBe(true)
    expect(await exists("MISTAKES.md")).toBe(true)
    expect(await exists("Makefile")).toBe(true)
    expect(await exists("handoff/beads.jsonl")).toBe(true)
    expect(await exists("handoff/beads.schema.json")).toBe(true)
    expect(await exists("docs/brainstorms/2026-03-23-res-snatcher-requirements.md")).toBe(true)
    expect(await exists("docs/plans/2026-03-23-001-feat-res-snatcher-hackathon-plan.md")).toBe(true)
    expect(await exists("docs/research/official-sources.md")).toBe(true)
  })

  test("planning artifacts capture feasibility boundaries and integration reality", async () => {
    const [requirements, plan, research] = await Promise.all([
      read("docs/brainstorms/2026-03-23-res-snatcher-requirements.md"),
      read("docs/plans/2026-03-23-001-feat-res-snatcher-hackathon-plan.md"),
      read("docs/research/official-sources.md"),
    ])

    expect(requirements).toContain("language barrier")
    expect(requirements).toContain("ElevenLabs")
    expect(requirements).toContain("Firecrawl")

    expect(plan).toContain("Feasibility Decision")
    expect(plan).toContain("Feasible with constraints")
    expect(plan).toContain("Twilio")
    expect(plan).toContain("verified caller ID")
    expect(plan).toContain("Firecrawl /search")
    expect(plan).toContain("Firecrawl /extract")
    expect(plan).toContain("Assumptions")
    expect(plan).toContain("Feasibility Boundaries")
    expect(plan).toContain("Implementation Beads")

    expect(research).toContain("elevenlabs.io/docs/eleven-agents/phone-numbers/twilio-integration/native-integration")
    expect(research).toContain("docs.firecrawl.dev/features/search")
    expect(research).toContain("docs.firecrawl.dev/features/extract")
  })
})
