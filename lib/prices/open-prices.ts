import "server-only";

// Client minimal de l'API Open Prices (Open Food Facts) — prix relevés en
// magasin, ouverts et gratuits. Renvoie un prix médian €/kg (ou €/L) pour une
// catégorie, ou null si indisponible / échantillon insuffisant. Défensif :
// timeout court + parsing tolérant (toute anomalie -> null -> repli catalogue).
const BASE = "https://prices.openfoodfacts.org/api/v1/prices";

export async function fetchCategoryPrice(
  categoryTag: string,
  per: "kg" | "l",
): Promise<number | null> {
  const wanted = per === "l" ? "LITER" : "KILOGRAM";
  const url = `${BASE}?category_tag=${encodeURIComponent(categoryTag)}&order_by=-created&page=1&size=30`;

  const res = await fetch(url, {
    signal: AbortSignal.timeout(3500),
    headers: {
      Accept: "application/json",
      "User-Agent": "SmartEat/1.0 (+https://smart-eat-ashy.vercel.app)",
    },
  });
  if (!res.ok) return null;

  const data: unknown = await res.json();
  const items = (data as { items?: unknown[] })?.items;
  if (!Array.isArray(items)) return null;

  const values: number[] = [];
  for (const raw of items) {
    const it = raw as { price?: unknown; price_per?: unknown; currency?: unknown };
    const price = Number(it.price);
    const pricePer = String(it.price_per ?? "").toUpperCase();
    const currency = String(it.currency ?? "EUR").toUpperCase();
    if (currency === "EUR" && Number.isFinite(price) && price > 0 && pricePer === wanted) {
      values.push(price);
    }
  }
  if (values.length < 2) return null; // échantillon trop faible -> repli

  values.sort((a, b) => a - b);
  return values[Math.floor(values.length / 2)]; // médiane €/kg (ou €/L)
}
