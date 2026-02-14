"use client";

import CardPreview from "@/components/CardPreview";
import type { Template } from "@/types/content";

interface Props {
  template: Template;
  toName?: string;
  fromName?: string;
  text: string;
  token: string;
}

export default function PublicCardClient({
  template,
  toName,
  fromName,
  text,
  token,
}: Props) {
  const shareUrl = typeof window !== "undefined" 
    ? window.location.href 
    : `${process.env.NEXT_PUBLIC_SITE_URL}/c/${token}`;

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Moje valentýnka 💕",
          text: toName ? `Valentýnka pro ${toName}!` : "Podívej se na moji valentýnku!",
          url: shareUrl,
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
    navigator.clipboard.writeText(shareUrl);
    alert("Odkaz zkopírován do schránky! 📋");
  };

  return (
    <>
      <div className="mb-8">
        <CardPreview
          template={template}
          toName={toName}
          fromName={fromName}
          text={text}
          size="large"
        />
      </div>

      <div className="flex justify-center">
        <button
          onClick={handleShare}
          className="bg-white hover:bg-gray-50 text-rose-500 font-semibold py-3 px-8 rounded-full transition-colors shadow-lg border border-rose-200"
        >
          Ukázat i ostatním 📤
        </button>
      </div>
    </>
  );
}
