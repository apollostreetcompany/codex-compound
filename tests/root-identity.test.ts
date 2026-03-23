import { describe, expect, test } from "bun:test"
import claudeMarketplace from "../.claude-plugin/marketplace.json"
import cursorMarketplace from "../.cursor-plugin/marketplace.json"
import packageJson from "../package.json"
import codingTutorCursorManifest from "../plugins/coding-tutor/.cursor-plugin/plugin.json"
import compoundClaudeManifest from "../plugins/compound-engineering/.claude-plugin/plugin.json"
import compoundCursorManifest from "../plugins/compound-engineering/.cursor-plugin/plugin.json"
import { DEFAULT_GITHUB_SOURCE, resolveGitHubSource } from "../src/commands/install"
import { CLI_NAME, main } from "../src/index"

const GITHUB_SOURCE_ENV_KEYS = ["CODEX_COMPOUND_GITHUB_SOURCE", "COMPOUND_PLUGIN_GITHUB_SOURCE"] as const

function withGitHubSourceEnv(
  overrides: Partial<Record<(typeof GITHUB_SOURCE_ENV_KEYS)[number], string | undefined>>,
  callback: () => void,
) {
  const previous = Object.fromEntries(
    GITHUB_SOURCE_ENV_KEYS.map((key) => [key, process.env[key]]),
  ) as Record<(typeof GITHUB_SOURCE_ENV_KEYS)[number], string | undefined>

  for (const key of GITHUB_SOURCE_ENV_KEYS) {
    const value = overrides[key]
    if (value === undefined) {
      delete process.env[key]
      continue
    }
    process.env[key] = value
  }

  try {
    callback()
  } finally {
    for (const key of GITHUB_SOURCE_ENV_KEYS) {
      const value = previous[key]
      if (value === undefined) {
        delete process.env[key]
        continue
      }
      process.env[key] = value
    }
  }
}

describe("root identity", () => {
  test("package metadata reflects Codex-Compound", () => {
    expect(packageJson.name).toBe("codex-compound")
    expect(packageJson.bin).toHaveProperty("codex-compound")
    expect(packageJson.homepage).toBe("https://github.com/apollostreetcompany/codex-compound")
    expect(packageJson.repository).toBe("https://github.com/apollostreetcompany/codex-compound")
  })

  test("default GitHub source points at Codex-Compound", () => {
    withGitHubSourceEnv({}, () => {
      expect(DEFAULT_GITHUB_SOURCE).toBe("https://github.com/apollostreetcompany/codex-compound.git")
      expect(resolveGitHubSource()).toBe(DEFAULT_GITHUB_SOURCE)
    })
  })

  test("new GitHub source override is preferred and legacy override still works", () => {
    withGitHubSourceEnv(
      {
        CODEX_COMPOUND_GITHUB_SOURCE: "https://example.com/new.git",
        COMPOUND_PLUGIN_GITHUB_SOURCE: "https://example.com/legacy.git",
      },
      () => {
        expect(resolveGitHubSource()).toBe("https://example.com/new.git")

        delete process.env.CODEX_COMPOUND_GITHUB_SOURCE
        expect(resolveGitHubSource()).toBe("https://example.com/legacy.git")
      },
    )
  })

  test("CLI metadata exposes the codex-compound command name", () => {
    expect(CLI_NAME).toBe("codex-compound")
    expect(main.meta.name).toBe(CLI_NAME)
  })

  test("marketplace metadata reflects the codex-compound root identity", () => {
    expect(claudeMarketplace.name).toBe("codex-compound")
    expect(claudeMarketplace.plugins[0]?.homepage).toBe("https://github.com/apollostreetcompany/codex-compound")
    expect(claudeMarketplace.plugins[1]?.homepage).toBe("https://github.com/apollostreetcompany/codex-compound")

    expect(cursorMarketplace.name).toBe("codex-compound")
    expect(cursorMarketplace.metadata.description).toBe("Cursor plugin marketplace for Codex-Compound plugins")
  })

  test("plugin manifests point back to the codex-compound repo", () => {
    expect(compoundClaudeManifest.repository).toBe("https://github.com/apollostreetcompany/codex-compound")
    expect(compoundCursorManifest.repository).toBe("https://github.com/apollostreetcompany/codex-compound")
    expect(codingTutorCursorManifest.homepage).toBe("https://github.com/apollostreetcompany/codex-compound")
    expect(codingTutorCursorManifest.repository).toBe("https://github.com/apollostreetcompany/codex-compound")
  })
})
