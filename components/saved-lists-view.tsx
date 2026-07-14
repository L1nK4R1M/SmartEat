"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { CalendarDays, ChevronRight, ShoppingBasket, Trash2 } from "lucide-react";
import { deleteShoppingList } from "@/app/list-actions";
import { SAVED_LISTS_KEY, type SavedList } from "@/lib/saved-lists";
import { Stagger, StaggerItem } from "@/components/ui/motion";
import { ProgressBar } from "@/components/ui/progress-bar";
import { buttonClasses } from "@/components/ui/button";
import { formatEuro } from "@/lib/utils";

// Listes sauvegardées — cartes riches : nom, date, enseigne, nb d'articles,
// total estimé et progression « au placard » quand on la connaît (connecté).
// La persistance est inchangée : Supabase si connecté, sinon localStorage.

// Liste enrichie côté serveur (connecté) : progression cochée facultative.
export interface SavedListDisplay extends SavedList {
  ownedCount?: number;
  ingredientCount?: number;
}

// Date lisible et déterministe (même rendu serveur/client, pas de fuseau local).
function formatListDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("fr-FR", { day: "numeric", month: "long", timeZone: "UTC" });
}

export function SavedListsView({
  authed,
  initialLists,
}: {
  authed: boolean;
  initialLists: SavedListDisplay[];
}) {
  const [lists, setLists] = useState<SavedListDisplay[]>(initialLists);

  // Invité : la source est localStorage (le serveur ne connaît pas ces listes).
  useEffect(() => {
    if (authed) return;
    try {
      const raw = localStorage.getItem(SAVED_LISTS_KEY);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (raw) setLists(JSON.parse(raw) as SavedListDisplay[]);
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
      <div className="mt-10 rounded-[var(--radius-card)] border border-dashed border-outline bg-surface p-8 text-center">
        <span className="text-5xl" aria-hidden>
          🧺
        </span>
        <p className="mt-4 font-display text-xl font-semibold tracking-tight">
          Aucune liste pour l&apos;instant
        </p>
        <p className="mt-1.5 text-sm text-on-surface-muted">
          Compose ta semaine de repas, puis sauvegarde ta liste de courses pour la retrouver ici.
        </p>
        <Link href="/plan" className={`${buttonClasses("primary", "md")} mt-5 w-full`}>
          Composer ma semaine
        </Link>
      </div>
    );
  }

  return (
    <Stagger className="mt-6 space-y-3">
      {lists.map((l) => {
        const date = formatListDate(l.createdAt);
        const hasProgress =
          typeof l.ownedCount === "number" &&
          typeof l.ingredientCount === "number" &&
          l.ingredientCount > 0;
        return (
          <StaggerItem key={l.id}>
            <div className="rounded-[var(--radius-card)] border border-outline bg-surface p-4">
              <div className="flex items-center gap-2">
                <Link
                  href={`/list?meals=${l.mealIds.join(",")}`}
                  className="flex min-w-0 flex-1 items-center gap-3"
                >
                  <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-primary/10 text-primary">
                    <ShoppingBasket size={22} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-semibold">{l.name}</span>
                    <span className="mt-0.5 flex items-center gap-1 text-xs text-on-surface-muted">
                      <CalendarDays size={12} className="shrink-0" aria-hidden />
                      <span className="truncate">
                        {date ? `${date} · ` : ""}
                        {l.storeName}
                      </span>
                    </span>
                  </span>
                  <ChevronRight size={18} className="shrink-0 text-on-surface-muted" />
                </Link>
                <button
                  type="button"
                  onClick={() => remove(l.id)}
                  aria-label={`Supprimer la liste ${l.name}`}
                  className="grid h-11 w-11 shrink-0 place-items-center rounded-full text-on-surface-muted transition-colors hover:bg-surface-variant hover:text-error"
                >
                  <Trash2 size={17} />
                </button>
              </div>

              <div className="mt-3 flex items-baseline justify-between border-t border-outline pt-3 text-sm">
                <span className="text-on-surface-muted">
                  <span className="tnum">{l.mealIds.length}</span> repas ·{" "}
                  <span className="tnum">{l.itemCount}</span> articles
                </span>
                <span className="tnum font-semibold">{formatEuro(l.total)}</span>
              </div>

              {hasProgress && (
                <div className="mt-2.5">
                  <ProgressBar value={l.ownedCount!} max={l.ingredientCount!} className="h-1.5" />
                  <p className="tnum mt-1.5 text-xs text-on-surface-muted">
                    {l.ownedCount}/{l.ingredientCount} articles au placard
                  </p>
                </div>
              )}
            </div>
          </StaggerItem>
        );
      })}
    </Stagger>
  );
}
