import "server-only";
import Anthropic from "@anthropic-ai/sdk";
import { z } from "zod";

// Génération IA d'une recette DÉTAILLÉE et adaptée aux choix de l'utilisateur,
// à partir des ingrédients (du catalogue, donc le prix reste exact). Repli
// gracieux sur la version standard si l'IA est indisponible / quota dépassé.

export type AiStatus =
  | "ok" // recette détaillée générée par l'IA
  | "disabled" // pas de clé API -> version standard (silencieux)
  | "fallback_quota" // quota / crédit dépassé -> version standard + message
  | "fallback_unavailable"; // IA indisponible / erreur -> version standard + message

export interface DetailedRecipe {
  title: string;
  steps: string[];
  tip?: string;
  status: AiStatus;
}

export interface DetailInput {
  id: string;
  title: string;
  ingredients: { name: string; qty: string }[];
  equipment: string[]; // libellés FR
  dietTags: string[]; // libellés FR
  householdSize: number;
  ambiance?: string[];
  fallbackSteps: string[];
}

const MODEL = process.env.ANTHROPIC_MODEL || "claude-haiku-4-5-20251001";

const schema = z.object({
  title: z.string().min(3).max(120),
  steps: z.array(z.string().min(8)).min(5).max(14),
  tip: z.string().optional(),
});

// Cache mémoire (par instance) : évite de régénérer la même recette/contexte.
const cache = new Map<string, { title: string; steps: string[]; tip?: string }>();

function variantKey(i: DetailInput): string {
  return [
    i.id,
    [...i.equipment].sort().join(","),
    [...i.dietTags].sort().join(","),
    i.householdSize,
    [...(i.ambiance ?? [])].sort().join(","),
  ].join("|");
}

export function aiConfigured(): boolean {
  return !!process.env.ANTHROPIC_API_KEY;
}

export async function getDetailedRecipe(input: DetailInput): Promise<DetailedRecipe> {
  if (!aiConfigured()) {
    return { title: input.title, steps: input.fallbackSteps, status: "disabled" };
  }

  const key = variantKey(input);
  const cached = cache.get(key);
  if (cached) return { ...cached, status: "ok" };

  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  const ingredientLines = input.ingredients.map((x) => `- ${x.name} : ${x.qty}`).join("\n");

  const system =
    "Tu es un chef cuisinier français. Tu rédiges des recettes claires, précises et " +
    "réalistes, adaptées au matériel et au régime indiqués. Tu n'utilises QUE les " +
    "ingrédients fournis (plus sel, poivre, eau et épices de base). Réponds en français.";

  const user = `Rédige une recette DÉTAILLÉE pour "${input.title}".
Pour ${input.householdSize} personne(s). Matériel disponible : ${input.equipment.join(", ") || "non précisé"}.
Régime à respecter : ${input.dietTags.join(", ") || "aucun"}.
Ingrédients (quantités totales) :
${ingredientLines}

Exigences :
- 8 à 12 étapes numérotées, concrètes et précises (températures, durées, techniques, repères visuels).
- Utilise uniquement le matériel disponible.
- Ajoute une astuce de chef ("tip").
- Réponds UNIQUEMENT par un objet JSON valide, sans texte autour, au format :
{"title": "...", "steps": ["...", "..."], "tip": "..."}`;

  try {
    const res = await client.messages.create({
      model: MODEL,
      max_tokens: 1500,
      system,
      messages: [{ role: "user", content: user }],
    });
    const text = res.content
      .map((b) => (b.type === "text" ? b.text : ""))
      .join("");
    const json = extractJson(text);
    const parsed = schema.parse(JSON.parse(json));
    const value = { title: parsed.title, steps: parsed.steps, tip: parsed.tip };
    cache.set(key, value);
    return { ...value, status: "ok" };
  } catch (err) {
    return { title: input.title, steps: input.fallbackSteps, status: classifyError(err) };
  }
}

function extractJson(text: string): string {
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  return start >= 0 && end > start ? text.slice(start, end + 1) : text;
}

function classifyError(err: unknown): "fallback_quota" | "fallback_unavailable" {
  if (err instanceof Anthropic.APIError) {
    const status = err.status ?? 0;
    const msg = (err.message || "").toLowerCase();
    if (status === 429 || msg.includes("credit") || msg.includes("quota") || msg.includes("billing")) {
      return "fallback_quota";
    }
  }
  return "fallback_unavailable";
}
