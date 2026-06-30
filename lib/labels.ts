import type {
  Appliance,
  Aisle,
  Capability,
  Country,
  DietTag,
  MealType,
  StoreKind,
} from "./types";

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
  pescetarien: { label: "Pescétarien", emoji: "🐟" },
  sans_gluten: { label: "Sans gluten", emoji: "🌾" },
  sans_lactose: { label: "Sans lactose", emoji: "🥛" },
};

export const MEAL_TYPE_LABELS: Record<MealType, { label: string; emoji: string }> = {
  rapide: { label: "Rapide", emoji: "⚡" },
  sain: { label: "Sain", emoji: "🥦" },
  leger: { label: "Léger", emoji: "🪶" },
  proteine: { label: "Protéiné", emoji: "💪" },
  famille: { label: "En famille", emoji: "👨‍👩‍👧" },
  gourmand: { label: "Gourmand", emoji: "😋" },
  monde: { label: "Saveurs du monde", emoji: "🌍" },
};

// Ambiances de l'onboarding (cartes PASTEL façon Romi). On mappe vers les
// MealType du moteur. `tint` = classes de fond/accent pastel (jusqu'à 3 choix).
export interface AmbianceConfig {
  type: MealType;
  label: string;
  emoji: string;
  tint: string; // fond pastel au repos
  tintActive: string; // fond + bordure quand sélectionné
}

export const AMBIANCES: AmbianceConfig[] = [
  { type: "rapide", label: "Rapide & facile", emoji: "⚡", tint: "bg-amber-50 border-amber-100", tintActive: "bg-amber-100 border-amber-300 ring-amber-300" },
  { type: "proteine", label: "Riche en protéines", emoji: "💪", tint: "bg-rose-50 border-rose-100", tintActive: "bg-rose-100 border-rose-300 ring-rose-300" },
  { type: "famille", label: "En famille", emoji: "👨‍👩‍👧", tint: "bg-sky-50 border-sky-100", tintActive: "bg-sky-100 border-sky-300 ring-sky-300" },
  { type: "sain", label: "Healthy", emoji: "🥗", tint: "bg-emerald-50 border-emerald-100", tintActive: "bg-emerald-100 border-emerald-300 ring-emerald-300" },
  { type: "gourmand", label: "Gourmand", emoji: "😋", tint: "bg-orange-50 border-orange-100", tintActive: "bg-orange-100 border-orange-300 ring-orange-300" },
  { type: "monde", label: "Saveurs du monde", emoji: "🌍", tint: "bg-violet-50 border-violet-100", tintActive: "bg-violet-100 border-violet-300 ring-violet-300" },
];

// Allergènes / aliments à éviter proposés à l'onboarding. Chaque groupe mappe
// vers des ids d'ingrédients du catalogue ; sélectionner exclut ces ingrédients.
export interface ExclusionConfig {
  key: string;
  label: string;
  emoji: string;
  ingredientIds: string[];
}

export const EXCLUSIONS: ExclusionConfig[] = [
  { key: "arachide", label: "Arachide", emoji: "🥜", ingredientIds: ["peanut_butter"] },
  { key: "poisson", label: "Poisson", emoji: "🐟", ingredientIds: ["salmon", "cod", "tuna_canned"] },
  { key: "crustaces", label: "Crustacés", emoji: "🦐", ingredientIds: ["shrimp"] },
  { key: "oeufs", label: "Œufs", emoji: "🥚", ingredientIds: ["eggs"] },
  { key: "champignons", label: "Champignons", emoji: "🍄", ingredientIds: ["mushroom"] },
  { key: "soja", label: "Soja", emoji: "🫛", ingredientIds: ["tofu", "soy_sauce"] },
  { key: "boeuf", label: "Bœuf", emoji: "🥩", ingredientIds: ["beef", "beef_steak"] },
];

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

export const COUNTRY_LABELS: Record<Country, { label: string; flag: string }> = {
  FR: { label: "France", flag: "🇫🇷" },
  BE: { label: "Belgique", flag: "🇧🇪" },
};

export const STORE_KIND_LABELS: Record<StoreKind, string> = {
  hyper: "Hypermarché",
  super: "Supermarché",
  proxi: "Magasin de proximité",
  discount: "Hard discount",
  bio: "Magasin bio",
  surgele: "Surgelés",
};

const WEEKDAYS = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"];

// Libellé du jour pour le plan hebdo (au-delà de 7, on numérote).
export function dayLabel(index: number): string {
  return WEEKDAYS[index] ?? `Jour ${index + 1}`;
}

export function dayShort(index: number): string {
  const full = dayLabel(index);
  return full.length > 4 ? full.slice(0, 3) : full;
}

// Onglet jour coloré à gauche de la carte (plan, façon Romi). Couleurs douces
// cohérentes avec la palette pastel des ambiances.
const DAY_COLORS = [
  "#16a34a", // lun — vert primaire
  "#0ea5e9", // mar — sky
  "#f59e0b", // mer — ambre
  "#8b5cf6", // jeu — violet
  "#ec4899", // ven — rose
  "#14b8a6", // sam — teal
  "#f97316", // dim — orange
];

export function dayColor(index: number): string {
  return DAY_COLORS[index % DAY_COLORS.length];
}
