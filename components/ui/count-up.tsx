"use client";

import { useEffect, useRef, useState } from "react";
import { animate } from "framer-motion";
import { formatEuro } from "@/lib/utils";

// Compteur animé (count-up). Sert le GROS chiffre de budget et les prix.
// `format` permet d'afficher € ou un simple entier.
export function CountUp({
  value,
  duration = 0.7,
  format = (v) => String(Math.round(v)),
  className,
}: {
  value: number;
  duration?: number;
  format?: (v: number) => string;
  className?: string;
}) {
  const [display, setDisplay] = useState(value);
  const fromRef = useRef(value);

  useEffect(() => {
    const controls = animate(fromRef.current, value, {
      duration,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => setDisplay(v),
    });
    fromRef.current = value;
    return () => controls.stop();
  }, [value, duration]);

  return (
    <span className={className} aria-live="polite">
      {format(display)}
    </span>
  );
}

// Variante € prête à l'emploi (chiffres tabulaires recommandés côté parent).
export function CountUpEuro({
  value,
  className,
  duration,
}: {
  value: number;
  className?: string;
  duration?: number;
}) {
  return <CountUp value={value} className={className} duration={duration} format={formatEuro} />;
}
