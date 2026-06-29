import { describe, expect, it } from "vitest";
import { INGREDIENTS, RECIPES, STORES } from "@/db/seed-data";
import { buildShoppingList } from "./shopping-list";

const ingredientsById = new Map(INGREDIENTS.map((i) => [i.id, i]));
const central = STORES.find((s) => s.id === "fr_carrefour")!;
const bio = STORES.find((s) => s.id === "fr_biocoop")!;
const r03 = RECIPES.find((r) => r.id === "r03")!; // curry pois chiches
const r09 = RECIPES.find((r) => r.id === "r09")!; // dahl lentilles

describe("buildShoppingList — agrégation & coût", () => {
  it("agrège et déduplique un ingrédient partagé par deux recettes", () => {
    // r03 et r09 partagent l'oignon (60g + 60g) — pour 1 portion chacun.
    const list = buildShoppingList([r03, r09], ingredientsById, 1, central);
    const lines = list.sections.flatMap((s) => s.lines);
    const onion = lines.filter((l) => l.ingredient.id === "onion");
    expect(onion).toHaveLength(1); // une seule ligne (dédupliquée)
    expect(onion[0].qty).toBe(120); // 60 + 60
  });

  it("met les quantités à l'échelle du foyer", () => {
    const solo = buildShoppingList([r03], ingredientsById, 1, central);
    const couple = buildShoppingList([r03], ingredientsById, 2, central);
    expect(couple.total).toBeCloseTo(solo.total * 2, 5);
  });

  it("applique le profil de prix du magasin", () => {
    const a = buildShoppingList([r03], ingredientsById, 2, central);
    const b = buildShoppingList([r03], ingredientsById, 2, bio);
    expect(b.total).toBeCloseTo(a.total * (bio.priceFactor / central.priceFactor), 5);
  });

  it("trie les sections selon l'ordre de parcours en magasin", () => {
    const list = buildShoppingList([r03, r09], ingredientsById, 2, central);
    const aisles = list.sections.map((s) => s.aisle);
    // fruits_legumes (1) avant epicerie (5)
    expect(aisles.indexOf("fruits_legumes")).toBeLessThan(aisles.indexOf("epicerie"));
  });
});
