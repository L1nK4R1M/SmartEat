"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ChevronLeft, Mail, Check } from "lucide-react";
import { getSupabaseBrowser } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";

type Status = "idle" | "loading" | "sent" | "error" | "unconfigured";

export default function LoginPage() {
  const supabase = useMemo(() => getSupabaseBrowser(), []);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>(supabase ? "idle" : "unconfigured");
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    if (!supabase) return;
    supabase.auth.getUser().then(({ data }) => setUserEmail(data.user?.email ?? null));
  }, [supabase]);

  async function sendLink(e: React.FormEvent) {
    e.preventDefault();
    if (!supabase) return;
    setStatus("loading");
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
    });
    setStatus(error ? "error" : "sent");
  }

  async function signOut() {
    if (!supabase) return;
    await supabase.auth.signOut();
    setUserEmail(null);
    setStatus("idle");
  }

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-md flex-col px-6 py-10">
      <Link
        href="/"
        className="mb-6 inline-flex items-center gap-1 text-sm text-on-surface-muted hover:text-on-surface"
      >
        <ChevronLeft size={16} /> Accueil
      </Link>

      <div className="flex flex-1 flex-col justify-center">
        <span className="text-5xl" aria-hidden>
          🥗
        </span>
        <h1 className="mt-6 text-3xl font-bold tracking-tight">Connexion</h1>
        <p className="mt-2 text-on-surface-muted">
          Reçois un lien magique par e-mail. Tes repas, ton placard et ton budget te suivront sur
          tous tes appareils.
        </p>

        {status === "unconfigured" && (
          <p className="mt-8 rounded-2xl border border-outline bg-surface-variant p-4 text-sm text-on-surface-muted">
            La connexion n&apos;est pas encore configurée sur cet environnement. L&apos;app reste
            utilisable en mode invité.
          </p>
        )}

        {status !== "unconfigured" && userEmail && (
          <div className="mt-8 space-y-3">
            <div className="flex items-center gap-2 rounded-2xl border border-primary/30 bg-primary/8 p-4 text-sm">
              <Check size={16} className="text-primary" /> Connecté en tant que{" "}
              <span className="font-medium">{userEmail}</span>
            </div>
            <Link href="/plan" className="block">
              <Button size="lg" className="w-full">
                Voir mes repas
              </Button>
            </Link>
            <Button onClick={signOut} variant="ghost" size="md" className="w-full">
              Se déconnecter
            </Button>
          </div>
        )}

        {status !== "unconfigured" && !userEmail && status !== "sent" && (
          <form onSubmit={sendLink} className="mt-8 space-y-3">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ton@email.com"
              autoComplete="email"
              className="h-12 w-full rounded-2xl border border-outline bg-surface px-4 outline-none focus:border-primary focus:ring-2 focus:ring-primary"
            />
            <Button size="lg" className="w-full" disabled={status === "loading"}>
              <Mail size={18} /> {status === "loading" ? "Envoi…" : "Recevoir le lien"}
            </Button>
            {status === "error" && (
              <p className="text-sm text-error">Échec de l&apos;envoi. Réessaie.</p>
            )}
          </form>
        )}

        {status === "sent" && (
          <div className="mt-8 rounded-2xl border border-primary/30 bg-primary/8 p-4">
            <p className="flex items-center gap-2 font-medium">
              <Mail size={18} className="text-primary" /> Lien envoyé !
            </p>
            <p className="mt-1 text-sm text-on-surface-muted">
              Ouvre l&apos;e-mail envoyé à <span className="font-medium">{email}</span> et clique sur
              le lien pour te connecter.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
