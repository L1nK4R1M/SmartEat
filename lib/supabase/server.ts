import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

// Client Supabase côté serveur (RSC / Server Actions / Route Handlers).
// Renvoie null si les variables d'env ne sont pas configurées -> l'app
// fonctionne alors en mode invité (cookie/localStorage), rien ne casse.
export async function getSupabaseServer() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;

  const cookieStore = await cookies();
  return createServerClient(url, key, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          for (const { name, value, options } of cookiesToSet) {
            cookieStore.set(name, value, options);
          }
        } catch {
          // Appelé depuis un Server Component (cookies en lecture seule) —
          // le rafraîchissement de session est géré par le middleware.
        }
      },
    },
  });
}

// Utilisateur courant (ou null) — raccourci pratique.
export async function getCurrentUser() {
  const supabase = await getSupabaseServer();
  if (!supabase) return null;
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}
