import Link from "next/link";

export default function PreviewPage() {
  return (
    <main className="py-12">
      <div className="mb-8">
        <Link
          href="/create"
          className="text-rose-500 hover:text-rose-600 transition-colors"
        >
          ← Zpět na úpravy
        </Link>
      </div>

      <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-8 text-center">
        Náhled karty
      </h1>

      {/* Placeholder pro preview karty */}
      <div className="bg-white rounded-2xl shadow-lg aspect-[3/4] max-w-md mx-auto mb-8 flex items-center justify-center">
        <div className="text-center text-gray-400">
          <span className="text-8xl block mb-4">💝</span>
          <p>Zde bude náhled karty (T1.6 - T1.7)</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <button className="bg-rose-500 hover:bg-rose-600 text-white font-semibold py-3 px-8 rounded-full transition-colors shadow-lg">
          Stáhnout kartu 📥
        </button>
        <button className="bg-white hover:bg-gray-50 text-rose-500 font-semibold py-3 px-8 rounded-full transition-colors shadow-lg border border-rose-200">
          Sdílet 🔗
        </button>
      </div>
    </main>
  );
}
