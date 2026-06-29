import type { Store } from "@/lib/types";

// Enseignes par pays (France & Belgique). `domain` sert au logo réel (service
// Clearbit) ; `color` est la couleur de marque pour le repli monogramme.
// `priceFactor` modélise le profil de prix de l'enseigne (discounter < hyper < proxi < bio).
export const STORES: Store[] = [
  // ---------- France ----------
  { id: "fr_leclerc", country: "FR", name: "E.Leclerc", domain: "leclerc.com", color: "#0066B3", kind: "hyper", priceFactor: 0.92 },
  { id: "fr_auchan", country: "FR", name: "Auchan", domain: "auchan.fr", color: "#E3001B", kind: "hyper", priceFactor: 0.95 },
  { id: "fr_carrefour", country: "FR", name: "Carrefour", domain: "carrefour.fr", color: "#004E9F", kind: "hyper", priceFactor: 1.0 },
  { id: "fr_carrefour_market", country: "FR", name: "Carrefour Market", domain: "carrefour.fr", color: "#004E9F", kind: "super", priceFactor: 1.05 },
  { id: "fr_carrefour_city", country: "FR", name: "Carrefour City", domain: "carrefour.fr", color: "#004E9F", kind: "proxi", priceFactor: 1.2 },
  { id: "fr_intermarche", country: "FR", name: "Intermarché", domain: "intermarche.com", color: "#E2001A", kind: "super", priceFactor: 0.98 },
  { id: "fr_super_u", country: "FR", name: "Super U", domain: "magasins-u.com", color: "#E2001A", kind: "super", priceFactor: 1.0 },
  { id: "fr_casino", country: "FR", name: "Géant Casino", domain: "geantcasino.fr", color: "#00A94F", kind: "hyper", priceFactor: 1.05 },
  { id: "fr_cora", country: "FR", name: "Cora", domain: "cora.fr", color: "#E2001A", kind: "hyper", priceFactor: 0.98 },
  { id: "fr_monoprix", country: "FR", name: "Monoprix", domain: "monoprix.fr", color: "#1A1A1A", kind: "proxi", priceFactor: 1.25 },
  { id: "fr_franprix", country: "FR", name: "Franprix", domain: "franprix.fr", color: "#C8102E", kind: "proxi", priceFactor: 1.2 },
  { id: "fr_lidl", country: "FR", name: "Lidl", domain: "lidl.fr", color: "#0050AA", kind: "discount", priceFactor: 0.85 },
  { id: "fr_aldi", country: "FR", name: "Aldi", domain: "aldi.fr", color: "#00457C", kind: "discount", priceFactor: 0.84 },
  { id: "fr_grand_frais", country: "FR", name: "Grand Frais", domain: "grandfrais.com", color: "#7AB800", kind: "super", priceFactor: 1.1 },
  { id: "fr_naturalia", country: "FR", name: "Naturalia", domain: "naturalia.fr", color: "#5B8C3E", kind: "bio", priceFactor: 1.35 },
  { id: "fr_biocoop", country: "FR", name: "Biocoop", domain: "biocoop.fr", color: "#6FA539", kind: "bio", priceFactor: 1.38 },
  { id: "fr_picard", country: "FR", name: "Picard", domain: "picard.fr", color: "#003DA5", kind: "surgele", priceFactor: 1.15 },

  // ---------- Belgique ----------
  { id: "be_colruyt", country: "BE", name: "Colruyt", domain: "colruyt.be", color: "#E2001A", kind: "super", priceFactor: 0.88 },
  { id: "be_aldi", country: "BE", name: "Aldi", domain: "aldi.be", color: "#00457C", kind: "discount", priceFactor: 0.84 },
  { id: "be_lidl", country: "BE", name: "Lidl", domain: "lidl.be", color: "#0050AA", kind: "discount", priceFactor: 0.85 },
  { id: "be_okay", country: "BE", name: "Okay", domain: "okay.be", color: "#E30613", kind: "proxi", priceFactor: 0.95 },
  { id: "be_carrefour", country: "BE", name: "Carrefour", domain: "carrefour.be", color: "#004E9F", kind: "hyper", priceFactor: 1.0 },
  { id: "be_carrefour_express", country: "BE", name: "Carrefour Express", domain: "carrefour.be", color: "#004E9F", kind: "proxi", priceFactor: 1.2 },
  { id: "be_delhaize", country: "BE", name: "Delhaize", domain: "delhaize.be", color: "#ED1C24", kind: "super", priceFactor: 1.1 },
  { id: "be_intermarche", country: "BE", name: "Intermarché", domain: "intermarche.be", color: "#E2001A", kind: "super", priceFactor: 0.98 },
  { id: "be_match", country: "BE", name: "Match", domain: "match.be", color: "#E2001A", kind: "super", priceFactor: 1.05 },
  { id: "be_spar", country: "BE", name: "Spar", domain: "spar.be", color: "#006B3F", kind: "proxi", priceFactor: 1.15 },
  { id: "be_ah", country: "BE", name: "Albert Heijn", domain: "ah.be", color: "#00ADE6", kind: "super", priceFactor: 1.08 },
  { id: "be_cora", country: "BE", name: "Cora", domain: "cora.be", color: "#E2001A", kind: "hyper", priceFactor: 0.98 },
  { id: "be_bio_planet", country: "BE", name: "Bio-Planet", domain: "bioplanet.be", color: "#6FA539", kind: "bio", priceFactor: 1.35 },
];
