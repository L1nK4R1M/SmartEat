"use client";

import { useState } from "react";
import Link from "next/link";
import { Clock, Wallet } from "lucide-react";
import type { MealSlot, MealType } from "@/lib/types";
import { MEAL_SLOT_LABELS, MEAL_TYPE_LABELS } from "@/lib/labels";
import { Stagger, StaggerItem } from "@/components/ui/motion";
import { RecipeImage } from "@/components/recipe-image";
import { Badge } from "@/components/ui/badge";
import { formatEuro } from "@/lib/utils";

export interface GalleryRecipe {
  id: string;
  title: string;
  emoji: string;
  imageUrl?: string;
  prepMinutes: number;
  mealType?: MealType;
  slots: MealSlot[];
  costPerServing: number;
}

const FILTERS: { key: MealSlot | "tous"; label: string; emoji: string }[] = [
  { key: "tous", label: "Tous", emoji: "🍴" },
  { key: "petit_dej", label: MEAL_SLOT_LABELS.petit_dej.label, emoji: MEAL_SLOT_LABELS.petit_dej.emoji },
  { key: "dejeuner", label: MEAL_SLOT_LABELS.dejeuner.label, emoji: MEAL_SLOT_LABELS.dejeuner.emoji },
  { key: "diner", label: MEAL_SLOT_LABELS.diner.label, emoji: MEAL_SLOT_LABELS.diner.emoji },
];

export function RecipeGallery({ recipes }: { recipes: GalleryRecipe[] }) {
  const [filter, setFilter] = useState<MealSlot | "tous">("tous");
  const filtered = filter === "tous" ? recipes : recipes.filter((r) => r.slots.includes(filter));

  return (
    <div>
      {/* Filtres par moment de la journée */}
      <div className="-mx-5 flex gap-2 overflow-x-auto px-5 pb-1">
        {FILTERS.map((f) => (
          <button
            key={f.key}
            type="button"
            onClick={() => setFilter(f.key)}
            className={`shrink-0 rounded-full border px-3.5 py-2 text-sm font-medium transition-colors ${
              filter === f.key
                ? "border-primary bg-primary text-on-primary"
                : "border-outline bg-surface text-on-surface-muted"
            }`}
          >
            {f.emoji} {f.label}
          </button>
        ))}
      </div>

      <p className="mt-3 text-sm text-on-surface-muted">
        {filtered.length} recette{filtered.length > 1 ? "s" : ""} avec photo
      </p>

      <Stagger className="mt-4 grid grid-cols-2 gap-3">
        {filtered.map((r) => (
          <StaggerItem key={r.id}>
            <Link
              href={`/recipe/${r.id}`}
              className="block overflow-hidden rounded-2xl border border-outline bg-surface"
            >
              <RecipeImage
                src={r.imageUrl}
                query={r.title}
                emoji={r.emoji}
                seed={r.id}
                alt={r.title}
                rounded="rounded-none"
                className="aspect-[4/3] w-full"
                emojiClassName="text-5xl"
              />
              <div className="p-3">
                <p className="truncate text-sm font-semibold">{r.title}</p>
                <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
                  {r.mealType && (
                    <Badge tone="primary">
                      {MEAL_TYPE_LABELS[r.mealType].emoji} {MEAL_TYPE_LABELS[r.mealType].label}
                    </Badge>
                  )}
                </div>
                <div className="mt-1.5 flex items-center gap-3 text-xs text-on-surface-muted">
                  <span className="inline-flex items-center gap-1">
                    <Clock size={12} /> {r.prepMinutes} min
                  </span>
                  <span className="tnum inline-flex items-center gap-1">
                    <Wallet size={12} /> {formatEuro(r.costPerServing)}/pers
                  </span>
                </div>
              </div>
            </Link>
          </StaggerItem>
        ))}
      </Stagger>
    </div>
  );
}
