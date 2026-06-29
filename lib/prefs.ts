import { cookies } from "next/headers";
import { z } from "zod";
import type { GenerationRequest, MealType, UserPrefs } from "./types";

// Préférences durables persistées en cookie (MVP, §4 : alternative simple à
// Supabase Auth + table users, qui reste le chemin de production).
const COOKIE = "smarteat_prefs";
const ONE_YEAR = 60 * 60 * 24 * 365;

const prefsSchema = z.object({
  country: z.enum(["FR", "BE"]),
  storeId: z.string().min(1),
  dietTags: z.array(
    z.enum(["halal", "vege", "vegan", "sans_gluten", "sans_lactose"]),
  ),
  equipment: z.array(z.enum(["four", "airfryer", "micro", "poele"])).min(1),
  householdSize: z.number().int().min(1).max(12),
  mealsPerWeek: z.number().int().min(1).max(21),
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
const MEAL_TYPES: MealType[] = ["rapide", "sain", "leger", "proteine"];

export const DEFAULT_BUDGET = 70;

export function parseRequest(
  searchParams: Record<string, string | string[] | undefined>,
  prefs: UserPrefs,
): GenerationRequest {
  const rawBudget = Number(first(searchParams.budget));
  const budget = Number.isFinite(rawBudget) && rawBudget > 0 ? rawBudget : DEFAULT_BUDGET;

  const rawTypes = first(searchParams.types);
  const mealTypes = rawTypes
    ? (rawTypes.split(",").filter((t): t is MealType => MEAL_TYPES.includes(t as MealType)))
    : [];

  void prefs; // réservé pour de futurs défauts personnalisés
  return { budget, mealTypes };
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
