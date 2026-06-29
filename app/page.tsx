import { getPrefs } from "@/lib/prefs";
import { repo } from "@/lib/repo";
import { recipeCostPerServing } from "@/lib/pricing";
import { Landing, type ShowcaseRecipe } from "@/components/landing";

export default async function Home() {
  const [prefs, recipes, ingredientsMap, stores] = await Promise.all([
    getPrefs(),
    repo.getRecipes(),
    repo.getIngredientsMap(),
    repo.getStores(),
  ]);
  const store = stores.find((s) => s.id === "fr_carrefour") ?? stores[0];

  // Vitrine : quelques recettes variées pour la landing (coût/pers pré-calculé).
  const showcase: ShowcaseRecipe[] = ["r01", "r03", "r13", "r24", "r19", "r10"]
    .map((id) => recipes.find((r) => r.id === id))
    .filter((r): r is NonNullable<typeof r> => Boolean(r))
    .map((r) => ({
      id: r.id,
      title: r.title,
      emoji: r.emoji,
      imageUrl: r.imageUrl,
      prepMinutes: r.prepMinutes,
      mealType: r.mealTypes[0],
      costPerServing: recipeCostPerServing(r, ingredientsMap, store),
    }));

  return <Landing hasPrefs={!!prefs} showcase={showcase} />;
}
