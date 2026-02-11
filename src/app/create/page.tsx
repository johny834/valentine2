import Link from "next/link";
import Image from "next/image";
import { loadTemplates } from "@/lib/content";

export default function CreatePage() {
  const templates = loadTemplates();

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

      {/* Template selection */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">
          1. Vyber šablonu
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {templates.map((template) => (
            <div
              key={template.id}
              className="bg-white rounded-2xl shadow-md p-4 cursor-pointer hover:ring-2 hover:ring-rose-400 transition-all"
            >
              <div className="aspect-square relative mb-3 bg-gradient-to-br from-pink-50 to-rose-100 rounded-xl overflow-hidden">
                <Image
                  src={template.illustrationPath}
                  alt={template.name}
                  fill
                  className="object-contain p-4"
                />
              </div>
              <p className="text-center font-medium text-gray-700">
                {template.name}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Placeholder pro formulář */}
      <section className="bg-white rounded-2xl shadow-lg p-8 mb-8">
        <p className="text-gray-500 text-center">
          🎨 Formulář pro generátor (T1.4)
        </p>
      </section>

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
