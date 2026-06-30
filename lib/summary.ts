import type { Store, UserPrefs } from "./types";
import {
  APPLIANCE_LABELS,
  COUNTRY_LABELS,
  DIET_LABELS,
  MEAL_SLOT_LABELS,
  MEAL_TYPE_LABELS,
} from "./labels";

// Résumé sérialisable des choix de l'utilisateur (affichable côté client/serveur).
export interface PrefsSummary {
  countryLabel: string;
  countryFlag: string;
  storeName: string;
  budget: number;
  householdSize: number;
  mealsPerWeek: number;
  mealSlots: string[];
  diets: string[];
  equipment: string[];
  ambiance: string[];
  exclusionsCount: number;
}

export function buildPrefsSummary(prefs: UserPrefs, store?: Store): PrefsSummary {
  return {
    countryLabel: COUNTRY_LABELS[prefs.country].label,
    countryFlag: COUNTRY_LABELS[prefs.country].flag,
    storeName: store?.name ?? "—",
    budget: prefs.budget,
    householdSize: prefs.householdSize,
    mealsPerWeek: prefs.mealsPerWeek,
    mealSlots: (prefs.mealSlots ?? []).map((s) => MEAL_SLOT_LABELS[s].label),
    diets: prefs.dietTags.map((d) => DIET_LABELS[d].label),
    equipment: prefs.equipment.map((e) => APPLIANCE_LABELS[e].label),
    ambiance: (prefs.ambiance ?? []).map((a) => MEAL_TYPE_LABELS[a].label),
    exclusionsCount: (prefs.excludedIngredients ?? []).length,
  };
}
