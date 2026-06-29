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
