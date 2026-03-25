export type CodexInvocationTargets = {
  promptTargets: Record<string, string>
  skillTargets: Record<string, string>
}

export type CodexTransformOptions = {
  unknownSlashBehavior?: "prompt" | "preserve"
}

/**
 * Transform Claude Code content to Codex-compatible content.
 *
 * Handles multiple syntax differences:
 * 1. Task agent calls: Task agent-name(args) -> Use the $agent-name skill to: args
 * 2. Slash command references:
 *    - known prompt entrypoints -> /prompts:prompt-name
 *    - known skills -> the exact skill name
 *    - unknown slash refs -> /prompts:command-name
 * 3. Agent references: @agent-name -> $agent-name skill
 * 4. Claude config paths: .claude/ -> .codex/
 */
export function transformContentForCodex(
  body: string,
  targets?: CodexInvocationTargets,
  options: CodexTransformOptions = {},
): string {
  let result = body
  const promptTargets = targets?.promptTargets ?? {}
  const skillTargets = targets?.skillTargets ?? {}
  const unknownSlashBehavior = options.unknownSlashBehavior ?? "prompt"

  const taskPattern = /^(\s*-?\s*)Task\s+([a-z][a-z0-9:-]*)\(([^)]*)\)/gm
  result = result.replace(taskPattern, (_match, prefix: string, agentName: string, args: string) => {
    // For namespaced calls like "compound-engineering:research:repo-research-analyst",
    // use only the final segment as the skill name.
    const finalSegment = agentName.includes(":") ? agentName.split(":").pop()! : agentName
    const skillName = normalizeCodexName(finalSegment)
    const trimmedArgs = args.trim()
    return trimmedArgs
      ? `${prefix}Use the $${skillName} skill to: ${trimmedArgs}`
      : `${prefix}Use the $${skillName} skill`
  })

  const slashCommandPattern = /(?<![:\w])\/([a-z][a-z0-9_:-]*?)(?=[\s,."')\]}`]|$)/gi
  result = result.replace(slashCommandPattern, (match, commandName: string) => {
    if (commandName.includes("/")) return match
    if (["dev", "tmp", "etc", "usr", "var", "bin", "home"].includes(commandName)) return match

    const normalizedName = normalizeCodexName(commandName)
    if (promptTargets[normalizedName]) {
      return `/prompts:${promptTargets[normalizedName]}`
    }
    if (skillTargets[normalizedName]) {
      return `the ${skillTargets[normalizedName]} skill`
    }
    if (unknownSlashBehavior === "preserve") {
      return match
    }
    return `/prompts:${normalizedName}`
  })

  result = result
    .replace(/~\/\.claude\//g, "~/.codex/")
    .replace(/\.claude\//g, ".codex/")

  const agentRefPattern = /@([a-z][a-z0-9-]*-(?:agent|reviewer|researcher|analyst|specialist|oracle|sentinel|guardian|strategist))/gi
  result = result.replace(agentRefPattern, (_match, agentName: string) => {
    const skillName = normalizeCodexName(agentName)
    return `$${skillName} skill`
  })

  return normalizeQuestionToolLanguage(result)
}

export function normalizeCodexName(value: string): string {
  const trimmed = value.trim()
  if (!trimmed) return "item"
  const normalized = trimmed
    .toLowerCase()
    .replace(/[\\/]+/g, "-")
    .replace(/[:\s]+/g, "-")
    .replace(/[^a-z0-9_-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "")
  return normalized || "item"
}

const PLATFORM_QUESTION_TOOL_GUIDANCE = "Use the platform's blocking question tool when available (`AskUserQuestion` in Claude Code, `request_user_input` in Codex, `ask_user` in Gemini). Otherwise, present numbered options in chat and wait."

function normalizeQuestionToolLanguage(body: string): string {
  if (!body.includes("AskUserQuestion")) {
    return body
  }

  let result = body
  const exactReplacements = new Map<string, string>([
    [
      "Use **AskUserQuestion tool** to ask which source document to use, or whether to proceed without one.",
      `${PLATFORM_QUESTION_TOOL_GUIDANCE} Ask which source document to use, or whether to proceed without one.`,
    ],
    [
      "Refine the idea through collaborative dialogue using the **AskUserQuestion tool**:",
      `Refine the idea through collaborative dialogue. ${PLATFORM_QUESTION_TOOL_GUIDANCE}`,
    ],
    [
      "After writing the plan file, use the **AskUserQuestion tool** to present these options:",
      `After writing the plan file, ${lowercaseFirst(PLATFORM_QUESTION_TOOL_GUIDANCE)} Present these options:`,
    ],
    [
      "After writing the enhanced plan, use the **AskUserQuestion tool** to present these options:",
      `After writing the enhanced plan, ${lowercaseFirst(PLATFORM_QUESTION_TOOL_GUIDANCE)} Present these options:`,
    ],
  ])

  for (const [source, replacement] of exactReplacements) {
    result = result.replaceAll(source, replacement)
  }

  const lines = result.split(/\r?\n/)
  const normalizedLines = lines.map((line) => normalizeQuestionToolLine(line))
  result = normalizedLines.join("\n")

  result = result.replace(/\bskip all AskUserQuestion calls\b/g, "skip all interactive question steps")

  return result
}

function normalizeQuestionToolLine(line: string): string {
  if (!line.includes("AskUserQuestion")) return line
  if (line.includes("request_user_input") || line.includes("ask_user")) return line

  return line
    .replace(
      /using the \*\*AskUserQuestion tool\*\*/g,
      `using the platform's blocking question tool when available (\`AskUserQuestion\` in Claude Code, \`request_user_input\` in Codex, \`ask_user\` in Gemini). Otherwise, present numbered options in chat and wait`,
    )
    .replace(
      /using the AskUserQuestion tool/gi,
      `using the platform's blocking question tool when available (\`AskUserQuestion\` in Claude Code, \`request_user_input\` in Codex, \`ask_user\` in Gemini). Otherwise, present numbered options in chat and wait`,
    )
    .replace(
      /Use \*\*AskUserQuestion tool\*\* to /g,
      `${PLATFORM_QUESTION_TOOL_GUIDANCE} Then `,
    )
    .replace(
      /use the \*\*AskUserQuestion tool\*\* to /gi,
      `${lowercaseFirst(PLATFORM_QUESTION_TOOL_GUIDANCE)} Then `,
    )
    .replace(
      /Use AskUserQuestion tool to /g,
      `${PLATFORM_QUESTION_TOOL_GUIDANCE} Then `,
    )
    .replace(
      /use AskUserQuestion tool to /g,
      `${lowercaseFirst(PLATFORM_QUESTION_TOOL_GUIDANCE)} Then `,
    )
}

function lowercaseFirst(value: string): string {
  return value.charAt(0).toLowerCase() + value.slice(1)
}
