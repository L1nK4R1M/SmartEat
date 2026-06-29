import type { Aisle, Ingredient, Recipe, Store, Unit } from "./types";
import { AISLE_LABELS } from "./labels";

// Génération de la liste de courses — §2.
// Agrège, déduplique par ingrédient, groupe par rayon, calcule le coût estimé.

export interface ShoppingLine {
  ingredient: Ingredient;
  qty: number; // dans l'unité de base de l'ingrédient
  unit: Unit;
  cost: number; // €
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
  // 1+2+3. Mise à l'échelle (× taille du foyer) et agrégation/dédoublonnage par ingrédient.
  // Hypothèse MVP : l'unité de la recette == unité de base de l'ingrédient (pas de
  // conversion d'unités, repoussée en V2). Voir docs/CAHIER_DES_CHARGES.md §2.
  const totals = new Map<string, number>();
  for (const recipe of recipes) {
    for (const ri of recipe.ingredients) {
      const current = totals.get(ri.ingredientId) ?? 0;
      totals.set(ri.ingredientId, current + ri.qtyPerServing * householdSize);
    }
  }

  // 4+5. Regroupement par rayon + coût (prix de référence × profil de prix du magasin).
  const byAisle = new Map<Aisle, ShoppingLine[]>();
  let total = 0;
  let itemCount = 0;

  for (const [ingredientId, qty] of totals) {
    const ingredient = ingredientsById.get(ingredientId);
    if (!ingredient) continue;
    const cost = qty * ingredient.refPrice * store.priceFactor;
    total += cost;
    itemCount += 1;
    const line: ShoppingLine = { ingredient, qty, unit: ingredient.baseUnit, cost };
    const bucket = byAisle.get(ingredient.aisle) ?? [];
    bucket.push(line);
    byAisle.set(ingredient.aisle, bucket);
  }

  const sections: ShoppingSection[] = [...byAisle.entries()]
    .map(([aisle, lines]) => ({
      aisle,
      label: AISLE_LABELS[aisle].label,
      lines: lines.sort((a, b) => a.ingredient.name.localeCompare(b.ingredient.name)),
      subtotal: lines.reduce((sum, l) => sum + l.cost, 0),
    }))
    // Parcours magasin logique (ordre des rayons).
    .sort((a, b) => AISLE_LABELS[a.aisle].order - AISLE_LABELS[b.aisle].order);

  return { sections, total, itemCount };
}
