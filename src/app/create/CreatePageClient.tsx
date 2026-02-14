"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import GeneratorForm, { type FormData } from "@/components/GeneratorForm";
import type { Template, TextEntry } from "@/types/content";
import { selectText, reshuffleText } from "@/lib/textSelector";

interface Props {
  templates: Template[];
}

export default function CreatePageClient({ templates }: Props) {
  const router = useRouter();
  const [selectedText, setSelectedText] = useState<TextEntry | null>(null);
  const [formData, setFormData] = useState<FormData | null>(null);

  const handleGenerate = (data: FormData) => {
    setFormData(data);

    const text = selectText({
      tone: data.tone,
      keywords: data.keywords,
    });

    setSelectedText(text);
  };

  const handleReshuffle = () => {
    if (!formData) return;

    const text = reshuffleText(
      {
        tone: formData.tone,
        keywords: formData.keywords,
      },
      selectedText?.id
    );

    setSelectedText(text);
  };

  const handleContinue = () => {
    if (!formData || !selectedText) return;

    // Serialize to URL params for preview
    const params = new URLSearchParams({
      t: formData.templateId,
      to: formData.toName,
      from: formData.fromName,
      tone: formData.tone,
      text: selectedText.text,
    });

    if (selectedText.image) {
      params.set("img", selectedText.image);
    }

    router.push(`/preview?${params.toString()}`);
  };

  return (
    <>
      <GeneratorForm templates={templates} onGenerate={handleGenerate} />

      {selectedText && (
        <div className="mt-8 bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            Vygenerovaný text:
          </h2>
          <p className="text-lg text-gray-800 bg-rose-50 p-4 rounded-lg mb-4 font-medium">
            {selectedText.text}
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={handleReshuffle}
              className="flex-1 py-2 px-4 border-2 border-rose-300 text-rose-500 rounded-full font-medium hover:bg-rose-50 transition-colors"
            >
              🔄 Zkusit jiný text
            </button>
            <button
              onClick={handleContinue}
              className="flex-1 py-2 px-4 bg-rose-500 text-white rounded-full font-medium hover:bg-rose-600 transition-colors"
            >
              Pokračovat na náhled →
            </button>
          </div>
        </div>
      )}
    </>
  );
}
