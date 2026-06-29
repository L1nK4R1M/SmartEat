"use client";

import { motion } from "framer-motion";
import { Clock } from "lucide-react";
import type { Nutrition } from "@/lib/types";
import { CountUp } from "@/components/ui/count-up";
import { formatEuro } from "@/lib/utils";

// Carte NUTRITION (Romi) : Protéines, Glucides, Lipides, KCAL, €/pers, Temps.
// Valeurs ESTIMÉES par portion (mention affichée).
export function NutritionCard({
  nutrition,
  costPerServing,
  prepMinutes,
}: {
  nutrition: Nutrition;
  costPerServing: number;
  prepMinutes: number;
}) {
  const cells = [
    { label: "Protéines", value: `${nutrition.protein} g`, tint: "text-rose-500" },
    { label: "Glucides", value: `${nutrition.carbs} g`, tint: "text-amber-500" },
    { label: "Lipides", value: `${nutrition.fat} g`, tint: "text-violet-500" },
    { label: "€/pers", value: formatEuro(costPerServing), tint: "text-primary" },
    { label: "Temps", value: `${prepMinutes} min`, tint: "text-sky-500", icon: true },
  ];

  return (
    <section className="rounded-[var(--radius-card)] border border-outline bg-surface p-4">
      <div className="grid grid-cols-3 gap-3">
        {/* KCAL en avant, avec count-up */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="col-span-3 flex items-baseline justify-center gap-1.5 rounded-2xl bg-primary/8 py-3"
        >
          <CountUp
            value={nutrition.kcal}
            className="tnum text-3xl font-bold text-primary"
            format={(v) => String(Math.round(v))}
          />
          <span className="text-sm font-semibold text-on-surface-muted">kcal / portion</span>
        </motion.div>

        {cells.map((c) => (
          <div key={c.label} className="rounded-2xl border border-outline p-3 text-center">
            <div className={`tnum flex items-center justify-center gap-1 text-sm font-semibold ${c.tint}`}>
              {c.icon && <Clock size={13} />}
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
