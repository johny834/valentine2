import Link from "next/link";
import { loadTemplates } from "@/lib/content";
import CreatePageClient from "./CreatePageClient";

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

      <CreatePageClient templates={templates} />
    </main>
  );
}
