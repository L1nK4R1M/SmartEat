"use client";

import { useEffect, useState } from "react";
import { Monitor, Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";

// Sélecteur de thème 3 états (Système / Clair / Sombre). Écrit `data-theme` sur
// <html> et persiste le choix dans localStorage. "system" retire l'attribut ->
// suit prefers-color-scheme (voir app/globals.css).
//
// Le flash au chargement est évité par le petit script inline dans app/layout.tsx
// qui applique le thème AVANT le premier paint.

const STORAGE_KEY = "smarteat-theme";

type Theme = "system" | "light" | "dark";

const OPTIONS: { value: Theme; label: string; Icon: typeof Sun }[] = [
  { value: "system", label: "Système", Icon: Monitor },
  { value: "light", label: "Clair", Icon: Sun },
  { value: "dark", label: "Sombre", Icon: Moon },
];

function applyTheme(theme: Theme) {
  const root = document.documentElement;
  if (theme === "system") root.removeAttribute("data-theme");
  else root.setAttribute("data-theme", theme);
}

export function ThemeToggle({ compact = false }: { compact?: boolean }) {
  // "system" par défaut pour le rendu serveur ; on synchronise côté client via useEffect.
  const [theme, setTheme] = useState<Theme>("system");

  useEffect(() => {
    // Hydratation depuis localStorage (indispo pendant le SSR). Le script inline
    // dans app/layout.tsx a déjà appliqué le thème sur <html> avant le paint —
    // ici on synchronise juste l'état React pour surligner le bon bouton.
    const stored = (localStorage.getItem(STORAGE_KEY) as Theme | null) ?? "system";
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTheme(stored);
  }, []);

  function pick(next: Theme) {
    setTheme(next);
    localStorage.setItem(STORAGE_KEY, next);
    applyTheme(next);
  }

  return (
    <div
      role="group"
      aria-label="Thème"
      className="inline-flex items-center gap-0.5 rounded-full border border-outline bg-surface p-1"
    >
      {OPTIONS.map((o) => {
        const active = theme === o.value;
        return (
          <button
            key={o.value}
            type="button"
            aria-pressed={active}
            aria-label={o.label}
            title={o.label}
            onClick={() => pick(o.value)}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full text-sm font-medium transition-colors",
              compact ? "px-2.5 py-2" : "px-3.5 py-2",
              active
                ? "bg-primary text-on-primary"
                : "text-on-surface-muted hover:text-on-surface",
            )}
          >
            <o.Icon size={15} />
            {!compact && <span>{o.label}</span>}
          </button>
        );
      })}
    </div>
  );
}
