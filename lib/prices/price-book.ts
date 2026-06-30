import "server-only";
import type { Ingredient, Store } from "@/lib/types";
import { PRICE_CATEGORIES } from "./categories";
import { fetchCategoryPrice } from "./open-prices";

// Carnet de prix résolu une fois par requête : prix RÉELS (Open Prices) là où
// disponibles, sinon rien (le calcul retombe alors sur le catalogue).
export type PriceSourceStatus = "catalog" | "mixed" | "unavailable";

export interface PriceBook {
  unit: Map<string, number>; // ingredientId -> prix €/unité de base (g ou ml), ajusté enseigne
  liveCount: number; // nb d'ingrédients avec un prix réel
  mappedCount: number; // nb d'ingrédients éligibles à un prix réel
  status: PriceSourceStatus;
}

const TTL = 24 * 60 * 60 * 1000; // 24 h
const cache = new Map<string, { perBase: number | null; ts: number }>();

export async function getPriceBook(ingredients: Ingredient[], store: Store): Promise<PriceBook> {
  const unit = new Map<string, number>();
  let mapped = 0;
  let attempts = 0;
  let errors = 0;

  await Promise.all(
    ingredients.map(async (ing) => {
      const cat = PRICE_CATEGORIES[ing.id];
      if (!cat) return;
      mapped++;
      const key = `${cat.tag}|${cat.per}`;
      const hit = cache.get(key);

      let perBase: number | null;
      if (hit && Date.now() - hit.ts < TTL) {
        perBase = hit.perBase;
      } else {
        attempts++;
        try {
          const perKgOrL = await fetchCategoryPrice(cat.tag, cat.per);
          perBase = perKgOrL != null ? perKgOrL / 1000 : null; // kg->g, L->ml
          cache.set(key, { perBase, ts: Date.now() });
        } catch {
          errors++;
          perBase = null;
        }
      }

      if (perBase != null && perBase > 0) {
        // Prix réel national ajusté au profil de l'enseigne choisie.
        unit.set(ing.id, perBase * store.priceFactor);
      }
    }),
  );

  const status: PriceSourceStatus =
    attempts > 0 && errors === attempts
      ? "unavailable"
      : unit.size > 0
        ? "mixed"
        : "catalog";

  return { unit, liveCount: unit.size, mappedCount: mapped, status };
}
