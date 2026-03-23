import { formatFrontmatter } from "../utils/frontmatter"
import type {
  ClaudeAgent,
  ClaudeCommand,
  ClaudePlugin,
  ClaudeMcpServer,
} from "../types/claude"
import type {
  OpenClawBundle,
  OpenClawCommandRegistration,
  OpenClawConfigProperty,
  OpenClawPluginManifest,
  OpenClawSkillFile,
  OpenClawSupportFile,
  OpenClawUiHint,
} from "../types/openclaw"
import type { ClaudeToOpenCodeOptions } from "./claude-to-opencode"

export type ClaudeToOpenClawOptions = ClaudeToOpenCodeOptions

export function convertClaudeToOpenClaw(
  plugin: ClaudePlugin,
  _options: ClaudeToOpenClawOptions,
): OpenClawBundle {
  const enabledCommands = plugin.commands.filter((cmd) => !cmd.disableModelInvocation)
  const bridgeScaffold = buildBridgeScaffold(plugin)

  const agentSkills = plugin.agents.map(convertAgentToSkill)
  const commandSkills = enabledCommands.map(convertCommandToSkill)
  const commands = enabledCommands.map(convertCommand)

  const skills: OpenClawSkillFile[] = [
    ...agentSkills,
    ...commandSkills,
    ...bridgeScaffold.skills,
  ]

  const skillDirCopies = plugin.skills.map((skill) => ({
    sourceDir: skill.sourceDir,
    name: skill.name,
  }))

  const allSkillDirs = [
    ...agentSkills.map((s) => s.dir),
    ...commandSkills.map((s) => s.dir),
    ...bridgeScaffold.skills.map((s) => s.dir),
    ...plugin.skills.map((s) => s.name),
  ]

  const manifest = buildManifest(
    plugin,
    allSkillDirs,
    bridgeScaffold.configProperties,
    bridgeScaffold.uiHints,
  )

  const packageJson = buildPackageJson(plugin)

  const openclawConfig = plugin.mcpServers
    ? buildOpenClawConfig(plugin.mcpServers)
    : undefined

  const entryPoint = generateEntryPoint(commands)

  return {
    manifest,
    packageJson,
    entryPoint,
    skills,
    skillDirCopies,
    commands,
    supportFiles: bridgeScaffold.supportFiles,
    openclawConfig,
  }
}

function buildManifest(
  plugin: ClaudePlugin,
  skillDirs: string[],
  configProperties: Record<string, OpenClawConfigProperty>,
  uiHints?: Record<string, OpenClawUiHint>,
): OpenClawPluginManifest {
  return {
    id: plugin.manifest.name,
    name: formatDisplayName(plugin.manifest.name),
    kind: "tool",
    configSchema: {
      type: "object",
      properties: configProperties,
    },
    uiHints,
    skills: skillDirs.map((dir) => `skills/${dir}`),
  }
}

function buildPackageJson(plugin: ClaudePlugin): Record<string, unknown> {
  return {
    name: `openclaw-${plugin.manifest.name}`,
    version: plugin.manifest.version,
    type: "module",
    private: true,
    description: plugin.manifest.description,
    main: "index.ts",
    openclaw: {
      extensions: [
        {
          id: plugin.manifest.name,
          entry: "./index.ts",
        },
      ],
    },
    keywords: [
      "openclaw",
      "openclaw-plugin",
      ...(plugin.manifest.keywords ?? []),
    ],
  }
}

function convertAgentToSkill(agent: ClaudeAgent): OpenClawSkillFile {
  const frontmatter: Record<string, unknown> = {
    name: agent.name,
    description: agent.description,
  }

  if (agent.model && agent.model !== "inherit") {
    frontmatter.model = agent.model
  }

  const body = rewritePaths(agent.body)
  const content = formatFrontmatter(frontmatter, body)

  return {
    name: agent.name,
    content,
    dir: `agent-${agent.name}`,
  }
}

