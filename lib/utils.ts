import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// Helper de classes Tailwind (pattern shadcn/ui).
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const euro = new Intl.NumberFormat("fr-FR", {
  style: "currency",
  currency: "EUR",
});

export function formatEuro(value: number): string {
  return euro.format(value);
}

// Quantité lisible : on bascule g->kg et ml->L au-delà de 1000.
export function formatQty(qty: number, unit: "g" | "ml" | "piece"): string {
  if (unit === "piece") {
    const n = Math.round(qty * 100) / 100;
    return `${n} ${n > 1 ? "pièces" : "pièce"}`;
  }
  if (qty >= 1000) {
    const big = Math.round((qty / 1000) * 100) / 100;
    return `${big} ${unit === "g" ? "kg" : "L"}`;
  }
  return `${Math.round(qty)} ${unit}`;
}

// URL d'image "photo" déterministe par plat, via un service génératif sans clé
// (Pollinations). Elle s'affiche PAR-DESSUS le fallback dégradé+emoji : si elle
// est lente ou indisponible, le dégradé reste visible (cf. RecipeImage).
// Images générées (placeholder) — à remplacer par de vraies photos curatées ensuite.
export function foodPhotoUrl(query: string, w = 600, h = 450): string {
  const prompt = `${query}, plat cuisiné dans une assiette, photographie culinaire, appétissant, lumière naturelle`;
  let s = 0;
  for (let i = 0; i < query.length; i++) s = (s * 31 + query.charCodeAt(i)) >>> 0;
  return `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=${w}&height=${h}&nologo=true&seed=${s % 100000}`;
}
