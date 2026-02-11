"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import type { Template, Tone } from "@/types/content";
import { MAX_LENGTHS, containsBlockedContent } from "@/lib/validation";
import { selectText, reshuffleText } from "@/lib/textSelector";

interface Props {
  templates: Template[];
}

const TONES: { value: Tone; label: string; emoji: string }[] = [
  { value: "cute", label: "Roztomilý", emoji: "🥰" },
  { value: "funny", label: "Vtipný", emoji: "😄" },
  { value: "spicy", label: "Pikantní", emoji: "🔥" },
  { value: "sarcastic", label: "Sarkastický", emoji: "🙃" },
];

export default function HomeClient({ templates }: Props) {
  const [selectedTemplate, setSelectedTemplate] = useState<Template>(templates[0]);
  const [fromName, setFromName] = useState("");
  const [toName, setToName] = useState("");
  const [customMessage, setCustomMessage] = useState("");
  const [tone, setTone] = useState<Tone>("funny");
  const [generatedText, setGeneratedText] = useState<string | null>(null);
  const [lastTextId, setLastTextId] = useState<string | null>(null);

  // Live preview values
  const displayFrom = fromName.trim() || "Tajný ctitel";
  const displayTo = toName.trim() || "Tebe";
  const displayText = customMessage.trim() || generatedText || "Klikni na 'Vygenerovat text' a uvidíš kouzlo ✨";

  const handleGenerate = () => {
    const text = selectText({
      tone,
      keywords: customMessage,
      excludeIds: lastTextId ? [lastTextId] : [],
    });
    if (text) {
      setGeneratedText(text.text);
      setLastTextId(text.id);
      setCustomMessage(""); // Clear custom message when generating
    }
  };

  const handleReshuffle = () => {
    const text = reshuffleText({ tone, keywords: "" }, lastTextId || undefined);
    if (text) {
      setGeneratedText(text.text);
      setLastTextId(text.id);
    }
  };

  const handleShare = async () => {
    const shareText = `💕 Pro: ${displayTo}\n\n${displayText}\n\n— ${displayFrom}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Moje valentýnka 💕",
          text: shareText,
        });
      } catch {
        copyToClipboard(shareText);
      }
    } else {
      copyToClipboard(shareText);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert("Zkopírováno do schránky! 📋");
  };

  const hasError = containsBlockedContent(fromName) || containsBlockedContent(toName) || containsBlockedContent(customMessage);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
      {/* Left: Form */}
      <div className="space-y-6">
        {/* Names */}
        <div className="bg-white/80 backdrop-blur rounded-3xl p-6 shadow-lg">
          <h3 className="font-display text-xl font-bold text-[#2d1f1a] mb-4">
            Personalizace
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-[#5c4038] mb-2">
                Od koho
              </label>
              <input
                type="text"
                value={fromName}
                onChange={(e) => setFromName(e.target.value)}
                placeholder="Tajný ctitel"
                maxLength={MAX_LENGTHS.fromName}
                className="input-field"
              />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-[#5c4038] mb-2">
                Pro koho
              </label>
              <input
                type="text"
                value={toName}
                onChange={(e) => setToName(e.target.value)}
                placeholder="Tebe"
                maxLength={MAX_LENGTHS.toName}
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#5c4038] mb-2">
                Vlastní vzkaz <span className="font-normal text-[#a08070]">(nebo nech vygenerovat)</span>
              </label>
              <textarea
                value={customMessage}
                onChange={(e) => setCustomMessage(e.target.value)}
                placeholder="Napiš vlastní text nebo klikni na Vygenerovat..."
                maxLength={MAX_LENGTHS.message}
                rows={3}
                className="input-field resize-none"
              />
              <p className="text-right text-xs text-[#a08070] mt-1">
                {customMessage.length}/{MAX_LENGTHS.message}
              </p>
            </div>
          </div>
        </div>

        {/* Tone selection */}
        <div className="bg-white/80 backdrop-blur rounded-3xl p-6 shadow-lg">
          <h3 className="font-display text-xl font-bold text-[#2d1f1a] mb-4">
            Tón vzkazu
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {TONES.map((t) => (
              <button
                key={t.value}
                type="button"
                onClick={() => setTone(t.value)}
                className={`p-3 rounded-xl border-2 transition-all ${
                  tone === t.value
                    ? "border-[#f04f5f] bg-[#fff0ed]"
                    : "border-[#e0c2b3] hover:border-[#f04f5f]/50"
                }`}
              >
                <span className="text-2xl block mb-1">{t.emoji}</span>
                <span className="text-sm font-medium text-[#2d1f1a]">{t.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Template selection */}
        <div className="bg-white/80 backdrop-blur rounded-3xl p-6 shadow-lg">
          <h3 className="font-display text-xl font-bold text-[#2d1f1a] mb-4">
            Šablona
          </h3>
          <div className="grid grid-cols-3 gap-3">
            {templates.map((template) => (
              <button
                key={template.id}
                type="button"
                onClick={() => setSelectedTemplate(template)}
                className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all ${
                  selectedTemplate.id === template.id
                    ? "border-[#f04f5f] shadow-lg scale-105"
                    : "border-transparent hover:border-[#f04f5f]/50"
                }`}
              >
                <Image
                  src={template.illustrationPath}
                  alt={template.name}
                  fill
                  className="object-contain p-2 bg-gradient-to-br from-[#ffe4dd] to-[#ffd4c8]"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-3">
          <button
            onClick={handleGenerate}
            disabled={hasError}
            className="btn-primary flex-1 disabled:opacity-50"
          >
            ✨ Vygenerovat text
          </button>
          {generatedText && (
            <button
              onClick={handleReshuffle}
              className="btn-secondary"
            >
              🔄 Jiný
            </button>
          )}
        </div>

        {hasError && (
          <p className="text-red-500 text-sm">Text obsahuje nevhodný obsah</p>
        )}
      </div>

      {/* Right: Live Preview Card */}
      <div className="lg:sticky lg:top-8">
        <div className="valentine-card">
          {/* Card art */}
          <div className="h-48 sm:h-56 bg-gradient-to-br from-[#ffdde1] to-[#ee9ca7] flex items-center justify-center">
            <div className="relative w-32 h-32 sm:w-40 sm:h-40">
              <Image
                src={selectedTemplate.illustrationPath}
                alt={selectedTemplate.name}
                fill
                className="object-contain drop-shadow-lg"
              />
            </div>
          </div>
          
          {/* Card body */}
          <div className="p-6 sm:p-8">
            <p className="text-sm font-semibold text-[#a24b4b] mb-1">
              Pro <span className="text-[#2d1f1a]">{displayTo}</span>
            </p>
            
            <p className="font-display text-xl sm:text-2xl font-bold text-[#2d1f1a] my-4 leading-snug">
              {displayText}
            </p>
            
            <p className="text-sm font-semibold text-[#a24b4b] text-right">
              S láskou, <span className="text-[#2d1f1a]">{displayFrom}</span>
            </p>

            {/* Badge */}
            <div className="mt-4 inline-block bg-[#2d1f1a] text-white px-3 py-1 rounded-full text-xs uppercase tracking-wider">
              {TONES.find(t => t.value === tone)?.label} {TONES.find(t => t.value === tone)?.emoji}
            </div>
          </div>
        </div>

        {/* Share button */}
        <div className="mt-4 flex gap-3">
          <button
            onClick={handleShare}
            className="btn-primary flex-1"
          >
            📤 Sdílet valentýnku
          </button>
        </div>
      </div>
    </div>
  );
}
