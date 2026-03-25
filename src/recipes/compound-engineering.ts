import fs from "fs"
import path from "path"
import { load } from "js-yaml"

export type CompoundEngineeringRecipeCatalogEntry = {
  id: string
  useFor?: string
}

export type CompoundEngineeringRecipeSourceGroup = {
  kind: "builtin" | "external_catalog"
  description?: string
  locationHint?: string
  catalog: CompoundEngineeringRecipeCatalogEntry[]
}

export type CompoundEngineeringWorkflowRecipe = {
  alwaysOn: string[]
  recommended: string[]
  sourceGroups: string[]
}

export type CompoundEngineeringRecipes = {
  version: number
  sourceGroups: Record<string, CompoundEngineeringRecipeSourceGroup>
  workflows: Record<string, CompoundEngineeringWorkflowRecipe>
}

const DEFAULT_RECIPES_PATH = path.resolve(
  import.meta.dir,
  "..",
  "..",
  "compound-engineering.recipes.yaml",
)

let cachedRecipes: CompoundEngineeringRecipes | null | undefined

export function loadCompoundEngineeringRecipes(
  recipesPath = DEFAULT_RECIPES_PATH,
): CompoundEngineeringRecipes {
  const raw = fs.readFileSync(recipesPath, "utf8")
  const parsed = load(raw)
  if (!parsed || typeof parsed !== "object") {
    throw new Error(`Invalid compound engineering recipes file: ${recipesPath}`)
  }

  const data = parsed as Record<string, unknown>
  return {
    version: Number(data.version ?? 1),
    sourceGroups: normalizeSourceGroups(data.source_groups),
    workflows: normalizeWorkflowRecipes(data.workflows),
  }
}

export function getDefaultCompoundEngineeringRecipes(): CompoundEngineeringRecipes | null {
  if (cachedRecipes !== undefined) {
    return cachedRecipes
  }

  try {
    cachedRecipes = loadCompoundEngineeringRecipes()
  } catch {
    cachedRecipes = null
  }

  return cachedRecipes
}

export function formatCompoundEngineeringRecipeGuidance(
  workflowName: string,
  recipes = getDefaultCompoundEngineeringRecipes(),
): string | null {
  if (!recipes) return null
  const recipe = recipes.workflows[workflowName]
  if (!recipe) return null

  const lines: string[] = [
    "## Helper Skill Recipe",
    "Load `compound-engineering.recipes.yaml` from the repo root when available and apply the entry for this workflow.",
    "",
    "Use the always-on helpers whenever they are available in this environment. Consider the recommended helpers when the task matches.",
  ]

  if (recipe.alwaysOn.length > 0) {
    lines.push("", `Always-on helper skills: ${formatInlineList(recipe.alwaysOn)}`)
  }
  if (recipe.recommended.length > 0) {
    lines.push("", `Recommended helper skills: ${formatInlineList(recipe.recommended)}`)
  }
  if (recipe.sourceGroups.length > 0) {
    lines.push("", `Source groups: ${formatInlineList(recipe.sourceGroups)}`)
  }

  return lines.join("\n")
}

function normalizeSourceGroups(
  value: unknown,
): Record<string, CompoundEngineeringRecipeSourceGroup> {
  if (!value || typeof value !== "object") return {}

  return Object.fromEntries(
    Object.entries(value as Record<string, unknown>).map(([name, groupValue]) => {
      const group = (groupValue && typeof groupValue === "object")
        ? (groupValue as Record<string, unknown>)
        : {}

      return [
        name,
        {
          kind: group.kind === "external_catalog" ? "external_catalog" : "builtin",
          description: stringOrUndefined(group.description),
          locationHint: stringOrUndefined(group.location_hint),
          catalog: normalizeCatalog(group.catalog),
        } satisfies CompoundEngineeringRecipeSourceGroup,
      ]
    }),
  )
}

function normalizeCatalog(value: unknown): CompoundEngineeringRecipeCatalogEntry[] {
  if (!Array.isArray(value)) return []
  return value
    .map((entry) => {
      if (!entry || typeof entry !== "object") return null
      const data = entry as Record<string, unknown>
      const id = stringOrUndefined(data.id)
      if (!id) return null
      return {
        id,
        useFor: stringOrUndefined(data.use_for),
      } satisfies CompoundEngineeringRecipeCatalogEntry
    })
    .filter((entry): entry is CompoundEngineeringRecipeCatalogEntry => entry !== null)
}

function normalizeWorkflowRecipes(
  value: unknown,
): Record<string, CompoundEngineeringWorkflowRecipe> {
  if (!value || typeof value !== "object") return {}

  return Object.fromEntries(
    Object.entries(value as Record<string, unknown>).map(([name, recipeValue]) => {
      const recipe = (recipeValue && typeof recipeValue === "object")
        ? (recipeValue as Record<string, unknown>)
        : {}

      return [
        name,
        {
          alwaysOn: stringList(recipe.always_on),
          recommended: stringList(recipe.recommended),
          sourceGroups: stringList(recipe.source_groups),
        } satisfies CompoundEngineeringWorkflowRecipe,
      ]
    }),
  )
}

function stringList(value: unknown): string[] {
  if (!Array.isArray(value)) return []
  return value
    .map((item) => String(item).trim())
    .filter(Boolean)
}

function stringOrUndefined(value: unknown): string | undefined {
  if (typeof value !== "string") return undefined
  const trimmed = value.trim()
  return trimmed.length > 0 ? trimmed : undefined
}

function formatInlineList(items: string[]): string {
  return items.map((item) => `\`${item}\``).join(", ")
}
