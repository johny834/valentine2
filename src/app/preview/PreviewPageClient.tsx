"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import CardPreview from "@/components/CardPreview";
import type { Template } from "@/types/content";

interface Props {
  template: Template;
  toName: string;
  fromName: string;
  text: string;
  tone: string;
}

export default function PreviewPageClient({
  template,
  toName,
  fromName,
  text,
  tone,
}: Props) {
  const router = useRouter();
  const [isSending, setIsSending] = useState(false);

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
        <CardPreview
          template={template}
          toName={toName || undefined}
          fromName={fromName}
          text={text}
        />
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
