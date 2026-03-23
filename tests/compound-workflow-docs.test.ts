import { describe, expect, test } from "bun:test"
import { promises as fs } from "fs"
import path from "path"

const repoRoot = path.join(import.meta.dir, "..")

async function read(relativePath: string): Promise<string> {
  return fs.readFile(path.join(repoRoot, relativePath), "utf8")
}

describe("compound engineering workflow docs", () => {
  test("core workflow skills are codex-first about continuity, learnings, and beads", async () => {
    const [brainstorm, plan, work] = await Promise.all([
      read("plugins/compound-engineering/skills/ce-brainstorm/SKILL.md"),
      read("plugins/compound-engineering/skills/ce-plan/SKILL.md"),
      read("plugins/compound-engineering/skills/ce-work/SKILL.md"),
    ])

    expect(brainstorm).toContain("AGENTS.md")
    expect(brainstorm).toContain("CONTINUITY.md")
    expect(brainstorm).toContain("docs/learnings/")
    expect(brainstorm).toContain("CLAUDE.md only if retained as compatibility")

    expect(plan).toContain("CONTINUITY.md")
    expect(plan).toContain("docs/learnings/projects/")
    expect(plan).toContain("docs/learnings/project-types/")
    expect(plan).toContain("docs/learnings/global/")
    expect(plan).toContain("Planning Beads")
    expect(plan).toContain("Implementation Beads")

    expect(work).toContain("Implementation Beads")
    expect(work).toContain("CONTINUITY.md")
    expect(work).toContain("handoff/beads.jsonl")
    expect(work).toContain("type(bead-N)")
  })

  test("plugin docs describe codex-first workflow memory primitives", async () => {
    const [pluginAgents, pluginReadme] = await Promise.all([
      read("plugins/compound-engineering/AGENTS.md"),
      read("plugins/compound-engineering/README.md"),
    ])

    expect(pluginAgents).toContain("CONTINUITY.md")
    expect(pluginAgents).toContain(".beads/")
    expect(pluginAgents).toContain("handoff/beads.jsonl")

    expect(pluginReadme).toContain("AGENTS.md")
    expect(pluginReadme).toContain("CONTINUITY.md")
    expect(pluginReadme).toContain(".beads/")
    expect(pluginReadme).toContain("handoff/beads.jsonl")
  })
})
