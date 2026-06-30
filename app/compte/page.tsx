import Link from "next/link";
import { ChevronLeft, LogOut, Pencil, UtensilsCrossed } from "lucide-react";
import { getPrefs } from "@/lib/prefs";
import { getCurrentUser } from "@/lib/supabase/server";
import { repo } from "@/lib/repo";
import { signOut } from "@/app/actions";
import { buildPrefsSummary } from "@/lib/summary";
import { PrefsSummary } from "@/components/prefs-summary";
import { buttonClasses } from "@/components/ui/button";

// Dashboard du compte : récap des choix + accès aux repas, jamais bloquant.
export default async function ComptePage() {
  const [user, prefs, stores] = await Promise.all([
    getCurrentUser(),
    getPrefs(),
    repo.getStores(),
  ]);
  const store = prefs ? stores.find((s) => s.id === prefs.storeId) : undefined;
  const summary = prefs ? buildPrefsSummary(prefs, store) : null;

  return (
    <main className="mx-auto w-full max-w-md px-5 py-8">
      <Link
        href="/"
        className="mb-4 inline-flex items-center gap-1 text-sm text-on-surface-muted hover:text-on-surface"
      >
        <ChevronLeft size={16} /> Accueil
      </Link>

      <h1 className="text-2xl font-semibold tracking-tight">Mon compte</h1>
      <p className="mt-1 text-sm text-on-surface-muted">
        {user ? (
          <>Connecté · <span className="font-medium text-on-surface">{user.email}</span></>
        ) : (
          "Mode invité (sur cet appareil)"
        )}
      </p>

      {summary ? (
        <>
          <h2 className="mb-2 mt-7 text-sm font-semibold uppercase tracking-wide text-on-surface-muted">
            Tes choix
          </h2>
          <PrefsSummary summary={summary} />

          <div className="mt-5 space-y-3">
            <Link href="/plan" className={`${buttonClasses("primary", "lg")} w-full`}>
              <UtensilsCrossed size={18} /> Voir mes repas de la semaine
            </Link>
            <Link href="/onboarding" className={`${buttonClasses("secondary", "md")} w-full`}>
              <Pencil size={16} /> Modifier mes préférences
            </Link>
          </div>
        </>
      ) : (
        <div className="mt-7 rounded-[var(--radius-card)] border border-dashed border-outline bg-surface p-6 text-center">
          <p className="font-medium">Tu n&apos;as pas encore configuré tes repas.</p>
          <Link href="/onboarding" className={`${buttonClasses("primary", "lg")} mt-4 w-full`}>
            Commencer
          </Link>
        </div>
      )}

      <div className="mt-8 border-t border-outline pt-5">
        {user ? (
          <form action={signOut}>
            <button type="submit" className={`${buttonClasses("ghost", "md")} w-full text-error`}>
              <LogOut size={16} /> Se déconnecter
            </button>
          </form>
        ) : (
          <Link href="/login" className={`${buttonClasses("secondary", "md")} w-full`}>
            Se connecter / créer un compte
          </Link>
        )}
      </div>
    </main>
  );
}
