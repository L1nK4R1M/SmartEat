"use client";

import { Stagger, StaggerItem } from "@/components/ui/motion";

// Étapes de préparation numérotées, révélées en cascade.
export function RecipeSteps({ steps }: { steps: string[] }) {
  return (
    <Stagger className="space-y-3">
      {steps.map((step, i) => (
        <StaggerItem key={i} className="flex gap-3">
          <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-primary/12 text-sm font-semibold text-primary">
            {i + 1}
          </span>
          <p className="pt-0.5 text-[15px]">{step}</p>
        </StaggerItem>
      ))}
    </Stagger>
  );
}
