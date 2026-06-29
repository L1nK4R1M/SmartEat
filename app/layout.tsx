import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

// §3 Typographie — Inter, self-host automatique sur Vercel, zéro CLS.
const inter = Inter({
  variable: "--font-inter",
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
  themeColor: "#16a34a",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
