import Link from "next/link";
import { RefreshCw, Clock, Wallet, ChevronRight } from "lucide-react";
import type { Recipe } from "@/lib/types";
import { MEAL_TYPE_LABELS } from "@/lib/labels";
import { formatEuro } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

// RecipeCard (§3). La carte est CLIQUABLE -> détail + étapes (/recipe/[id]).
// Le bouton swap est un lien frère positionné par-dessus (pas d'ancre imbriquée).
export function RecipeCard({
  recipe,
  day,
  mealCost,
  swapHref,
}: {
  recipe: Recipe;
  day?: string;
  mealCost: number;
  swapHref: string | null;
}) {
  return (
    <article className="relative rounded-[var(--radius-card)] border border-outline bg-surface">
      <Link href={`/recipe/${recipe.id}`} className="block rounded-[var(--radius-card)] p-4 pr-12">
        {day && (
          <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-primary">{day}</div>
        )}
        <div className="flex items-center gap-4">
          <div
            aria-hidden
            className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-surface-variant text-3xl"
          >
            {recipe.emoji}
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="truncate text-[15px] font-semibold">{recipe.title}</h3>
            <div className="mt-1.5 flex flex-wrap gap-1.5">
              {recipe.mealTypes.slice(0, 2).map((t) => (
                <Badge key={t} tone="primary">
                  {MEAL_TYPE_LABELS[t].emoji} {MEAL_TYPE_LABELS[t].label}
                </Badge>
              ))}
              <Badge>
                <Clock size={12} /> {recipe.prepMinutes} min
              </Badge>
              <Badge>
                <Wallet size={12} /> <span className="tnum">≈ {formatEuro(mealCost)}</span>
              </Badge>
            </div>
          </div>
        </div>
      </Link>

      {swapHref ? (
        <Link
          href={swapHref}
          aria-label={`Remplacer ${recipe.title}`}
          className="absolute right-3 top-3 z-10 grid h-9 w-9 place-items-center rounded-full bg-surface-variant text-on-surface-muted transition-colors hover:text-on-surface"
        >
          <RefreshCw size={16} />
        </Link>
      ) : (
        <ChevronRight
          size={18}
          className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-muted"
        />
      )}
    </article>
  );
}
