// Correspondance ingrédient (catalogue) -> catégorie Open Food Facts pour
// chercher un prix réel via Open Prices. `per` = base du prix relevé (kg ou L).
// Seuls les ingrédients au poids/volume y figurent ; les autres et les non
// trouvés retombent sur le prix catalogue (repli).
export interface PriceCategory {
  tag: string; // category_tag Open Food Facts (en:...)
  per: "kg" | "l";
}

export const PRICE_CATEGORIES: Record<string, PriceCategory> = {
  chicken: { tag: "en:chicken-breasts", per: "kg" },
  chicken_thigh: { tag: "en:chicken-legs", per: "kg" },
  beef: { tag: "en:ground-beef", per: "kg" },
  beef_steak: { tag: "en:beef", per: "kg" },
  turkey: { tag: "en:turkey", per: "kg" },
  salmon: { tag: "en:salmon", per: "kg" },
  cod: { tag: "en:cod", per: "kg" },
  shrimp: { tag: "en:shrimps", per: "kg" },
  tuna_canned: { tag: "en:canned-tuna", per: "kg" },
  cheese: { tag: "en:grated-cheeses", per: "kg" },
  butter: { tag: "en:butters", per: "kg" },
  cream: { tag: "en:cremes-fraiches", per: "l" },
  yogurt: { tag: "en:greek-yogurts", per: "kg" },
  rice: { tag: "en:rices", per: "kg" },
  pasta: { tag: "en:pastas", per: "kg" },
  lentils: { tag: "en:lentils", per: "kg" },
  chickpeas: { tag: "en:chickpeas", per: "kg" },
  quinoa: { tag: "en:quinoa", per: "kg" },
  couscous: { tag: "en:couscous", per: "kg" },
  oats: { tag: "en:rolled-oats", per: "kg" },
  olive_oil: { tag: "en:olive-oils", per: "l" },
  coconut_milk: { tag: "en:coconut-milks", per: "l" },
  tomato_canned: { tag: "en:canned-tomatoes", per: "kg" },
  potato: { tag: "en:potatoes", per: "kg" },
  sweet_potato: { tag: "en:sweet-potatoes", per: "kg" },
  carrot: { tag: "en:carrots", per: "kg" },
  onion: { tag: "en:onions", per: "kg" },
  zucchini: { tag: "en:zucchini", per: "kg" },
  broccoli: { tag: "en:broccoli", per: "kg" },
  spinach: { tag: "en:spinachs", per: "kg" },
  mushroom: { tag: "en:mushrooms", per: "kg" },
  tomato: { tag: "en:tomatoes", per: "kg" },
  green_beans: { tag: "en:green-beans", per: "kg" },
  milk: { tag: "en:milks", per: "l" },
  soy_milk: { tag: "en:soy-milks", per: "l" },
  berries: { tag: "en:frozen-red-berries", per: "kg" },
  edamame: { tag: "en:edamame", per: "kg" },
  // NB : pas d'ingrédient en "piece" ici (banane, œufs…) : le prix Open Prices
  // est au kg/L et serait mal interprété sur une unité "pièce".
};
