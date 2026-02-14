"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import type { Template } from "@/types/content";

interface CardPreviewProps {
  template: Template;
  toName?: string;
  fromName?: string;
  text: string;
  imagePath?: string;
  size?: "default" | "large";
}

export default function CardPreview({
  template,
  toName,
  fromName,
  text,
  imagePath,
  size = "default",
}: CardPreviewProps) {
  const [isRevealed, setIsRevealed] = useState(false);

  useEffect(() => {
    // Trigger reveal animation after mount
    const timer = setTimeout(() => setIsRevealed(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const fontClass = template.styleTokens.fontStyle === "handwriting"
    ? "font-handwriting"
    : "";

  const isLarge = size === "large";
  const displayImage = imagePath || template.illustrationPath;

  return (
    <div
      className={`
        relative bg-white rounded-3xl shadow-2xl overflow-hidden
        aspect-[3/4] mx-auto
        ${isLarge ? "max-w-xl" : "max-w-md"}
        transition-all duration-700 ease-out
        ${isRevealed ? "opacity-100 scale-100" : "opacity-0 scale-95"}
      `}
      style={{
        background: `linear-gradient(135deg, ${template.styleTokens.accentColor}22, white)`,
      }}
    >
      {/* Top decoration */}
      <div
        className="absolute top-0 left-0 right-0 h-2"
        style={{ backgroundColor: template.styleTokens.primaryColor }}
      />

      {/* Card content */}
      <div className={`flex flex-col h-full ${isLarge ? "p-8 sm:p-10" : "p-6 sm:p-8"}`}>
        {/* Illustration */}
        <div className="relative flex-shrink-0 h-1/2 mb-4">
          <Image
            src={displayImage}
            alt={template.name}
            fill
            className={`
              object-contain
              transition-transform duration-700 delay-200
              ${isRevealed ? "scale-100" : "scale-90"}
            `}
            priority
          />
        </div>

        {/* Text area */}
        <div
          className={`
            flex-1 flex flex-col justify-center
            transition-all duration-500 delay-300
            ${isRevealed ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}
          `}
        >
          {/* To */}
          {toName && (
            <p
              className={`${isLarge ? "text-base" : "text-sm"} mb-2 ${fontClass}`}
              style={{ color: template.styleTokens.primaryColor }}
            >
              Pro: <span className="font-semibold">{toName}</span>
            </p>
          )}

          {/* Main text */}
          <p
            className={`${isLarge ? "text-xl sm:text-2xl" : "text-lg sm:text-xl"} text-gray-800 leading-relaxed text-center my-4 ${fontClass}`}
          >
            {text}
          </p>

          {/* From */}
          {fromName && (
            <p
              className={`${isLarge ? "text-base" : "text-sm"} text-right mt-auto ${fontClass}`}
              style={{ color: template.styleTokens.primaryColor }}
            >
              Od: <span className="font-semibold">{fromName}</span>
            </p>
          )}
        </div>
      </div>

      {/* Corner hearts decoration */}
      <div
        className={`${isLarge ? "bottom-6 right-6 text-3xl" : "bottom-4 right-4 text-2xl"} absolute opacity-30`}
        style={{ color: template.styleTokens.primaryColor }}
      >
        💕
      </div>
    </div>
  );
}