function convertCommandToSkill(command: ClaudeCommand): OpenClawSkillFile {
  const frontmatter: Record<string, unknown> = {
    name: `cmd-${command.name}`,
    description: command.description,
  }

  if (command.model && command.model !== "inherit") {
    frontmatter.model = command.model
  }

  const body = rewritePaths(command.body)
  const content = formatFrontmatter(frontmatter, body)

  return {
    name: command.name,
    content,
    dir: `cmd-${command.name}`,
  }
}

function convertCommand(command: ClaudeCommand): OpenClawCommandRegistration {
  return {
    name: command.name.replace(/:/g, "-"),
    description: command.description ?? `Run ${command.name}`,
    acceptsArgs: Boolean(command.argumentHint),
    body: rewritePaths(command.body),
  }
}

type OpenClawBridgeScaffold = {
  skills: OpenClawSkillFile[]
  supportFiles: OpenClawSupportFile[]
  configProperties: Record<string, OpenClawConfigProperty>
  uiHints?: Record<string, OpenClawUiHint>
}

function buildBridgeScaffold(plugin: ClaudePlugin): OpenClawBridgeScaffold {
  if (plugin.manifest.name !== "compound-engineering") {
    return {
      skills: [],
      supportFiles: [],
      configProperties: {},
    }
  }

  const content = formatFrontmatter(
    {
      name: "openclaw-codex-acp-bridge",
      description: "Relay compound-engineering planning to Codex through OpenClaw ACP sessions.",
    },
    [
      "# OpenClaw Codex ACP Bridge",
      "",
      "Use this when an Opus-driven OpenClaw session should hand compound-engineering planning to Codex.",
      "",
      "Codex owns the planning session. OpenClaw stays in the user-facing thread and relays follow-ups.",
      "",
      "## Preconditions",
      "- Codex CLI is installed and authenticated on the OpenClaw host machine.",
      "- The target repository is checked out on that same host machine.",
      "- The `@openclaw/acpx` backend plugin is installed and healthy.",
      "- ACP dispatch and thread binding are enabled for the active channel.",
      "",
      "## Start the planning session",
      "1. `/acp spawn codex --mode persistent --thread auto --cwd /absolute/path/to/repo`",
      "2. In the spawned Codex session, run `/ce:brainstorm` or `/ce:plan` with the active feature brief.",
      "3. Keep the OpenClaw thread bound to that ACP session so user replies continue steering the same Codex run.",
      "",
      "## Relay clarifying questions",
      "- Use `/acp steer <instruction>` when Codex needs a clarification or new constraint.",
      "- Use `/acp status` or `/acp sessions` to inspect live progress.",
      "- Use `/acp close` when the planning session is complete or must be replaced.",
      "",
      "## Scope limits",
      "- This first bridge cut assumes OpenClaw ACP sessions, not a custom plugin-managed PTY runtime.",
      "- Attach-to-existing sessions and durable resume semantics are follow-up work.",
      "- If Codex CLI, ACP backend, or repo checkout is missing on the OpenClaw host, stop and ask for remediation instead of faking progress.",
      "",
      "## Suggested config",
      "- See `bridge/codex-acp-bridge.example.json` for a documented ACP + thread-binding baseline.",
    ].join("\n"),
  )

  return {
    skills: [
      {
        name: "openclaw-codex-acp-bridge",
        dir: "openclaw-codex-acp-bridge",
        content,
      },
    ],
    supportFiles: [
      {
        path: "bridge/codex-acp-bridge.example.json",
        content: JSON.stringify(
          {
            acp: {
              enabled: true,
              dispatch: { enabled: true },
              backend: "acpx",
              defaultAgent: "codex",
              allowedAgents: ["codex"],
              runtime: { ttlMinutes: 120 },
            },
            agents: {
              list: [
                {
                  id: "codex",
                  runtime: {
                    type: "acp",
                    acp: {
                      agent: "codex",
                      backend: "acpx",
                      mode: "persistent",
                      cwd: "/absolute/path/to/repo",
                    },
                  },
                },
              ],
            },
            channels: {
              discord: {
                threadBindings: {
                  enabled: true,
                  spawnAcpSessions: true,
                  idleHours: 24,
                  maxAgeHours: 0,
                },
              },
            },
          },
          null,
          2,
        ),
      },
    ],
    configProperties: {
      planningAgentId: {
        type: "string",
        description: "ACP agent id to use when OpenClaw hands compound-engineering planning to Codex.",
        default: "codex",
      },
      planningMode: {
        type: "string",
        description: "ACP session mode for Codex planning handoff.",
        default: "persistent",
      },
      requireThreadBinding: {
        type: "boolean",
        description: "Require thread binding when the active OpenClaw channel supports ACP thread-bound sessions.",
        default: true,
      },
      defaultCwd: {
        type: "string",
        description: "Absolute repository path on the OpenClaw host machine for Codex ACP spawns.",
      },
    },
    uiHints: {
      planningAgentId: {
        label: "Planning ACP agent id",
        placeholder: "codex",
      },
      defaultCwd: {
        label: "Codex working directory",
        placeholder: "/absolute/path/to/repo",
      },
    },
  }
}

