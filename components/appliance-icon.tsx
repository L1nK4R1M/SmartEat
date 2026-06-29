import type { Appliance } from "@/lib/types";

// Icônes SVG générées pour les 4 équipements (auto-hébergées, pas de dépendance).
const PATHS: Record<Appliance, React.ReactNode> = {
  four: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <line x1="3" y1="8" x2="21" y2="8" />
      <rect x="6" y="11" width="12" height="7" rx="1" />
      <line x1="7" y1="5.5" x2="9" y2="5.5" />
      <line x1="12" y1="5.5" x2="17" y2="5.5" />
    </>
  ),
  airfryer: (
    <>
      <path d="M6 3h12l-1 5H7L6 3Z" />
      <rect x="4" y="8" width="16" height="12" rx="3" />
      <circle cx="12" cy="14" r="3" />
      <line x1="10" y1="5.5" x2="14" y2="5.5" />
    </>
  ),
  micro: (
    <>
      <rect x="2" y="4" width="20" height="15" rx="2" />
      <rect x="5" y="7" width="9" height="9" rx="1" />
      <line x1="18" y1="8" x2="18" y2="8.01" />
      <line x1="18" y1="12" x2="18" y2="12.01" />
      <line x1="18" y1="16" x2="18" y2="16.01" />
    </>
  ),
  poele: (
    <>
      <circle cx="9" cy="13" r="6" />
      <line x1="15" y1="11" x2="23" y2="9" />
    </>
  ),
};

export function ApplianceIcon({
  appliance,
  size = 24,
  className,
}: {
  appliance: Appliance;
  size?: number;
  className?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      {PATHS[appliance]}
    </svg>
  );
}
