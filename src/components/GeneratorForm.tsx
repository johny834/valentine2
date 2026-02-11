"use client";

import { useState } from "react";
import Image from "next/image";
import type { Template, Tone } from "@/types/content";

interface GeneratorFormProps {
  templates: Template[];
  onGenerate: (data: FormData) => void;
}

export interface FormData {
  templateId: string;
  toName: string;
  fromName: string;
  tone: Tone;
  keywords: string;
  isAnonymous: boolean;
}

const TONES: { value: Tone; label: string; emoji: string }[] = [
  { value: "cute", label: "Roztomilý", emoji: "🥰" },
  { value: "funny", label: "Vtipný", emoji: "😄" },
  { value: "spicy", label: "Pikantní", emoji: "🔥" },
  { value: "sarcastic", label: "Sarkastický", emoji: "🙃" },
];

export default function GeneratorForm({ templates, onGenerate }: GeneratorFormProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<string>("");
  const [toName, setToName] = useState("");
  const [fromName, setFromName] = useState("");
  const [tone, setTone] = useState<Tone>("cute");
  const [keywords, setKeywords] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!selectedTemplate) {
      newErrors.template = "Vyber šablonu";
    }
    if (toName.length > 32) {
      newErrors.toName = "Max 32 znaků";
    }
    if (fromName.length > 32) {
      newErrors.fromName = "Max 32 znaků";
    }
    if (keywords.length > 140) {
      newErrors.keywords = "Max 140 znaků";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;

    onGenerate({
      templateId: selectedTemplate,
      toName: toName.trim(),
      fromName: isAnonymous ? "Anonym" : (fromName.trim() || "Anonym"),
      tone,
      keywords: keywords.trim(),
      isAnonymous,
    });
  };

  return (
    <div className="space-y-8">
      {/* Template selection */}
      <section>
        <h2 className="text-xl font-semibold text-gray-700 mb-4">
          1. Vyber šablonu
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {templates.map((template) => (
            <button
              key={template.id}
              type="button"
              onClick={() => setSelectedTemplate(template.id)}
              className={`bg-white rounded-2xl shadow-md p-4 transition-all text-left ${
                selectedTemplate === template.id
                  ? "ring-2 ring-rose-500 shadow-lg"
                  : "hover:ring-2 hover:ring-rose-300"
              }`}
            >
              <div className="aspect-square relative mb-3 bg-gradient-to-br from-pink-50 to-rose-100 rounded-xl overflow-hidden">
                <Image
                  src={template.illustrationPath}
                  alt={template.name}
                  fill
                  className="object-contain p-4"
                />
              </div>
              <p className="text-center font-medium text-gray-700">
                {template.name}
              </p>
            </button>
          ))}
        </div>
        {errors.template && (
          <p className="text-red-500 text-sm mt-2">{errors.template}</p>
        )}
      </section>

      {/* Names */}
      <section className="bg-white rounded-2xl shadow-lg p-6">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">
          2. Komu a od koho?
        </h2>
        
        <div className="space-y-4">
          <div>
            <label htmlFor="toName" className="block text-sm font-medium text-gray-600 mb-1">
              Komu (volitelné)
            </label>
            <input
              id="toName"
              type="text"
              value={toName}
              onChange={(e) => setToName(e.target.value)}
              placeholder="Např. Terezka"
              maxLength={32}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-400 focus:border-transparent outline-none transition-all"
            />
            {errors.toName && (
              <p className="text-red-500 text-sm mt-1">{errors.toName}</p>
            )}
          </div>

          <div>
            <label htmlFor="fromName" className="block text-sm font-medium text-gray-600 mb-1">
              Od koho (volitelné)
            </label>
            <input
              id="fromName"
              type="text"
              value={fromName}
              onChange={(e) => setFromName(e.target.value)}
              placeholder="Např. Tvůj tajný ctitel"
              maxLength={32}
              disabled={isAnonymous}
              className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-400 focus:border-transparent outline-none transition-all ${
                isAnonymous ? "bg-gray-100 text-gray-400" : ""
              }`}
            />
            {errors.fromName && (
              <p className="text-red-500 text-sm mt-1">{errors.fromName}</p>
            )}
          </div>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={isAnonymous}
              onChange={(e) => setIsAnonymous(e.target.checked)}
              className="w-4 h-4 text-rose-500 rounded focus:ring-rose-400"
            />
            <span className="text-sm text-gray-600">Chci zůstat v anonymitě 🕵️</span>
          </label>
        </div>
      </section>

      {/* Tone selection */}
      <section className="bg-white rounded-2xl shadow-lg p-6">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">
          3. Jaký tón?
        </h2>
        
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {TONES.map((t) => (
            <button
              key={t.value}
              type="button"
              onClick={() => setTone(t.value)}
              className={`p-3 rounded-xl border-2 transition-all ${
                tone === t.value
                  ? "border-rose-500 bg-rose-50"
                  : "border-gray-200 hover:border-rose-300"
              }`}
            >
              <span className="text-2xl block mb-1">{t.emoji}</span>
              <span className="text-sm font-medium text-gray-700">{t.label}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Keywords */}
      <section className="bg-white rounded-2xl shadow-lg p-6">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">
          4. Něco navíc? (volitelné)
        </h2>
        
        <textarea
          value={keywords}
          onChange={(e) => setKeywords(e.target.value)}
          placeholder="Společný vtip, přezdívka, oblíbené jídlo..."
          maxLength={140}
          rows={3}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-400 focus:border-transparent outline-none transition-all resize-none"
        />
        <div className="flex justify-between text-sm text-gray-400 mt-1">
          <span>Pomůže vybrat lepší text</span>
          <span>{keywords.length}/140</span>
        </div>
        {errors.keywords && (
          <p className="text-red-500 text-sm mt-1">{errors.keywords}</p>
        )}
      </section>

      {/* Submit */}
      <div className="text-center">
        <button
          type="button"
          onClick={handleSubmit}
          className="bg-rose-500 hover:bg-rose-600 text-white font-semibold py-3 px-8 rounded-full text-lg transition-colors shadow-lg hover:shadow-xl"
        >
          Vygenerovat text ✨
        </button>
      </div>
    </div>
  );
}
