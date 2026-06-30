import { describe, expect, it } from "vitest";
import { INGREDIENTS, RECIPES, STORES } from "@/db/seed-data";
import { PROTEIN_MIN } from "./labels";
import { canCook } from "./capabilities";
import { displaySlot, eligibleRecipes, planWeek } from "./matching-engine";
import { recipeCostPerServing } from "./pricing";
import type { GenerationRequest, Ingredient, UserPrefs } from "./types";

const ingredientsById = new Map<string, Ingredient>(INGREDIENTS.map((i) => [i.id, i]));
const store = STORES.find((s) => s.id === "fr_carrefour")!; // priceFactor 1.0

const basePrefs: UserPrefs = {
  country: "FR",
  storeId: "fr_carrefour",
  dietTags: [],
  equipment: ["four", "airfryer", "micro", "poele"],
  householdSize: 2,
  mealsPerWeek: 5,
  budget: 35,
  ambiance: [],
  mealSlots: ["petit_dej", "dejeuner", "diner"],
};

const wideRequest: GenerationRequest = { budget: 200, mealTypes: [] };

describe("Recipe Matching Engine — combinatoire intelligente", () => {
  it("exclut une recette Four-only si l'utilisateur n'a qu'un Air Fryer", () => {
    const prefs: UserPrefs = { ...basePrefs, equipment: ["airfryer"] };
    const eligible = eligibleRecipes(RECIPES, prefs, wideRequest);
    expect(eligible.find((r) => r.id === "r06")).toBeUndefined(); // gratin -> Four only
    expect(eligible.find((r) => r.id === "r01")).toBeDefined(); // roast -> Air Fryer ok
  });

  it("Four ET Air Fryer couvrent tous deux `roast` (substitution gratuite)", () => {
    expect(canCook(["roast"], ["four"])).toBe(true);
    expect(canCook(["roast"], ["airfryer"])).toBe(true);
    expect(canCook(["simmer"], ["four"])).toBe(false);
  });

  it("Poêle seule exclut rôti, gratin et vapeur", () => {
    const prefs: UserPrefs = { ...basePrefs, equipment: ["poele"] };
    const ids = eligibleRecipes(RECIPES, prefs, wideRequest).map((r) => r.id);
    expect(ids).not.toContain("r01"); // roast
    expect(ids).not.toContain("r06"); // gratin
    expect(ids).not.toContain("r02"); // steam
    expect(ids).toContain("r03"); // simmer ok
  });

  it("applique le régime par inclusion (tous les tags requis)", () => {
    const prefs: UserPrefs = { ...basePrefs, dietTags: ["vegan", "sans_gluten"] };
    const eligible = eligibleRecipes(RECIPES, prefs, wideRequest);
    expect(
      eligible.every((r) => r.dietTags.includes("vegan") && r.dietTags.includes("sans_gluten")),
    ).toBe(true);
    expect(eligible.find((r) => r.id === "r04")).toBeUndefined(); // bolognaise (viande, gluten)
  });

  it("exclut les recettes contenant un aliment à éviter (allergène/dégoût)", () => {
    const prefs: UserPrefs = { ...basePrefs, excludedIngredients: ["salmon", "cod", "tuna_canned"] };
    const eligible = eligibleRecipes(RECIPES, prefs, wideRequest);
    // r02 & r13 contiennent du saumon -> exclues.
    expect(eligible.find((r) => r.id === "r02")).toBeUndefined();
    expect(eligible.find((r) => r.id === "r13")).toBeUndefined();
    // aucune recette éligible ne contient un ingrédient exclu.
    const banned = new Set(prefs.excludedIngredients);
    expect(eligible.every((r) => !r.ingredients.some((i) => banned.has(i.ingredientId)))).toBe(true);
  });

  it("le coût d'une recette suit le profil de prix du magasin", () => {
    const bio = STORES.find((s) => s.id === "fr_biocoop")!;
    const r = RECIPES.find((x) => x.id === "r03")!;
    const atCarrefour = recipeCostPerServing(r, ingredientsById, store);
    const atBio = recipeCostPerServing(r, ingredientsById, bio);
    expect(atBio).toBeCloseTo(atCarrefour * (bio.priceFactor / store.priceFactor), 5);
  });

  it("planWeek garantit que le panier de la semaine reste <= budget", () => {
    const plan = planWeek(RECIPES, basePrefs, { budget: 60, mealTypes: [] }, ingredientsById, store);
    expect(plan.total).toBeLessThanOrEqual(60 + 0.001);
    expect(plan.recipes.length).toBeLessThanOrEqual(basePrefs.mealsPerWeek);
    expect(new Set(plan.recipes.map((r) => r.id)).size).toBe(plan.recipes.length);
  });

  it("un budget plus serré ne sélectionne pas plus de repas", () => {
    const tight = planWeek(RECIPES, basePrefs, { budget: 40, mealTypes: [] }, ingredientsById, store);
    const loose = planWeek(RECIPES, basePrefs, { budget: 120, mealTypes: [] }, ingredientsById, store);
    expect(tight.recipes.length).toBeLessThanOrEqual(loose.recipes.length);
    expect(tight.total).toBeLessThanOrEqual(40 + 0.001);
  });

  it("la graine de variété (régénérer) reste déterministe et sous budget", () => {
    const a = planWeek(RECIPES, basePrefs, { budget: 60, mealTypes: [], seed: 1 }, ingredientsById, store);
    const aBis = planWeek(RECIPES, basePrefs, { budget: 60, mealTypes: [], seed: 1 }, ingredientsById, store);
    // Déterministe à seed égal.
    expect(a.recipes.map((r) => r.id)).toEqual(aBis.recipes.map((r) => r.id));
    // Toujours sous budget, quelle que soit la graine.
    expect(a.total).toBeLessThanOrEqual(60 + 0.001);
  });

  it("régénérer avec une autre graine produit une sélection différente sous budget", () => {
    const seeds = [1, 2, 3, 4, 5].map(
      (s) => planWeek(RECIPES, basePrefs, { budget: 80, mealTypes: [], seed: s }, ingredientsById, store),
    );
    // Toutes restent valides (sous budget).
    for (const p of seeds) expect(p.total).toBeLessThanOrEqual(80 + 0.001);
    // Au moins deux graines donnent une sélection distincte (variété réelle).
    const sigs = new Set(seeds.map((p) => p.recipes.map((r) => r.id).sort().join(",")));
    expect(sigs.size).toBeGreaterThan(1);
  });

  it("ne propose que des recettes du moment demandé (petit-déj seul)", () => {
    const prefs: UserPrefs = { ...basePrefs, mealSlots: ["petit_dej"] };
    const eligible = eligibleRecipes(RECIPES, prefs, wideRequest);
    expect(eligible.length).toBeGreaterThan(0);
    expect(eligible.every((r) => r.slots.includes("petit_dej"))).toBe(true);
    // Un plat de dîner pur (ex. bolognaise) ne doit jamais apparaître au petit-déj.
    expect(eligible.find((r) => r.id === "r04")).toBeUndefined();
  });

  it("ambiance protéinée : chaque repas retenu a >= 40 g de protéines", () => {
    const prefs: UserPrefs = { ...basePrefs, mealSlots: ["dejeuner", "diner"] };
    const request: GenerationRequest = { budget: 200, mealTypes: ["proteine"] };
    const eligible = eligibleRecipes(RECIPES, prefs, request);
    expect(eligible.length).toBeGreaterThan(0);
    expect(eligible.every((r) => r.nutrition.protein >= PROTEIN_MIN)).toBe(true);
    const plan = planWeek(RECIPES, prefs, request, ingredientsById, store);
    expect(plan.recipes.every((r) => r.nutrition.protein >= PROTEIN_MIN)).toBe(true);
  });

  it("équilibre la semaine entre les moments demandés", () => {
    const prefs: UserPrefs = { ...basePrefs, mealSlots: ["petit_dej", "dejeuner"], mealsPerWeek: 4 };
    const plan = planWeek(RECIPES, prefs, { budget: 120, mealTypes: [] }, ingredientsById, store);
    const slots = plan.recipes.map((r) => displaySlot(r, prefs.mealSlots));
    // Avec deux moments demandés et un budget large, les deux sont représentés.
    expect(slots).toContain("petit_dej");
    expect(slots).toContain("dejeuner");
  });
});
