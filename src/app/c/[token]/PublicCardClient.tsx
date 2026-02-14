"use client";

import { useRef, useState } from "react";
import CardPreview from "@/components/CardPreview";
import type { Template } from "@/types/content";
import { exportElementToPng } from "@/lib/exportToPng";

interface Props {
  template: Template;
  toName?: string;
  fromName?: string;
  text: string;
  token: string;
  imagePath?: string;
}

export default function PublicCardClient({
  template,
  toName,
  fromName,
  text,
  token,
  imagePath,
}: Props) {
  const [isSaving, setIsSaving] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleSaveAsImage = async () => {
    if (!cardRef.current || isSaving) {
      return;
    }

    try {
      setIsSaving(true);
      const dataUrl = await exportElementToPng(cardRef.current);
      const link = document.createElement("a");
      link.download = `valentynka-${token}.png`;
      link.href = dataUrl;
      link.click();
    } catch {
      alert("Kartu se nepodařilo uložit. Zkus to prosím znovu.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      <div ref={cardRef} className="mb-8">
        <CardPreview
          template={template}
          toName={toName}
          fromName={fromName}
          text={text}
          imagePath={imagePath}
          size="large"
        />
      </div>

      <div className="flex justify-center">
        <button
          onClick={handleSaveAsImage}
          disabled={isSaving}
          className="bg-white hover:bg-gray-50 disabled:bg-gray-100 disabled:text-gray-400 text-rose-500 font-semibold py-3 px-8 rounded-full transition-colors shadow-lg border border-rose-200"
        >
          {isSaving ? "Ukládám..." : "Stáhnout kartu jako PNG"}
        </button>
      </div>
    </>
  );
}
