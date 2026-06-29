import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft, Clock, Users, Wallet } from "lucide-react";
import { repo } from "@/lib/repo";
import { getPrefs } from "@/lib/prefs";
import { recipeMealCost } from "@/lib/pricing";
import { CAPABILITY_LABELS, DIET_LABELS, MEAL_TYPE_LABELS } from "@/lib/labels";
import { Badge } from "@/components/ui/badge";
import { formatEuro, formatQty } from "@/lib/utils";
import type { DietTag } from "@/lib/types";

export default async function RecipePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [recipe, ingredientsMap, stores, prefs] = await Promise.all([
    repo.getRecipe(id),
    repo.getIngredientsMap(),
    repo.getStores(),
    getPrefs(),
  ]);
  if (!recipe) notFound();

  const householdSize = prefs?.householdSize ?? 2;
  const store = stores.find((s) => s.id === prefs?.storeId) ?? stores[0];
  const mealCost = recipeMealCost(recipe, ingredientsMap, store, householdSize);

  return (
    <div className="mx-auto w-full max-w-md px-5 pb-16 pt-6">
      <Link
        href="/plan"
        className="mb-3 inline-flex items-center gap-1 text-sm text-on-surface-muted hover:text-on-surface"
      >
        <ChevronLeft size={16} /> Retour aux repas
      </Link>

      <div className="flex items-center gap-4">
        <div
          aria-hidden
          className="grid h-16 w-16 shrink-0 place-items-center rounded-2xl bg-surface-variant text-4xl"
        >
          {recipe.emoji}
        </div>
        <h1 className="text-2xl font-semibold tracking-tight">{recipe.title}</h1>
      </div>

      <div className="mt-4 flex flex-wrap gap-1.5">
        {recipe.mealTypes.map((t) => (
          <Badge key={t} tone="primary">
            {MEAL_TYPE_LABELS[t].emoji} {MEAL_TYPE_LABELS[t].label}
          </Badge>
        ))}
        {recipe.dietTags
          .filter((d): d is DietTag => d !== "halal" || recipe.dietTags.length === 1)
          .map((d) => (
            <Badge key={d}>
              {DIET_LABELS[d].emoji} {DIET_LABELS[d].label}
            </Badge>
          ))}
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2 text-center">
        <Stat icon={<Clock size={16} />} label="Préparation" value={`${recipe.prepMinutes} min`} />
        <Stat icon={<Users size={16} />} label="Portions" value={`${householdSize}`} />
        <Stat icon={<Wallet size={16} />} label={`≈ chez ${store.name}`} value={formatEuro(mealCost)} />
      </div>

      <p className="mt-3 text-xs text-on-surface-muted">
        Cuisson : {recipe.reqCapabilities.map((c) => CAPABILITY_LABELS[c]).join(", ")}.
      </p>

      <section className="mt-6">
        <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-on-surface-muted">
          Ingrédients ({householdSize} pers.)
        </h2>
        <ul className="overflow-hidden rounded-[var(--radius-card)] border border-outline bg-surface">
          {recipe.ingredients.map((ri) => {
            const ing = ingredientsMap.get(ri.ingredientId);
            if (!ing) return null;
            return (
              <li
                key={ri.ingredientId}
                className="flex items-center justify-between border-b border-outline px-4 py-2.5 last:border-b-0"
              >
                <span className="font-medium">{ing.name}</span>
                <span className="tnum text-sm text-on-surface-muted">
                  {formatQty(ri.qtyPerServing * householdSize, ing.baseUnit)}
                </span>
              </li>
            );
          })}
        </ul>
      </section>

      <section className="mt-6">
        <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-on-surface-muted">
          Préparation
        </h2>
        <ol className="space-y-3">
          {recipe.steps.map((step, i) => (
            <li key={i} className="flex gap-3">
              <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-primary/12 text-sm font-semibold text-primary">
                {i + 1}
              </span>
              <p className="pt-0.5 text-[15px]">{step}</p>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}

function Stat({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-outline bg-surface p-3">
      <div className="flex items-center justify-center text-on-surface-muted">{icon}</div>
      <div className="tnum mt-1 text-sm font-semibold">{value}</div>
      <div className="truncate text-[11px] text-on-surface-muted">{label}</div>
    </div>
  );
}
