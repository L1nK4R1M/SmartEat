import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { getCurrentUser } from "@/lib/supabase/server";
import { loadShoppingLists } from "@/app/list-actions";
import { SavedLists } from "@/components/saved-lists";

// Mes listes de courses — l'utilisateur peut en garder plusieurs.
export default async function ListesPage() {
  const user = await getCurrentUser();
  const initialLists = user ? await loadShoppingLists() : [];

  return (
    <main className="mx-auto w-full max-w-md px-5 py-8">
      <Link
        href={user ? "/compte" : "/"}
        className="mb-4 inline-flex items-center gap-1 text-sm text-on-surface-muted hover:text-on-surface"
      >
        <ChevronLeft size={16} /> {user ? "Mon compte" : "Accueil"}
      </Link>

      <h1 className="text-2xl font-semibold tracking-tight">Mes listes</h1>
      <p className="mt-1 text-sm text-on-surface-muted">
        {user ? "Synchronisées sur ton compte." : "Gardées sur cet appareil (mode invité)."}
      </p>

      <SavedLists authed={!!user} initialLists={initialLists} />
    </main>
  );
}
