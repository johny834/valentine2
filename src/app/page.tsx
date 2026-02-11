import { loadTemplates } from "@/lib/content";
import HomeClient from "./HomeClient";

export default function Home() {
  const templates = loadTemplates();

  return (
    <main className="py-8 sm:py-12">
      {/* Hero */}
      <header className="text-center mb-8">
        <p className="uppercase tracking-[0.2em] text-sm text-[#a24b4b] mb-2">
          Valentine Forge
        </p>
        <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-[#2d1f1a] mb-4">
          Vtipná valentýnka, která se nesnaží být roztomilá — a právě proto funguje.
        </h1>
        <p className="text-lg text-[#5c4038] max-w-2xl mx-auto">
          Vytvoř si satirickou, lehce žhavou (ale stále safe) valentýnku. 
          Vlastní ilustrace, sdílení jedním kliknutím.
        </p>
      </header>

      {/* Main builder */}
      <HomeClient templates={templates} />

      {/* Footer */}
      <footer className="text-center text-[#5c4038] text-sm mt-16 pt-8 border-t border-[#e0c2b3]">
        <p>Valentine Forge — vytvoř si vtipnou valentýnku a nebuď suchar. 💕</p>
      </footer>
    </main>
  );
}
