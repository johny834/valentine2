"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
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
  const router = useRouter();
  const defaultTemplate = templates[0];
  const allTexts = loadTexts();
  
  const [fromName, setFromName] = useState("");
  const [toName, setToName] = useState("");
  const [customMessage, setCustomMessage] = useState("");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedTone, setSelectedTone] = useState<Tone>("funny");
  const [activeCategory, setActiveCategory] = useState<Tone>("funny");
  const [isSending, setIsSending] = useState(false);

  // Live preview values
  const displayFrom = fromName.trim() || "Tajný ctitel";
  const displayTo = toName.trim() || "Tebe";
  const displayText = customMessage.trim() || "Vyber šablonu z galerie nebo napiš vlastní ✨";
  const displayImage = selectedImage || defaultTemplate.illustrationPath;

  const handleTextSelect = (text: TextEntry) => {
    // Set the custom message field with the template text
    setCustomMessage(text.text);
    // Store the image separately so it persists when user edits text
    setSelectedImage(text.image || null);
    setSelectedTone(text.tone);
  };

  const handleShare = () => {
    const params = new URLSearchParams({
      t: defaultTemplate.id,
      to: displayTo,
      from: fromName.trim() ? displayFrom : "Anonym",
      tone: selectedTone,
      text: displayText,
    });

    if (selectedImage) {
      params.set("img", selectedImage);
    }

    window.location.href = `/preview?${params.toString()}`;
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
            <h3 className="font-display text-xl font-bold text-[#2d1f1a] mb-4">
              🧪 Namíchej to správně:
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
                  Vlastní vzkaz <span className="font-normal text-[#a08070]">(nebo vyber z galerie)</span>
                </label>
                <textarea
                  value={customMessage}
                  onChange={(e) => setCustomMessage(e.target.value)}
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
              <div className={`relative ${selectedImage ? 'w-full h-full' : 'w-32 h-32 sm:w-40 sm:h-40'}`}>
                <Image
                  src={displayImage}
                  alt="Valentine card"
                  fill
                  className={selectedImage ? "object-cover" : "object-contain drop-shadow-lg"}
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
                {CATEGORIES.find(c => c.tone === selectedTone)?.label} {CATEGORIES.find(c => c.tone === selectedTone)?.emoji}
              </div>
            </div>
          </div>

          {/* Share button */}
          <div className="mt-4 space-y-2">
            <button
              onClick={handleShare}
              disabled={isSending}
              className="btn-primary w-full text-lg"
            >
              {isSending ? "Posílám překvápko..." : "🚀 Poslat překvápko"}
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

        {/* Template cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {categoryTexts.map((text) => (
            <button
              key={text.id}
              onClick={() => handleTextSelect(text)}
              className={`text-left rounded-2xl transition-all hover:scale-[1.02] overflow-hidden ${
                customMessage === text.text && selectedImage === (text.image || null)
                  ? "ring-2 ring-[#f04f5f] shadow-lg"
                  : "shadow-md hover:shadow-lg"
              }`}
            >
              {/* Image preview */}
              {text.image && (
                <div className="relative h-32 bg-gradient-to-br from-[#ffdde1] to-[#ee9ca7]">
                  <Image
                    src={text.image}
                    alt=""
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              <div className={`p-4 ${
                customMessage === text.text && selectedImage === (text.image || null)
                  ? "bg-[#fff0ed]"
                  : "bg-white/60"
              }`}>
                <p className="text-[#2d1f1a] font-medium leading-snug">
                  {text.text}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
