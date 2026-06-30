"use server";

import { getSupabaseServer } from "@/lib/supabase/server";

// Placard persisté côté Supabase pour les utilisateurs connectés.
// (Les invités utilisent localStorage — voir components/shopping-list.tsx.)

export async function loadPantry(): Promise<string[]> {
  const supabase = await getSupabaseServer();
  if (!supabase) return [];
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];
  const { data } = await supabase.from("pantry").select("ingredient_id").eq("user_id", user.id);
  return (data ?? []).map((r: { ingredient_id: string }) => r.ingredient_id);
}

export async function setPantryItem(ingredientId: string, owned: boolean): Promise<void> {
  const supabase = await getSupabaseServer();
  if (!supabase) return;
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  if (owned) {
    await supabase.from("pantry").upsert({ user_id: user.id, ingredient_id: ingredientId });
  } else {
    await supabase
      .from("pantry")
      .delete()
      .eq("user_id", user.id)
      .eq("ingredient_id", ingredientId);
  }
}
