"use client";

import { motion, type Variants, type HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

// Primitives d'animation réutilisables (framer-motion). Mobile-first et discrètes
// (150–250 ms), elles respectent prefers-reduced-motion via framer-motion.

const EASE = [0.22, 1, 0.36, 1] as const;

// Apparition de page : léger fade + slide vers le haut.
export const pageVariants: Variants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: EASE } },
};

// Conteneur "stagger" : révèle ses enfants en cascade.
export const staggerContainer: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06, delayChildren: 0.04 } },
};

// Enfant d'une cascade (carte, ligne de liste…).
export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3, ease: EASE } },
};

// Wrapper de transition d'apparition pour une page entière.
export function PageTransition({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.div variants={pageVariants} initial="hidden" animate="show" className={className}>
      {children}
    </motion.div>
  );
}

// Liste/grille en cascade. `as` permet de garder la sémantique (ul, div…).
export function Stagger({
  children,
  className,
  ...props
}: HTMLMotionProps<"div"> & { children: React.ReactNode; className?: string }) {
  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="show"
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}

// Élément d'une cascade.
export function StaggerItem({
  children,
  className,
  ...props
}: HTMLMotionProps<"div"> & { children: React.ReactNode; className?: string }) {
  return (
    <motion.div variants={staggerItem} className={className} {...props}>
      {children}
    </motion.div>
  );
}

// Élément qui se révèle au scroll (whileInView), pour la landing.
export function Reveal({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.5, ease: EASE, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Bouton/carte avec micro-interaction au tap (scale).
export function Tappable({
  children,
  className,
  ...props
}: HTMLMotionProps<"div"> & { children: React.ReactNode; className?: string }) {
  return (
    <motion.div
      whileTap={{ scale: 0.97 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      className={cn("touch-manipulation", className)}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export { motion };
