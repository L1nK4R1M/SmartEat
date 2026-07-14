"use client";

import { motion } from "framer-motion";
import { Clock } from "lucide-react";
import type { Nutrition } from "@/lib/types";
import { CountUp } from "@/components/ui/count-up";
import { formatEuro } from "@/lib/utils";

// Carte NUTRITION : kcal en avant (serif éditorial), puis Protéines, Glucides,
// Lipides, €/pers, Temps. Valeurs ESTIMÉES par portion (mention affichée).
export function NutritionCard({
  nutrition,
  costPerServing,
  prepMinutes,
}: {
  nutrition: Nutrition;
  costPerServing: number;
  prepMinutes: number;
}) {
  const cells: { label: string; value: string; tint?: string; icon?: boolean }[] = [
    { label: "Protéines", value: `${nutrition.protein} g` },
    { label: "Glucides", value: `${nutrition.carbs} g` },
    { label: "Lipides", value: `${nutrition.fat} g` },
    { label: "€/pers", value: formatEuro(costPerServing), tint: "text-primary" },
    { label: "Temps", value: `${prepMinutes} min`, icon: true },
  ];

  return (
    <section className="rounded-[var(--radius-card)] border border-outline bg-surface p-4 shadow-[var(--shadow-md)]">
      <div className="grid grid-cols-3 gap-2">
        {/* KCAL en avant, avec count-up */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="col-span-3 flex items-baseline justify-center gap-1.5 rounded-2xl bg-primary/10 py-3"
        >
          <CountUp
            value={nutrition.kcal}
            className="tnum font-display text-3xl font-semibold tracking-tight text-primary"
            format={(v) => String(Math.round(v))}
          />
          <span className="text-sm font-semibold text-on-surface-muted">kcal / portion</span>
        </motion.div>

        {cells.map((c) => (
          <div
            key={c.label}
            className="rounded-2xl bg-surface-variant/60 p-3 text-center"
          >
            <div
              className={`tnum flex items-center justify-center gap-1 text-sm font-semibold ${c.tint ?? "text-on-surface"}`}
            >
              {c.icon && <Clock size={13} className="text-on-surface-muted" />}
              {c.value}
            </div>
            <div className="mt-0.5 text-[11px] text-on-surface-muted">{c.label}</div>
          </div>
        ))}
      </div>
      <p className="mt-3 text-center text-[11px] text-on-surface-muted">
        Valeurs nutritionnelles estimées.
      </p>
    </section>
  );
}
