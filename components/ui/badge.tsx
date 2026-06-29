import { cn } from "@/lib/utils";

// Petit badge pour les métadonnées d'une recette (temps, prix, type).
export function Badge({
  children,
  tone = "neutral",
  className,
}: {
  children: React.ReactNode;
  tone?: "neutral" | "accent" | "primary";
  className?: string;
}) {
  const tones = {
    neutral: "bg-surface-variant text-on-surface-muted",
    accent: "bg-accent/15 text-accent",
    primary: "bg-primary/12 text-primary",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
