import type { Ingredient, Recipe, Store } from "./types";

// Prix par unité de base. Source : prix RÉEL (Open Prices) si fourni dans le
// `priceBook` pour cet ingrédient, sinon repli sur le prix catalogue × profil
// magasin. Le priceBook (Map ingredientId -> €/unité de base) est résolu une
// fois par requête côté serveur (voir lib/prices/price-book.ts).
export function ingredientUnitPrice(
  ingredient: Ingredient,
  store: Store,
  priceBook?: Map<string, number>,
): number {
  const live = priceBook?.get(ingredient.id);
  if (live !== undefined && live > 0) return live;
  return (ingredient.packPrice / ingredient.packSize) * store.priceFactor;
}

// Coût d'une portion d'une recette dans un magasin donné.
export function recipeCostPerServing(
  recipe: Recipe,
  ingredientsById: Map<string, Ingredient>,
  store: Store,
  priceBook?: Map<string, number>,
): number {
  return recipe.ingredients.reduce((sum, ri) => {
    const ingredient = ingredientsById.get(ri.ingredientId);
    if (!ingredient) return sum;
    return sum + ri.qtyPerServing * ingredientUnitPrice(ingredient, store, priceBook);
  }, 0);
}

// Coût d'un repas = coût/portion × taille du foyer.
export function recipeMealCost(
  recipe: Recipe,
  ingredientsById: Map<string, Ingredient>,
  store: Store,
  householdSize: number,
  priceBook?: Map<string, number>,
): number {
  return recipeCostPerServing(recipe, ingredientsById, store, priceBook) * householdSize;
}
