import { describe, expect, test } from "bun:test"
import packageJson from "../package.json"
import { DEFAULT_GITHUB_SOURCE, resolveGitHubSource } from "../src/commands/install"
import { CLI_NAME, main } from "../src/index"

describe("root identity", () => {
  test("package metadata reflects Codex-Compound", () => {
    expect(packageJson.name).toBe("codex-compound")
    expect(packageJson.bin).toHaveProperty("codex-compound")
    expect(packageJson.homepage).toBe("https://github.com/apollostreetcompany/codex-compound")
    expect(packageJson.repository).toBe("https://github.com/apollostreetcompany/codex-compound")
  })

  test("default GitHub source points at Codex-Compound", () => {
    const previous = process.env.COMPOUND_PLUGIN_GITHUB_SOURCE
    delete process.env.COMPOUND_PLUGIN_GITHUB_SOURCE

    try {
      expect(DEFAULT_GITHUB_SOURCE).toBe("https://github.com/apollostreetcompany/codex-compound.git")
      expect(resolveGitHubSource()).toBe(DEFAULT_GITHUB_SOURCE)
    } finally {
      if (previous === undefined) {
        delete process.env.COMPOUND_PLUGIN_GITHUB_SOURCE
      } else {
        process.env.COMPOUND_PLUGIN_GITHUB_SOURCE = previous
      }
    }
  })

  test("new GitHub source override is preferred and legacy override still works", () => {
    const previousNew = process.env.CODEX_COMPOUND_GITHUB_SOURCE
    const previousLegacy = process.env.COMPOUND_PLUGIN_GITHUB_SOURCE

    process.env.CODEX_COMPOUND_GITHUB_SOURCE = "https://example.com/new.git"
    process.env.COMPOUND_PLUGIN_GITHUB_SOURCE = "https://example.com/legacy.git"
    expect(resolveGitHubSource()).toBe("https://example.com/new.git")

    delete process.env.CODEX_COMPOUND_GITHUB_SOURCE
    expect(resolveGitHubSource()).toBe("https://example.com/legacy.git")

    if (previousNew === undefined) {
      delete process.env.CODEX_COMPOUND_GITHUB_SOURCE
    } else {
      process.env.CODEX_COMPOUND_GITHUB_SOURCE = previousNew
    }

    if (previousLegacy === undefined) {
      delete process.env.COMPOUND_PLUGIN_GITHUB_SOURCE
    } else {
      process.env.COMPOUND_PLUGIN_GITHUB_SOURCE = previousLegacy
    }
  })

  test("CLI metadata exposes the codex-compound command name", () => {
    expect(CLI_NAME).toBe("codex-compound")
    expect(main.meta.name).toBe(CLI_NAME)
  })
})
