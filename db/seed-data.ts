import type { Ingredient, Recipe, Store } from "@/lib/types";

// Catalogue éditorial seedé (§5 : pas de saisie utilisateur au MVP).
// En production ces tableaux sont remplacés par des requêtes Drizzle/Supabase
// — voir lib/repo.ts (point de bascule unique).

export const STORES: Store[] = [
  { id: "eco", name: "Éco Marché", emoji: "🛒", priceFactor: 0.9 },
  { id: "central", name: "Super Centre", emoji: "🏪", priceFactor: 1.0 },
  { id: "bio", name: "Bio Primeur", emoji: "🌿", priceFactor: 1.25 },
];

export const INGREDIENTS: Ingredient[] = [
  // Boucherie / Poissonnerie
  { id: "chicken", name: "Blanc de poulet", aisle: "boucherie", baseUnit: "g", refPrice: 0.012 },
  { id: "beef", name: "Bœuf haché", aisle: "boucherie", baseUnit: "g", refPrice: 0.011 },
  { id: "salmon", name: "Filet de saumon", aisle: "boucherie", baseUnit: "g", refPrice: 0.022 },
  // Crémerie
  { id: "eggs", name: "Œufs", aisle: "cremerie", baseUnit: "piece", refPrice: 0.3 },
  { id: "cheese", name: "Fromage râpé", aisle: "cremerie", baseUnit: "g", refPrice: 0.012 },
  { id: "cream", name: "Crème fraîche", aisle: "cremerie", baseUnit: "ml", refPrice: 0.005 },
  // Fruits & Légumes
  { id: "potato", name: "Pommes de terre", aisle: "fruits_legumes", baseUnit: "g", refPrice: 0.002 },
  { id: "sweet_potato", name: "Patate douce", aisle: "fruits_legumes", baseUnit: "g", refPrice: 0.0035 },
  { id: "broccoli", name: "Brocoli", aisle: "fruits_legumes", baseUnit: "g", refPrice: 0.004 },
  { id: "zucchini", name: "Courgette", aisle: "fruits_legumes", baseUnit: "g", refPrice: 0.003 },
  { id: "bell_pepper", name: "Poivron", aisle: "fruits_legumes", baseUnit: "piece", refPrice: 0.8 },
  { id: "onion", name: "Oignon", aisle: "fruits_legumes", baseUnit: "g", refPrice: 0.0015 },
  { id: "garlic", name: "Ail (gousse)", aisle: "fruits_legumes", baseUnit: "piece", refPrice: 0.25 },
  { id: "spinach", name: "Épinards frais", aisle: "fruits_legumes", baseUnit: "g", refPrice: 0.006 },
  { id: "carrot", name: "Carottes", aisle: "fruits_legumes", baseUnit: "g", refPrice: 0.0018 },
  { id: "mushroom", name: "Champignons", aisle: "fruits_legumes", baseUnit: "g", refPrice: 0.006 },
  { id: "lemon", name: "Citron", aisle: "fruits_legumes", baseUnit: "piece", refPrice: 0.4 },
  // Épicerie
  { id: "tofu", name: "Tofu nature", aisle: "epicerie", baseUnit: "g", refPrice: 0.008 },
  { id: "chickpeas", name: "Pois chiches", aisle: "epicerie", baseUnit: "g", refPrice: 0.004 },
  { id: "lentils", name: "Lentilles corail", aisle: "epicerie", baseUnit: "g", refPrice: 0.004 },
  { id: "rice", name: "Riz basmati", aisle: "epicerie", baseUnit: "g", refPrice: 0.003 },
  { id: "quinoa", name: "Quinoa", aisle: "epicerie", baseUnit: "g", refPrice: 0.007 },
  { id: "pasta", name: "Pâtes", aisle: "epicerie", baseUnit: "g", refPrice: 0.0025 },
  { id: "gf_pasta", name: "Pâtes sans gluten", aisle: "epicerie", baseUnit: "g", refPrice: 0.006 },
  { id: "tomato_canned", name: "Tomates concassées", aisle: "epicerie", baseUnit: "g", refPrice: 0.002 },
  { id: "coconut_milk", name: "Lait de coco", aisle: "epicerie", baseUnit: "ml", refPrice: 0.004 },
  { id: "olive_oil", name: "Huile d'olive", aisle: "epicerie", baseUnit: "ml", refPrice: 0.008 },
  { id: "soy_sauce", name: "Sauce soja", aisle: "epicerie", baseUnit: "ml", refPrice: 0.006 },
  { id: "curry_paste", name: "Pâte de curry", aisle: "epicerie", baseUnit: "g", refPrice: 0.02 },
  // Boulangerie
  { id: "wrap", name: "Galette wrap", aisle: "boulangerie", baseUnit: "piece", refPrice: 0.5 },
  // Surgelé
  { id: "frozen_veg", name: "Poêlée de légumes surgelés", aisle: "surgele", baseUnit: "g", refPrice: 0.003 },
];

