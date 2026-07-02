# SmartEat — Design System

> **SmartEat** — application web **« Smart Shopping & Meal Planning »**.
> Promesse : supprimer la charge mentale de « qu'est-ce qu'on mange + qu'est-ce
> qu'on achète ». On choisit **moins**, pas plus : l'app décide, l'utilisateur
> valide ou remplace. Contrainte structurante : **≤ 3 clics** entre l'ouverture
> de l'app et la liste de courses générée.

Ce dépôt est le **design system** de SmartEat : tokens (couleurs, typo,
espacement), primitives React, cartes de fondations et un UI kit interactif de
l'app mobile. Il permet de produire des interfaces et des visuels fidèles à la
marque, en production comme en prototype jetable.

---

## Sources

Construit à partir du dépôt de code produit (Next.js 16 · App Router · RSC ·
TypeScript · Tailwind v4 · framer-motion · lucide-react · Drizzle/Supabase) :

- **GitHub** — `L1nK4R1M/SmartEat` (branche `develop`) — <https://github.com/L1nK4R1M/SmartEat>
  - Explorez-le pour approfondir : `docs/CAHIER_DES_CHARGES.md` (guidelines
    UX/UI §3, palette, échelle typo), `app/globals.css` (tokens réels),
    `components/` (primitives + écrans), `db/` (catalogue recettes, ingrédients,
    enseignes FR/BE).

Les fichiers source lus sont archivés sous `_reference/` (non compilés) pour
référence hors-ligne. *Le lecteur n'a pas forcément accès au dépôt privé — ces
copies servent de vérité de terrain.*

---

## Content Fundamentals — comment on écrit

- **Langue : français**, registre familier et chaleureux. On **tutoie**
  systématiquement l'utilisateur (« ton budget », « tes envies », « te revoir »).
- **Titres d'écran**, formulés comme **une seule question directe** —
  **majuscule en début de phrase** : *« On prépare ta semaine ? »*, *« Quel
  budget cette semaine ? »*, *« Vous êtes combien ? »*. Règle produit : **un
  écran = une question**.
- **Ton amical, chaleureux et complice** — on parle comme un ami qui cuisine
  avec toi. CTA qui donnent envie plutôt que secs (*« Cuisinons ensemble »*), et
  encouragements bienveillants qui déculpabilisent (*« Pas d'idée pour ce soir ?
  T'inquiète, on s'en occupe. 🙌 »*, *« Joli ! Ton menu tient dans le budget. 🎉 »*).
- **CTA = un verbe**, à l'infinitif ou l'impératif, jamais vague :
  *« Générer ma liste »*, *« Reprendre mes repas »*, *« Commencer gratuitement »*,
  *« Continuer »*. Un seul CTA évident par écran (thumb zone, bas d'écran).
- **Ton honnête et rassurant**, un brin complice : *« 👋 Content de te revoir ! »*,
  *« Une petite appli faite maison — gratuite et sans pub. »*, *« bon appétit ! 🎉 »*.
  Les avertissements restent doux, jamais culpabilisants : *« Le budget couvre 5
  jours sur 7. Augmente le budget pour couvrir plus de jours. »*
- **Emoji : oui, avec parcimonie et intention** — ils font partie du système
  visuel (voir Iconographie). Un emoji d'accent par bloc, pas de rafale.
- **Chiffres** : prix en euros format FR (`32,40 €`), toujours en chiffres
  tabulaires (`.tnum`). Mentions d'estimation explicites (« valeurs estimées »,
  « ≈ »).
- Casse : titres en minuscules décomplexées ; labels de section en
  MAJUSCULES discrètes (uppercase, tracking léger, couleur `on-surface-muted`).

---

## Visual Foundations

