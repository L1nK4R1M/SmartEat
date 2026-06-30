// Listes de courses sauvegardées — l'utilisateur peut en générer/garder plusieurs.
// Connecté -> persistées dans Supabase (multi-appareils) ; invité -> localStorage.
// Type partagé client/serveur (pur, sans dépendance).

export interface SavedList {
  id: string; // uuid Supabase ou id local (invité)
  name: string;
  storeName: string;
  mealIds: string[];
  itemCount: number;
  total: number; // coût estimé (€) au moment de la sauvegarde
  createdAt: string; // ISO
}

// Données nécessaires pour sauvegarder une liste (sans id ni date).
export type SavedListInput = Omit<SavedList, "id" | "createdAt">;

// Clé localStorage (mode invité).
export const SAVED_LISTS_KEY = "smarteat_lists";

// Nom par défaut : « Semaine du 30 juin · Carrefour ».
export function defaultListName(storeName: string, date = new Date()): string {
  const day = date.toLocaleDateString("fr-FR", { day: "numeric", month: "long" });
  return `Semaine du ${day} · ${storeName}`;
}
