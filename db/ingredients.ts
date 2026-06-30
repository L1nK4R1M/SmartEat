import type { Ingredient } from "@/lib/types";

// Conditionnements (packSize) + prix moyen du produit entier (packPrice, €).
// Prix calés sur des relevés marché FR/BE 2025-2026 (poulet ~10 €/kg, saumon
// ~29 €/kg, œufs ~2,45 €/6, riz ~3 €/kg, bœuf ~12 €/kg, huile ~8 €/L,
// pâtes ~1 €/500 g, pois chiches ~1 €/400 g, lait coco ~1,5 €/400 ml...).
// Le profil de prix du magasin (priceFactor) est appliqué au calcul (lib/pricing.ts).
export const INGREDIENTS: Ingredient[] = [
  // ---------- Boucherie / Poissonnerie ----------
  { id: "chicken", name: "Blanc de poulet", aisle: "boucherie", baseUnit: "g", packSize: 1000, packLabel: "1 kg", packPrice: 10.5 },
  { id: "chicken_thigh", name: "Cuisse de poulet", aisle: "boucherie", baseUnit: "g", packSize: 1000, packLabel: "1 kg", packPrice: 7.0 },
  { id: "beef", name: "Bœuf haché 5%", aisle: "boucherie", baseUnit: "g", packSize: 500, packLabel: "barquette 500 g", packPrice: 6.0 },
  { id: "beef_steak", name: "Steak de bœuf", aisle: "boucherie", baseUnit: "g", packSize: 300, packLabel: "≈300 g (2 pièces)", packPrice: 6.0 },
  { id: "turkey", name: "Escalope de dinde", aisle: "boucherie", baseUnit: "g", packSize: 400, packLabel: "400 g", packPrice: 6.0 },
  { id: "merguez", name: "Merguez", aisle: "boucherie", baseUnit: "g", packSize: 400, packLabel: "400 g", packPrice: 5.0 },
  { id: "ham", name: "Jambon de dinde", aisle: "boucherie", baseUnit: "g", packSize: 200, packLabel: "200 g (tranches)", packPrice: 2.5 },
  { id: "salmon", name: "Filet de saumon", aisle: "boucherie", baseUnit: "g", packSize: 260, packLabel: "≈260 g (2 pavés)", packPrice: 7.5 },
  { id: "cod", name: "Filet de cabillaud", aisle: "boucherie", baseUnit: "g", packSize: 300, packLabel: "≈300 g (2 filets)", packPrice: 6.0 },
  { id: "shrimp", name: "Crevettes", aisle: "boucherie", baseUnit: "g", packSize: 200, packLabel: "200 g", packPrice: 5.0 },
  { id: "tuna_canned", name: "Thon en boîte", aisle: "epicerie", baseUnit: "g", packSize: 140, packLabel: "boîte 140 g", packPrice: 1.6 },

  // ---------- Crémerie ----------
  { id: "eggs", name: "Œufs", aisle: "cremerie", baseUnit: "piece", packSize: 6, packLabel: "boîte de 6", packPrice: 2.45 },
  { id: "cheese", name: "Fromage râpé", aisle: "cremerie", baseUnit: "g", packSize: 200, packLabel: "sachet 200 g", packPrice: 2.4 },
  { id: "mozzarella", name: "Mozzarella", aisle: "cremerie", baseUnit: "g", packSize: 125, packLabel: "boule 125 g", packPrice: 1.2 },
  { id: "feta", name: "Feta", aisle: "cremerie", baseUnit: "g", packSize: 200, packLabel: "200 g", packPrice: 2.6 },
  { id: "parmesan", name: "Parmesan", aisle: "cremerie", baseUnit: "g", packSize: 100, packLabel: "100 g", packPrice: 2.8 },
  { id: "cream", name: "Crème fraîche", aisle: "cremerie", baseUnit: "ml", packSize: 200, packLabel: "pot 20 cl", packPrice: 1.2 },
  { id: "yogurt", name: "Yaourt grec", aisle: "cremerie", baseUnit: "g", packSize: 400, packLabel: "pot 400 g", packPrice: 2.0 },
  { id: "butter", name: "Beurre", aisle: "cremerie", baseUnit: "g", packSize: 250, packLabel: "plaquette 250 g", packPrice: 2.0 },
  { id: "milk", name: "Lait demi-écrémé", aisle: "cremerie", baseUnit: "ml", packSize: 1000, packLabel: "brique 1 L", packPrice: 1.1 },

  // ---------- Fruits & Légumes ----------
  { id: "potato", name: "Pommes de terre", aisle: "fruits_legumes", baseUnit: "g", packSize: 1000, packLabel: "filet 1 kg", packPrice: 2.0 },
  { id: "sweet_potato", name: "Patate douce", aisle: "fruits_legumes", baseUnit: "g", packSize: 1000, packLabel: "1 kg", packPrice: 3.5 },
  { id: "broccoli", name: "Brocoli", aisle: "fruits_legumes", baseUnit: "g", packSize: 500, packLabel: "1 pièce ≈500 g", packPrice: 2.0 },
  { id: "cauliflower", name: "Chou-fleur", aisle: "fruits_legumes", baseUnit: "g", packSize: 800, packLabel: "1 pièce", packPrice: 2.6 },
  { id: "zucchini", name: "Courgette", aisle: "fruits_legumes", baseUnit: "g", packSize: 500, packLabel: "≈2 pièces", packPrice: 1.8 },
  { id: "eggplant", name: "Aubergine", aisle: "fruits_legumes", baseUnit: "g", packSize: 500, packLabel: "≈2 pièces", packPrice: 2.0 },
  { id: "bell_pepper", name: "Poivron", aisle: "fruits_legumes", baseUnit: "piece", packSize: 3, packLabel: "barquette x3", packPrice: 2.1 },
  { id: "onion", name: "Oignon", aisle: "fruits_legumes", baseUnit: "g", packSize: 1000, packLabel: "filet 1 kg", packPrice: 1.5 },
  { id: "garlic", name: "Ail", aisle: "fruits_legumes", baseUnit: "piece", packSize: 12, packLabel: "1 tête (≈12 gousses)", packPrice: 0.6 },
  { id: "ginger", name: "Gingembre", aisle: "fruits_legumes", baseUnit: "g", packSize: 100, packLabel: "morceau ≈100 g", packPrice: 1.2 },
  { id: "spinach", name: "Épinards frais", aisle: "fruits_legumes", baseUnit: "g", packSize: 200, packLabel: "sachet 200 g", packPrice: 1.8 },
  { id: "carrot", name: "Carottes", aisle: "fruits_legumes", baseUnit: "g", packSize: 1000, packLabel: "1 kg", packPrice: 1.5 },
  { id: "mushroom", name: "Champignons", aisle: "fruits_legumes", baseUnit: "g", packSize: 250, packLabel: "barquette 250 g", packPrice: 1.8 },
  { id: "tomato", name: "Tomates", aisle: "fruits_legumes", baseUnit: "g", packSize: 500, packLabel: "≈500 g", packPrice: 2.0 },
  { id: "cherry_tomato", name: "Tomates cerises", aisle: "fruits_legumes", baseUnit: "g", packSize: 250, packLabel: "barquette 250 g", packPrice: 2.0 },
  { id: "cucumber", name: "Concombre", aisle: "fruits_legumes", baseUnit: "piece", packSize: 1, packLabel: "1 pièce", packPrice: 0.9 },
  { id: "salad", name: "Salade verte", aisle: "fruits_legumes", baseUnit: "piece", packSize: 1, packLabel: "1 pièce", packPrice: 0.9 },
  { id: "avocado", name: "Avocat", aisle: "fruits_legumes", baseUnit: "piece", packSize: 2, packLabel: "filet x2", packPrice: 1.8 },
  { id: "lemon", name: "Citron", aisle: "fruits_legumes", baseUnit: "piece", packSize: 4, packLabel: "filet x4", packPrice: 1.4 },
  { id: "green_beans", name: "Haricots verts", aisle: "fruits_legumes", baseUnit: "g", packSize: 400, packLabel: "400 g", packPrice: 2.4 },
  { id: "banana", name: "Bananes", aisle: "fruits_legumes", baseUnit: "piece", packSize: 6, packLabel: "régime ≈6", packPrice: 1.5 },

  // ---------- Épicerie ----------
  { id: "tofu", name: "Tofu nature", aisle: "epicerie", baseUnit: "g", packSize: 200, packLabel: "bloc 200 g", packPrice: 1.8 },
  { id: "chickpeas", name: "Pois chiches", aisle: "epicerie", baseUnit: "g", packSize: 400, packLabel: "boîte 400 g", packPrice: 1.0 },
  { id: "red_beans", name: "Haricots rouges", aisle: "epicerie", baseUnit: "g", packSize: 400, packLabel: "boîte 400 g", packPrice: 1.0 },
  { id: "lentils", name: "Lentilles corail", aisle: "epicerie", baseUnit: "g", packSize: 500, packLabel: "500 g", packPrice: 2.5 },
  { id: "rice", name: "Riz basmati", aisle: "epicerie", baseUnit: "g", packSize: 1000, packLabel: "1 kg", packPrice: 3.0 },
  { id: "quinoa", name: "Quinoa", aisle: "epicerie", baseUnit: "g", packSize: 500, packLabel: "500 g", packPrice: 4.0 },
  { id: "bulgur", name: "Boulgour", aisle: "epicerie", baseUnit: "g", packSize: 500, packLabel: "500 g", packPrice: 2.0 },
  { id: "couscous", name: "Semoule de couscous", aisle: "epicerie", baseUnit: "g", packSize: 1000, packLabel: "1 kg", packPrice: 2.5 },
  { id: "pasta", name: "Pâtes", aisle: "epicerie", baseUnit: "g", packSize: 500, packLabel: "500 g", packPrice: 1.0 },
  { id: "gf_pasta", name: "Pâtes sans gluten", aisle: "epicerie", baseUnit: "g", packSize: 500, packLabel: "500 g", packPrice: 3.0 },
  { id: "noodles", name: "Nouilles", aisle: "epicerie", baseUnit: "g", packSize: 250, packLabel: "250 g", packPrice: 1.5 },
  { id: "oats", name: "Flocons d'avoine", aisle: "epicerie", baseUnit: "g", packSize: 500, packLabel: "500 g", packPrice: 1.5 },
  { id: "tomato_canned", name: "Tomates concassées", aisle: "epicerie", baseUnit: "g", packSize: 400, packLabel: "boîte 400 g", packPrice: 1.0 },
  { id: "coconut_milk", name: "Lait de coco", aisle: "epicerie", baseUnit: "ml", packSize: 400, packLabel: "boîte 400 ml", packPrice: 1.5 },
  { id: "olive_oil", name: "Huile d'olive", aisle: "epicerie", baseUnit: "ml", packSize: 1000, packLabel: "1 L", packPrice: 8.0 },
  { id: "soy_sauce", name: "Sauce soja", aisle: "epicerie", baseUnit: "ml", packSize: 250, packLabel: "250 ml", packPrice: 2.5 },
  { id: "curry_paste", name: "Pâte de curry", aisle: "epicerie", baseUnit: "g", packSize: 200, packLabel: "pot 200 g", packPrice: 4.0 },
  { id: "pesto", name: "Pesto", aisle: "epicerie", baseUnit: "g", packSize: 190, packLabel: "pot 190 g", packPrice: 2.5 },
  { id: "peanut_butter", name: "Beurre de cacahuète", aisle: "epicerie", baseUnit: "g", packSize: 350, packLabel: "pot 350 g", packPrice: 3.0 },
  { id: "honey", name: "Miel", aisle: "epicerie", baseUnit: "g", packSize: 250, packLabel: "pot 250 g", packPrice: 4.0 },

  // ---------- Boulangerie ----------
  { id: "bread", name: "Pain", aisle: "boulangerie", baseUnit: "piece", packSize: 1, packLabel: "1 pain", packPrice: 0.6 },
  { id: "wrap", name: "Galette / wrap", aisle: "boulangerie", baseUnit: "piece", packSize: 6, packLabel: "paquet de 6", packPrice: 2.0 },

  // ---------- Surgelé ----------
  { id: "frozen_veg", name: "Poêlée de légumes surgelés", aisle: "surgele", baseUnit: "g", packSize: 750, packLabel: "sachet 750 g", packPrice: 2.5 },
  { id: "peas", name: "Petits pois surgelés", aisle: "surgele", baseUnit: "g", packSize: 1000, packLabel: "sachet 1 kg", packPrice: 2.0 },
  { id: "berries", name: "Fruits rouges surgelés", aisle: "surgele", baseUnit: "g", packSize: 450, packLabel: "sachet 450 g", packPrice: 3.5 },
];
