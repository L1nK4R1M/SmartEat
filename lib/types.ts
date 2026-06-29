// Modèle de domaine — reflète le schéma du cahier des charges (§2 Logic Engine).
// Les types restent identiques que les données viennent du seed ou de Postgres.

export type Appliance = "four" | "airfryer" | "micro" | "poele";

export type Capability =
  | "roast"
  | "bake"
  | "gratin"
  | "fry"
  | "sear"
  | "simmer"
  | "heat"
  | "reheat"
  | "steam";

export type MealType = "rapide" | "sain" | "leger" | "proteine";

export type DietTag = "halal" | "vege" | "vegan" | "sans_gluten" | "sans_lactose";

export type Unit = "g" | "ml" | "piece";

export type Aisle =
  | "fruits_legumes"
  | "boucherie"
  | "cremerie"
  | "epicerie"
  | "surgele"
  | "boulangerie";

export interface Ingredient {
  id: string;
  name: string;
  aisle: Aisle;
  baseUnit: Unit;
  refPrice: number; // € par baseUnit
}

export interface RecipeIngredient {
  ingredientId: string;
  qtyPerServing: number; // exprimé dans l'unité de base de l'ingrédient
  unit: Unit;
}

export interface Recipe {
  id: string;
  title: string;
  emoji: string;
  mealTypes: MealType[];
  dietTags: DietTag[];
  reqCapabilities: Capability[]; // moteur ensembliste : <= capacités utilisateur
  prepMinutes: number;
  costPerServing: number; // €
  defaultServings: number;
  ingredients: RecipeIngredient[];
}

export interface Store {
  id: string;
  name: string;
  emoji: string;
  priceFactor: number; // multiplie les prix de référence (profil de prix, §4)
}

// Préférences durables capturées une seule fois à l'onboarding (§1).
export interface UserPrefs {
  storeId: string;
  dietTags: DietTag[];
  equipment: Appliance[];
  householdSize: number;
  mealsPerWeek: number;
}

// Arbitrages ponctuels demandés à chaque génération (§1).
export interface GenerationRequest {
  budget: number; // € total pour la semaine
  mealTypes: MealType[]; // envies de la semaine (vide = peu importe)
}
