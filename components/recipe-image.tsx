"use client";

import { useState } from "react";
import { cn, foodPhotoUrl } from "@/lib/utils";

// Visuel de recette : on rend TOUJOURS un fond dégradé pastel + gros emoji
// (déterministe par recette), et on superpose une vraie photo par-dessus quand
// elle est disponible (prop `src` ou générée depuis `query`). Si la photo est
// lente ou échoue, le dégradé reste visible — superbe et robuste sans réseau.

const GRADIENTS = [
  "linear-gradient(135deg, #fde68a 0%, #fca5a5 100%)",
  "linear-gradient(135deg, #a7f3d0 0%, #6ee7b7 100%)",
  "linear-gradient(135deg, #bae6fd 0%, #93c5fd 100%)",
  "linear-gradient(135deg, #ddd6fe 0%, #c4b5fd 100%)",
  "linear-gradient(135deg, #fed7aa 0%, #fdba74 100%)",
  "linear-gradient(135deg, #bbf7d0 0%, #fde68a 100%)",
  "linear-gradient(135deg, #fecdd3 0%, #fda4af 100%)",
  "linear-gradient(135deg, #99f6e4 0%, #67e8f9 100%)",
];

function pickGradient(seed: string): string {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  return GRADIENTS[h % GRADIENTS.length];
}

export function RecipeImage({
  src,
  query,
  emoji,
  seed,
  alt,
  className,
  emojiClassName,
  rounded = "rounded-2xl",
}: {
  src?: string;
  query?: string; // si pas de src, génère une photo à partir de ce libellé
  emoji: string;
  seed: string;
  alt: string;
  className?: string;
  emojiClassName?: string;
  rounded?: string;
}) {
  const [failed, setFailed] = useState(false);
  const resolved = src ?? (query ? foodPhotoUrl(query) : undefined);
  const showImage = !!resolved && !failed;

  return (
    <div
      className={cn("relative grid place-items-center overflow-hidden", rounded, className)}
      style={{ backgroundImage: pickGradient(seed) }}
      aria-label={alt}
      role="img"
    >
      {/* Fond toujours présent : voile + emoji (visible tant que la photo n'est pas chargée). */}
      <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
      <span className={cn("relative drop-shadow-sm", emojiClassName ?? "text-4xl")} aria-hidden>
        {emoji}
      </span>
      {showImage && (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img
          src={resolved}
          alt={alt}
          loading="lazy"
          onError={() => setFailed(true)}
          className="absolute inset-0 h-full w-full object-cover"
        />
      )}
    </div>
  );
}
