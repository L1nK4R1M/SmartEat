import { redirect } from "next/navigation";
import type { MealSlot } from "@/lib/types";
import { repo } from "@/lib/repo";
import { getPrefs, parseMealIds, parseRequest } from "@/lib/prefs";
import {
  buildPlanFromIds,
  planWeek,
  requestedSlots,
  slotSubstitutes,
  toDayGrid,
  type PlannedMeal,
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

  // Moments demandés (ordre matin -> soir, repli midi + soir).
  const selectedSlots: MealSlot[] = requestedSlots(prefs);

  // Grille JOUR × MOMENT : ids fournis (après swap) sinon plan hebdo budget-aware.
  const presetIds = parseMealIds(sp);
  let meals: PlannedMeal[];
  let withinBudget = true;
  let plannedDays = 0;
  if (presetIds.length) {
    meals = toDayGrid(buildPlanFromIds(presetIds, recipes), selectedSlots);
    plannedDays = new Set(meals.map((m) => m.day)).size;
  } else {
    const plan = planWeek(recipes, prefs, request, ingredientsMap, store, priceBook.unit);
    meals = plan.meals;
    withinBudget = plan.withinBudget;
    plannedDays = plan.plannedDays;
  }
  const selected = meals.map((m) => m.recipe);
  const selectedIds = selected.map((r) => r.id);

  const list = buildShoppingList(selected, ingredientsMap, prefs.householdSize, store, priceBook.unit);

  // Substituts par MOMENT : "Changer" remplace un repas par un autre du même
  // moment, absent de la semaine (position conservée -> même jour/moment).
  const subFor = slotSubstitutes(
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
    recipes: meals.map(({ recipe, slot, day }) => {
      const sub = subFor(slot);
      return {
        id: recipe.id,
        title: recipe.title,
        emoji: recipe.emoji,
        imageUrl: recipe.imageUrl,
        prepMinutes: recipe.prepMinutes,
        mealTypes: recipe.mealTypes,
        slot,
        day,
        mealCost: recipeMealCost(recipe, ingredientsMap, store, prefs.householdSize, priceBook.unit),
        swapHref: sub
          ? planHref(
              request.budget,
              request.mealTypes,
              selectedIds.map((id) => (id === recipe.id ? sub.id : id)),
            )
          : null,
      };
    }),
    selectedIds,
    total: list.total,
    budget: request.budget,
    itemCount: list.itemCount,
    householdSize: prefs.householdSize,
    plannedDays,
    withinBudget,
    regenerateHref: planHref(request.budget, request.mealTypes, [], nextSeed),
    listHref: `/list?meals=${selectedIds.join(",")}`,
    homeHref: home.href,
    homeLabel: home.label,
    priceLive: priceBook.liveCount,
    priceStatus: priceBook.status,
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
