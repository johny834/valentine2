import { loadTemplates } from "@/lib/content";
import HomeClient from "./HomeClient";

export default function Home() {
  const templates = loadTemplates();

  return (
    <main className="py-8 sm:py-12">
      {/* Hero */}
      <header className="text-center mb-8">
        <p className="tracking-[0.15em] text-sm text-[#a24b4b] mb-2 font-semibold">
          ✨ Digi-Valentýnka 💘
        </p>
        <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-[#2d1f1a] mb-4 leading-tight">
          Dokaž, že máš vkus — údernou valentýnkou
        </h1>
        <p className="text-lg text-[#5c4038] max-w-2xl mx-auto leading-relaxed">
          Zapomeň na univerzální básničky z internetu. Vytvoř valentýnku, která má vtip, jiskru a tvoji DNA. 
          <span className="block mt-2 font-medium text-[#2d1f1a]">Ať už jde o tajnou lásku, čerstvý vztah nebo manželství, kde už si nic nedarujete — s tímhle zaskóruješ!</span>
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
