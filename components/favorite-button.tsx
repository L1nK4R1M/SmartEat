"use client";

import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import { useFavorites } from "@/lib/favorites";

// Bouton cœur (favoris). Autonome : lit/écrit les favoris via useFavorites,
// toutes les instances restent synchronisées. Utilisable par-dessus une photo
// ou dans une carte-lien (preventDefault/stopPropagation intégrés).
export function FavoriteButton({
  recipeId,
  title,
  className,
}: {
  recipeId: string;
  title: string;
  className?: string;
}) {
  const { isFavorite, toggle } = useFavorites();
  const active = isFavorite(recipeId);

  return (
    <button
      type="button"
      aria-label={active ? `Retirer « ${title} » des favoris` : `Ajouter « ${title} » aux favoris`}
      aria-pressed={active}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggle(recipeId);
      }}
      className={cn(
        "grid h-11 w-11 place-items-center rounded-full bg-surface/90 backdrop-blur",
        "shadow-[var(--shadow-sm)] transition-all active:scale-90",
        active ? "text-error" : "text-on-surface-muted hover:text-on-surface",
        className,
      )}
    >
      <Heart size={20} fill={active ? "currentColor" : "none"} strokeWidth={2} />
    </button>
  );
}
