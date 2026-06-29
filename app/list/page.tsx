import Link from "next/link";
import { redirect } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { repo } from "@/lib/repo";
import { getPrefs, parseMealIds } from "@/lib/prefs";
import { buildShoppingList } from "@/lib/shopping-list";
import { CopyListButton } from "@/components/copy-list-button";
import { BrandLogo } from "@/components/brand-logo";
import { formatEuro, formatQty } from "@/lib/utils";

type SearchParams = Record<string, string | string[] | undefined>;

export default async function ListPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const prefs = await getPrefs();
  if (!prefs) redirect("/onboarding");

  const sp = await searchParams;
  const ids = parseMealIds(sp);
  if (!ids.length) redirect("/plan");

  const [recipes, ingredientsMap, stores] = await Promise.all([
    repo.getRecipesByIds(ids),
    repo.getIngredientsMap(),
    repo.getStores(),
  ]);
  const store = stores.find((s) => s.id === prefs.storeId) ?? stores[0];

  const list = buildShoppingList(recipes, ingredientsMap, prefs.householdSize, store);

  // Export texte : on indique les produits ENTIERS à acheter (paquets).
  const plainText = [
    `SmartEat — Liste de courses (${store.name})`,
    "",
    ...list.sections.flatMap((section) => [
      `${section.label}`,
      ...section.lines.map(
        (l) =>
          `- ${l.ingredient.name} : ${l.packs} × ${l.ingredient.packLabel}` +
          ` (besoin ${formatQty(l.neededQty, l.ingredient.baseUnit)})`,
      ),
      "",
    ]),
    `Total estimé : ${formatEuro(list.total)}`,
  ].join("\n");

  return (
    <div className="mx-auto w-full max-w-md px-5 pb-40 pt-6">
      <header className="mb-5">
        <Link
          href={`/plan?meals=${ids.join(",")}`}
          className="mb-3 inline-flex items-center gap-1 text-sm text-on-surface-muted hover:text-on-surface"
        >
          <ChevronLeft size={16} /> Modifier les repas
        </Link>
        <div className="flex items-center gap-3">
          <BrandLogo domain={store.domain} name={store.name} color={store.color} size={44} />
          <div className="min-w-0">
            <h1 className="text-2xl font-semibold tracking-tight">Liste de courses</h1>
            <p className="mt-0.5 text-sm text-on-surface-muted">
              {recipes.length} repas · {list.itemCount} produits · {store.name}
            </p>
          </div>
        </div>
      </header>

      {/* Liste de courses (produits entiers) */}
      <div className="space-y-5">
        {list.sections.map((section) => (
          <section key={section.aisle}>
            <div className="mb-2 flex items-baseline justify-between">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-on-surface-muted">
                {section.label}
              </h2>
              <span className="tnum text-xs text-on-surface-muted">
                {formatEuro(section.subtotal)}
              </span>
            </div>
            <ul className="overflow-hidden rounded-[var(--radius-card)] border border-outline bg-surface">
              {section.lines.map((line) => (
                <li
                  key={line.ingredient.id}
                  className="flex items-center justify-between gap-3 border-b border-outline px-4 py-3 last:border-b-0"
                >
                  <div className="min-w-0">
                    <span className="block truncate font-medium">{line.ingredient.name}</span>
                    <span className="block text-xs text-on-surface-muted">
                      besoin {formatQty(line.neededQty, line.ingredient.baseUnit)}
                    </span>
                  </div>
                  <div className="shrink-0 text-right">
                    <span className="block text-sm font-medium">
                      {line.packs} × {line.ingredient.packLabel}
                    </span>
                    <span className="tnum block text-xs text-on-surface-muted">
                      {formatEuro(line.cost)}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>

      {/* Recettes de la semaine avec toutes les étapes */}
      <section className="mt-8">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-on-surface-muted">
          Recettes de la semaine
        </h2>
        <div className="space-y-2.5">
          {recipes.map((recipe) => (
            <details
              key={recipe.id}
              className="overflow-hidden rounded-[var(--radius-card)] border border-outline bg-surface"
            >
              <summary className="flex cursor-pointer items-center gap-3 p-4 [&::-webkit-details-marker]:hidden">
                <span className="text-2xl" aria-hidden>
                  {recipe.emoji}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate font-medium">{recipe.title}</span>
                  <span className="block text-xs text-on-surface-muted">
                    {recipe.prepMinutes} min · {recipe.steps.length} étapes
                  </span>
                </span>
                <ChevronRight size={18} className="shrink-0 text-on-surface-muted" />
              </summary>
              <div className="border-t border-outline px-4 pb-4 pt-3">
                <ol className="space-y-2.5">
                  {recipe.steps.map((step, i) => (
                    <li key={i} className="flex gap-3">
                      <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-primary/12 text-xs font-semibold text-primary">
                        {i + 1}
                      </span>
                      <p className="pt-0.5 text-sm">{step}</p>
                    </li>
                  ))}
                </ol>
                <Link
                  href={`/recipe/${recipe.id}`}
                  className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-primary"
                >
                  Voir la recette complète <ChevronRight size={14} />
                </Link>
              </div>
            </details>
          ))}
        </div>
      </section>

      {/* Total + export, sticky en thumb-zone */}
      <div className="fixed inset-x-0 bottom-0">
        <div className="mx-auto max-w-md border-t border-outline bg-background/80 p-5 backdrop-blur">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-on-surface-muted">Total estimé · produits entiers</span>
            <span className="tnum text-xl font-bold">{formatEuro(list.total)}</span>
          </div>
          <CopyListButton text={plainText} />
        </div>
      </div>
    </div>
  );
}