function buildOpenClawConfig(
  servers: Record<string, ClaudeMcpServer>,
): Record<string, unknown> {
  const mcpServers: Record<string, unknown> = {}

  for (const [name, server] of Object.entries(servers)) {
    if (server.command) {
      mcpServers[name] = {
        type: "stdio",
        command: server.command,
        args: server.args ?? [],
        env: server.env,
      }
    } else if (server.url) {
      mcpServers[name] = {
        type: "http",
        url: server.url,
        headers: server.headers,
      }
    }
  }

  return { mcpServers }
}

function generateEntryPoint(commands: OpenClawCommandRegistration[]): string {
  const commandRegistrations = commands
    .map((cmd) => {
      // JSON.stringify produces a fully-escaped string literal safe for JS/TS source embedding
      const safeName = JSON.stringify(cmd.name)
      const safeDesc = JSON.stringify(cmd.description ?? "")
      const safeNotFound = JSON.stringify(`Command ${cmd.name} not found. Check skills directory.`)
      return `  api.registerCommand({
    name: ${safeName},
    description: ${safeDesc},
    acceptsArgs: ${cmd.acceptsArgs},
    requireAuth: false,
    handler: (ctx) => ({
      text: skills[${safeName}] ?? ${safeNotFound},
    }),
  });`
    })
    .join("\n\n")

  return `// Auto-generated OpenClaw plugin entry point
// Converted from Claude Code plugin format by compound-plugin CLI
import { promises as fs } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Pre-load skill bodies for command responses
const skills: Record<string, string> = {};

async function loadSkills() {
  const skillsDir = path.join(__dirname, "skills");
  try {
    const entries = await fs.readdir(skillsDir, { withFileTypes: true });
    for (const entry of entries) {
      if (!entry.isDirectory()) continue;
      const skillPath = path.join(skillsDir, entry.name, "SKILL.md");
      try {
        const content = await fs.readFile(skillPath, "utf8");
        // Strip frontmatter
        const body = content.replace(/^---[\\s\\S]*?---\\n*/, "");
        skills[entry.name.replace(/^cmd-/, "")] = body.trim();
      } catch {
        // Skill file not found, skip
      }
    }
  } catch {
    // Skills directory not found
  }
}

export default async function register(api) {
  await loadSkills();

${commandRegistrations}
}
`
}

function rewritePaths(body: string): string {
  return body
    .replace(/(?<=^|\s|["'`])~\/\.claude\//gm, "~/.openclaw/")
    .replace(/(?<=^|\s|["'`])\.claude\//gm, ".openclaw/")
    .replace(/\.claude-plugin\//g, "openclaw-plugin/")
}

function formatDisplayName(name: string): string {
  return name
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")
}
