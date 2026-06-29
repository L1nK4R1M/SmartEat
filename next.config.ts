import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // §4 — images servies depuis Supabase Storage en production.
  images: {
    remotePatterns: [{ protocol: "https", hostname: "**.supabase.co" }],
  },
  // Liste de courses générée via URL dynamiques (?meals=…) : on garde les hrefs
  // en chaîne simple plutôt que des routes typées.
  typedRoutes: false,
};

export default nextConfig;
