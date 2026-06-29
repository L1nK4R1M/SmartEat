import type { GenerationRequest, Recipe, UserPrefs } from "./types";
import { userCapabilities } from "./capabilities";

// Recipe Matching Engine — §2 du cahier des charges.
// Deux passes : (1) filtres durs = élimination, (2) scoring doux = classement.
// Fonctions pures sur des données simples : identique en seed ou en SQL Postgres
// (où la passe 1 devient des opérateurs d'inclusion de tableaux @> / <@ avec index GIN).

export interface ScoredRecipe {
  recipe: Recipe;
  score: number;
}

// Budget par portion = budget total / (repas par semaine × taille du foyer).
// Garantit que la somme des coûts retenus reste <= budget total.
export function budgetPerServing(prefs: UserPrefs, request: GenerationRequest): number {
  const servings = Math.max(1, prefs.mealsPerWeek * prefs.householdSize);
  return request.budget / servings;
}

// ---- Passe 1 : filtres durs (élimination) ----
export function eligibleRecipes(
  recipes: Recipe[],
  prefs: UserPrefs,
  request: GenerationRequest,
): Recipe[] {
  const caps = userCapabilities(prefs.equipment);
  const maxPerServing = budgetPerServing(prefs, request);

  return recipes.filter((r) => {
    // Régime : la recette doit porter TOUS les tags demandés (r.diet_tags @> user.diet_tags).
    const dietOk = prefs.dietTags.every((d) => r.dietTags.includes(d));
    // Équipement : capacités requises incluses dans les capacités utilisateur (req <@ user).
    const equipOk = r.reqCapabilities.every((c) => caps.has(c));
    // Budget : coût par portion sous le plafond.
    const budgetOk = r.costPerServing <= maxPerServing;
    // Type : intersection si des envies sont précisées, sinon tout passe.
    const typeOk =
      request.mealTypes.length === 0 ||
      r.mealTypes.some((t) => request.mealTypes.includes(t));
    return dietOk && equipOk && budgetOk && typeOk;
  });
}

// ---- Passe 2 : scoring doux (classement) ----
const WEIGHTS = { type: 0.4, budget: 0.2, time: 0.2, variety: 0.2 };

export function scoreRecipe(
  recipe: Recipe,
  request: GenerationRequest,
  maxPerServing: number,
): number {
  const typeScore =
    request.mealTypes.length === 0
      ? 0.5
      : recipe.mealTypes.filter((t) => request.mealTypes.includes(t)).length /
        request.mealTypes.length;

  const budgetScore =
    maxPerServing > 0 ? Math.max(0, 1 - recipe.costPerServing / maxPerServing) : 0;

  const timeScore = recipe.prepMinutes <= 25 ? 1 : 0;

  // Variété : nécessite l'historique des dernières semaines -> repoussé en V2 (§5).
  const varietyScore = 0.5;

  return (
    WEIGHTS.type * typeScore +
    WEIGHTS.budget * budgetScore +
    WEIGHTS.time * timeScore +
    WEIGHTS.variety * varietyScore
  );
}

// Classement complet des recettes éligibles (utile pour swap & sélection).
export function rankRecipes(
  recipes: Recipe[],
  prefs: UserPrefs,
  request: GenerationRequest,
): ScoredRecipe[] {
  const maxPerServing = budgetPerServing(prefs, request);
  return eligibleRecipes(recipes, prefs, request)
    .map((recipe) => ({ recipe, score: scoreRecipe(recipe, request, maxPerServing) }))
    // Tri par score décroissant, départage stable par id pour des swaps déterministes.
    .sort((a, b) => b.score - a.score || a.recipe.id.localeCompare(b.recipe.id));
}

// Sélection des N meilleurs repas (warm start du dashboard).
export function selectMeals(
  recipes: Recipe[],
  prefs: UserPrefs,
  request: GenerationRequest,
  count: number,
  excludeIds: string[] = [],
): Recipe[] {
  return rankRecipes(recipes, prefs, request)
    .filter((s) => !excludeIds.includes(s.recipe.id))
    .slice(0, count)
    .map((s) => s.recipe);
}

// Meilleur substitut pour le swap (clic 2) : top 1 éligible hors sélection courante.
export function bestSubstitute(
  recipes: Recipe[],
  prefs: UserPrefs,
  request: GenerationRequest,
  currentIds: string[],
): Recipe | null {
  const ranked = rankRecipes(recipes, prefs, request).filter(
    (s) => !currentIds.includes(s.recipe.id),
  );
  return ranked[0]?.recipe ?? null;
}
