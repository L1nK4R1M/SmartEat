import { cookies } from "next/headers";
import { z } from "zod";
import type { GenerationRequest, MealType, UserPrefs } from "./types";

// Préférences durables persistées en cookie (MVP, §4 : alternative simple à
// Supabase Auth + table users, qui reste le chemin de production).
const COOKIE = "smarteat_prefs";
const ONE_YEAR = 60 * 60 * 24 * 365;

const MEAL_TYPE_ENUM = [
  "rapide",
  "sain",
  "leger",
  "proteine",
  "famille",
  "gourmand",
  "monde",
] as const;

const prefsSchema = z.object({
  country: z.enum(["FR", "BE"]),
  storeId: z.string().min(1),
  dietTags: z.array(
    z.enum(["halal", "vege", "vegan", "pescetarien", "sans_gluten", "sans_lactose"]),
  ),
  equipment: z.array(z.enum(["four", "airfryer", "micro", "poele"])).min(1),
  householdSize: z.number().int().min(1).max(12),
  mealsPerWeek: z.number().int().min(1).max(21),
  // Rétrocompat : les cookies plus anciens n'avaient ni budget ni ambiance.
  budget: z.number().min(15).max(300).default(35),
  ambiance: z.array(z.enum(MEAL_TYPE_ENUM)).default([]),
});

export async function getPrefs(): Promise<UserPrefs | null> {
  const raw = (await cookies()).get(COOKIE)?.value;
  if (!raw) return null;
  try {
    const parsed = prefsSchema.safeParse(JSON.parse(raw));
    return parsed.success ? parsed.data : null;
  } catch {
    return null;
  }
}

// À appeler depuis une Server Action / Route Handler uniquement.
export async function savePrefs(prefs: UserPrefs): Promise<void> {
  const validated = prefsSchema.parse(prefs);
  (await cookies()).set(COOKIE, JSON.stringify(validated), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: ONE_YEAR,
  });
}

// ---- Arbitrages ponctuels lus depuis l'URL (budget + types de la semaine) ----
const MEAL_TYPES: MealType[] = [
  "rapide",
  "sain",
  "leger",
  "proteine",
  "famille",
  "gourmand",
  "monde",
];

export const DEFAULT_BUDGET = 35;

export function parseRequest(
  searchParams: Record<string, string | string[] | undefined>,
  prefs: UserPrefs,
): GenerationRequest {
  // Budget : URL > préférence par défaut > constante.
  const rawBudget = Number(first(searchParams.budget));
  const budget =
    Number.isFinite(rawBudget) && rawBudget > 0 ? rawBudget : prefs.budget || DEFAULT_BUDGET;

  // Types : URL > ambiance par défaut de l'onboarding (sinon "peu importe").
  const rawTypes = first(searchParams.types);
  const mealTypes = rawTypes
    ? rawTypes.split(",").filter((t): t is MealType => MEAL_TYPES.includes(t as MealType))
    : (prefs.ambiance ?? []);

  // Graine de variété ("régénérer la semaine") — change la sélection sous budget.
  const rawSeed = Number(first(searchParams.seed));
  const seed = Number.isFinite(rawSeed) && rawSeed > 0 ? rawSeed : undefined;

  return { budget, mealTypes, seed };
}

export function parseMealIds(
  searchParams: Record<string, string | string[] | undefined>,
): string[] {
  const raw = first(searchParams.meals);
  if (!raw) return [];
  return raw.split(",").filter(Boolean);
}

function first(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}
