import { loadTemplates } from "@/lib/content";
import HomeClient from "./HomeClient";

export default function Home() {
  const templates = loadTemplates();

  return (
    <main className="py-8 sm:py-12">
      {/* Hero */}
      <header className="text-center mb-8">
        <p className="uppercase tracking-[0.2em] text-sm text-[#a24b4b] mb-2 font-semibold">
          💘 Digi-Valentýnka
        </p>
        <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-[#2d1f1a] mb-4 leading-tight">
          Řekni to, co si fakt myslíš.
          <span className="block text-[#a24b4b]">(A co by se na plyšáka nevešlo.)</span>
        </h1>
        <p className="text-lg text-[#5c4038] max-w-2xl mx-auto">
          Zapomeň na přeslazená klišé. Vyber hlášku, která sedí, personalizuj a pošli.
          <span className="font-semibold text-[#2d1f1a]"> Za 30 vteřin máš hotovo.</span>
        </p>
      </header>

      {/* Main builder */}
      <HomeClient templates={templates} />

      {/* Footer */}
      <footer className="text-center text-[#5c4038] text-sm mt-16 pt-8 border-t border-[#e0c2b3]">
        <p>🔥 Make it hot (but safe) — digitální důkaz lásky, co v koši neskončí.</p>
      </footer>
    </main>
  );
}
