import { MapPin, Store, Wallet, Users, Salad, Flame, Sparkles, Ban, Clock } from "lucide-react";
import type { PrefsSummary as Summary } from "@/lib/summary";
import { formatEuro } from "@/lib/utils";

// Récapitulatif des infos données par l'utilisateur (sur /compte et l'accueil).
export function PrefsSummary({ summary }: { summary: Summary }) {
  const rows: { icon: React.ReactNode; label: string; value: string }[] = [
    { icon: <MapPin size={15} />, label: "Pays", value: `${summary.countryFlag} ${summary.countryLabel}` },
    { icon: <Store size={15} />, label: "Magasin", value: summary.storeName },
    { icon: <Wallet size={15} />, label: "Budget / semaine", value: formatEuro(summary.budget) },
    {
      icon: <Users size={15} />,
      label: "Foyer",
      value: `${summary.householdSize} pers · ${summary.mealsPerWeek} repas/sem`,
    },
    {
      icon: <Clock size={15} />,
      label: "Repas",
      value: summary.mealSlots.length ? summary.mealSlots.join(", ") : "—",
    },
    { icon: <Salad size={15} />, label: "Régime", value: summary.diets.length ? summary.diets.join(", ") : "Aucun" },
    { icon: <Flame size={15} />, label: "Équipement", value: summary.equipment.join(", ") || "—" },
    { icon: <Sparkles size={15} />, label: "Ambiance", value: summary.ambiance.length ? summary.ambiance.join(", ") : "—" },
    {
      icon: <Ban size={15} />,
      label: "À éviter",
      value: summary.exclusionsCount ? `${summary.exclusionsCount} aliment(s)` : "—",
    },
  ];

  return (
    <div className="overflow-hidden rounded-[var(--radius-card)] border border-outline bg-surface">
      {rows.map((r) => (
        <div
          key={r.label}
          className="flex items-center justify-between gap-3 border-b border-outline px-4 py-2.5 last:border-b-0"
        >
          <span className="inline-flex items-center gap-2 text-sm text-on-surface-muted">
            {r.icon} {r.label}
          </span>
          <span className="min-w-0 truncate text-right text-sm font-medium">{r.value}</span>
        </div>
      ))}
    </div>
  );
}
