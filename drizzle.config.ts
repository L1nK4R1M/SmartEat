import "dotenv/config";
import { defineConfig } from "drizzle-kit";

// Migrations Postgres (cible de production). Requiert DATABASE_URL.
// Usage : `npx drizzle-kit generate` puis `npx drizzle-kit migrate`.
export default defineConfig({
  schema: "./db/schema.ts",
  out: "./db/migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL ?? "postgres://localhost:5432/smarteat",
  },
});
