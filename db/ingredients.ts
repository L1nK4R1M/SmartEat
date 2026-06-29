import type { Ingredient } from "@/lib/types";

// Prix de référence (refPrice) par unité de base, en €. Le profil de prix du
// magasin (priceFactor) est appliqué au moment du calcul (lib/pricing.ts).
export const INGREDIENTS: Ingredient[] = [
  // ---------- Boucherie / Poissonnerie ----------
  { id: "chicken", name: "Blanc de poulet", aisle: "boucherie", baseUnit: "g", refPrice: 0.012 },
  { id: "chicken_thigh", name: "Cuisse de poulet", aisle: "boucherie", baseUnit: "g", refPrice: 0.009 },
  { id: "beef", name: "Bœuf haché", aisle: "boucherie", baseUnit: "g", refPrice: 0.011 },
  { id: "beef_steak", name: "Steak de bœuf", aisle: "boucherie", baseUnit: "g", refPrice: 0.02 },
  { id: "turkey", name: "Escalope de dinde", aisle: "boucherie", baseUnit: "g", refPrice: 0.013 },
  { id: "merguez", name: "Merguez", aisle: "boucherie", baseUnit: "g", refPrice: 0.013 },
  { id: "ham", name: "Jambon de dinde", aisle: "boucherie", baseUnit: "g", refPrice: 0.012 },
  { id: "salmon", name: "Filet de saumon", aisle: "boucherie", baseUnit: "g", refPrice: 0.022 },
  { id: "cod", name: "Filet de cabillaud", aisle: "boucherie", baseUnit: "g", refPrice: 0.02 },
  { id: "shrimp", name: "Crevettes", aisle: "boucherie", baseUnit: "g", refPrice: 0.025 },
  { id: "tuna_canned", name: "Thon en boîte", aisle: "epicerie", baseUnit: "g", refPrice: 0.009 },

  // ---------- Crémerie ----------
  { id: "eggs", name: "Œufs", aisle: "cremerie", baseUnit: "piece", refPrice: 0.3 },
  { id: "cheese", name: "Fromage râpé", aisle: "cremerie", baseUnit: "g", refPrice: 0.012 },
  { id: "mozzarella", name: "Mozzarella", aisle: "cremerie", baseUnit: "g", refPrice: 0.011 },
  { id: "feta", name: "Feta", aisle: "cremerie", baseUnit: "g", refPrice: 0.013 },
  { id: "parmesan", name: "Parmesan", aisle: "cremerie", baseUnit: "g", refPrice: 0.025 },
  { id: "cream", name: "Crème fraîche", aisle: "cremerie", baseUnit: "ml", refPrice: 0.005 },
  { id: "yogurt", name: "Yaourt grec", aisle: "cremerie", baseUnit: "g", refPrice: 0.005 },
  { id: "butter", name: "Beurre", aisle: "cremerie", baseUnit: "g", refPrice: 0.008 },

  // ---------- Fruits & Légumes ----------
  { id: "potato", name: "Pommes de terre", aisle: "fruits_legumes", baseUnit: "g", refPrice: 0.002 },
  { id: "sweet_potato", name: "Patate douce", aisle: "fruits_legumes", baseUnit: "g", refPrice: 0.0035 },
  { id: "broccoli", name: "Brocoli", aisle: "fruits_legumes", baseUnit: "g", refPrice: 0.004 },
  { id: "cauliflower", name: "Chou-fleur", aisle: "fruits_legumes", baseUnit: "g", refPrice: 0.0035 },
  { id: "zucchini", name: "Courgette", aisle: "fruits_legumes", baseUnit: "g", refPrice: 0.003 },
  { id: "eggplant", name: "Aubergine", aisle: "fruits_legumes", baseUnit: "g", refPrice: 0.0035 },
  { id: "bell_pepper", name: "Poivron", aisle: "fruits_legumes", baseUnit: "piece", refPrice: 0.8 },
  { id: "onion", name: "Oignon", aisle: "fruits_legumes", baseUnit: "g", refPrice: 0.0015 },
  { id: "garlic", name: "Ail (gousse)", aisle: "fruits_legumes", baseUnit: "piece", refPrice: 0.25 },
  { id: "ginger", name: "Gingembre", aisle: "fruits_legumes", baseUnit: "g", refPrice: 0.012 },
  { id: "spinach", name: "Épinards frais", aisle: "fruits_legumes", baseUnit: "g", refPrice: 0.006 },
  { id: "carrot", name: "Carottes", aisle: "fruits_legumes", baseUnit: "g", refPrice: 0.0018 },
  { id: "mushroom", name: "Champignons", aisle: "fruits_legumes", baseUnit: "g", refPrice: 0.006 },
  { id: "tomato", name: "Tomates", aisle: "fruits_legumes", baseUnit: "g", refPrice: 0.003 },
  { id: "cherry_tomato", name: "Tomates cerises", aisle: "fruits_legumes", baseUnit: "g", refPrice: 0.006 },
  { id: "cucumber", name: "Concombre", aisle: "fruits_legumes", baseUnit: "piece", refPrice: 0.7 },
  { id: "salad", name: "Salade verte", aisle: "fruits_legumes", baseUnit: "piece", refPrice: 0.9 },
  { id: "avocado", name: "Avocat", aisle: "fruits_legumes", baseUnit: "piece", refPrice: 0.9 },
  { id: "lemon", name: "Citron", aisle: "fruits_legumes", baseUnit: "piece", refPrice: 0.4 },
  { id: "green_beans", name: "Haricots verts", aisle: "fruits_legumes", baseUnit: "g", refPrice: 0.005 },

  // ---------- Épicerie ----------
  { id: "tofu", name: "Tofu nature", aisle: "epicerie", baseUnit: "g", refPrice: 0.008 },
  { id: "chickpeas", name: "Pois chiches", aisle: "epicerie", baseUnit: "g", refPrice: 0.004 },
  { id: "red_beans", name: "Haricots rouges", aisle: "epicerie", baseUnit: "g", refPrice: 0.004 },
  { id: "lentils", name: "Lentilles corail", aisle: "epicerie", baseUnit: "g", refPrice: 0.004 },
  { id: "rice", name: "Riz basmati", aisle: "epicerie", baseUnit: "g", refPrice: 0.003 },
  { id: "quinoa", name: "Quinoa", aisle: "epicerie", baseUnit: "g", refPrice: 0.007 },
  { id: "bulgur", name: "Boulgour", aisle: "epicerie", baseUnit: "g", refPrice: 0.004 },
  { id: "couscous", name: "Semoule de couscous", aisle: "epicerie", baseUnit: "g", refPrice: 0.003 },
  { id: "pasta", name: "Pâtes", aisle: "epicerie", baseUnit: "g", refPrice: 0.0025 },
  { id: "gf_pasta", name: "Pâtes sans gluten", aisle: "epicerie", baseUnit: "g", refPrice: 0.006 },
  { id: "noodles", name: "Nouilles", aisle: "epicerie", baseUnit: "g", refPrice: 0.004 },
  { id: "oats", name: "Flocons d'avoine", aisle: "epicerie", baseUnit: "g", refPrice: 0.003 },
  { id: "tomato_canned", name: "Tomates concassées", aisle: "epicerie", baseUnit: "g", refPrice: 0.002 },
  { id: "coconut_milk", name: "Lait de coco", aisle: "epicerie", baseUnit: "ml", refPrice: 0.004 },
  { id: "olive_oil", name: "Huile d'olive", aisle: "epicerie", baseUnit: "ml", refPrice: 0.008 },
  { id: "soy_sauce", name: "Sauce soja", aisle: "epicerie", baseUnit: "ml", refPrice: 0.006 },
  { id: "curry_paste", name: "Pâte de curry", aisle: "epicerie", baseUnit: "g", refPrice: 0.02 },
  { id: "pesto", name: "Pesto", aisle: "epicerie", baseUnit: "g", refPrice: 0.015 },
  { id: "peanut_butter", name: "Beurre de cacahuète", aisle: "epicerie", baseUnit: "g", refPrice: 0.01 },

  // ---------- Boulangerie ----------
  { id: "bread", name: "Pain", aisle: "boulangerie", baseUnit: "piece", refPrice: 0.5 },
  { id: "wrap", name: "Galette / wrap", aisle: "boulangerie", baseUnit: "piece", refPrice: 0.4 },

  // ---------- Surgelé ----------
  { id: "frozen_veg", name: "Poêlée de légumes surgelés", aisle: "surgele", baseUnit: "g", refPrice: 0.003 },
  { id: "peas", name: "Petits pois surgelés", aisle: "surgele", baseUnit: "g", refPrice: 0.003 },
];
