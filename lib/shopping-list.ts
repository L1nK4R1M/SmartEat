import type { Aisle, Ingredient, Recipe, Store } from "./types";
import { AISLE_LABELS } from "./labels";

// Génération de la liste de courses — §2, version "produit entier".
// On agrège les besoins de la semaine, puis on achète des CONDITIONNEMENTS
// ENTIERS : nb de paquets = arrondi supérieur (besoin total / contenance).
// -> un paquet qui suffit à plusieurs repas n'est acheté qu'une fois (anti-doublon).

export interface ShoppingLine {
  ingredient: Ingredient;
  neededQty: number; // quantité réellement nécessaire (unité de base)
  packs: number; // nombre de conditionnements à acheter
  cost: number; // packs × prix paquet × profil magasin
}

export interface ShoppingSection {
  aisle: Aisle;
  label: string;
  lines: ShoppingLine[];
  subtotal: number;
}

export interface ShoppingList {
  sections: ShoppingSection[];
  total: number;
  itemCount: number;
}

export function buildShoppingList(
  recipes: Recipe[],
  ingredientsById: Map<string, Ingredient>,
  householdSize: number,
  store: Store,
): ShoppingList {
  // 1+2. Agrégation/dédoublonnage des BESOINS par ingrédient (× taille du foyer).
  const needed = new Map<string, number>();
  for (const recipe of recipes) {
    for (const ri of recipe.ingredients) {
      needed.set(ri.ingredientId, (needed.get(ri.ingredientId) ?? 0) + ri.qtyPerServing * householdSize);
    }
  }

  // 3. Conversion en produits entiers (anti-doublon) + coût au profil du magasin.
  const byAisle = new Map<Aisle, ShoppingLine[]>();
  let total = 0;
  let itemCount = 0;

  for (const [ingredientId, neededQty] of needed) {
    const ingredient = ingredientsById.get(ingredientId);
    if (!ingredient || neededQty <= 0) continue;
    const packs = Math.ceil(neededQty / ingredient.packSize);
    const cost = packs * ingredient.packPrice * store.priceFactor;
    total += cost;
    itemCount += 1;
    const line: ShoppingLine = { ingredient, neededQty, packs, cost };
    const bucket = byAisle.get(ingredient.aisle) ?? [];
    bucket.push(line);
    byAisle.set(ingredient.aisle, bucket);
  }

  // 4. Regroupement par rayon (parcours magasin logique).
  const sections: ShoppingSection[] = [...byAisle.entries()]
    .map(([aisle, lines]) => ({
      aisle,
      label: AISLE_LABELS[aisle].label,
      lines: lines.sort((a, b) => a.ingredient.name.localeCompare(b.ingredient.name)),
      subtotal: lines.reduce((sum, l) => sum + l.cost, 0),
    }))
    .sort((a, b) => AISLE_LABELS[a.aisle].order - AISLE_LABELS[b.aisle].order);

  return { sections, total, itemCount };
}
