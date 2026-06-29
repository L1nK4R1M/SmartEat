import { describe, expect, it } from "vitest";
import { RECIPES } from "@/db/seed-data";
import { canCook } from "./capabilities";
import { eligibleRecipes, selectMeals } from "./matching-engine";
import type { GenerationRequest, UserPrefs } from "./types";

const basePrefs: UserPrefs = {
  storeId: "central",
  dietTags: [],
  equipment: ["four", "airfryer", "micro", "poele"],
  householdSize: 2,
  mealsPerWeek: 5,
};

const wideRequest: GenerationRequest = { budget: 150, mealTypes: [] };

describe("Recipe Matching Engine — combinatoire intelligente", () => {
  it("exclut une recette Four-only si l'utilisateur n'a qu'un Air Fryer", () => {
    const prefs: UserPrefs = { ...basePrefs, equipment: ["airfryer"] };
    const eligible = eligibleRecipes(RECIPES, prefs, wideRequest);
    // r06 (gratin) exige `gratin`, fourni uniquement par le Four.
    expect(eligible.find((r) => r.id === "r06")).toBeUndefined();
    // r01 (rôti) exige `roast`, fourni par l'Air Fryer -> conservée.
    expect(eligible.find((r) => r.id === "r01")).toBeDefined();
  });

  it("Four ET Air Fryer couvrent tous deux `roast` (substitution gratuite)", () => {
    const four = canCook(["roast"], ["four"]);
    const airfryer = canCook(["roast"], ["airfryer"]);
    expect(four).toBe(true);
    expect(airfryer).toBe(true);
    // mais le mijoté (simmer) n'est pas couvert par le Four seul.
    expect(canCook(["simmer"], ["four"])).toBe(false);
  });

  it("Poêle seule exclut rôti, gratin et vapeur", () => {
    const prefs: UserPrefs = { ...basePrefs, equipment: ["poele"] };
    const ids = eligibleRecipes(RECIPES, prefs, wideRequest).map((r) => r.id);
    expect(ids).not.toContain("r01"); // roast
    expect(ids).not.toContain("r06"); // gratin
    expect(ids).not.toContain("r02"); // steam
    expect(ids).toContain("r03"); // simmer -> ok
  });

  it("applique le régime par inclusion (tous les tags requis)", () => {
    const prefs: UserPrefs = { ...basePrefs, dietTags: ["vegan", "sans_gluten"] };
    const eligible = eligibleRecipes(RECIPES, prefs, wideRequest);
    expect(eligible.every((r) => r.dietTags.includes("vegan") && r.dietTags.includes("sans_gluten"))).toBe(true);
    expect(eligible.find((r) => r.id === "r04")).toBeUndefined(); // bolognaise (viande, gluten)
  });

  it("respecte le plafond de budget par portion", () => {
    // Budget serré : 40€ / (5 repas × 2 pers) = 4€/portion.
    const prefs: UserPrefs = { ...basePrefs };
    const tight: GenerationRequest = { budget: 40, mealTypes: [] };
    const eligible = eligibleRecipes(RECIPES, prefs, tight);
    expect(eligible.every((r) => r.costPerServing <= 4)).toBe(true);
    expect(eligible.find((r) => r.id === "r13")).toBeUndefined(); // saumon 6.8€ exclu
  });

  it("selectMeals renvoie au plus N repas, classés et sans doublon", () => {
    const meals = selectMeals(RECIPES, basePrefs, wideRequest, 5);
    expect(meals.length).toBeLessThanOrEqual(5);
    expect(new Set(meals.map((m) => m.id)).size).toBe(meals.length);
  });
});
