"use client";

import { useEffect, useMemo, useState } from "react";
import { Check } from "lucide-react";
import type { ShoppingSection } from "@/lib/shopping-list";
import { Stagger, StaggerItem } from "@/components/ui/motion";
import { CopyListButton } from "@/components/copy-list-button";
import { setPantryItem } from "@/app/pantry-actions";
import { cn, formatEuro, formatQty } from "@/lib/utils";

// Liste de courses interactive avec PLACARD : cocher « j'ai déjà » retire l'article
// du panier (et du total), sans le racheter. Connecté -> placard persisté dans
// Supabase (multi-appareils) ; invité -> localStorage (reste d'une semaine à l'autre).
const PANTRY_KEY = "smarteat_pantry";

export function ShoppingList({
  sections,
  storeName,
  authed = false,
  initialOwned = [],
}: {
  sections: ShoppingSection[];
  storeName: string;
  authed?: boolean;
  initialOwned?: string[];
}) {
  const [owned, setOwned] = useState<Set<string>>(() => new Set(authed ? initialOwned : []));

  // Invité : on hydrate depuis localStorage après le montage (SSR rend tout "à acheter").
  useEffect(() => {
    if (authed) return; // connecté : la source est Supabase (initialOwned)
    try {
      const raw = localStorage.getItem(PANTRY_KEY);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (raw) setOwned(new Set(JSON.parse(raw) as string[]));
    } catch {
      /* localStorage indisponible — on ignore */
    }
  }, [authed]);

  function toggle(id: string) {
    setOwned((prev) => {
      const next = new Set(prev);
      const willOwn = !next.has(id);
      if (willOwn) next.add(id);
      else next.delete(id);
      if (authed) {
        void setPantryItem(id, willOwn); // persistance Supabase (optimiste)
      } else {
        try {
          localStorage.setItem(PANTRY_KEY, JSON.stringify([...next]));
        } catch {
          /* ignore */
        }
      }
      return next;
    });
  }

  const { total, remaining } = useMemo(() => {
    let total = 0;
    let remaining = 0;
    for (const s of sections) {
      for (const l of s.lines) {
        if (!owned.has(l.ingredient.id)) {
          total += l.cost;
          remaining += 1;
        }
      }
    }
    return { total, remaining };
  }, [sections, owned]);

  const copyText = useMemo(() => {
    const lines = [`SmartEat — Liste de courses (${storeName})`, ""];
    for (const s of sections) {
      const kept = s.lines.filter((l) => !owned.has(l.ingredient.id));
      if (!kept.length) continue;
      lines.push(s.label);
      for (const l of kept) {
        lines.push(
          `- ${l.ingredient.name} : ${l.packs} × ${l.ingredient.packLabel}` +
            ` (besoin ${formatQty(l.neededQty, l.ingredient.baseUnit)})`,
        );
      }
      lines.push("");
    }
    lines.push(`Total estimé : ${formatEuro(total)}`);
    return lines.join("\n");
  }, [sections, owned, storeName, total]);

  return (
    <>
      <Stagger className="space-y-5">
        {sections.map((section) => {
          const subtotal = section.lines.reduce(
            (sum, l) => (owned.has(l.ingredient.id) ? sum : sum + l.cost),
            0,
          );
          return (
            <StaggerItem key={section.aisle}>
              <div className="mb-2 flex items-baseline justify-between">
                <h2 className="text-sm font-semibold uppercase tracking-wide text-on-surface-muted">
                  {section.label}
                </h2>
                <span className="tnum text-xs text-on-surface-muted">{formatEuro(subtotal)}</span>
              </div>
              <ul className="overflow-hidden rounded-[var(--radius-card)] border border-outline bg-surface">
                {section.lines.map((line) => {
                  const isOwned = owned.has(line.ingredient.id);
                  return (
                    <li
                      key={line.ingredient.id}
                      className={cn(
                        "flex items-center gap-3 border-b border-outline px-4 py-3 last:border-b-0 transition-opacity",
                        isOwned && "opacity-50",
                      )}
                    >
                      <button
                        type="button"
                        onClick={() => toggle(line.ingredient.id)}
                        aria-pressed={isOwned}
                        aria-label={`J'ai déjà ${line.ingredient.name}`}
                        className={cn(
                          "grid h-6 w-6 shrink-0 place-items-center rounded-full border transition-colors",
                          isOwned
                            ? "border-primary bg-primary text-on-primary"
                            : "border-outline hover:border-primary",
                        )}
                      >
                        {isOwned && <Check size={14} strokeWidth={3} />}
                      </button>
                      <div className="min-w-0 flex-1">
                        <span className={cn("block truncate font-medium", isOwned && "line-through")}>
                          {line.ingredient.name}
                        </span>
                        <span className="block text-xs text-on-surface-muted">
                          {isOwned
                            ? "déjà dans le placard"
                            : `besoin ${formatQty(line.neededQty, line.ingredient.baseUnit)}`}
                        </span>
                      </div>
                      <div className="shrink-0 text-right">
                        <span
                          className={cn(
                            "block text-sm font-medium",
                            isOwned && "text-on-surface-muted line-through",
                          )}
                        >
                          {line.packs} × {line.ingredient.packLabel}
                        </span>
                        <span className="tnum block text-xs text-on-surface-muted">
                          {formatEuro(line.cost)}
                        </span>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </StaggerItem>
          );
        })}
      </Stagger>

      {/* Total + export, sticky en thumb-zone (recalculé sans les articles du placard) */}
      <div className="fixed inset-x-0 bottom-0">
        <div className="mx-auto max-w-md border-t border-outline bg-background/80 p-5 backdrop-blur">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-on-surface-muted">{remaining} à acheter · produits entiers</span>
            <span className="tnum text-xl font-bold">{formatEuro(total)}</span>
          </div>
          <CopyListButton text={copyText} />
        </div>
      </div>
    </>
  );
}
