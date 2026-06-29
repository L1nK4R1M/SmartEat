"use server";

import { redirect } from "next/navigation";
import { savePrefs } from "@/lib/prefs";
import type { UserPrefs } from "@/lib/types";

// Fin de l'onboarding : persiste les préférences durables puis envoie vers le
// dashboard où une sélection est déjà pré-générée (warm start, §1).
export async function completeOnboarding(prefs: UserPrefs) {
  await savePrefs(prefs);
  redirect("/plan");
}
