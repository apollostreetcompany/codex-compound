import { describe, expect, test } from "bun:test"
import { promises as fs } from "fs"
import os from "os"
import path from "path"

async function exists(filePath: string): Promise<boolean> {
  try {
    await fs.access(filePath)
    return true
  } catch {
    return false
  }
}

describe("bootstrap script", () => {
  test("installs compound-engineering into a target CODEX_HOME using the current checkout", async () => {
    const tempRoot = await fs.mkdtemp(path.join(os.tmpdir(), "bootstrap-codex-"))
    const codexHome = path.join(tempRoot, ".codex")
    const repoRoot = path.join(import.meta.dir, "..")
    const scriptPath = path.join(repoRoot, "scripts", "bootstrap-codex-compound.sh")

    const proc = Bun.spawn(["bash", scriptPath], {
      cwd: tempRoot,
      stdout: "pipe",
      stderr: "pipe",
      env: {
        ...process.env,
        CODEX_COMPOUND_ROOT: repoRoot,
        CODEX_HOME: codexHome,
        SKIP_BUN_INSTALL: "1",
      },
    })

    const exitCode = await proc.exited
    const stdout = await new Response(proc.stdout).text()
    const stderr = await new Response(proc.stderr).text()

    if (exitCode !== 0) {
      throw new Error(`bootstrap failed (exit ${exitCode}).\nstdout: ${stdout}\nstderr: ${stderr}`)
    }

    expect(stdout).toContain("Installed Codex-Compound into")
    expect(stdout).toContain(codexHome)
    expect(await exists(path.join(codexHome, "prompts", "ce-plan.md"))).toBe(true)
    expect(await exists(path.join(codexHome, "prompts", "ce-brainstorm.md"))).toBe(true)
    expect(await exists(path.join(codexHome, "skills", "ce:plan", "SKILL.md"))).toBe(true)
    expect(await exists(path.join(codexHome, "skills", "repo-research-analyst", "SKILL.md"))).toBe(true)
    expect(await exists(path.join(codexHome, "AGENTS.md"))).toBe(true)
  })
})
