"use client";

import { useState } from "react";
import Image from "next/image";
import type { Template, Tone, TextEntry } from "@/types/content";
import { MAX_LENGTHS, containsBlockedContent } from "@/lib/validation";
import { loadTexts } from "@/lib/content";

interface Props {
  templates: Template[];
}

const CATEGORIES: { tone: Tone; label: string; emoji: string }[] = [
  { tone: "funny", label: "Vtipné", emoji: "😄" },
  { tone: "cute", label: "Romantické", emoji: "💕" },
  { tone: "spicy", label: "Spicy", emoji: "🔥" },
  { tone: "office", label: "The Office", emoji: "📋" },
  { tone: "taylor", label: "Taylor Swift", emoji: "🎤" },
];

export default function HomeClient({ templates }: Props) {
  const defaultTemplate = templates[0];
  const allTexts = loadTexts();
  
  const [fromName, setFromName] = useState("");
  const [toName, setToName] = useState("");
  const [customMessage, setCustomMessage] = useState("");
  const [selectedText, setSelectedText] = useState<TextEntry | null>(null);
  const [activeCategory, setActiveCategory] = useState<Tone>("funny");

  // Live preview values
  const displayFrom = fromName.trim() || "Tajný ctitel";
  const displayTo = toName.trim() || "Tebe";
  const displayText = customMessage.trim() || selectedText?.text || "Vyber text z galerie nebo napiš vlastní ✨";
  const currentTone = selectedText?.tone || "funny";
  const displayImage = selectedText?.image || defaultTemplate.illustrationPath;

  const handleTextSelect = (text: TextEntry) => {
    setSelectedText(text);
    setCustomMessage(""); // Clear custom when selecting from gallery
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

  // Get texts for active category
  const categoryTexts = allTexts.filter(t => t.tone === activeCategory);

  return (
    <div className="space-y-8">
      {/* Main area: Form + Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Left: Form */}
        <div className="space-y-6">
          {/* Names */}
          <div className="bg-white/80 backdrop-blur rounded-3xl p-6 shadow-lg">
            <h3 className="font-display text-xl font-bold text-[#2d1f1a] mb-1">
              Udělej to osobní 🎯
            </h3>
            <p className="text-sm text-[#a08070] mb-4">Čím víc detailů, tím větší reakce</p>
            
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
                  Vlastní vzkaz <span className="font-normal text-[#a08070]">(nebo vyber z galerie)</span>
                </label>
                <textarea
                  value={customMessage}
                  onChange={(e) => {
                    setCustomMessage(e.target.value);
                    if (e.target.value) setSelectedText(null);
                  }}
                  placeholder="Napiš vlastní text..."
                  maxLength={MAX_LENGTHS.message}
                  rows={3}
                  className="input-field resize-none"
                />
                <p className="text-right text-xs text-[#a08070] mt-1">
                  {customMessage.length}/{MAX_LENGTHS.message}
                </p>
              </div>
            </div>

            {hasError && (
              <p className="text-red-500 text-sm mt-2">Text obsahuje nevhodný obsah</p>
            )}
          </div>
        </div>

        {/* Right: Live Preview Card */}
        <div className="lg:sticky lg:top-8">
          <div className="valentine-card">
            {/* Card art */}
            <div className="h-80 sm:h-96 bg-gradient-to-br from-[#ffdde1] to-[#ee9ca7] flex items-center justify-center overflow-hidden">
              <div className={`relative ${selectedText?.image ? 'w-full h-full' : 'w-32 h-32 sm:w-40 sm:h-40'}`}>
                <Image
                  src={displayImage}
                  alt="Valentine card"
                  fill
                  className={selectedText?.image ? "object-cover" : "object-contain drop-shadow-lg"}
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
                {CATEGORIES.find(c => c.tone === currentTone)?.label} {CATEGORIES.find(c => c.tone === currentTone)?.emoji}
              </div>
            </div>
          </div>

          {/* Share button */}
          <div className="mt-4 space-y-2">
            <button
              onClick={handleShare}
              className="btn-primary w-full text-lg"
            >
              🚀 Poslat překvápko
            </button>
            <p className="text-center text-xs text-[#a08070]">
              ...a sleduj tu reakci 👀
            </p>
          </div>
        </div>
      </div>

      {/* Text Gallery */}
      <div className="bg-white/80 backdrop-blur rounded-3xl p-6 shadow-lg">
        <h3 className="font-display text-2xl font-bold text-[#2d1f1a] mb-2">
          Vyber hlášku, co zvedne tep 💓
        </h3>
        <p className="text-[#5c4038] mb-6">
          Klikni → text jde do náhledu → hotovo. Tak jednoduché.
        </p>

        {/* Category tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.tone}
              onClick={() => setActiveCategory(cat.tone)}
              className={`px-4 py-2 rounded-full font-semibold text-sm transition-all ${
                activeCategory === cat.tone
                  ? "bg-[#2d1f1a] text-white"
                  : "bg-[#ffe3cf] text-[#4e2c24] hover:bg-[#ffd4b8]"
              }`}
            >
              {cat.emoji} {cat.label}
            </button>
          ))}
        </div>

        {/* Text cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {categoryTexts.map((text) => (
            <button
              key={text.id}
              onClick={() => handleTextSelect(text)}
              className={`text-left p-4 rounded-2xl transition-all hover:scale-[1.02] ${
                selectedText?.id === text.id
                  ? "bg-[#fff0ed] ring-2 ring-[#f04f5f] shadow-lg"
                  : "bg-white/60 hover:bg-white/80 shadow-md hover:shadow-lg"
              }`}
            >
              <p className="text-[#2d1f1a] font-medium leading-snug">
                {text.text}
              </p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
