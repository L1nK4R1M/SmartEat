import Link from "next/link";
import { redirect } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { repo } from "@/lib/repo";
import { getPrefs, parseMealIds } from "@/lib/prefs";
import { buildShoppingList } from "@/lib/shopping-list";
import { CopyListButton } from "@/components/copy-list-button";
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

  // Version texte brut pour l'export (copier / partager).
  const plainText = [
    `SmartEat — Liste de courses (${store.name})`,
    "",
    ...list.sections.flatMap((section) => [
      `${section.label}`,
      ...section.lines.map((l) => `- ${l.ingredient.name} : ${formatQty(l.qty, l.unit)}`),
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
        <h1 className="text-2xl font-semibold tracking-tight">Liste de courses</h1>
        <p className="mt-1 text-sm text-on-surface-muted">
          {recipes.length} repas · {list.itemCount} articles · {store.emoji} {store.name}
        </p>
      </header>

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
                  className="flex items-center justify-between border-b border-outline px-4 py-3 last:border-b-0"
                >
                  <span className="font-medium">{line.ingredient.name}</span>
                  <span className="tnum text-sm text-on-surface-muted">
                    {formatQty(line.qty, line.unit)}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>

      {/* Total + export, sticky en thumb-zone */}
      <div className="fixed inset-x-0 bottom-0">
        <div className="mx-auto max-w-md border-t border-outline bg-background/80 p-5 backdrop-blur">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-on-surface-muted">Total estimé</span>
            <span className="tnum text-xl font-bold">{formatEuro(list.total)}</span>
          </div>
          <CopyListButton text={plainText} />
        </div>
      </div>
    </div>
  );
}
