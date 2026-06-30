import { redirect } from "next/navigation";
import type { MealSlot } from "@/lib/types";
import { repo } from "@/lib/repo";
import { getPrefs, parseMealIds, parseRequest } from "@/lib/prefs";
import {
  assignSlots,
  bestSubstitute,
  buildPlanFromIds,
  planWeek,
  requestedSlots,
} from "@/lib/matching-engine";
import { buildShoppingList } from "@/lib/shopping-list";
import { recipeMealCost } from "@/lib/pricing";
import { getPriceBook } from "@/lib/prices/price-book";
import { getCurrentUser } from "@/lib/supabase/server";
import { FilterBar } from "@/components/filter-bar";
import { PlanView, type PlanViewData } from "@/components/plan-view";

type SearchParams = Record<string, string | string[] | undefined>;

function planHref(budget: number, types: string[], meals: string[], seed?: number) {
  const params = new URLSearchParams();
  params.set("budget", String(budget));
  if (types.length) params.set("types", types.join(","));
  if (meals.length) params.set("meals", meals.join(","));
  if (seed) params.set("seed", String(seed));
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

  // Prix RÉELS (Open Prices) là où dispo, sinon repli catalogue. Résolu une fois.
  const priceBook = await getPriceBook([...ingredientsMap.values()], store);

  // Sélection : ids fournis (après swap) sinon plan hebdo budget-aware.
  const presetIds = parseMealIds(sp);
  const preset = presetIds.length ? buildPlanFromIds(presetIds, recipes) : [];
  let selected = preset;
  let withinBudget = true;
  if (preset.length === 0) {
    const plan = planWeek(recipes, prefs, request, ingredientsMap, store, priceBook.unit);
    selected = plan.recipes;
    withinBudget = plan.withinBudget;
  }
  const selectedIds = selected.map((r) => r.id);

  // Moments demandés (ordre matin -> soir, repli midi + soir) — étiquetage + sections.
  const selectedSlots: MealSlot[] = requestedSlots(prefs);
  // Répartition équilibrée des repas entre les moments (petit-déj / déjeuner / dîner).
  const slotByRecipe = assignSlots(selected, selectedSlots);

  const list = buildShoppingList(selected, ingredientsMap, prefs.householdSize, store, priceBook.unit);
  const substitute = bestSubstitute(
    recipes,
    prefs,
    request,
    ingredientsMap,
    store,
    selectedIds,
    priceBook.unit,
  );

  // "Régénérer" = nouvelle graine de variété (sélection différente, toujours <= budget).
  const nextSeed = (request.seed ?? 1) * 7 + 13;

  // Navigation : connecté -> dashboard compte ; invité -> accueil. Jamais bloqué.
  const user = await getCurrentUser();
  const home = user
    ? { href: "/compte", label: "Mon compte" }
    : { href: "/", label: "Accueil" };

  const viewData: PlanViewData = {
    store: { name: store.name, domain: store.domain, color: store.color },
    recipes: selected.map((recipe) => ({
      id: recipe.id,
      title: recipe.title,
      emoji: recipe.emoji,
      imageUrl: recipe.imageUrl,
      prepMinutes: recipe.prepMinutes,
      mealTypes: recipe.mealTypes,
      slot: slotByRecipe.get(recipe.id) ?? selectedSlots[0],
      mealCost: recipeMealCost(recipe, ingredientsMap, store, prefs.householdSize, priceBook.unit),
      swapHref: substitute
        ? planHref(
            request.budget,
            request.mealTypes,
            selectedIds.map((id) => (id === recipe.id ? substitute.id : id)),
          )
        : null,
    })),
    selectedIds,
    total: list.total,
    budget: request.budget,
    itemCount: list.itemCount,
    householdSize: prefs.householdSize,
    mealsPerWeek: prefs.mealsPerWeek,
    withinBudget,
    regenerateHref: planHref(request.budget, request.mealTypes, [], nextSeed),
    listHref: `/list?meals=${selectedIds.join(",")}`,
    homeHref: home.href,
    homeLabel: home.label,
    priceLive: priceBook.liveCount,
    priceStatus: priceBook.status,
    requestedSlots: selectedSlots,
  };

  return (
    <>
      <PlanView {...viewData} />
      {/* Ajuster les arbitrages de la semaine (budget + envies). */}
      {viewData.recipes.length > 0 && (
        <div className="mx-auto w-full max-w-md px-5 pb-28">
          <details className="group">
            <summary className="mb-3 inline-flex cursor-pointer items-center gap-1.5 text-sm font-semibold text-on-surface-muted [&::-webkit-details-marker]:hidden">
              Ajuster cette semaine
              <span className="transition-transform group-open:rotate-180">▾</span>
            </summary>
            <FilterBar initialBudget={request.budget} initialTypes={request.mealTypes} />
          </details>
        </div>
      )}
    </>
  );
}
