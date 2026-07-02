---
name: smarteat-design
description: Use this skill to generate well-branded interfaces and assets for SmartEat (a French "smart shopping & meal planning" web app), either for production or throwaway prototypes/mocks/etc. Contains essential design guidelines, colors, type, fonts, assets, and UI kit components for prototyping.
user-invocable: true
---

Read the README.md file within this skill, and explore the other available files.

If creating visual artifacts (slides, mocks, throwaway prototypes, etc), copy assets out and create static HTML files for the user to view. If working on production code, you can copy assets and read the rules here to become an expert in designing with this brand.

If the user invokes this skill without any other guidance, ask them what they want to build or design, ask some questions, and act as an expert designer who outputs HTML artifacts _or_ production code, depending on the need.

Key facts to internalize (details in README.md):
- **Voice**: French, tutoiement, lowercase screen titles phrased as one direct question, verb-led CTAs, warm and honest. Emoji used with intention.
- **Color**: green `#16A34A` is the brand; amber `#F59E0B` is reserved for the budget signal only. Green-tinted neutrals; full dark theme.
- **Type**: Inter everywhere, Material-3 scale, mobile-first, tabular numerals for prices.
- **Feel**: mobile-first, full-width sticky bottom CTA (thumb zone), 16px cards with a 1px outline (shadows are minimal), pill buttons/badges, `scale(0.97)` press, 150–250ms motion on `cubic-bezier(0.22,1,0.36,1)`.
- **Icons**: lucide (via the `Icon` component or a CDN), custom `ApplianceIcon` SVGs, `BrandLogo` via Clearbit, and emoji as first-class recipe/diet/moment iconography. No SmartEat logo exists — render "🥗 SmartEat" in Inter 700.
- **Components** live in `components/*` and are bundled under `window.SmartEatDesignSystem_1c9f23`; `ui_kits/smarteat-app/` is a full interactive mobile recreation.
