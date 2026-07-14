import { getPrefs } from "@/lib/prefs";
import { repo } from "@/lib/repo";
import { recipeCostPerServing } from "@/lib/pricing";
import { buildPrefsSummary } from "@/lib/summary";
import { Landing, type ShowcaseRecipe } from "@/components/landing";

export default async function Home() {
  const [prefs, recipes, ingredientsMap, stores] = await Promise.all([
    getPrefs(),
    repo.getRecipes(),
    repo.getIngredientsMap(),
    repo.getStores(),
  ]);
  const store = stores.find((s) => s.id === "fr_carrefour") ?? stores[0];

  // Récap des choix pour un utilisateur qui revient (invité ou connecté).
  const userStore = prefs ? stores.find((s) => s.id === prefs.storeId) : undefined;
  const summary = prefs ? buildPrefsSummary(prefs, userStore) : null;

  // Vitrine : un large aperçu du catalogue pour la landing (coût/pers pré-calculé).
  // Le catalogue complet, avec photo pour chaque recette, reste consultable sur /recettes.
  const showcase: ShowcaseRecipe[] = [
    "r01", "r03", "r13", "r24", "r19", "r10",
    "b05", "b12", "r30", "r45", "p01", "r08",
  ]
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

  return (
    <Landing
      hasPrefs={!!prefs}
      showcase={showcase}
      summary={summary}
      recipeCount={recipes.length}
      storeCount={stores.length}
    />
  );
}
