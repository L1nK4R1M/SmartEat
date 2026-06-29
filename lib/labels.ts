import type { Appliance, Aisle, Capability, DietTag, MealType } from "./types";

// Libellés FR pour l'UI (séparés du domaine pour rester localisables).

export const APPLIANCE_LABELS: Record<Appliance, { label: string; emoji: string }> = {
  four: { label: "Four", emoji: "🔥" },
  airfryer: { label: "Air Fryer", emoji: "🌀" },
  micro: { label: "Micro-ondes", emoji: "📦" },
  poele: { label: "Poêle", emoji: "🍳" },
};

export const DIET_LABELS: Record<DietTag, { label: string; emoji: string }> = {
  halal: { label: "Halal", emoji: "🥩" },
  vege: { label: "Végétarien", emoji: "🥗" },
  vegan: { label: "Vegan", emoji: "🌱" },
  sans_gluten: { label: "Sans gluten", emoji: "🌾" },
  sans_lactose: { label: "Sans lactose", emoji: "🥛" },
};

export const MEAL_TYPE_LABELS: Record<MealType, { label: string; emoji: string }> = {
  rapide: { label: "Rapide", emoji: "⚡" },
  sain: { label: "Sain", emoji: "🥦" },
  leger: { label: "Léger", emoji: "🪶" },
  proteine: { label: "Protéiné", emoji: "💪" },
};

export const AISLE_LABELS: Record<Aisle, { label: string; order: number }> = {
  fruits_legumes: { label: "Fruits & Légumes", order: 1 },
  boucherie: { label: "Boucherie / Poissonnerie", order: 2 },
  cremerie: { label: "Crémerie", order: 3 },
  boulangerie: { label: "Boulangerie", order: 4 },
  epicerie: { label: "Épicerie", order: 5 },
  surgele: { label: "Surgelé", order: 6 },
};

export const CAPABILITY_LABELS: Record<Capability, string> = {
  roast: "Rôtir",
  bake: "Cuire au four",
  gratin: "Gratiner",
  fry: "Frire / poêler",
  sear: "Saisir",
  simmer: "Mijoter",
  heat: "Chauffer",
  reheat: "Réchauffer",
  steam: "Vapeur",
};
