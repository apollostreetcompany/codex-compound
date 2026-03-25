import { describe, expect, test } from "bun:test"
import {
  formatCompoundEngineeringRecipeGuidance,
  loadCompoundEngineeringRecipes,
} from "../src/recipes/compound-engineering"

describe("compound-engineering recipes", () => {
  test("loads the repo-local recipe config with RepoPrompt defaults and a vetted catalog", () => {
    const recipes = loadCompoundEngineeringRecipes()

    expect(recipes.sourceGroups.repoprompt?.kind).toBe("builtin")
    expect(recipes.workflows["ce:plan"]?.alwaysOn).toContain("rp-investigate")
    expect(recipes.workflows["ce:review"]?.alwaysOn).toContain("rp-review")
    expect(recipes.workflows["ce:work"]?.alwaysOn).toContain("file-todos")
    expect(recipes.workflows["ce:work"]?.alwaysOn).not.toContain("rp-investigate")
    expect(recipes.sourceGroups["vetted-baseline"]?.kind).toBe("external_catalog")
    expect(recipes.sourceGroups["vetted-baseline"]?.catalog.length).toBeGreaterThan(0)
  })

  test("formats helper guidance for Codex prompt wrappers", () => {
    const recipes = loadCompoundEngineeringRecipes()
    const guidance = formatCompoundEngineeringRecipeGuidance("ce:plan", recipes)

    expect(guidance).not.toBeNull()
    expect(guidance).toContain("compound-engineering.recipes.yaml")
    expect(guidance).toContain("Always-on helper skills")
    expect(guidance).toContain("rp-investigate")
    expect(guidance).toContain("repoprompt")
  })
})
