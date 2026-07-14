"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import { Stagger, StaggerItem } from "@/components/ui/motion";

// Mode cuisine : étapes cochables pendant la préparation. Chaque étape se
// coche/décoche (état local, pas de persistance), une barre de progression
// suit l'avancement « X/N étapes ». Révélation en cascade conservée.
export function RecipeSteps({ steps }: { steps: string[] }) {
  const [done, setDone] = useState<boolean[]>(() => steps.map(() => false));
  const doneCount = done.filter(Boolean).length;
  const allDone = doneCount === steps.length && steps.length > 0;

  const toggle = (i: number) =>
    setDone((prev) => prev.map((d, j) => (j === i ? !d : d)));

  return (
    <div>
      {/* Progression du mode cuisine */}
      <div className="mb-3 rounded-2xl border border-outline bg-surface p-3">
        <div className="flex items-baseline justify-between text-sm">
          <span className="font-semibold">{allDone ? "C'est prêt ! 🎉" : "Mode cuisine"}</span>
          <span className="tnum text-on-surface-muted">
            {doneCount}/{steps.length} étapes
          </span>
        </div>
        <div
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={steps.length}
          aria-valuenow={doneCount}
          aria-label="Progression de la recette"
          className="mt-2 h-1.5 overflow-hidden rounded-full bg-surface-variant"
        >
          <div
            className="h-full rounded-full bg-primary transition-all duration-300"
            style={{ width: `${steps.length ? (doneCount / steps.length) * 100 : 0}%` }}
          />
        </div>
      </div>

      <Stagger className="space-y-2">
        {steps.map((step, i) => {
          const checked = done[i];
          return (
            <StaggerItem key={i}>
              <button
                type="button"
                onClick={() => toggle(i)}
                aria-pressed={checked}
                aria-label={`${checked ? "Décocher" : "Cocher"} l'étape ${i + 1}`}
                className={`flex w-full min-h-11 items-start gap-3 rounded-2xl border p-3 text-left transition-colors ${
                  checked
                    ? "border-primary/30 bg-primary/10"
                    : "border-outline bg-surface hover:bg-surface-variant"
                }`}
              >
                <span
                  className={`grid h-7 w-7 shrink-0 place-items-center rounded-full text-sm font-semibold transition-colors ${
                    checked ? "bg-primary text-on-primary" : "bg-primary/10 text-primary"
                  }`}
                  aria-hidden
                >
                  {checked ? <Check size={15} strokeWidth={3} /> : i + 1}
                </span>
                <span
                  className={`pt-0.5 text-[15px] transition-colors ${
                    checked ? "text-on-surface-muted line-through decoration-1" : ""
                  }`}
                >
                  {step}
                </span>
              </button>
            </StaggerItem>
          );
        })}
      </Stagger>
    </div>
  );
}
