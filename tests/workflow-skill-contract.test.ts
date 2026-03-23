import { describe, expect, test } from "bun:test"
import { promises as fs } from "fs"
import path from "path"

async function readSkill(relativePath: string): Promise<string> {
  return fs.readFile(path.join(import.meta.dir, "..", relativePath), "utf8")
}

describe("core workflow skill contracts", () => {
  test("ce:brainstorm is grounded in AGENTS and CONTINUITY", async () => {
    const skill = await readSkill("plugins/compound-engineering/skills/ce-brainstorm/SKILL.md")

    expect(skill).toContain("AGENTS.md")
    expect(skill).toContain("CONTINUITY.md")
    expect(skill).toContain("docs/learnings/")
  })

  test("ce:plan emits bead-aware plans grounded in continuity and learnings", async () => {
    const skill = await readSkill("plugins/compound-engineering/skills/ce-plan/SKILL.md")

    expect(skill).toContain("CONTINUITY.md")
    expect(skill).toContain("docs/learnings/projects/")
    expect(skill).toContain("docs/learnings/project-types/")
    expect(skill).toContain("docs/learnings/global/")
    expect(skill).toContain("planning beads")
    expect(skill).toContain("implementation beads")
  })

  test("ce:work executes one bead at a time and records evidence", async () => {
    const skill = await readSkill("plugins/compound-engineering/skills/ce-work/SKILL.md")

    expect(skill).toContain("one bead at a time")
    expect(skill).toContain("handoff/beads.jsonl")
    expect(skill).toContain("MISTAKES.md")
    expect(skill).toContain("docs/learnings/")
  })

  test("adjacent workflows honor Codex-first memory artifacts", async () => {
    const reviewSkill = await readSkill("plugins/compound-engineering/skills/ce-review/SKILL.md")
    const compoundSkill = await readSkill("plugins/compound-engineering/skills/ce-compound/SKILL.md")
    const ideateSkill = await readSkill("plugins/compound-engineering/skills/ce-ideate/SKILL.md")

    expect(reviewSkill).toContain("CONTINUITY.md")
    expect(reviewSkill).toContain("handoff/beads.jsonl")

    expect(compoundSkill).toContain("docs/learnings/projects/")
    expect(compoundSkill).toContain("docs/learnings/project-types/")
    expect(compoundSkill).toContain("docs/learnings/global/")

    expect(ideateSkill).toContain("CONTINUITY.md")
    expect(ideateSkill).toContain("docs/learnings/")
  })
})
