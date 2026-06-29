"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

// Logo réel de l'enseigne via service (Clearbit, par domaine), avec repli sur un
// monogramme aux couleurs de la marque si le logo est introuvable (onError).
function initials(name: string): string {
  const words = name.replace(/[^\p{L}\s]/gu, "").trim().split(/\s+/);
  if (words.length === 1) return words[0]!.slice(0, 2).toUpperCase();
  return (words[0]![0]! + words[1]![0]!).toUpperCase();
}

export function BrandLogo({
  domain,
  name,
  color,
  size = 48,
  className,
}: {
  domain: string;
  name: string;
  color: string;
  size?: number;
  className?: string;
}) {
  const [failed, setFailed] = useState(false);
  const box = cn(
    "grid place-items-center overflow-hidden rounded-xl border border-outline shrink-0",
    className,
  );

  if (failed || !domain) {
    return (
      <div
        className={box}
        style={{ width: size, height: size, background: color }}
        aria-label={name}
        role="img"
      >
        <span className="font-bold text-white" style={{ fontSize: size * 0.36 }}>
          {initials(name)}
        </span>
      </div>
    );
  }

  return (
    <div className={cn(box, "bg-white")} style={{ width: size, height: size }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`https://logo.clearbit.com/${domain}?size=128`}
        alt={name}
        width={size}
        height={size}
        loading="lazy"
        onError={() => setFailed(true)}
        className="h-full w-full object-contain p-1.5"
      />
    </div>
  );
}
