"use client";

import type { ShoppingSection } from "@/lib/shopping-list";
import { Stagger, StaggerItem } from "@/components/ui/motion";
import { formatEuro, formatQty } from "@/lib/utils";

// Sections de la liste de courses, révélées en cascade (groupées par rayon).
export function ShoppingSections({ sections }: { sections: ShoppingSection[] }) {
  return (
    <Stagger className="space-y-5">
      {sections.map((section) => (
        <StaggerItem key={section.aisle}>
          <div className="mb-2 flex items-baseline justify-between">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-on-surface-muted">
              {section.label}
            </h2>
            <span className="tnum text-xs text-on-surface-muted">
              {formatEuro(section.subtotal)}
            </span>
          </div>
          <ul className="overflow-hidden rounded-[var(--radius-card)] border border-outline bg-surface">
            {section.lines.map((line) => (
              <li
                key={line.ingredient.id}
                className="flex items-center justify-between gap-3 border-b border-outline px-4 py-3 last:border-b-0"
              >
                <div className="min-w-0">
                  <span className="block truncate font-medium">{line.ingredient.name}</span>
                  <span className="block text-xs text-on-surface-muted">
                    besoin {formatQty(line.neededQty, line.ingredient.baseUnit)}
                  </span>
                </div>
                <div className="shrink-0 text-right">
                  <span className="block text-sm font-medium">
                    {line.packs} × {line.ingredient.packLabel}
                  </span>
                  <span className="tnum block text-xs text-on-surface-muted">
                    {formatEuro(line.cost)}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </StaggerItem>
      ))}
    </Stagger>
  );
}
