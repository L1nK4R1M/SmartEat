"use server";

import { redirect } from "next/navigation";
import { savePrefs } from "@/lib/prefs";
import { getSupabaseServer } from "@/lib/supabase/server";
import type { UserPrefs } from "@/lib/types";

// Fin de l'onboarding : persiste les préférences durables (dont budget +
// ambiance) puis envoie vers l'écran de génération animé, qui redirige ensuite
// vers le plan déjà pré-généré (warm start, §1).
export async function completeOnboarding(prefs: UserPrefs) {
  await savePrefs(prefs);
  const params = new URLSearchParams();
  params.set("budget", String(prefs.budget));
  if (prefs.ambiance.length) params.set("types", prefs.ambiance.join(","));
  redirect(`/generating?${params.toString()}`);
}

// Déconnexion (Supabase) puis retour à l'accueil.
export async function signOut() {
  const supabase = await getSupabaseServer();
  if (supabase) await supabase.auth.signOut();
  redirect("/");
}
