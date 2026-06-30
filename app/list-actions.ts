"use server";

import { getSupabaseServer } from "@/lib/supabase/server";
import type { SavedList, SavedListInput } from "@/lib/saved-lists";

// Persistance Supabase des listes de courses (utilisateurs connectés).
// Les invités passent par localStorage (voir components/saved-lists.tsx).
// Tout échec est avalé -> repli silencieux, l'app ne casse jamais.

interface ListRow {
  id: string;
  name: string;
  store_name: string | null;
  meal_ids: string[] | null;
  item_count: number | null;
  total: number | string | null;
  created_at: string;
}

function rowToSaved(r: ListRow): SavedList {
  return {
    id: r.id,
    name: r.name,
    storeName: r.store_name ?? "—",
    mealIds: r.meal_ids ?? [],
    itemCount: r.item_count ?? 0,
    total: Number(r.total ?? 0),
    createdAt: r.created_at,
  };
}

export async function loadShoppingLists(): Promise<SavedList[]> {
  const supabase = await getSupabaseServer();
  if (!supabase) return [];
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return [];
    const { data } = await supabase
      .from("shopping_lists")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });
    return ((data ?? []) as ListRow[]).map(rowToSaved);
  } catch {
    return [];
  }
}

// Renvoie true si la sauvegarde Supabase a réussi (sinon l'appelant
// retombe sur localStorage côté client).
export async function saveShoppingList(input: SavedListInput): Promise<boolean> {
  const supabase = await getSupabaseServer();
  if (!supabase) return false;
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return false;
    const { error } = await supabase.from("shopping_lists").insert({
      user_id: user.id,
      name: input.name,
      store_name: input.storeName,
      meal_ids: input.mealIds,
      item_count: input.itemCount,
      total: input.total,
    });
    return !error;
  } catch {
    return false;
  }
}

export async function deleteShoppingList(id: string): Promise<void> {
  const supabase = await getSupabaseServer();
  if (!supabase) return;
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;
    await supabase.from("shopping_lists").delete().eq("id", id).eq("user_id", user.id);
  } catch {
    /* ignore */
  }
}
