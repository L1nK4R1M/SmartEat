"use client";

import { useCallback, useEffect, useState } from "react";

// Favoris de recettes, persistés en localStorage (clé `smarteat-favorites`,
// tableau d'ids JSON). Aucune dépendance serveur : fonctionne en invité.
// Les instances du hook restent synchronisées entre elles via un événement
// custom (même page) et l'événement `storage` (autres onglets).

const STORAGE_KEY = "smarteat-favorites";
const SYNC_EVENT = "smarteat:favorites";

export function readFavorites(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((x): x is string => typeof x === "string");
  } catch {
    return [];
  }
}

export function writeFavorites(ids: string[]): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
  } catch {
    // Stockage indisponible (navigation privée…) : les favoris restent en mémoire.
  }
  window.dispatchEvent(new CustomEvent(SYNC_EVENT));
}

// Hook client : ids favoris + isFavorite(id) + toggle(id).
// SSR-safe : rendu initial vide, hydraté depuis localStorage au montage.
export function useFavorites() {
  const [ids, setIds] = useState<string[]>([]);

  useEffect(() => {
    // Hydratation on-mount (localStorage absent côté serveur). La lecture via
    // `sync` évite le piège `react-hooks/set-state-in-effect` du repo.
    const sync = () => {
      setIds(readFavorites());
    };
    sync();
    window.addEventListener(SYNC_EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(SYNC_EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const toggle = useCallback((id: string) => {
    const current = readFavorites();
    const next = current.includes(id)
      ? current.filter((x) => x !== id)
      : [...current, id];
    writeFavorites(next); // notifie toutes les instances du hook (dont celle-ci)
  }, []);

  const isFavorite = useCallback((id: string) => ids.includes(id), [ids]);

  return { ids, isFavorite, toggle };
}
