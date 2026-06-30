import type { GenerationRequest, Ingredient, Recipe, Store, UserPrefs } from "./types";
import { userCapabilities } from "./capabilities";
import { recipeCostPerServing } from "./pricing";
import { buildShoppingList } from "./shopping-list";

// Recipe Matching Engine — §2, version "budget-aware".
// 1) Filtres durs (régime / équipement / type) -> élimination.
// 2) Scoring doux (type, prix au magasin, rapidité) -> classement.
// 3) Plan hebdo glouton qui garantit : total du panier de la semaine <= budget.

export interface ScoredRecipe {
  recipe: Recipe;
  score: number;
  costPerServing: number;
}

// Part équitable par portion = budget / (repas × foyer). Sert de référence au
// scoring "prix" (une recette sous cette part marque mieux).
export function fairSharePerServing(prefs: UserPrefs, request: GenerationRequest): number {
  const servings = Math.max(1, prefs.mealsPerWeek * prefs.householdSize);
  return request.budget / servings;
}

// ---- Passe 1 : filtres durs (sans budget : le budget est géré au niveau panier) ----
export function eligibleRecipes(
  recipes: Recipe[],
  prefs: UserPrefs,
  request: GenerationRequest,
): Recipe[] {
  const caps = userCapabilities(prefs.equipment);
  const excluded = new Set(prefs.excludedIngredients ?? []);
  return recipes.filter((r) => {
    const dietOk = prefs.dietTags.every((d) => r.dietTags.includes(d));
    const equipOk = r.reqCapabilities.every((c) => caps.has(c));
    const typeOk =
      request.mealTypes.length === 0 || r.mealTypes.some((t) => request.mealTypes.includes(t));
    // Allergènes / aliments à éviter : aucune recette contenant un ingrédient exclu.
    const excludeOk = excluded.size === 0 || !r.ingredients.some((ri) => excluded.has(ri.ingredientId));
    return dietOk && equipOk && typeOk && excludeOk;
  });
}

// ---- Passe 2 : scoring doux ----
const WEIGHTS = { type: 0.4, budget: 0.2, time: 0.2, variety: 0.2 };

// Bruit déterministe et stable dans [0,1) à partir d'une (id, seed). Sert la
// "variété" : à seed différent, classement différent — mais toujours reproductible.
function hashNoise(id: string, seed: number): number {
  let h = 2166136261 ^ seed;
  for (let i = 0; i < id.length; i++) {
    h ^= id.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  // xorshift final pour mieux disperser
  h ^= h >>> 13;
  h = Math.imul(h, 0x5bd1e995);
  h ^= h >>> 15;
  return ((h >>> 0) % 100000) / 100000;
}

export function scoreRecipe(
  recipe: Recipe,
  request: GenerationRequest,
  costPerServing: number,
  fairShare: number,
): number {
  const typeScore =
    request.mealTypes.length === 0
      ? 0.5
      : recipe.mealTypes.filter((t) => request.mealTypes.includes(t)).length /
        request.mealTypes.length;

  // Plus la portion est sous la part équitable, mieux c'est (aide à tenir le budget).
  const budgetScore = fairShare > 0 ? Math.max(0, Math.min(1, 1 - costPerServing / fairShare)) : 0;
  const timeScore = recipe.prepMinutes <= 25 ? 1 : 0;
  // Sans seed : score de variété neutre (comportement historique conservé).
  // Avec seed : bruit déterministe qui rebrasse les recettes ~équivalentes.
  const varietyScore = request.seed ? hashNoise(recipe.id, request.seed) : 0.5;

  return (
    WEIGHTS.type * typeScore +
    WEIGHTS.budget * budgetScore +
    WEIGHTS.time * timeScore +
    WEIGHTS.variety * varietyScore
  );
}

export function rankRecipes(
  recipes: Recipe[],
  prefs: UserPrefs,
  request: GenerationRequest,
  ingredientsById: Map<string, Ingredient>,
  store: Store,
): ScoredRecipe[] {
  const fairShare = fairSharePerServing(prefs, request);
  return eligibleRecipes(recipes, prefs, request)
    .map((recipe) => {
      const costPerServing = recipeCostPerServing(recipe, ingredientsById, store);
      return { recipe, costPerServing, score: scoreRecipe(recipe, request, costPerServing, fairShare) };
    })
    .sort((a, b) => b.score - a.score || a.recipe.id.localeCompare(b.recipe.id));
}

export interface WeekPlan {
  recipes: Recipe[];
  total: number; // coût réel du panier (au magasin) — DOIT être <= budget
  withinBudget: boolean; // a-t-on pu remplir tous les jours sous le budget ?
  eligibleCount: number;
}

// ---- Passe 3 : plan hebdo glouton sous contrainte de budget ----
// Ajoute les recettes les mieux classées tant que le panier agrégé (dédoublonné)
// reste <= budget, jusqu'à couvrir `mealsPerWeek` jours.
export function planWeek(
  recipes: Recipe[],
  prefs: UserPrefs,
  request: GenerationRequest,
  ingredientsById: Map<string, Ingredient>,
  store: Store,
): WeekPlan {
  const ranked = rankRecipes(recipes, prefs, request, ingredientsById, store);
  const days = prefs.mealsPerWeek;
  const chosen: Recipe[] = [];

  for (const { recipe } of ranked) {
    if (chosen.length >= days) break;
    const tentative = [...chosen, recipe];
    const total = buildShoppingList(tentative, ingredientsById, prefs.householdSize, store).total;
    if (total <= request.budget) chosen.push(recipe);
  }

  const total = buildShoppingList(chosen, ingredientsById, prefs.householdSize, store).total;
  return {
    recipes: chosen,
    total,
    withinBudget: chosen.length >= days,
    eligibleCount: ranked.length,
  };
}

// Plan à partir d'une sélection fixée (après un swap) : conserve l'ordre demandé.
export function buildPlanFromIds(
  ids: string[],
  recipes: Recipe[],
): Recipe[] {
  return ids
    .map((id) => recipes.find((r) => r.id === id))
    .filter((r): r is Recipe => Boolean(r));
}

// Meilleur substitut pour le swap : top-1 éligible hors sélection courante.
export function bestSubstitute(
  recipes: Recipe[],
  prefs: UserPrefs,
  request: GenerationRequest,
  ingredientsById: Map<string, Ingredient>,
  store: Store,
  currentIds: string[],
): Recipe | null {
  const ranked = rankRecipes(recipes, prefs, request, ingredientsById, store).filter(
    (s) => !currentIds.includes(s.recipe.id),
  );
  return ranked[0]?.recipe ?? null;
}
