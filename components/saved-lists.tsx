"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ChevronRight, ShoppingCart, Trash2 } from "lucide-react";
import { deleteShoppingList } from "@/app/list-actions";
import { SAVED_LISTS_KEY, type SavedList } from "@/lib/saved-lists";
import { buttonClasses } from "@/components/ui/button";
import { formatEuro } from "@/lib/utils";

export function SavedLists({
  authed,
  initialLists,
}: {
  authed: boolean;
  initialLists: SavedList[];
}) {
  const [lists, setLists] = useState<SavedList[]>(initialLists);

  // Invité : la source est localStorage (le serveur ne connaît pas ces listes).
  useEffect(() => {
    if (authed) return;
    try {
      const raw = localStorage.getItem(SAVED_LISTS_KEY);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (raw) setLists(JSON.parse(raw) as SavedList[]);
    } catch {
      /* ignore */
    }
  }, [authed]);

  function remove(id: string) {
    setLists((prev) => {
      const next = prev.filter((l) => l.id !== id);
      if (authed) {
        void deleteShoppingList(id);
      } else {
        try {
          localStorage.setItem(SAVED_LISTS_KEY, JSON.stringify(next));
        } catch {
          /* ignore */
        }
      }
      return next;
    });
  }

  if (lists.length === 0) {
    return (
      <div className="mt-8 rounded-[var(--radius-card)] border border-dashed border-outline bg-surface p-6 text-center">
        <p className="font-medium">Aucune liste sauvegardée pour l&apos;instant.</p>
        <p className="mt-1 text-sm text-on-surface-muted">
          Génère une semaine puis « Sauvegarder cette liste » pour la retrouver ici.
        </p>
        <Link href="/plan" className={`${buttonClasses("primary", "md")} mt-4 w-full`}>
          <ShoppingCart size={16} /> Voir mes repas
        </Link>
      </div>
    );
  }

  return (
    <div className="mt-6 space-y-3">
      {lists.map((l) => (
        <div
          key={l.id}
          className="flex items-center gap-2 rounded-[var(--radius-card)] border border-outline bg-surface p-3"
        >
          <Link
            href={`/list?meals=${l.mealIds.join(",")}`}
            className="flex min-w-0 flex-1 items-center gap-3"
          >
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-primary/10 text-primary">
              <ShoppingCart size={20} />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate font-semibold">{l.name}</span>
              <span className="block text-xs text-on-surface-muted">
                {l.mealIds.length} repas · {l.itemCount} produits · {formatEuro(l.total)}
              </span>
            </span>
            <ChevronRight size={18} className="shrink-0 text-on-surface-muted" />
          </Link>
          <button
            type="button"
            onClick={() => remove(l.id)}
            aria-label={`Supprimer ${l.name}`}
            className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-on-surface-muted transition-colors hover:bg-surface-variant hover:text-error"
          >
            <Trash2 size={16} />
          </button>
        </div>
      ))}
    </div>
  );
}
