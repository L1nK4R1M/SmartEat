"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

// Visuel de recette avec FALLBACK élégant : si l'image manque ou échoue, on
// rend une tuile dégradé (déterministe par recette) + gros emoji. Le rendu sans
// réseau est superbe par défaut — aucune dépendance à une image distante.

// Palettes pastel "food" ; choix déterministe via un hash de la seed.
const GRADIENTS = [
  "linear-gradient(135deg, #fde68a 0%, #fca5a5 100%)", // amber -> rose
  "linear-gradient(135deg, #a7f3d0 0%, #6ee7b7 100%)", // emerald
  "linear-gradient(135deg, #bae6fd 0%, #93c5fd 100%)", // sky
  "linear-gradient(135deg, #ddd6fe 0%, #c4b5fd 100%)", // violet
  "linear-gradient(135deg, #fed7aa 0%, #fdba74 100%)", // orange
  "linear-gradient(135deg, #bbf7d0 0%, #fde68a 100%)", // green -> amber
  "linear-gradient(135deg, #fecdd3 0%, #fda4af 100%)", // rose
  "linear-gradient(135deg, #99f6e4 0%, #67e8f9 100%)", // teal -> cyan
];

function pickGradient(seed: string): string {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  return GRADIENTS[h % GRADIENTS.length];
}

export function RecipeImage({
  src,
  emoji,
  seed,
  alt,
  className,
  emojiClassName,
  rounded = "rounded-2xl",
}: {
  src?: string;
  emoji: string;
  seed: string;
  alt: string;
  className?: string;
  emojiClassName?: string;
  rounded?: string;
}) {
  const [failed, setFailed] = useState(false);
  const showImage = src && !failed;

  return (
    <div
      className={cn("relative grid place-items-center overflow-hidden", rounded, className)}
      style={showImage ? undefined : { backgroundImage: pickGradient(seed) }}
      aria-label={alt}
      role="img"
    >
      {showImage ? (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img
          src={src}
          alt={alt}
          loading="lazy"
          onError={() => setFailed(true)}
          className="h-full w-full object-cover"
        />
      ) : (
        <>
          {/* léger voile pour la profondeur */}
          <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
          <span
            className={cn("relative drop-shadow-sm", emojiClassName ?? "text-4xl")}
            aria-hidden
          >
            {emoji}
          </span>
        </>
      )}
    </div>
  );
}
