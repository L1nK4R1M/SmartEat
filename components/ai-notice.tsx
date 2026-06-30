import { AlertTriangle } from "lucide-react";
import type { AiStatus } from "@/lib/ai/recipe-detail";

// Message d'info/erreur quand l'IA n'a pas pu générer la recette détaillée
// (quota dépassé ou service indisponible). Rien si tout va bien / IA désactivée.
export function AiNotice({ status }: { status: AiStatus }) {
  if (status === "ok" || status === "disabled") return null;
  const quota = status === "fallback_quota";
  return (
    <div className="mb-4 flex items-start gap-2 rounded-2xl border border-accent/40 bg-accent/10 p-3 text-sm">
      <AlertTriangle size={16} className="mt-0.5 shrink-0 text-accent" />
      <span>
        {quota
          ? "Quota IA atteint : la recette détaillée n'a pas pu être générée pour le moment. Version standard affichée — réessaie plus tard."
          : "Service IA momentanément indisponible : version standard de la recette affichée."}
      </span>
    </div>
  );
}
