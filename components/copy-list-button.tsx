"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";

// Export simple de la liste (§4 : pas d'API retailer au MVP -> copier / partager).
export function CopyListButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard indisponible (contexte non sécurisé) — silencieux.
    }
  }

  return (
    <Button onClick={copy} variant="secondary" size="lg" className="w-full">
      {copied ? <Check size={18} /> : <Copy size={18} />}
      {copied ? "Liste copiée !" : "Copier la liste"}
    </Button>
  );
}
