"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Loader2 } from "lucide-react";

// Écran de génération SmartEat 3.0 : « On prépare ta semaine… » + checklist
// séquentielle, puis redirection vers le plan (~2,5 s, côté client).
// La bottom nav est cachée sur /generating (flux plein écran).
const STEPS = [
  "Analyse du budget et de tes préférences",
  "Création de ton plan de repas",
  "Génération de la liste de courses",
];

export function GeneratingView({
  planHref,
  storeName,
}: {
  planHref: string;
  storeName?: string;
}) {
  const router = useRouter();
  const [active, setActive] = useState(0);

  useEffect(() => {
    // Pré-charge le plan pour une transition fluide.
    router.prefetch(planHref);
    const stepDelay = 750;
    const timers = STEPS.map((_, i) =>
      setTimeout(() => setActive(i + 1), (i + 1) * stepDelay),
    );
    const redirect = setTimeout(() => router.replace(planHref), STEPS.length * stepDelay + 500);
    return () => {
      timers.forEach(clearTimeout);
      clearTimeout(redirect);
    };
  }, [planHref, router]);

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-md flex-col items-center justify-center px-6 py-10 text-center">
      {/* Illustration panier qui rebondit doucement */}
      <motion.div
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 12 }}
        className="grid h-24 w-24 place-items-center rounded-[var(--radius-card)] bg-primary/10 text-5xl"
        aria-hidden
      >
        <motion.span
          animate={{ y: [0, -8, 0] }}
          transition={{ repeat: Infinity, duration: 1.4, ease: "easeInOut" }}
        >
          🛒
        </motion.span>
      </motion.div>

      <h1 className="mt-7 font-display text-3xl font-semibold tracking-tight">
        On prépare ta semaine…
      </h1>
      {storeName && (
        <p className="mt-1.5 text-on-surface-muted">
          Prévu pour <span className="font-medium text-on-surface">{storeName}</span>
        </p>
      )}

      <ul className="mt-9 w-full space-y-3 text-left">
        {STEPS.map((label, i) => {
          const done = i < active;
          const current = i === active;
          return (
            <motion.li
              key={label}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: done || current ? 1 : 0.4, x: 0 }}
              transition={{ duration: 0.3 }}
              className="flex items-center gap-3 rounded-[var(--radius-card)] border border-outline bg-surface p-4"
            >
              <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full">
                <AnimatePresence mode="wait" initial={false}>
                  {done ? (
                    <motion.span
                      key="done"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="grid h-7 w-7 place-items-center rounded-full bg-primary text-on-primary"
                    >
                      <Check size={16} strokeWidth={3} />
                    </motion.span>
                  ) : current ? (
                    <motion.span
                      key="loading"
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                      className="text-primary"
                    >
                      <Loader2 size={20} />
                    </motion.span>
                  ) : (
                    <span
                      key="idle"
                      className="h-3 w-3 rounded-full border-2 border-outline"
                    />
                  )}
                </AnimatePresence>
              </span>
              <span className="flex-1 text-[15px] font-medium">{label}</span>
              <span className="text-xs text-on-surface-muted">
                {done ? "Terminé" : current ? "En cours…" : ""}
              </span>
            </motion.li>
          );
        })}
      </ul>
    </main>
  );
}
