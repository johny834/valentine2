"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import GeneratorForm, { type FormData } from "@/components/GeneratorForm";
import type { Template } from "@/types/content";

interface Props {
  templates: Template[];
}

export default function CreatePageClient({ templates }: Props) {
  const router = useRouter();
  const [generatedText, setGeneratedText] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData | null>(null);

  const handleGenerate = (data: FormData) => {
    setFormData(data);
    // Placeholder - will be replaced by T1.5 text selector
    setGeneratedText("💕 Vygenerovaný text se zobrazí zde (T1.5)");
  };

  const handleContinue = () => {
    if (!formData || !generatedText) return;
    
    // Serialize to URL params for preview
    const params = new URLSearchParams({
      t: formData.templateId,
      to: formData.toName,
      from: formData.fromName,
      text: generatedText,
    });
    
    router.push(`/preview?${params.toString()}`);
  };

  return (
    <>
      <GeneratorForm templates={templates} onGenerate={handleGenerate} />

      {generatedText && (
        <div className="mt-8 bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            Vygenerovaný text:
          </h2>
          <p className="text-lg text-gray-800 bg-rose-50 p-4 rounded-lg mb-4">
            {generatedText}
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => handleGenerate(formData!)}
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
