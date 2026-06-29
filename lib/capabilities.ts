import type { Appliance, Capability } from "./types";

// §2 — On ne raisonne pas en *appareils* mais en *capacités de cuisson*.
// Chaque appareil FOURNIT des capacités ; une recette REQUIERT des capacités.
// La substitution « Four <-> Air Fryer » émerge gratuitement (les deux fournissent `roast`).
export const APPLIANCE_CAPABILITIES: Record<Appliance, Capability[]> = {
  four: ["roast", "bake", "gratin", "heat"],
  airfryer: ["roast", "fry", "heat"],
  poele: ["fry", "sear", "simmer", "heat"],
  micro: ["heat", "reheat", "steam"],
};

// Union des capacités dérivée de l'équipement de l'utilisateur (jamais stockée).
export function userCapabilities(equipment: Appliance[]): Set<Capability> {
  const caps = new Set<Capability>();
  for (const appliance of equipment) {
    for (const cap of APPLIANCE_CAPABILITIES[appliance] ?? []) {
      caps.add(cap);
    }
  }
  return caps;
}

// Une recette est réalisable si toutes ses capacités requises sont couvertes.
export function canCook(
  reqCapabilities: Capability[],
  equipment: Appliance[],
): boolean {
  const caps = userCapabilities(equipment);
  return reqCapabilities.every((c) => caps.has(c));
}
