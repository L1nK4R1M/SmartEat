import Link from "next/link";
import { getPrefs } from "@/lib/prefs";
import { buttonClasses } from "@/components/ui/button";

const PITCH = [
  { emoji: "🍽️", title: "Choisissez vos repas", text: "Selon votre régime, équipement et budget." },
  { emoji: "🧠", title: "L'app fait le tri", text: "Seules les recettes que vous pouvez cuisiner." },
  { emoji: "🛒", title: "Liste prête", text: "Groupée par rayon, en moins de 3 clics." },
];

export default async function Home() {
  const prefs = await getPrefs();

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-md flex-col px-6 py-10">
      <div className="flex flex-1 flex-col justify-center">
        <span className="text-5xl" aria-hidden>
          🥗
        </span>
        <h1 className="mt-6 text-4xl font-bold tracking-tight">
          Vos repas et vos courses, <span className="text-primary">sans la charge mentale.</span>
        </h1>
        <p className="mt-4 text-lg text-on-surface-muted">
          SmartEat sélectionne des repas adaptés à votre régime et à votre équipement, puis génère
          votre liste de courses optimisée.
        </p>

        <ul className="mt-10 space-y-4">
          {PITCH.map((p) => (
            <li key={p.title} className="flex items-start gap-4">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-surface-variant text-xl">
                {p.emoji}
              </span>
              <div>
                <p className="font-semibold">{p.title}</p>
                <p className="text-sm text-on-surface-muted">{p.text}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-10 space-y-3">
        {prefs ? (
          <>
            <Link href="/plan" className={`${buttonClasses("primary", "lg")} w-full`}>
              Reprendre mes repas
            </Link>
            <Link href="/onboarding" className={`${buttonClasses("ghost", "md")} w-full`}>
              Modifier mes préférences
            </Link>
          </>
        ) : (
          <Link href="/onboarding" className={`${buttonClasses("primary", "lg")} w-full`}>
            Commencer
          </Link>
        )}
      </div>
    </main>
  );
}
