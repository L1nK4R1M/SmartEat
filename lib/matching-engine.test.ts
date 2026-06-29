import { describe, expect, it } from "vitest";
import { INGREDIENTS, RECIPES, STORES } from "@/db/seed-data";
import { canCook } from "./capabilities";
import { eligibleRecipes, planWeek } from "./matching-engine";
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
});
