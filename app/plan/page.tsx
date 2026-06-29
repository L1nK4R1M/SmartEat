import Link from "next/link";
import { redirect } from "next/navigation";
import { ShoppingCart, AlertTriangle } from "lucide-react";
import { repo } from "@/lib/repo";
import { getPrefs, parseMealIds, parseRequest } from "@/lib/prefs";
import { bestSubstitute, buildPlanFromIds, planWeek } from "@/lib/matching-engine";
import { buildShoppingList } from "@/lib/shopping-list";
import { recipeMealCost } from "@/lib/pricing";
import { APPLIANCE_LABELS, dayLabel } from "@/lib/labels";
import { FilterBar } from "@/components/filter-bar";
import { RecipeCard } from "@/components/recipe-card";
import { BrandLogo } from "@/components/brand-logo";
import { buttonClasses } from "@/components/ui/button";
import { formatEuro } from "@/lib/utils";

type SearchParams = Record<string, string | string[] | undefined>;

function planHref(budget: number, types: string[], meals: string[]) {
  const params = new URLSearchParams();
  params.set("budget", String(budget));
  if (types.length) params.set("types", types.join(","));
  if (meals.length) params.set("meals", meals.join(","));
  return `/plan?${params.toString()}`;
}

export default async function PlanPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const prefs = await getPrefs();
  if (!prefs) redirect("/onboarding");

  const sp = await searchParams;
  const request = parseRequest(sp, prefs);

  const [recipes, ingredientsMap, stores] = await Promise.all([
    repo.getRecipes(),
    repo.getIngredientsMap(),
    repo.getStores(),
  ]);
  const store = stores.find((s) => s.id === prefs.storeId) ?? stores[0];

  // Sélection : ids fournis (après swap) sinon plan hebdo budget-aware.
  const presetIds = parseMealIds(sp);
  const preset = presetIds.length ? buildPlanFromIds(presetIds, recipes) : [];
  let selected = preset;
  let withinBudget = true;
  if (preset.length === 0) {
    const plan = planWeek(recipes, prefs, request, ingredientsMap, store);
    selected = plan.recipes;
    withinBudget = plan.withinBudget;
  }
  const selectedIds = selected.map((r) => r.id);

  const total = buildShoppingList(selected, ingredientsMap, prefs.householdSize, store).total;
  const overBudget = total > request.budget + 0.001;
  const substitute = bestSubstitute(recipes, prefs, request, ingredientsMap, store, selectedIds);

  return (
    <div className="mx-auto w-full max-w-md px-5 pb-32 pt-6">
      <header className="mb-5 flex items-center gap-3">
        <BrandLogo domain={store.domain} name={store.name} color={store.color} size={44} />
        <div className="min-w-0">
          <h1 className="text-2xl font-semibold tracking-tight">Vos repas de la semaine</h1>
          <p className="truncate text-sm text-on-surface-muted">
            {store.name} · {prefs.equipment.map((e) => APPLIANCE_LABELS[e].label).join(", ")}
          </p>
        </div>
      </header>

      <FilterBar initialBudget={request.budget} initialTypes={request.mealTypes} />

      {/* Avertissement : budget trop serré pour couvrir tous les jours */}
      {!withinBudget && selected.length > 0 && (
        <div className="mt-4 flex items-start gap-2 rounded-2xl border border-accent/40 bg-accent/10 p-3 text-sm">
          <AlertTriangle size={16} className="mt-0.5 shrink-0 text-accent" />
          <span>
            Budget atteint avec <b>{selected.length}</b> repas (sur {prefs.mealsPerWeek} souhaités).
            Augmentez le budget pour en ajouter.
          </span>
        </div>
      )}

      <div className="mt-5 space-y-3">
        {selected.length === 0 ? (
          <div className="rounded-[var(--radius-card)] border border-dashed border-outline bg-surface p-6 text-center">
            <p className="font-medium">Aucune recette ne rentre dans ce budget.</p>
            <p className="mt-1 text-sm text-on-surface-muted">
              Augmentez le budget ou retirez un filtre de type.
            </p>
          </div>
        ) : (
          selected.map((recipe, i) => (
            <RecipeCard
              key={recipe.id}
              recipe={recipe}
              day={dayLabel(i)}
              mealCost={recipeMealCost(recipe, ingredientsMap, store, prefs.householdSize)}
              swapHref={
                substitute
                  ? planHref(
                      request.budget,
                      request.mealTypes,
                      selectedIds.map((id) => (id === recipe.id ? substitute.id : id)),
                    )
                  : null
              }
            />
          ))
        )}
      </div>

      {selected.length > 0 && (
        <p className="mt-4 text-center text-sm text-on-surface-muted">
          Total de la semaine ({store.name}) :{" "}
          <span className={`tnum font-semibold ${overBudget ? "text-accent" : "text-primary"}`}>
            {formatEuro(total)}
          </span>{" "}
          / {formatEuro(request.budget)}
        </p>
      )}

      {selected.length > 0 && (
        <div className="fixed inset-x-0 bottom-0">
          <div className="mx-auto max-w-md border-t border-outline bg-background/80 p-5 backdrop-blur">
            <Link
              href={`/list?meals=${selectedIds.join(",")}`}
              className={`${buttonClasses("primary", "lg")} w-full`}
            >
              <ShoppingCart size={18} /> Générer la liste de courses
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
