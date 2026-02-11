import Link from "next/link";

export default function CreatePage() {
  return (
    <main className="py-12">
      <div className="mb-8">
        <Link
          href="/"
          className="text-rose-500 hover:text-rose-600 transition-colors"
        >
          ← Zpět na úvod
        </Link>
      </div>

      <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-8 text-center">
        Vytvoř svou valentýnku
      </h1>

      {/* Placeholder pro generátor */}
      <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
        <p className="text-gray-500 text-center">
          🎨 Zde bude generátor karet (T1.4 - T1.5)
        </p>
      </div>

      <div className="text-center">
        <Link
          href="/preview"
          className="inline-block bg-rose-500 hover:bg-rose-600 text-white font-semibold py-3 px-8 rounded-full text-lg transition-colors shadow-lg"
        >
          Pokračovat na náhled →
        </Link>
      </div>
    </main>
  );
}
