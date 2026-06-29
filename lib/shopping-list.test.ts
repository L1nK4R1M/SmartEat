import { describe, expect, it } from "vitest";
import { INGREDIENTS, RECIPES, STORES } from "@/db/seed-data";
import { buildShoppingList } from "./shopping-list";

const ingredientsById = new Map(INGREDIENTS.map((i) => [i.id, i]));
const central = STORES.find((s) => s.id === "fr_carrefour")!;
const bio = STORES.find((s) => s.id === "fr_biocoop")!;
const r03 = RECIPES.find((r) => r.id === "r03")!; // curry pois chiches
const r09 = RECIPES.find((r) => r.id === "r09")!; // dahl lentilles

describe("buildShoppingList — produit entier & anti-doublon", () => {
  it("agrège les besoins d'un ingrédient partagé en une seule ligne", () => {
    const list = buildShoppingList([r03, r09], ingredientsById, 1, central);
    const lines = list.sections.flatMap((s) => s.lines);
    const onion = lines.filter((l) => l.ingredient.id === "onion");
    expect(onion).toHaveLength(1); // dédupliqué
    expect(onion[0].neededQty).toBe(120); // 60 + 60
  });

  it("n'achète qu'un seul paquet si la contenance suffit (anti-doublon)", () => {
    // riz: r03 (80g) + r09 (70g) = 150g, paquet de 1 kg -> 1 seul paquet.
    const list = buildShoppingList([r03, r09], ingredientsById, 1, central);
    const rice = list.sections.flatMap((s) => s.lines).find((l) => l.ingredient.id === "rice")!;
    expect(rice.packs).toBe(1);
    expect(rice.cost).toBeCloseTo(rice.ingredient.packPrice * central.priceFactor, 5);
  });

  it("achète plusieurs paquets quand le besoin dépasse la contenance", () => {
    // oignon: 120g/portion × 10 personnes = 1200g, paquet 1 kg -> 2 paquets.
    const list = buildShoppingList([r03, r09], ingredientsById, 10, central);
    const onion = list.sections.flatMap((s) => s.lines).find((l) => l.ingredient.id === "onion")!;
    expect(onion.neededQty).toBe(1200);
    expect(onion.packs).toBe(2);
  });

  it("applique le profil de prix du magasin", () => {
    const a = buildShoppingList([r03], ingredientsById, 2, central);
    const b = buildShoppingList([r03], ingredientsById, 2, bio);
    expect(b.total).toBeCloseTo(a.total * (bio.priceFactor / central.priceFactor), 5);
  });

  it("trie les sections selon l'ordre de parcours en magasin", () => {
    const list = buildShoppingList([r03, r09], ingredientsById, 2, central);
    const aisles = list.sections.map((s) => s.aisle);
    expect(aisles.indexOf("fruits_legumes")).toBeLessThan(aisles.indexOf("epicerie"));
  });
});
