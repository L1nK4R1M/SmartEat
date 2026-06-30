"use client";

import Link from "next/link";
import { useState } from "react";
import { BookmarkPlus, Check, ListChecks } from "lucide-react";
import { saveShoppingList } from "@/app/list-actions";
import { SAVED_LISTS_KEY, type SavedList, type SavedListInput } from "@/lib/saved-lists";
import { buttonClasses } from "@/components/ui/button";

// Sauvegarde la liste courante pour pouvoir en garder plusieurs.
// Connecté -> Supabase (repli localStorage si échec) ; invité -> localStorage.
export function SaveListButton({
  input,
  authed,
}: {
  input: SavedListInput;
  authed: boolean;
}) {
  const [state, setState] = useState<"idle" | "saving" | "saved">("idle");

  function saveLocally() {
    try {
      const raw = localStorage.getItem(SAVED_LISTS_KEY);
      const lists: SavedList[] = raw ? (JSON.parse(raw) as SavedList[]) : [];
      const entry: SavedList = {
        ...input,
        id:
          typeof crypto !== "undefined" && "randomUUID" in crypto
            ? crypto.randomUUID()
            : String(Date.now()),
        createdAt: new Date().toISOString(),
      };
      localStorage.setItem(SAVED_LISTS_KEY, JSON.stringify([entry, ...lists]));
    } catch {
      /* localStorage indisponible — on ignore */
    }
  }

  async function onSave() {
    if (state !== "idle") return;
    setState("saving");
    if (authed) {
      const ok = await saveShoppingList(input);
      if (!ok) saveLocally(); // repli si Supabase indisponible
    } else {
      saveLocally();
    }
    setState("saved");
  }

  if (state === "saved") {
    return (
      <div className="flex items-center gap-2">
        <span className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-full bg-primary/10 px-4 py-2.5 text-sm font-medium text-primary">
          <Check size={16} strokeWidth={3} /> Liste enregistrée
        </span>
        <Link href="/listes" className={`${buttonClasses("secondary", "md")} shrink-0`}>
          <ListChecks size={16} /> Mes listes
        </Link>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={onSave}
      disabled={state === "saving"}
      className={`${buttonClasses("secondary", "md")} w-full`}
    >
      <BookmarkPlus size={16} />
      {state === "saving" ? "Enregistrement…" : "Sauvegarder cette liste"}
    </button>
  );
}
