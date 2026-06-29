import type { Ingredient, Recipe, Store } from "./types";

// Prix calculé depuis les ingrédients au profil de prix du magasin choisi.
// "Le prix DOIT correspondre au prix des aliments" -> une seule source de vérité.

// Prix INDICATIF par unité de base = prix du paquet / contenance, × profil magasin.
// Sert au coût "par portion" affiché sur les cartes et au scoring. Le coût RÉEL
// du panier (au produit entier, dédoublonné) est calculé dans lib/shopping-list.ts.
export function ingredientUnitPrice(ingredient: Ingredient, store: Store): number {
  return (ingredient.packPrice / ingredient.packSize) * store.priceFactor;
}

// Coût d'une portion d'une recette dans un magasin donné.
export function recipeCostPerServing(
  recipe: Recipe,
  ingredientsById: Map<string, Ingredient>,
  store: Store,
): number {
  return recipe.ingredients.reduce((sum, ri) => {
    const ingredient = ingredientsById.get(ri.ingredientId);
    if (!ingredient) return sum;
    return sum + ri.qtyPerServing * ingredientUnitPrice(ingredient, store);
  }, 0);
}

// Coût d'un repas = coût/portion × taille du foyer.
export function recipeMealCost(
  recipe: Recipe,
  ingredientsById: Map<string, Ingredient>,
  store: Store,
  householdSize: number,
): number {
  return recipeCostPerServing(recipe, ingredientsById, store) * householdSize;
}
