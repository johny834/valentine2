import { notFound } from "next/navigation";
import { Metadata } from "next";
import PublicCardClient from "./PublicCardClient";
import type { PublicCard, TemplateSnapshot } from "@/types/database";

interface PageProps {
  params: Promise<{ token: string }>;
}

async function getCard(token: string): Promise<PublicCard | null> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  
  try {
    const res = await fetch(`${baseUrl}/api/cards/${token}`, {
      cache: "no-store", // Always fetch fresh data
    });
    
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { token } = await params;
  const card = await getCard(token);
  
  if (!card) {
    return {
      title: "Kartička nenalezena",
    };
  }

  const toText = card.toName ? `pro ${card.toName}` : "";
  
  return {
    title: `Valentýnka ${toText} 💕`,
    description: card.messageText.slice(0, 160),
    openGraph: {
      title: `Valentýnka ${toText} 💕`,
      description: card.messageText.slice(0, 160),
      type: "website",
    },
  };
}

export default async function PublicCardPage({ params }: PageProps) {
  const { token } = await params;
  const card = await getCard(token);

  if (!card) {
    notFound();
  }

  // Convert template snapshot to Template type for CardPreview
  const template = {
    id: card.template.id,
    name: card.template.name,
    illustrationPath: card.template.illustrationPath,
    styleTokens: card.template.styleTokens,
  };

  return (
    <main className="min-h-screen py-8 sm:py-12 px-4">
      <div className="max-w-lg mx-auto">
        <h1 className="text-2xl sm:text-3xl font-bold text-center text-gray-800 mb-6">
          Máš valentýnku! 💌
        </h1>

        <PublicCardClient
          template={template}
          toName={card.toName ?? undefined}
          fromName={card.fromName ?? "Tajný ctitel"}
          text={card.messageText}
          token={token}
        />

        {/* Expiry notice */}
        {card.expiresAt && (
          <p className="text-center text-sm text-gray-400 mt-8">
            Tato kartička vyprší {new Date(card.expiresAt).toLocaleDateString("cs-CZ")}
          </p>
        )}

        {/* Create your own CTA */}
        <div className="mt-12 text-center">
          <p className="text-gray-600 mb-4">Chceš poslat vlastní valentýnku?</p>
          <a
            href="/"
            className="inline-block bg-rose-500 hover:bg-rose-600 text-white font-semibold py-3 px-8 rounded-full transition-colors shadow-lg"
          >
            Vytvořit kartičku 💕
          </a>
        </div>
      </div>
    </main>
  );
}