export const RECIPES: Recipe[] = [
  {
    id: "r01",
    title: "Poulet rôti & légumes",
    emoji: "🍗",
    mealTypes: ["proteine", "sain"],
    dietTags: ["halal", "sans_gluten", "sans_lactose"],
    reqCapabilities: ["roast"], // Four OU Air Fryer
    prepMinutes: 30,
    costPerServing: 5.5,
    defaultServings: 2,
    ingredients: [
      { ingredientId: "chicken", qtyPerServing: 180, unit: "g" },
      { ingredientId: "potato", qtyPerServing: 200, unit: "g" },
      { ingredientId: "carrot", qtyPerServing: 100, unit: "g" },
      { ingredientId: "olive_oil", qtyPerServing: 10, unit: "ml" },
      { ingredientId: "garlic", qtyPerServing: 1, unit: "piece" },
    ],
  },
  {
    id: "r02",
    title: "Saumon vapeur express",
    emoji: "🐟",
    mealTypes: ["sain", "leger", "proteine"],
    dietTags: ["halal", "sans_gluten", "sans_lactose"],
    reqCapabilities: ["steam"], // Micro-ondes uniquement
    prepMinutes: 15,
    costPerServing: 6.5,
    defaultServings: 2,
    ingredients: [
      { ingredientId: "salmon", qtyPerServing: 150, unit: "g" },
      { ingredientId: "broccoli", qtyPerServing: 200, unit: "g" },
      { ingredientId: "lemon", qtyPerServing: 0.5, unit: "piece" },
      { ingredientId: "olive_oil", qtyPerServing: 5, unit: "ml" },
    ],
  },
  {
    id: "r03",
    title: "Curry de pois chiches",
    emoji: "🍛",
    mealTypes: ["sain", "leger"],
    dietTags: ["halal", "vege", "vegan", "sans_gluten", "sans_lactose"],
    reqCapabilities: ["simmer"], // Poêle uniquement
    prepMinutes: 25,
    costPerServing: 3.2,
    defaultServings: 2,
    ingredients: [
      { ingredientId: "chickpeas", qtyPerServing: 150, unit: "g" },
      { ingredientId: "coconut_milk", qtyPerServing: 100, unit: "ml" },
      { ingredientId: "tomato_canned", qtyPerServing: 100, unit: "g" },
      { ingredientId: "onion", qtyPerServing: 60, unit: "g" },
      { ingredientId: "curry_paste", qtyPerServing: 20, unit: "g" },
      { ingredientId: "rice", qtyPerServing: 80, unit: "g" },
    ],
  },
  {
    id: "r04",
    title: "Pâtes bolognaise",
    emoji: "🍝",
    mealTypes: ["proteine"],
    dietTags: ["halal", "sans_lactose"],
    reqCapabilities: ["simmer"], // Poêle uniquement
    prepMinutes: 30,
    costPerServing: 4.5,
    defaultServings: 2,
    ingredients: [
      { ingredientId: "pasta", qtyPerServing: 100, unit: "g" },
      { ingredientId: "beef", qtyPerServing: 120, unit: "g" },
      { ingredientId: "tomato_canned", qtyPerServing: 150, unit: "g" },
      { ingredientId: "onion", qtyPerServing: 50, unit: "g" },
      { ingredientId: "olive_oil", qtyPerServing: 10, unit: "ml" },
    ],
  },
  {
    id: "r05",
    title: "Buddha bowl quinoa",
    emoji: "🥗",
    mealTypes: ["sain", "leger"],
    dietTags: ["halal", "vege", "vegan", "sans_gluten", "sans_lactose"],
    reqCapabilities: ["heat"], // n'importe quel appareil
    prepMinutes: 20,
    costPerServing: 4.0,
    defaultServings: 2,
    ingredients: [
      { ingredientId: "quinoa", qtyPerServing: 80, unit: "g" },
      { ingredientId: "chickpeas", qtyPerServing: 80, unit: "g" },
      { ingredientId: "spinach", qtyPerServing: 50, unit: "g" },
      { ingredientId: "bell_pepper", qtyPerServing: 0.5, unit: "piece" },
      { ingredientId: "olive_oil", qtyPerServing: 10, unit: "ml" },
      { ingredientId: "lemon", qtyPerServing: 0.5, unit: "piece" },
    ],
  },
  {
    id: "r06",
    title: "Gratin de courgettes",
    emoji: "🧀",
    mealTypes: ["sain"],
    dietTags: ["halal", "vege", "sans_gluten"],
    reqCapabilities: ["gratin"], // Four uniquement
    prepMinutes: 40,
    costPerServing: 4.2,
    defaultServings: 2,
    ingredients: [
      { ingredientId: "zucchini", qtyPerServing: 250, unit: "g" },
      { ingredientId: "cheese", qtyPerServing: 60, unit: "g" },
      { ingredientId: "cream", qtyPerServing: 50, unit: "ml" },
      { ingredientId: "eggs", qtyPerServing: 1, unit: "piece" },
      { ingredientId: "garlic", qtyPerServing: 1, unit: "piece" },
    ],
  },
  {
    id: "r07",
    title: "Wrap poulet croustillant",
    emoji: "🌯",
    mealTypes: ["rapide", "proteine"],
    dietTags: ["halal", "sans_lactose"],
    reqCapabilities: ["fry"], // Air Fryer OU Poêle
    prepMinutes: 15,
    costPerServing: 4.8,
    defaultServings: 2,
    ingredients: [
      { ingredientId: "chicken", qtyPerServing: 120, unit: "g" },
      { ingredientId: "wrap", qtyPerServing: 1, unit: "piece" },
      { ingredientId: "bell_pepper", qtyPerServing: 0.5, unit: "piece" },
      { ingredientId: "onion", qtyPerServing: 40, unit: "g" },
      { ingredientId: "olive_oil", qtyPerServing: 5, unit: "ml" },
    ],
  },
  {
    id: "r08",
    title: "Omelette express",
    emoji: "🍳",
    mealTypes: ["rapide", "proteine", "leger"],
    dietTags: ["halal", "vege", "sans_gluten", "sans_lactose"],
    reqCapabilities: ["fry"], // Air Fryer OU Poêle
    prepMinutes: 10,
    costPerServing: 2.5,
    defaultServings: 2,
    ingredients: [
      { ingredientId: "eggs", qtyPerServing: 3, unit: "piece" },
      { ingredientId: "mushroom", qtyPerServing: 50, unit: "g" },
      { ingredientId: "spinach", qtyPerServing: 30, unit: "g" },
      { ingredientId: "olive_oil", qtyPerServing: 5, unit: "ml" },
    ],
  },
  {
    id: "r09",
    title: "Dahl de lentilles corail",
    emoji: "🍲",
    mealTypes: ["sain", "leger"],
    dietTags: ["halal", "vege", "vegan", "sans_gluten", "sans_lactose"],
    reqCapabilities: ["simmer"], // Poêle uniquement
    prepMinutes: 30,
    costPerServing: 2.8,
    defaultServings: 2,
    ingredients: [
      { ingredientId: "lentils", qtyPerServing: 100, unit: "g" },
      { ingredientId: "coconut_milk", qtyPerServing: 80, unit: "ml" },
      { ingredientId: "onion", qtyPerServing: 60, unit: "g" },
      { ingredientId: "tomato_canned", qtyPerServing: 100, unit: "g" },
      { ingredientId: "curry_paste", qtyPerServing: 15, unit: "g" },
      { ingredientId: "rice", qtyPerServing: 70, unit: "g" },
    ],
  },
  {
    id: "r10",
    title: "Patates douces rôties & tofu",
    emoji: "🍠",
    mealTypes: ["sain", "proteine"],
    dietTags: ["halal", "vege", "vegan", "sans_gluten", "sans_lactose"],
    reqCapabilities: ["roast"], // Four OU Air Fryer
    prepMinutes: 35,
    costPerServing: 3.6,
    defaultServings: 2,
    ingredients: [
      { ingredientId: "sweet_potato", qtyPerServing: 200, unit: "g" },
      { ingredientId: "tofu", qtyPerServing: 120, unit: "g" },
      { ingredientId: "broccoli", qtyPerServing: 100, unit: "g" },
      { ingredientId: "olive_oil", qtyPerServing: 10, unit: "ml" },
      { ingredientId: "soy_sauce", qtyPerServing: 10, unit: "ml" },
    ],
  },
  {
    id: "r11",
    title: "Steak haché & poêlée",
    emoji: "🥩",
    mealTypes: ["rapide", "proteine"],
    dietTags: ["halal", "sans_gluten", "sans_lactose"],
    reqCapabilities: ["sear"], // Poêle uniquement
    prepMinutes: 15,
    costPerServing: 5.2,
    defaultServings: 2,
    ingredients: [
      { ingredientId: "beef", qtyPerServing: 150, unit: "g" },
      { ingredientId: "frozen_veg", qtyPerServing: 200, unit: "g" },
      { ingredientId: "olive_oil", qtyPerServing: 5, unit: "ml" },
    ],
  },
  {
    id: "r12",
    title: "Riz sauté aux légumes",
    emoji: "🍚",
    mealTypes: ["rapide", "sain"],
    dietTags: ["halal", "vege", "vegan", "sans_gluten", "sans_lactose"],
    reqCapabilities: ["fry"], // Air Fryer OU Poêle
    prepMinutes: 18,
    costPerServing: 3.0,
    defaultServings: 2,
    ingredients: [
      { ingredientId: "rice", qtyPerServing: 90, unit: "g" },
      { ingredientId: "frozen_veg", qtyPerServing: 150, unit: "g" },
      { ingredientId: "soy_sauce", qtyPerServing: 15, unit: "ml" },
      { ingredientId: "garlic", qtyPerServing: 1, unit: "piece" },
      { ingredientId: "olive_oil", qtyPerServing: 8, unit: "ml" },
    ],
  },
  {
    id: "r13",
    title: "Saumon rôti & quinoa",
    emoji: "🐟",
    mealTypes: ["sain", "proteine"],
    dietTags: ["halal", "sans_gluten", "sans_lactose"],
    reqCapabilities: ["roast"], // Four OU Air Fryer
    prepMinutes: 28,
    costPerServing: 6.8,
    defaultServings: 2,
    ingredients: [
      { ingredientId: "salmon", qtyPerServing: 150, unit: "g" },
      { ingredientId: "quinoa", qtyPerServing: 80, unit: "g" },
      { ingredientId: "zucchini", qtyPerServing: 100, unit: "g" },
      { ingredientId: "lemon", qtyPerServing: 0.5, unit: "piece" },
      { ingredientId: "olive_oil", qtyPerServing: 8, unit: "ml" },
    ],
  },
  {
    id: "r14",
    title: "Pâtes sans gluten aux légumes",
    emoji: "🍝",
    mealTypes: ["sain", "leger"],
    dietTags: ["halal", "vege", "vegan", "sans_gluten", "sans_lactose"],
    reqCapabilities: ["simmer"], // Poêle uniquement
    prepMinutes: 22,
    costPerServing: 4.6,
    defaultServings: 2,
    ingredients: [
      { ingredientId: "gf_pasta", qtyPerServing: 100, unit: "g" },
      { ingredientId: "zucchini", qtyPerServing: 100, unit: "g" },
      { ingredientId: "tomato_canned", qtyPerServing: 120, unit: "g" },
      { ingredientId: "garlic", qtyPerServing: 1, unit: "piece" },
      { ingredientId: "olive_oil", qtyPerServing: 10, unit: "ml" },
    ],
  },
  {
    id: "r15",
    title: "Bowl poulet & riz (meal prep)",
    emoji: "🍗",
    mealTypes: ["proteine", "sain"],
    dietTags: ["halal", "sans_gluten", "sans_lactose"],
    reqCapabilities: ["roast"], // Four OU Air Fryer
    prepMinutes: 35,
    costPerServing: 5.0,
    defaultServings: 2,
    ingredients: [
      { ingredientId: "chicken", qtyPerServing: 160, unit: "g" },
      { ingredientId: "rice", qtyPerServing: 90, unit: "g" },
      { ingredientId: "broccoli", qtyPerServing: 120, unit: "g" },
      { ingredientId: "carrot", qtyPerServing: 80, unit: "g" },
      { ingredientId: "soy_sauce", qtyPerServing: 10, unit: "ml" },
    ],
  },
  {
    id: "r16",
    title: "Soupe de légumes maison",
    emoji: "🥣",
    mealTypes: ["leger", "sain"],
    dietTags: ["halal", "vege", "vegan", "sans_gluten", "sans_lactose"],
    reqCapabilities: ["simmer"], // Poêle uniquement
    prepMinutes: 30,
    costPerServing: 2.2,
    defaultServings: 2,
    ingredients: [
      { ingredientId: "carrot", qtyPerServing: 100, unit: "g" },
      { ingredientId: "potato", qtyPerServing: 120, unit: "g" },
      { ingredientId: "onion", qtyPerServing: 60, unit: "g" },
      { ingredientId: "zucchini", qtyPerServing: 80, unit: "g" },
      { ingredientId: "olive_oil", qtyPerServing: 8, unit: "ml" },
    ],
  },
];
