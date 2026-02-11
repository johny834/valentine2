"use client";

import CardPreview from "@/components/CardPreview";
import type { Template } from "@/types/content";

interface Props {
  template: Template;
  toName: string;
  fromName: string;
  text: string;
}

export default function PreviewPageClient({
  template,
  toName,
  fromName,
  text,
}: Props) {
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Moje valentýnka 💕",
          text: text,
          url: window.location.href,
        });
      } catch {
        // User cancelled or share failed
        copyToClipboard();
      }
    } else {
      copyToClipboard();
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(window.location.href);
    alert("Odkaz zkopírován do schránky! 📋");
  };

  return (
    <>
      <div className="mb-8">
        <CardPreview
          template={template}
          toName={toName || undefined}
          fromName={fromName}
          text={text}
        />
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
        <button
          onClick={() => alert("Stahování bude v další verzi 🚧")}
          className="flex-1 bg-rose-500 hover:bg-rose-600 text-white font-semibold py-3 px-6 rounded-full transition-colors shadow-lg"
        >
          Stáhnout kartu 📥
        </button>
        <button
          onClick={handleShare}
          className="flex-1 bg-white hover:bg-gray-50 text-rose-500 font-semibold py-3 px-6 rounded-full transition-colors shadow-lg border border-rose-200"
        >
          Sdílet 🔗
        </button>
      </div>
    </>
  );
}
