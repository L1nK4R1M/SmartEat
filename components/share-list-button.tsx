"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Share2 } from "lucide-react";
import { buttonClasses } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// Partage de la liste de courses en texte brut (titre, rayons, articles, total).
// 1. `navigator.share` (feuille de partage native) si disponible ;
// 2. sinon `navigator.clipboard.writeText` avec confirmation « Copié ! » ;
// 3. si aucune des deux API n'existe, message doux — jamais de crash.
export function ShareListButton({
  title,
  text,
  className,
}: {
  title: string;
  text: string;
  className?: string;
}) {
  const [feedback, setFeedback] = useState<"idle" | "copied" | "unavailable">("idle");
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Nettoie le timer de confirmation si le composant est démonté entre-temps.
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  function flash(state: "copied" | "unavailable") {
    setFeedback(state);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setFeedback("idle"), 2000);
  }

  async function share() {
    // 1. Feuille de partage native (mobile surtout).
    if (typeof navigator !== "undefined" && typeof navigator.share === "function") {
      try {
        await navigator.share({ title, text });
        return;
      } catch (err) {
        // L'utilisateur a annulé : on ne fait rien de plus.
        if (err instanceof Error && err.name === "AbortError") return;
        // Autre échec -> on tente le presse-papiers ci-dessous.
      }
    }
    // 2. Repli presse-papiers.
    if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
      try {
        await navigator.clipboard.writeText(text);
        flash("copied");
        return;
      } catch {
        // Presse-papiers refusé (contexte non sécurisé…) -> message doux.
      }
    }
    // 3. Aucune API disponible : on prévient sans casser.
    flash("unavailable");
  }

  return (
    <button
      type="button"
      onClick={share}
      aria-live="polite"
      className={cn(buttonClasses("primary", "lg"), className)}
    >
      {feedback === "copied" ? <Check size={18} strokeWidth={3} /> : <Share2 size={18} />}
      {feedback === "copied"
        ? "Copié !"
        : feedback === "unavailable"
          ? "Partage indisponible ici"
          : "Partager la liste"}
    </button>
  );
}
