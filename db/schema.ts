import {
  integer,
  numeric,
  pgTable,
  primaryKey,
  text,
  uuid,
} from "drizzle-orm/pg-core";

/**
 * Schéma Postgres (cible de production, §2 & §4).
 *
 * Non utilisé au runtime du MVP (les données viennent du seed via lib/repo.ts),
 * mais c'est la source des migrations Drizzle : `drizzle-kit generate` puis
 * `drizzle-kit migrate`. Les dimensions de filtrage (diet_tags, meal_types,
 * req_capabilities) sont des tableaux Postgres à indexer en GIN pour exploiter
 * les opérateurs d'inclusion @> / <@ du Recipe Matching Engine.
 */

export const stores = pgTable("stores", {
  id: text("id").primaryKey(),
  country: text("country").notNull(), // FR | BE
  name: text("name").notNull(),
  domain: text("domain").notNull(), // logo (Clearbit)
  color: text("color").notNull(), // couleur de marque (repli monogramme)
  kind: text("kind").notNull(), // hyper | super | proxi | discount | bio | surgele
  priceFactor: numeric("price_factor").notNull().default("1"),
});

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").notNull().unique(),
  country: text("country").notNull().default("FR"),
  storeId: text("store_id").references(() => stores.id),
  dietTags: text("diet_tags").array().notNull().default([]),
  equipment: text("equipment").array().notNull().default([]),
  householdSize: integer("household_size").notNull().default(2),
  mealsPerWeek: integer("meals_per_week").notNull().default(5),
});

export const ingredients = pgTable("ingredients", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  aisle: text("aisle").notNull(),
  baseUnit: text("base_unit").notNull(),
  refPrice: numeric("ref_price").notNull(),
});

export const recipes = pgTable("recipes", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  emoji: text("emoji").notNull().default("🍽️"),
  // Tableaux Postgres -> index GIN -> opérateurs @> / <@ (voir migrations).
  mealTypes: text("meal_types").array().notNull().default([]),
  dietTags: text("diet_tags").array().notNull().default([]),
  reqCapabilities: text("req_capabilities").array().notNull().default([]),
  prepMinutes: integer("prep_minutes").notNull(),
  // Pas de prix stocké : calculé depuis recipe_ingredients × store_prices.
  defaultServings: integer("default_servings").notNull().default(2),
  // Nutrition ESTIMÉE par portion (proxy simple, §5) + visuel optionnel.
  kcal: integer("kcal").notNull().default(0),
  protein: numeric("protein").notNull().default("0"),
  carbs: numeric("carbs").notNull().default("0"),
  fat: numeric("fat").notNull().default("0"),
  imageUrl: text("image_url"),
});

export const recipeIngredients = pgTable(
  "recipe_ingredients",
  {
    recipeId: text("recipe_id")
      .notNull()
      .references(() => recipes.id, { onDelete: "cascade" }),
    ingredientId: text("ingredient_id")
      .notNull()
      .references(() => ingredients.id),
    qtyPerServing: numeric("qty_per_serving").notNull(),
    unit: text("unit").notNull(),
  },
  (t) => [primaryKey({ columns: [t.recipeId, t.ingredientId] })],
);

// Override de prix par magasin (optionnel) — profil de prix du §4.
export const storePrices = pgTable(
  "store_prices",
  {
    storeId: text("store_id")
      .notNull()
      .references(() => stores.id, { onDelete: "cascade" }),
    ingredientId: text("ingredient_id")
      .notNull()
      .references(() => ingredients.id, { onDelete: "cascade" }),
    price: numeric("price").notNull(),
  },
  (t) => [primaryKey({ columns: [t.storeId, t.ingredientId] })],
);
