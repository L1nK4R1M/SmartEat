"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

// Barre de progression animée (coût / budget). Passe en ambre si > 100 %.
export function ProgressBar({
  value,
  max,
  className,
  over = false,
}: {
  value: number;
  max: number;
  className?: string;
  over?: boolean;
}) {
  const pct = max > 0 ? Math.min(100, Math.max(0, (value / max) * 100)) : 0;
  return (
    <div
      className={cn("h-2.5 w-full overflow-hidden rounded-full bg-surface-variant", className)}
      role="progressbar"
      aria-valuenow={Math.round(pct)}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <motion.div
        className={cn("h-full rounded-full", over ? "bg-accent" : "bg-primary")}
        initial={{ width: 0 }}
        animate={{ width: `${pct}%` }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      />
    </div>
  );
}
