"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronLeft, Mail, Check, Lock } from "lucide-react";
import { getSupabaseBrowser } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Mode = "signin" | "signup";

export default function LoginPage() {
  const router = useRouter();
  const supabase = useMemo(() => getSupabaseBrowser(), []);
  const configured = !!supabase;

  const [mode, setMode] = useState<Mode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ kind: "error" | "info"; text: string } | null>(null);

  useEffect(() => {
    if (!supabase) return;
    supabase.auth.getUser().then(({ data }) => setUserEmail(data.user?.email ?? null));
  }, [supabase]);

  async function withPassword(e: React.FormEvent) {
    e.preventDefault();
    if (!supabase) return;
    setBusy(true);
    setMsg(null);
    if (mode === "signup") {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
      });
      setBusy(false);
      if (error) return setMsg({ kind: "error", text: error.message });
      if (data.session) {
        router.push("/compte");
        router.refresh();
      } else {
        setMsg({ kind: "info", text: "Compte créé ! Vérifie ton e-mail pour le confirmer, puis connecte-toi." });
        setMode("signin");
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      setBusy(false);
      if (error) return setMsg({ kind: "error", text: "E-mail ou mot de passe incorrect." });
      router.push("/compte");
      router.refresh();
    }
  }

  async function magicLink() {
    if (!supabase || !email) {
      setMsg({ kind: "error", text: "Saisis ton e-mail d'abord." });
      return;
    }
    setBusy(true);
    setMsg(null);
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
    });
    setBusy(false);
    setMsg(
      error
        ? { kind: "error", text: error.message }
        : { kind: "info", text: `Lien magique envoyé à ${email}.` },
    );
  }

  async function logout() {
    if (!supabase) return;
    await supabase.auth.signOut();
    setUserEmail(null);
    router.refresh();
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

        {!configured ? (
          <>
            <h1 className="mt-6 text-3xl font-bold tracking-tight">Connexion</h1>
            <p className="mt-6 rounded-2xl border border-outline bg-surface-variant p-4 text-sm text-on-surface-muted">
              La connexion n&apos;est pas encore configurée sur cet environnement. L&apos;app reste
              utilisable en mode invité.
            </p>
          </>
        ) : userEmail ? (
          <div className="space-y-3">
            <h1 className="text-3xl font-bold tracking-tight">Te voilà connecté</h1>
            <div className="flex items-center gap-2 rounded-2xl border border-primary/30 bg-primary/8 p-4 text-sm">
              <Check size={16} className="text-primary" /> {userEmail}
            </div>
            <Link href="/compte" className="block">
              <Button size="lg" className="w-full">
                Mon compte
              </Button>
            </Link>
            <Button onClick={logout} variant="ghost" size="md" className="w-full">
              Se déconnecter
            </Button>
          </div>
        ) : (
          <>
            <h1 className="mt-6 text-3xl font-bold tracking-tight">
              {mode === "signin" ? "Connexion" : "Créer un compte"}
            </h1>
            <p className="mt-2 text-on-surface-muted">
              Tes repas, ton placard et ton budget te suivent sur tous tes appareils.
            </p>

            {/* Onglets connexion / inscription */}
            <div className="mt-6 grid grid-cols-2 rounded-full border border-outline p-1 text-sm font-medium">
              {(["signin", "signup"] as Mode[]).map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => {
                    setMode(m);
                    setMsg(null);
                  }}
                  className={cn(
                    "rounded-full py-2 transition-colors",
                    mode === m ? "bg-primary text-on-primary" : "text-on-surface-muted",
                  )}
                >
                  {m === "signin" ? "Connexion" : "Inscription"}
                </button>
              ))}
            </div>

            <form onSubmit={withPassword} className="mt-4 space-y-3">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ton@email.com"
                autoComplete="email"
                className="h-12 w-full rounded-2xl border border-outline bg-surface px-4 outline-none focus:border-primary focus:ring-2 focus:ring-primary"
              />
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Mot de passe (6 caractères min.)"
                autoComplete={mode === "signup" ? "new-password" : "current-password"}
                className="h-12 w-full rounded-2xl border border-outline bg-surface px-4 outline-none focus:border-primary focus:ring-2 focus:ring-primary"
              />
              <Button size="lg" className="w-full" disabled={busy}>
                <Lock size={16} />
                {busy ? "…" : mode === "signin" ? "Se connecter" : "Créer mon compte"}
              </Button>
            </form>

            <button
              type="button"
              onClick={magicLink}
              disabled={busy}
              className="mt-3 inline-flex w-full items-center justify-center gap-1.5 text-sm font-medium text-primary hover:underline"
            >
              <Mail size={15} /> Recevoir plutôt un lien magique
            </button>

            {msg && (
              <p
                className={cn(
                  "mt-4 rounded-2xl p-3 text-sm",
                  msg.kind === "error"
                    ? "bg-error/10 text-error"
                    : "border border-primary/30 bg-primary/8",
                )}
              >
                {msg.text}
              </p>
            )}
          </>
        )}
      </div>
    </main>
  );
}
