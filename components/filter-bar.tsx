"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { SlidersHorizontal } from "lucide-react";
import type { MealType } from "@/lib/types";
import { MEAL_TYPE_LABELS } from "@/lib/labels";
import { Button } from "@/components/ui/button";
import { cn, formatEuro } from "@/lib/utils";

const TYPES: MealType[] = ["rapide", "sain", "leger", "proteine"];

// FilterSheet simplifié (§3) : les seuls arbitrages de la semaine = type + budget.
// « Appliquer » régénère la sélection (on retire le param `meals` de l'URL).
export function FilterBar({
  initialBudget,
  initialTypes,
}: {
  initialBudget: number;
  initialTypes: MealType[];
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [budget, setBudget] = useState(initialBudget);
  const [types, setTypes] = useState<MealType[]>(initialTypes);

  function toggleType(t: MealType) {
    setTypes((prev) => (prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]));
  }

  function apply() {
    const params = new URLSearchParams();
    params.set("budget", String(budget));
    if (types.length) params.set("types", types.join(","));
    startTransition(() => router.push(`/plan?${params.toString()}`));
  }

  return (
    <section className="rounded-[var(--radius-card)] border border-outline bg-surface p-4">
      <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-on-surface-muted">
        <SlidersHorizontal size={16} /> Cette semaine
      </div>

      {/* Type de repas — sélection multiple (SegmentedButton M3) */}
      <div className="flex flex-wrap gap-2">
        {TYPES.map((t) => {
          const active = types.includes(t);
          return (
            <button
              key={t}
              type="button"
              aria-pressed={active}
              onClick={() => toggleType(t)}
              className={cn(
                "rounded-full border px-3.5 py-2 text-sm font-medium transition-colors",
                active
                  ? "border-primary bg-primary/12 text-primary"
                  : "border-outline text-on-surface-muted hover:bg-surface-variant",
              )}
            >
              {MEAL_TYPE_LABELS[t].emoji} {MEAL_TYPE_LABELS[t].label}
            </button>
          );
        })}
      </div>

      {/* Budget hebdomadaire */}
      <div className="mt-5">
        <div className="mb-1 flex items-center justify-between text-sm">
          <label htmlFor="budget" className="text-on-surface-muted">
            Budget / semaine
          </label>
          <span className="tnum font-semibold text-on-surface">{formatEuro(budget)}</span>
        </div>
        <input
          id="budget"
          type="range"
          min={30}
          max={150}
          step={5}
          value={budget}
          onChange={(e) => setBudget(Number(e.target.value))}
          className="h-2 w-full cursor-pointer appearance-none rounded-full bg-surface-variant accent-primary"
        />
      </div>

      <Button onClick={apply} disabled={pending} className="mt-5 w-full" size="md">
        {pending ? "Mise à jour…" : "Appliquer"}
      </Button>
    </section>
  );
}
