"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import type { Template, Tone } from "@/types/content";

interface Props {
  template: Template;
  toName: string;
  fromName: string;
  text: string;
  tone: Tone;
  imagePath?: string;
}

const CATEGORIES: { tone: Tone; label: string; emoji: string }[] = [
  { tone: "funny", label: "Vtipné", emoji: "😄" },
  { tone: "cute", label: "Romantické", emoji: "💕" },
  { tone: "spicy", label: "Spicy", emoji: "🔥" },
  { tone: "office", label: "The Office", emoji: "📋" },
  { tone: "taylor", label: "Taylor Swift", emoji: "🎤" },
];

export default function PreviewPageClient({
  template,
  toName,
  fromName,
  text,
  tone,
  imagePath,
}: Props) {
  const router = useRouter();
  const [isSending, setIsSending] = useState(false);

  const displayImage = imagePath || template.illustrationPath;

  const handleSendSurprise = async () => {
    if (isSending) return;

    setIsSending(true);

    try {
      const response = await fetch("/api/cards", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          templateId: template.id,
          toName,
          fromName,
          tone,
          messageText: text,
          isAnonymous: fromName === "Anonym",
          imagePath: imagePath || undefined,
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.publicUrl) {
        throw new Error(result.error || "Nepodařilo se vytvořit sdílený odkaz");
      }

      router.push(result.publicUrl);
    } catch {
      alert("Nepodařilo se vytvořit sdílený odkaz. Zkus to prosím znovu.");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <>
      <div className="mb-8">
        <div className="valentine-card max-w-2xl mx-auto">
          <div className="h-[28rem] sm:h-[34rem] bg-gradient-to-br from-[#ffdde1] to-[#ee9ca7] flex items-center justify-center overflow-hidden">
            <div className={`relative ${imagePath ? "w-full h-full" : "w-48 h-48 sm:w-56 sm:h-56"}`}>
              <Image
                src={displayImage}
                alt="Valentine card"
                fill
                className={imagePath ? "object-cover" : "object-contain drop-shadow-lg"}
                priority
              />
            </div>
          </div>

          <div className="p-8 sm:p-10">
            <p className="text-base font-semibold text-[#a24b4b] mb-2">
              Pro <span className="text-[#2d1f1a]">{toName}</span>
            </p>

            <p className="font-display text-3xl sm:text-4xl font-bold text-[#2d1f1a] my-6 leading-snug">
              {text}
            </p>

            <p className="text-base font-semibold text-[#a24b4b] text-right">
              S láskou, <span className="text-[#2d1f1a]">{fromName}</span>
            </p>

            <div className="mt-5 inline-block bg-[#2d1f1a] text-white px-4 py-1.5 rounded-full text-sm uppercase tracking-wider">
              {CATEGORIES.find((c) => c.tone === tone)?.label} {CATEGORIES.find((c) => c.tone === tone)?.emoji}
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
        <button
          onClick={handleSendSurprise}
          disabled={isSending}
          className="flex-1 bg-rose-500 hover:bg-rose-600 disabled:bg-rose-300 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-full transition-colors shadow-lg"
        >
          {isSending ? "Posílám překvápko..." : "Poslat překvápko 💌"}
        </button>
      </div>
    </>
  );
}
