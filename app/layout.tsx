import type { Metadata, Viewport } from "next";
import { Fraunces, Inter } from "next/font/google";
import { BottomNav } from "@/components/bottom-nav";
import "./globals.css";

// §3 Typographie — Inter (corps) + Fraunces (titres éditoriaux),
// self-host automatique sur Vercel, zéro CLS.
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "SmartEat — Repas & courses sans charge mentale",
  description:
    "Choisissez vos repas selon votre régime, votre équipement et votre budget. Liste de courses générée en moins de 3 clics.",
};

// Mobile-first : viewport adapté, pas de zoom bloqué (accessibilité).
export const viewport: Viewport = {
  themeColor: "#1b7a4e",
  width: "device-width",
  initialScale: 1,
};

// Script inline exécuté AVANT le premier paint. Lit le choix utilisateur dans
// localStorage et applique data-theme sur <html>, ce qui évite le flash de
// thème incorrect à l'ouverture. "system" retire l'attribut -> prefers-color-scheme.
const themeInitScript = `
try {
  var t = localStorage.getItem('smarteat-theme');
  if (t === 'dark' || t === 'light') document.documentElement.setAttribute('data-theme', t);
} catch (_) {}
`;

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="fr"
      className={`${inter.variable} ${fraunces.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="min-h-full flex flex-col">
        {children}
        <BottomNav />
      </body>
    </html>
  );
}
