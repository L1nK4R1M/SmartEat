"use client";

import { useState, useTransition } from "react";
import { Check, ChevronLeft, Minus, Plus } from "lucide-react";
import type { Appliance, DietTag, Store } from "@/lib/types";
import { APPLIANCE_LABELS, DIET_LABELS } from "@/lib/labels";
import { completeOnboarding } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// Onboarding 4 écrans — une question par écran (§1). Capture les préférences
// durables une seule fois ; ensuite elles deviennent invisibles.
const DIETS = Object.keys(DIET_LABELS) as DietTag[];
const APPLIANCES = Object.keys(APPLIANCE_LABELS) as Appliance[];
const STEPS = ["Magasin", "Régime", "Équipement", "Foyer"];

export function OnboardingWizard({ stores }: { stores: Store[] }) {
  const [step, setStep] = useState(0);
  const [pending, startTransition] = useTransition();

  const [storeId, setStoreId] = useState(stores[0]?.id ?? "");
  const [diets, setDiets] = useState<DietTag[]>([]);
  const [equipment, setEquipment] = useState<Appliance[]>([]);
  const [householdSize, setHouseholdSize] = useState(2);
  const [mealsPerWeek, setMealsPerWeek] = useState(5);

  const canContinue =
    (step === 0 && storeId) ||
    step === 1 ||
    (step === 2 && equipment.length > 0) ||
    step === 3;

  function next() {
    if (step < STEPS.length - 1) {
      setStep((s) => s + 1);
      return;
    }
    startTransition(() =>
      completeOnboarding({ storeId, dietTags: diets, equipment, householdSize, mealsPerWeek }),
    );
  }

  return (
    <div className="flex min-h-dvh flex-col">
      {/* Progression */}
      <header className="flex items-center gap-3 px-5 pt-5">
        {step > 0 ? (
          <button
            onClick={() => setStep((s) => s - 1)}
            aria-label="Retour"
            className="grid h-9 w-9 place-items-center rounded-full hover:bg-surface-variant"
          >
            <ChevronLeft size={20} />
          </button>
        ) : (
          <div className="h-9 w-9" />
        )}
        <div className="flex flex-1 gap-1.5">
          {STEPS.map((_, i) => (
            <span
              key={i}
              className={cn(
                "h-1.5 flex-1 rounded-full transition-colors",
                i <= step ? "bg-primary" : "bg-surface-variant",
              )}
            />
          ))}
        </div>
      </header>

      <main className="flex-1 px-5 pt-8">
        {step === 0 && (
          <Step title="Où faites-vous vos courses ?" subtitle="On adapte les prix estimés.">
            <div className="grid grid-cols-1 gap-3">
              {stores.map((s) => (
                <ChoiceCard
                  key={s.id}
                  emoji={s.emoji}
                  label={s.name}
                  selected={storeId === s.id}
                  onClick={() => setStoreId(s.id)}
                />
              ))}
            </div>
          </Step>
        )}

        {step === 1 && (
          <Step title="Un régime particulier ?" subtitle="Plusieurs choix possibles. Laissez vide sinon.">
            <div className="grid grid-cols-2 gap-3">
              {DIETS.map((d) => (
                <ChoiceCard
                  key={d}
                  emoji={DIET_LABELS[d].emoji}
                  label={DIET_LABELS[d].label}
                  selected={diets.includes(d)}
                  onClick={() =>
                    setDiets((prev) =>
                      prev.includes(d) ? prev.filter((x) => x !== d) : [...prev, d],
                    )
                  }
                />
              ))}
            </div>
          </Step>
        )}

        {step === 2 && (
          <Step
            title="Quel équipement avez-vous ?"
            subtitle="On exclut les recettes que vous ne pouvez pas cuisiner."
          >
            <div className="grid grid-cols-2 gap-3">
              {APPLIANCES.map((a) => (
                <ChoiceCard
                  key={a}
                  emoji={APPLIANCE_LABELS[a].emoji}
                  label={APPLIANCE_LABELS[a].label}
                  selected={equipment.includes(a)}
                  onClick={() =>
                    setEquipment((prev) =>
                      prev.includes(a) ? prev.filter((x) => x !== a) : [...prev, a],
                    )
                  }
                />
              ))}
            </div>
          </Step>
        )}

        {step === 3 && (
          <Step title="Votre foyer" subtitle="Pour ajuster les quantités et le budget.">
            <Stepper label="Personnes" value={householdSize} min={1} max={10} onChange={setHouseholdSize} />
            <Stepper label="Repas / semaine" value={mealsPerWeek} min={1} max={14} onChange={setMealsPerWeek} />
          </Step>
        )}
      </main>

      {/* CTA sticky en thumb-zone */}
      <footer className="sticky bottom-0 border-t border-outline bg-background/80 p-5 backdrop-blur">
        <Button onClick={next} disabled={!canContinue || pending} size="lg" className="w-full">
          {pending
            ? "Préparation…"
            : step < STEPS.length - 1
              ? "Continuer"
              : "Voir mes repas"}
        </Button>
      </footer>
    </div>
  );
}

function Step({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto w-full max-w-md">
      <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
      <p className="mt-1.5 text-on-surface-muted">{subtitle}</p>
      <div className="mt-6">{children}</div>
    </div>
  );
}

function ChoiceCard({
  emoji,
  label,
  selected,
  onClick,
}: {
  emoji: string;
  label: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onClick}
      className={cn(
        "relative flex items-center gap-3 rounded-2xl border p-4 text-left transition-colors",
        selected
          ? "border-primary bg-primary/8 ring-2 ring-primary"
          : "border-outline bg-surface hover:bg-surface-variant",
      )}
    >
      <span className="text-2xl" aria-hidden>
        {emoji}
      </span>
      <span className="font-medium">{label}</span>
      {selected && (
        <span className="absolute right-3 top-3 grid h-5 w-5 place-items-center rounded-full bg-primary text-on-primary">
          <Check size={13} strokeWidth={3} />
        </span>
      )}
    </button>
  );
}

function Stepper({
  label,
  value,
  min,
  max,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  onChange: (v: number) => void;
}) {
  return (
    <div className="mb-4 flex items-center justify-between rounded-2xl border border-outline bg-surface p-4">
      <span className="font-medium">{label}</span>
      <div className="flex items-center gap-4">
        <button
          type="button"
          aria-label={`Diminuer ${label}`}
          onClick={() => onChange(Math.max(min, value - 1))}
          className="grid h-10 w-10 place-items-center rounded-full border border-outline disabled:opacity-40"
          disabled={value <= min}
        >
          <Minus size={18} />
        </button>
        <span className="tnum w-6 text-center text-lg font-semibold">{value}</span>
        <button
          type="button"
          aria-label={`Augmenter ${label}`}
          onClick={() => onChange(Math.min(max, value + 1))}
          className="grid h-10 w-10 place-items-center rounded-full border border-outline disabled:opacity-40"
          disabled={value >= max}
        >
          <Plus size={18} />
        </button>
      </div>
    </div>
  );
}
