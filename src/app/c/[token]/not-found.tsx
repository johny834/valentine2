import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen flex items-center justify-center py-12 px-4">
      <div className="text-center max-w-md">
        <div className="text-6xl mb-6">💔</div>
        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          Kartička nenalezena
        </h1>
        <p className="text-gray-600 mb-8">
          Tato valentýnka neexistuje, vypršela nebo byla odstraněna.
        </p>
        <Link
          href="/"
          className="inline-block bg-rose-500 hover:bg-rose-600 text-white font-semibold py-3 px-8 rounded-full transition-colors shadow-lg"
        >
          Vytvořit novou kartičku 💕
        </Link>
      </div>
    </main>
  );
}