- **Couleur** — Le **vert frais `#16A34A`** (`--primary`) porte toute la marque :
  aliment sain, CTA, sélection active. L'**ambre `#F59E0B`** (`--accent`) est
  **réservé au signal budget** et aux alertes douces — ne jamais l'utiliser comme
  couleur décorative. Neutres légèrement **teintés de vert désaturé** (fond
  `#F7FAF9`, surface variante `#F1F5F3`). **Thème clair & sombre** : clair par
  défaut, le sombre s'active soit **automatiquement** selon le système
  (`prefers-color-scheme`), soit **au choix** via `data-theme="light|dark"` sur
  `<html>` (retirer l'attribut = revenir à « système ») ; le composant
  `ThemeToggle` gère les 3 états. Les **moments du repas** ont leurs couleurs (petit-déj
  ambre, déjeuner vert, dîner indigo) et le plan hebdo une **palette de 7 jours**.
- **Typographie** — **Inter** partout (unique famille), échelle Material 3
  pensée mobile : Display 32/40, Title 22/28, Body 16/24, Label 13, Caption 12.
  Titres en `font-weight` 600–700 avec `letter-spacing: -0.02em`. Chiffres
  tabulaires pour tout ce qui s'aligne (prix, quantités).
- **Layout** — **Mobile-first strict** : conteneur `max-width` ~ 400–460px
  centré, conçu pour le pouce. **CTA plein largeur, sticky en bas** (thumb zone),
  fond translucide + `backdrop-filter: blur`. Densité maîtrisée façon Linear ;
  marges généreuses façon Apple HIG ; zones tactiles **≥ 44px**.
- **Cartes** — fond `--surface`, **bordure fine `1px --outline`**, rayon **16px**
  (`--radius-card`). La hiérarchie vient surtout de la **bordure**, pas de
  l'ombre : ombres très légères et rares (`--shadow-sm`). Cartes « ambiance » et
  modales plus arrondies (24px). Boutons, badges et chips sont des **pilules**.
- **Imagerie recettes** — pas de banque photo imposée : chaque recette a un
  **fond dégradé pastel déterministe** (par id) + un **gros emoji**, avec une
  vraie photo superposée quand elle existe (repli gracieux sur le dégradé).
  Palette d'imagerie **chaude et acidulée** (pastels jaune/rose/menthe/lavande).
- **Bordures & rayons** — bordures discrètes `--outline` ; rayons : 8 / 12 / 16 /
  24 / 28 / pilule. **Anneau de sélection** = `box-shadow 0 0 0 2px --primary` +
  bordure primary + fond primary 8%.
- **États** — *hover* : `brightness()` léger (±5%) ou passage au
  `--surface-variant` (ghost) ; *press* : **`scale(0.97–0.98)`**. Sélection très
  visible (anneau vert + pastille cochée).
- **Transparence & flou** — réservés aux **barres sticky** (fond `--background`
  translucide + blur) et aux overlays d'image (voile `rgba(0,0,0,.10)` en bas).
- **Animation** — micro-interactions **150–250ms**, courbe **`cubic-bezier(0.22,
  1, 0.36, 1)`** (`--ease-brand`). Apparition = fade + slide-up (12–24px),
  cascades *stagger* pour listes/grilles, count-up sur les gros chiffres,
  skeleton plutôt que spinner plein écran. Respecte `prefers-reduced-motion`.

---

## Iconography

- **Système principal : lucide-react** (le produit l'utilise partout).
  Ici, faute de pouvoir embarquer le paquet npm dans le bundle, le composant
  **`Icon`** rend **inline les tracés lucide exacts** (24×24, stroke 2, bouts
  arrondis, `currentColor`) — mêmes glyphes, zéro dépendance. Liste des noms
  disponibles via `ICON_NAMES` ; élargissez `PATHS` dans `components/brand/Icon.jsx`
  au besoin. *En prototype HTML, vous pouvez aussi charger lucide depuis un CDN.*
- **Icônes d'équipement** : **`ApplianceIcon`** — 4 SVG maison (four, air fryer,
  poêle, micro-ondes), repris tels quels du code source (`appliance-icon.tsx`).
- **Logos d'enseignes** : **`BrandLogo`** récupère le logo réel via **Clearbit**
  (par domaine) avec repli sur un **monogramme** aux couleurs de la marque.
- **Emoji = iconographie de premier plan.** Chaque **recette** a son emoji
  (🍗 🐟 🍛 🍝 🥗 …), de même que les **régimes** (🥗 🌱 🥩 🌾), **ambiances**
  (⚡ 💪 😋 🌍) et **moments** (🥐 🍽️ 🌙). C'est un parti pris assumé, pas du
  décor : utilisez-les de façon cohérente avec les libellés du produit.
- **Aucun logo SmartEat** n'existe dans les sources. Le lockup est donc l'emoji
  **🥗 suivi de « SmartEat »** en Inter 700. *(voir « Wordmark » dans l'onglet
  Design System.)* **Ne pas dessiner de logo** : rendre la marque en toutes
  lettres partout où une marque irait.

### Substitutions à confirmer

- **Police Inter** — chargée depuis **Google Fonts** (`tokens/fonts.css`), pas
  auto-hébergée comme dans l'app (`next/font`). C'est la **bonne police** ; si
  vous voulez self-host, remplacez l'`@import` par des `@font-face` locaux.

---

## Components

Primitives React réutilisables, bundlées sous
`window.SmartEatDesignSystem_1c9f23`. Elles reflètent l'inventaire réel du dépôt
(`components/` + `components/ui/`), converties en styles inline pilotés par les
tokens CSS.

**actions/**
- **Button** — CTA pilule, variantes `primary | secondary | ghost`, tailles `md | lg`.

**feedback/**
- **Badge** — pilule de métadonnée (`neutral | accent | primary`).
- **ProgressBar** — barre coût/budget animée (passe en ambre si dépassé).
- **AiNotice** — bandeau d'alerte douce (ambre).

**inputs/**
- **ChoiceCard** — carte sélectionnable d'onboarding (icône/emoji + label).
- **MealStepper** — contrôle − n + à gros boutons (foyer / repas).
- **BudgetSlider** — slider de budget avec valeur € live.
- **TypeChips** — chips multi-sélection type/ambiance (SegmentedButton M3).

**recipe/**
- **RecipeCard** — ligne repas cliquable + badges + bouton « remplacer ».
- **PlanDayCard** — carte repas du plan avec onglet « moment » coloré.
- **NutritionCard** — kcal + macros + €/pers + temps (valeurs estimées).
- **RecipeImage** — dégradé pastel + emoji + photo optionnelle superposée.

**brand/**
- **Icon** — glyphes lucide inline (+ `ICON_NAMES`).
- **ApplianceIcon** — SVG des 4 équipements de cuisson.
- **BrandLogo** — logo enseigne (Clearbit) + repli monogramme.

**theme/**
- **ThemeToggle** — sélecteur système / clair / sombre (écrit `data-theme`, persiste le choix) ; `setTheme()` exporté pour un usage impératif.

> **Ajouts intentionnels** : `Icon` (wrapper de glyphes lucide sans dépendance
> npm) et `TypeChips`/`BudgetSlider`/`MealStepper` (extraits des écrans
> `filter-bar.tsx` / `onboarding-wizard.tsx` pour en faire des primitives
> réutilisables). Tout le reste correspond 1:1 à un composant du dépôt.

---

## UI Kit

- **`ui_kits/smarteat-app/`** — recréation interactive de l'app mobile, dans un
  cadre téléphone. Parcours complet : **Landing → Onboarding (5 écrans) →
  écran de génération → Plan (avec swap de repas) → Liste de courses (cocher le
  placard) → Détail recette (nutrition + étapes)**. Compose toutes les
  primitives ci-dessus. Ouvrez `index.html`.

---

## Index (manifeste racine)

| Chemin | Rôle |
|---|---|
| `styles.css` | **Point d'entrée CSS** — liste d'`@import` uniquement. |
| `tokens/colors.css` · `typography.css` · `spacing.css` · `fonts.css` · `base.css` | Tokens & reset. |
| `components/actions` · `feedback` · `inputs` · `recipe` · `brand` | Primitives (`.jsx` + `.d.ts` + `.prompt.md` + carte). |
| `foundations/*.html` | Cartes de fondations (onglet Design System : Colors, Type, Spacing, Brand). |
| `ui_kits/smarteat-app/` | UI kit de l'app mobile (interactif). |
| `_reference/` | Copies du code source lu (non compilé). |
| `SKILL.md` | Rend le dépôt utilisable comme Agent Skill. |

---

*Namespace runtime : `window.SmartEatDesignSystem_1c9f23`. Dans une carte HTML :
`const { Button } = window.SmartEatDesignSystem_1c9f23;`.*
