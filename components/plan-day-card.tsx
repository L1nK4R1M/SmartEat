"use client";

import Link from "next/link";
import { RefreshCw, Clock, Users, Wallet } from "lucide-react";
import type { MealSlot, MealType } from "@/lib/types";
import { MEAL_SLOT_LABELS, MEAL_TYPE_LABELS } from "@/lib/labels";
import { formatEuro } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { RecipeImage } from "@/components/recipe-image";

export interface PlanCardRecipe {
  id: string;
  title: string;
  emoji: string;
  imageUrl?: string;
  prepMinutes: number;
  mealTypes: MealType[];
  slot: MealSlot;
}

// Carte repas enrichie (plan, façon Romi) : onglet "moment" coloré à gauche,
// visuel, nom, temps, nb personnes, prix calculé, tags d'ambiance. -> détail.
export function PlanDayCard({
  recipe,
  householdSize,
  mealCost,
  swapHref,
}: {
  recipe: PlanCardRecipe;
  householdSize: number;
  mealCost: number;
  swapHref: string | null;
}) {
  const slot = MEAL_SLOT_LABELS[recipe.slot];
  return (
    <article className="relative flex overflow-hidden rounded-[var(--radius-card)] border border-outline bg-surface">
      {/* Onglet moment coloré */}
      <div
        className="flex w-9 shrink-0 items-center justify-center"
        style={{ backgroundColor: slot.color }}
        aria-hidden
      >
        <span className="rotate-180 text-[11px] font-bold uppercase tracking-wider text-white [writing-mode:vertical-rl]">
          {slot.short}
        </span>
      </div>

      <Link href={`/recipe/${recipe.id}`} className="flex min-w-0 flex-1 items-center gap-3 p-3 pr-11">
        <RecipeImage
          src={recipe.imageUrl}
          query={recipe.title}
          emoji={recipe.emoji}
          seed={recipe.id}
          alt={recipe.title}
          className="h-16 w-16 shrink-0"
          emojiClassName="text-3xl"
        />
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-[15px] font-semibold">{recipe.title}</h3>
          <div className="mt-1.5 flex flex-wrap gap-1.5">
            {recipe.mealTypes.slice(0, 2).map((t) => (
              <Badge key={t} tone="primary">
                {MEAL_TYPE_LABELS[t].emoji} {MEAL_TYPE_LABELS[t].label}
              </Badge>
            ))}
          </div>
          <div className="mt-1.5 flex flex-wrap items-center gap-3 text-xs text-on-surface-muted">
            <span className="inline-flex items-center gap-1">
              <Clock size={12} /> {recipe.prepMinutes} min
            </span>
            <span className="inline-flex items-center gap-1">
              <Users size={12} /> {householdSize}
            </span>
            <span className="tnum inline-flex items-center gap-1 font-medium text-on-surface">
              <Wallet size={12} /> {formatEuro(mealCost)}
            </span>
          </div>
        </div>
      </Link>

      {swapHref && (
        <Link
          href={swapHref}
          aria-label={`Changer ${recipe.title}`}
          className="absolute right-2.5 top-2.5 z-10 grid h-9 w-9 place-items-center rounded-full bg-surface-variant text-on-surface-muted transition-colors hover:text-on-surface"
        >
          <RefreshCw size={16} />
        </Link>
      )}
    </article>
  );
}
