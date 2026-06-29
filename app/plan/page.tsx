import Link from "next/link";
import { redirect } from "next/navigation";
import { ShoppingCart } from "lucide-react";
import { repo } from "@/lib/repo";
import { getPrefs, parseMealIds, parseRequest } from "@/lib/prefs";
import { bestSubstitute, selectMeals } from "@/lib/matching-engine";
import { APPLIANCE_LABELS } from "@/lib/labels";
import { FilterBar } from "@/components/filter-bar";
import { RecipeCard } from "@/components/recipe-card";
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
  const recipes = await repo.getRecipes();

  // Sélection : ids fournis (après un swap) sinon warm start (top N).
  const presetIds = parseMealIds(sp);
  const preset = presetIds.length ? await repo.getRecipesByIds(presetIds) : [];
  const selected =
    preset.length > 0 ? preset : selectMeals(recipes, prefs, request, prefs.mealsPerWeek);
  const selectedIds = selected.map((r) => r.id);

  // Un seul substitut (prochain meilleur hors sélection) sert tous les boutons de swap.
  const substitute = bestSubstitute(recipes, prefs, request, selectedIds);

  const estTotal = selected.reduce(
    (sum, r) => sum + r.costPerServing * prefs.householdSize,
    0,
  );
  const overBudget = estTotal > request.budget;
  const listHref = `/list?meals=${selectedIds.join(",")}`;

  return (
    <div className="mx-auto w-full max-w-md px-5 pb-28 pt-6">
      <header className="mb-5">
        <h1 className="text-2xl font-semibold tracking-tight">Vos repas de la semaine</h1>
        <p className="mt-1 text-sm text-on-surface-muted">
          Adaptés à votre équipement :{" "}
          {prefs.equipment.map((e) => APPLIANCE_LABELS[e].label).join(", ")}
        </p>
      </header>

      <FilterBar initialBudget={request.budget} initialTypes={request.mealTypes} />

      <div className="mt-5 space-y-3">
        {selected.length === 0 ? (
          <div className="rounded-[var(--radius-card)] border border-dashed border-outline bg-surface p-6 text-center">
            <p className="font-medium">Aucune recette ne correspond.</p>
            <p className="mt-1 text-sm text-on-surface-muted">
              Augmentez le budget ou retirez un filtre de type pour élargir les possibilités.
            </p>
          </div>
        ) : (
          selected.map((recipe) => (
            <RecipeCard
              key={recipe.id}
              recipe={recipe}
              servings={prefs.householdSize}
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
          Total estimé :{" "}
          <span className={`tnum font-semibold ${overBudget ? "text-accent" : "text-on-surface"}`}>
            {formatEuro(estTotal)}
          </span>{" "}
          / {formatEuro(request.budget)}
        </p>
      )}

      {/* CTA sticky en thumb-zone — le 3e clic : générer la liste */}
      {selected.length > 0 && (
        <div className="fixed inset-x-0 bottom-0">
          <div className="mx-auto max-w-md border-t border-outline bg-background/80 p-5 backdrop-blur">
            <Link href={listHref} className={`${buttonClasses("primary", "lg")} w-full`}>
              <ShoppingCart size={18} /> Générer la liste de courses
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
