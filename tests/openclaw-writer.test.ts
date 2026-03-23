import { describe, expect, test } from "bun:test"
import { promises as fs } from "fs"
import os from "os"
import path from "path"
import { pathToFileURL } from "url"
import { convertClaudeToOpenClaw } from "../src/converters/claude-to-openclaw"
import { writeOpenClawBundle } from "../src/targets/openclaw"
import type { ClaudePlugin } from "../src/types/claude"
import type { OpenClawBundle } from "../src/types/openclaw"

describe("writeOpenClawBundle", () => {
  test("writes openclaw.plugin.json with a configSchema", async () => {
    const tempRoot = await fs.mkdtemp(path.join(os.tmpdir(), "openclaw-writer-"))
    const bundle: OpenClawBundle = {
      manifest: {
        id: "compound-engineering",
        name: "Compound Engineering",
        kind: "tool",
        configSchema: {
          type: "object",
          properties: {},
        },
        skills: [],
      },
      packageJson: {
        name: "openclaw-compound-engineering",
        version: "1.0.0",
      },
      entryPoint: "export default async function register() {}",
      skills: [],
      skillDirCopies: [],
      commands: [],
      supportFiles: [
        {
          path: "bridge/codex-acp-bridge.example.json",
          content: "{\n  \"acp\": { \"defaultAgent\": \"codex\" }\n}",
        },
      ],
    }

    await writeOpenClawBundle(tempRoot, bundle)

    const manifest = JSON.parse(
      await fs.readFile(path.join(tempRoot, "openclaw.plugin.json"), "utf8"),
    )

    expect(manifest.configSchema).toEqual({
      type: "object",
      properties: {},
    })

    const bridgeConfig = JSON.parse(
      await fs.readFile(path.join(tempRoot, "bridge", "codex-acp-bridge.example.json"), "utf8"),
    )
    expect(bridgeConfig.acp.defaultAgent).toBe("codex")
  })

  test("written entry point resolves namespaced command skills at runtime", async () => {
    const tempRoot = await fs.mkdtemp(path.join(os.tmpdir(), "openclaw-runtime-"))
    const plugin: ClaudePlugin = {
      root: tempRoot,
      manifest: { name: "compound-engineering", version: "1.0.0", description: "A plugin" },
      agents: [],
      commands: [
        {
          name: "workflows:plan",
          description: "Planning command",
          argumentHint: "[FOCUS]",
          model: "inherit",
          allowedTools: ["Read"],
          body: "Plan the work. See ~/.claude/settings for config.",
          sourcePath: path.join(tempRoot, "commands", "workflows", "plan.md"),
        },
      ],
      skills: [],
      hooks: undefined,
      mcpServers: {},
    }

    const bundle = convertClaudeToOpenClaw(plugin, {
      agentMode: "subagent",
      inferTemperature: false,
      permissions: "none",
    })

    await writeOpenClawBundle(tempRoot, bundle)

    const module = await import(pathToFileURL(path.join(tempRoot, "index.ts")).href)
    const registrations: Array<{
      name: string
      handler: (ctx: unknown) => { text: string }
    }> = []

    await module.default({
      registerCommand(command: {
        name: string
        handler: (ctx: unknown) => { text: string }
      }) {
        registrations.push(command)
      },
    })

    const planCommand = registrations.find((command) => command.name === "workflows-plan")
    expect(planCommand).toBeDefined()

    const result = planCommand!.handler({})
    expect(result.text).toContain("Plan the work.")
    expect(result.text).toContain("~/.openclaw/settings")
    expect(result.text).not.toContain("~/.claude/settings")
  })
})
