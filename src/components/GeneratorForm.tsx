"use client";

import { useState } from "react";
import type { Template, Tone } from "@/types/content";
import { MAX_LENGTHS, containsBlockedContent, escapeHtml } from "@/lib/validation";
import TemplateGallery from "./TemplateGallery";

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
    if (toName.length > MAX_LENGTHS.toName) {
      newErrors.toName = `Max ${MAX_LENGTHS.toName} znaků`;
    }
    if (fromName.length > MAX_LENGTHS.fromName) {
      newErrors.fromName = `Max ${MAX_LENGTHS.fromName} znaků`;
    }
    if (keywords.length > MAX_LENGTHS.keywords) {
      newErrors.keywords = `Max ${MAX_LENGTHS.keywords} znaků`;
    }

    // Check for blocked content
    if (containsBlockedContent(toName)) {
      newErrors.toName = "Text obsahuje nevhodný obsah";
    }
    if (containsBlockedContent(fromName)) {
      newErrors.fromName = "Text obsahuje nevhodný obsah";
    }
    if (containsBlockedContent(keywords)) {
      newErrors.keywords = "Text obsahuje nevhodný obsah";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;

    onGenerate({
      templateId: selectedTemplate,
      toName: escapeHtml(toName.trim()),
      fromName: isAnonymous ? "Anonym" : escapeHtml(fromName.trim() || "Anonym"),
      tone,
      keywords: escapeHtml(keywords.trim()),
      isAnonymous,
    });
  };

  const handleTemplateSelect = (template: Template) => {
    setSelectedTemplate(template.id);
  };

  return (
    <div className="space-y-8">
      {/* Template selection */}
      <section>
        <h2 className="text-xl font-semibold text-gray-700 mb-4">
          1. Vyber šablonu
        </h2>
        <TemplateGallery
          templates={templates}
          selectedId={selectedTemplate}
          onSelect={handleTemplateSelect}
          interactive={true}
          showLabels={true}
        />
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
              maxLength={MAX_LENGTHS.toName}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-rose-400 focus:border-transparent outline-none transition-all ${
                errors.toName ? "border-red-400" : "border-gray-300"
              }`}
            />
            <div className="flex justify-between text-sm mt-1">
              {errors.toName ? (
                <span className="text-red-500">{errors.toName}</span>
              ) : (
                <span />
              )}
              <span className="text-gray-400">{toName.length}/{MAX_LENGTHS.toName}</span>
            </div>
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
              maxLength={MAX_LENGTHS.fromName}
              disabled={isAnonymous}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-rose-400 focus:border-transparent outline-none transition-all ${
                isAnonymous ? "bg-gray-100 text-gray-400" : ""
              } ${errors.fromName ? "border-red-400" : "border-gray-300"}`}
            />
            <div className="flex justify-between text-sm mt-1">
              {errors.fromName ? (
                <span className="text-red-500">{errors.fromName}</span>
              ) : (
                <span />
              )}
              <span className="text-gray-400">{fromName.length}/{MAX_LENGTHS.fromName}</span>
            </div>
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
          maxLength={MAX_LENGTHS.keywords}
          rows={3}
          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-rose-400 focus:border-transparent outline-none transition-all resize-none ${
            errors.keywords ? "border-red-400" : "border-gray-300"
          }`}
        />
        <div className="flex justify-between text-sm mt-1">
          {errors.keywords ? (
            <span className="text-red-500">{errors.keywords}</span>
          ) : (
            <span className="text-gray-400">Pomůže vybrat lepší text</span>
          )}
          <span className="text-gray-400">{keywords.length}/{MAX_LENGTHS.keywords}</span>
        </div>
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
