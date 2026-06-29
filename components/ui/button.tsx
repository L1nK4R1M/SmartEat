import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost";
type Size = "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 rounded-full font-medium transition-all active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary";

const variants: Record<Variant, string> = {
  primary: "bg-primary text-on-primary hover:brightness-105 shadow-sm",
  secondary: "bg-surface-variant text-on-surface hover:brightness-95 border border-outline",
  ghost: "text-on-surface hover:bg-surface-variant",
};

const sizes: Record<Size, string> = {
  md: "h-11 px-5 text-[15px]",
  lg: "h-14 px-6 text-base",
};

export function buttonClasses(variant: Variant = "primary", size: Size = "md") {
  return cn(base, variants[variant], sizes[size]);
}

export function Button({
  variant = "primary",
  size = "md",
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
}) {
  return <button className={cn(buttonClasses(variant, size), className)} {...props} />;
}
