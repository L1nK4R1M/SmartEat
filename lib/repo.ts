import type { Country, Ingredient, Recipe, Store } from "./types";
import { INGREDIENTS, RECIPES, STORES } from "@/db/seed-data";

/**
 * Couche d'accès aux données — POINT DE BASCULE UNIQUE (§4).
 *
 * Pour le MVP, les données proviennent du catalogue seedé en mémoire ; l'app
 * tourne ainsi sur Vercel sans aucune base à provisionner.
 *
 * Pour passer en production avec Supabase/Postgres, il suffit de réécrire le
 * corps de ces fonctions avec des requêtes Drizzle (voir db/schema.ts) — la
 * signature async est déjà prête, rien d'autre dans l'app ne change. La passe 1
 * du moteur (filtres durs) peut alors être poussée en SQL via @> / <@ + index GIN.
 */
export const repo = {
  async getRecipes(): Promise<Recipe[]> {
    return RECIPES;
  },

  async getStores(): Promise<Store[]> {
    return STORES;
  },

  async getStoresByCountry(country: Country): Promise<Store[]> {
    return STORES.filter((s) => s.country === country).sort((a, b) =>
      a.name.localeCompare(b.name, "fr"),
    );
  },

  async getStore(id: string): Promise<Store | undefined> {
    return STORES.find((s) => s.id === id);
  },

  async getIngredientsMap(): Promise<Map<string, Ingredient>> {
    return new Map(INGREDIENTS.map((i) => [i.id, i]));
  },

  async getRecipesByIds(ids: string[]): Promise<Recipe[]> {
    const set = new Set(ids);
    // Conserve l'ordre demandé (important pour une sélection stable).
    return ids
      .map((id) => RECIPES.find((r) => r.id === id))
      .filter((r): r is Recipe => Boolean(r) && set.has(r!.id));
  },
};
