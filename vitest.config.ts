import { defineConfig } from "vitest/config";
import { fileURLToPath } from "node:url";

// Résout l'alias @/* (comme tsconfig "paths") pour les tests.
export default defineConfig({
  resolve: {
    alias: {
      "@": fileURLToPath(new URL(".", import.meta.url)),
    },
  },
  test: {
    environment: "node",
    include: ["lib/**/*.test.ts"],
  },
});
