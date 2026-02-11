import Link from "next/link";

export default function Home() {
  return (
    <main className="py-12 sm:py-20">
      {/* Hero */}
      <section className="text-center mb-16">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-rose-600 mb-4 font-handwriting">
          Valentine2 💕
        </h1>
        <p className="text-lg sm:text-xl text-gray-700 mb-8 max-w-2xl mx-auto">
          Vytvoř jedinečnou valentýnku s krásnými ilustracemi a vtipnými texty.
          Žádné AI, jen láska a kreativita.
        </p>
        <Link
          href="/create"
          className="inline-block bg-rose-500 hover:bg-rose-600 text-white font-semibold py-3 px-8 rounded-full text-lg transition-colors shadow-lg hover:shadow-xl"
        >
          Vytvořit kartu ❤️
        </Link>
      </section>

      {/* Jak to funguje */}
      <section className="mb-16">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 text-center mb-8">
          Jak to funguje?
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-white/80 backdrop-blur rounded-2xl p-6 text-center shadow-md">
            <div className="text-4xl mb-4">🎨</div>
            <h3 className="font-semibold text-lg mb-2">1. Vyber šablonu</h3>
            <p className="text-gray-600 text-sm">
              Zvol si z krásných ručně kreslených ilustrací
            </p>
          </div>
          <div className="bg-white/80 backdrop-blur rounded-2xl p-6 text-center shadow-md">
            <div className="text-4xl mb-4">✍️</div>
            <h3 className="font-semibold text-lg mb-2">2. Přidej text</h3>
            <p className="text-gray-600 text-sm">
              Vyber tón a nech si vygenerovat vtipný text
            </p>
          </div>
          <div className="bg-white/80 backdrop-blur rounded-2xl p-6 text-center shadow-md">
            <div className="text-4xl mb-4">💌</div>
            <h3 className="font-semibold text-lg mb-2">3. Pošli lásku</h3>
            <p className="text-gray-600 text-sm">
              Sdílej kartu nebo ji stáhni jako obrázek
            </p>
          </div>
        </div>
      </section>

      {/* Preview galerie - placeholder */}
      <section className="mb-16">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 text-center mb-8">
          Ukázky šablon
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-white rounded-2xl aspect-[3/4] shadow-md flex items-center justify-center text-gray-400"
            >
              <span className="text-6xl">💝</span>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center text-gray-500 text-sm border-t border-rose-200 pt-8">
        <div className="space-x-4">
          <Link href="#" className="hover:text-rose-500 transition-colors">
            Ochrana soukromí
          </Link>
          <Link href="#" className="hover:text-rose-500 transition-colors">
            Podmínky použití
          </Link>
        </div>
        <p className="mt-4">Made with ❤️ in Prague</p>
      </footer>
    </main>
  );
}
