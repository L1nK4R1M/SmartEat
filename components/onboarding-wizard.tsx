"use client";

import { useMemo, useState, useTransition } from "react";
import { Check, ChevronLeft, Minus, Plus } from "lucide-react";
import type { Appliance, Country, DietTag, Store } from "@/lib/types";
import {
  APPLIANCE_LABELS,
  COUNTRY_LABELS,
  DIET_LABELS,
  STORE_KIND_LABELS,
} from "@/lib/labels";
import { completeOnboarding } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { BrandLogo } from "@/components/brand-logo";
import { ApplianceIcon } from "@/components/appliance-icon";
import { cn } from "@/lib/utils";

// Onboarding 5 écrans (§1) — une question par écran. Pays -> Magasin -> Régime
// -> Équipement -> Foyer. Préférences durables capturées une seule fois.
const COUNTRIES = Object.keys(COUNTRY_LABELS) as Country[];
const DIETS = Object.keys(DIET_LABELS) as DietTag[];
const APPLIANCES = Object.keys(APPLIANCE_LABELS) as Appliance[];
const STEPS = ["Pays", "Magasin", "Régime", "Équipement", "Foyer"];

export function OnboardingWizard({ stores }: { stores: Store[] }) {
  const [step, setStep] = useState(0);
  const [pending, startTransition] = useTransition();

  const [country, setCountry] = useState<Country>("FR");
  const [storeId, setStoreId] = useState("");
  const [diets, setDiets] = useState<DietTag[]>([]);
  const [equipment, setEquipment] = useState<Appliance[]>([]);
  const [householdSize, setHouseholdSize] = useState(2);
  const [mealsPerWeek, setMealsPerWeek] = useState(5);

  const storesForCountry = useMemo(
    () =>
      stores
        .filter((s) => s.country === country)
        .sort((a, b) => a.name.localeCompare(b.name, "fr")),
    [stores, country],
  );

  const canContinue =
    (step === 0 && !!country) ||
    (step === 1 && !!storeId) ||
    step === 2 ||
    (step === 3 && equipment.length > 0) ||
    step === 4;

  function next() {
    if (step < STEPS.length - 1) {
      setStep((s) => s + 1);
      return;
    }
    startTransition(() =>
      completeOnboarding({ country, storeId, dietTags: diets, equipment, householdSize, mealsPerWeek }),
    );
  }

  return (
    <div className="flex min-h-dvh flex-col">
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
          <Step title="Dans quel pays ?" subtitle="On charge les enseignes de ton pays.">
            <div className="grid grid-cols-2 gap-3">
              {COUNTRIES.map((c) => (
                <ChoiceCard
                  key={c}
                  emoji={COUNTRY_LABELS[c].flag}
                  label={COUNTRY_LABELS[c].label}
                  selected={country === c}
                  onClick={() => {
                    setCountry(c);
                    setStoreId(""); // forcer un nouveau choix d'enseigne
                  }}
                />
              ))}
            </div>
          </Step>
        )}

        {step === 1 && (
          <Step
            title="Où faites-vous vos courses ?"
            subtitle={`${storesForCountry.length} enseignes en ${COUNTRY_LABELS[country].label}. On adapte les prix.`}
          >
            <div className="-mx-1 max-h-[60dvh] space-y-2.5 overflow-y-auto px-1 pb-2">
              {storesForCountry.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  aria-pressed={storeId === s.id}
                  onClick={() => setStoreId(s.id)}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-2xl border p-3 text-left transition-colors",
                    storeId === s.id
                      ? "border-primary bg-primary/8 ring-2 ring-primary"
                      : "border-outline bg-surface hover:bg-surface-variant",
                  )}
                >
                  <BrandLogo domain={s.domain} name={s.name} color={s.color} size={44} />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-medium">{s.name}</span>
                    <span className="block text-xs text-on-surface-muted">
                      {STORE_KIND_LABELS[s.kind]}
                    </span>
                  </span>
                  {storeId === s.id && (
                    <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-primary text-on-primary">
                      <Check size={13} strokeWidth={3} />
                    </span>
                  )}
                </button>
              ))}
            </div>
          </Step>
        )}

        {step === 2 && (
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

        {step === 3 && (
          <Step
            title="Quel équipement avez-vous ?"
            subtitle="On exclut les recettes que vous ne pouvez pas cuisiner."
          >
            <div className="grid grid-cols-2 gap-3">
              {APPLIANCES.map((a) => (
                <ChoiceCard
                  key={a}
                  icon={<ApplianceIcon appliance={a} size={26} />}
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

        {step === 4 && (
          <Step title="Votre foyer" subtitle="Pour ajuster les quantités et le budget.">
            <Stepper label="Personnes" value={householdSize} min={1} max={10} onChange={setHouseholdSize} />
            <Stepper label="Repas / semaine" value={mealsPerWeek} min={1} max={14} onChange={setMealsPerWeek} />
          </Step>
        )}
      </main>

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
  icon,
  label,
  selected,
  onClick,
}: {
  emoji?: string;
  icon?: React.ReactNode;
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
      <span className={cn("grid place-items-center", selected ? "text-primary" : "text-on-surface")}>
        {icon ?? (
          <span className="text-2xl" aria-hidden>
            {emoji}
          </span>
        )}
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
