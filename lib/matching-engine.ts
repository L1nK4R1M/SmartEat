import type { GenerationRequest, Ingredient, MealSlot, Recipe, Store, UserPrefs } from "./types";
import { userCapabilities } from "./capabilities";
import { PROTEIN_MIN } from "./labels";
import { recipeCostPerServing } from "./pricing";
import { buildShoppingList } from "./shopping-list";

// Recipe Matching Engine — §2, version "budget-aware".
// 1) Filtres durs (régime / équipement / moment / ambiance) -> élimination.
// 2) Scoring doux (type, prix au magasin, rapidité) -> classement.
// 3) Plan hebdo glouton, équilibré entre moments, qui garantit : total <= budget.

const DEFAULT_SLOTS: MealSlot[] = ["dejeuner", "diner"];

// Moments effectivement demandés (repli midi + soir si rien n'est précisé).
function requestedSlots(prefs: UserPrefs): MealSlot[] {
  return prefs.mealSlots?.length ? prefs.mealSlots : DEFAULT_SLOTS;
}

// Moment d'affichage d'une recette = premier moment demandé qu'elle couvre.
export function displaySlot(recipe: Recipe, selectedSlots: MealSlot[]): MealSlot {
  return selectedSlots.find((s) => recipe.slots.includes(s)) ?? recipe.slots[0] ?? "diner";
}

// Répartit une sélection entre les moments demandés en ÉQUILIBRANT les effectifs :
// un plat servable midi ET soir ira au moment le moins rempli. Évite que tous les
// plats polyvalents se massent au déjeuner et laissent le dîner vide.
export function assignSlots(
  recipes: Recipe[],
  selectedSlots: MealSlot[],
): Map<string, MealSlot> {
  const slots = selectedSlots.length ? selectedSlots : DEFAULT_SLOTS;
  const count = new Map<MealSlot, number>(slots.map((s) => [s, 0]));
  const out = new Map<string, MealSlot>();
  for (const r of recipes) {
    const candidates = slots.filter((s) => r.slots.includes(s));
    const pool = candidates.length ? candidates : [displaySlot(r, slots)];
    // Moment le moins chargé (départage par l'ordre des moments demandés).
    const best = pool.reduce((a, b) => ((count.get(b) ?? 0) < (count.get(a) ?? 0) ? b : a));
    count.set(best, (count.get(best) ?? 0) + 1);
    out.set(r.id, best);
  }
  return out;
}

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
  const slots = requestedSlots(prefs);
  // Ambiance "Riche en protéines" -> on n'autorise que des repas >= seuil.
  const wantProtein = request.mealTypes.includes("proteine");
  return recipes.filter((r) => {
    const dietOk = prefs.dietTags.every((d) => r.dietTags.includes(d));
    const equipOk = r.reqCapabilities.every((c) => caps.has(c));
    const typeOk =
      request.mealTypes.length === 0 || r.mealTypes.some((t) => request.mealTypes.includes(t));
    // Allergènes / aliments à éviter : aucune recette contenant un ingrédient exclu.
    const excludeOk = excluded.size === 0 || !r.ingredients.some((ri) => excluded.has(ri.ingredientId));
    // Moment de la journée : la recette doit couvrir au moins un moment demandé.
    const slotOk = r.slots.some((s) => slots.includes(s));
    // Seuil protéines (≥ 40 g / portion) si l'ambiance protéinée est demandée.
    const proteinOk = !wantProtein || r.nutrition.protein >= PROTEIN_MIN;
    return dietOk && equipOk && typeOk && excludeOk && slotOk && proteinOk;
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
  priceBook?: Map<string, number>,
): ScoredRecipe[] {
  const fairShare = fairSharePerServing(prefs, request);
  return eligibleRecipes(recipes, prefs, request)
    .map((recipe) => {
      const costPerServing = recipeCostPerServing(recipe, ingredientsById, store, priceBook);
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

// ---- Passe 3 : plan hebdo glouton, ÉQUILIBRÉ entre moments, sous budget ----
// On regroupe les recettes éligibles par moment demandé, puis on pioche en
// tourniquet (petit-déj, déjeuner, dîner…) la meilleure recette qui tient encore
// dans le budget, jusqu'à couvrir `mealsPerWeek`. Le coût du panier ne pouvant
// que croître, une recette qui ne rentre pas est définitivement écartée.
export function planWeek(
  recipes: Recipe[],
  prefs: UserPrefs,
  request: GenerationRequest,
  ingredientsById: Map<string, Ingredient>,
  store: Store,
  priceBook?: Map<string, number>,
): WeekPlan {
  const ranked = rankRecipes(recipes, prefs, request, ingredientsById, store, priceBook);
  const days = prefs.mealsPerWeek;
  const slots = requestedSlots(prefs);

  // Buckets ordonnés par score : une recette figure dans CHAQUE moment qu'elle
  // couvre (un plat midi+soir alimente donc les deux files). La déduplication
  // garantit qu'on ne la choisit qu'une fois.
  const bySlot = new Map<MealSlot, Recipe[]>(slots.map((s) => [s, []]));
  for (const { recipe } of ranked) {
    for (const s of slots) {
      if (recipe.slots.includes(s)) bySlot.get(s)!.push(recipe);
    }
  }
  const cursor = new Map<MealSlot, number>(slots.map((s) => [s, 0]));

  const chosen: Recipe[] = [];
  const chosenIds = new Set<string>();
  let progressed = true;
  while (chosen.length < days && progressed) {
    progressed = false;
    for (const slot of slots) {
      if (chosen.length >= days) break;
      const list = bySlot.get(slot)!;
      let i = cursor.get(slot)!;
      while (i < list.length) {
        const candidate = list[i];
        i++;
        if (chosenIds.has(candidate.id)) continue; // déjà pris via un autre moment
        const total = buildShoppingList(
          [...chosen, candidate],
          ingredientsById,
          prefs.householdSize,
          store,
          priceBook,
        ).total;
        if (total <= request.budget) {
          chosen.push(candidate);
          chosenIds.add(candidate.id);
          progressed = true;
          break;
        }
      }
      cursor.set(slot, i);
    }
  }

  const total = buildShoppingList(chosen, ingredientsById, prefs.householdSize, store, priceBook).total;
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
  priceBook?: Map<string, number>,
): Recipe | null {
  const ranked = rankRecipes(recipes, prefs, request, ingredientsById, store, priceBook).filter(
    (s) => !currentIds.includes(s.recipe.id),
  );
  return ranked[0]?.recipe ?? null;
}
