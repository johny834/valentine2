"use client";

import { useCallback, useRef } from "react";
import Image from "next/image";
import type { Template } from "@/types/content";

interface TemplateGalleryProps {
  templates: Template[];
  selectedId?: string;
  onSelect?: (template: Template) => void;
  showLabels?: boolean;
  interactive?: boolean;
}

export default function TemplateGallery({
  templates,
  selectedId,
  onSelect,
  showLabels = true,
  interactive = true,
}: TemplateGalleryProps) {
  const galleryRef = useRef<HTMLDivElement>(null);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent, index: number) => {
      if (!interactive || !onSelect) return;

      let nextIndex: number | null = null;

      switch (e.key) {
        case "ArrowRight":
        case "ArrowDown":
          e.preventDefault();
          nextIndex = (index + 1) % templates.length;
          break;
        case "ArrowLeft":
        case "ArrowUp":
          e.preventDefault();
          nextIndex = (index - 1 + templates.length) % templates.length;
          break;
        case "Enter":
        case " ":
          e.preventDefault();
          onSelect(templates[index]);
          return;
      }

      if (nextIndex !== null) {
        const buttons = galleryRef.current?.querySelectorAll("button");
        buttons?.[nextIndex]?.focus();
      }
    },
    [templates, onSelect, interactive]
  );

  const handleClick = (template: Template) => {
    if (interactive && onSelect) {
      onSelect(template);
    }
  };

  return (
    <div
      ref={galleryRef}
      className="grid grid-cols-1 sm:grid-cols-3 gap-4"
      role="radiogroup"
      aria-label="Výběr šablony valentýnky"
    >
      {templates.map((template, index) => (
        <button
          key={template.id}
          type="button"
          role="radio"
          aria-checked={selectedId === template.id}
          aria-label={`Šablona: ${template.name}`}
          tabIndex={interactive ? (selectedId === template.id || (!selectedId && index === 0) ? 0 : -1) : -1}
          onClick={() => handleClick(template)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          disabled={!interactive}
          className={`
            bg-white rounded-2xl shadow-md p-4 transition-all text-left
            ${interactive ? "cursor-pointer" : "cursor-default"}
            ${selectedId === template.id
              ? "ring-2 ring-rose-500 shadow-lg"
              : interactive
                ? "hover:ring-2 hover:ring-rose-300 focus:ring-2 focus:ring-rose-400 focus:outline-none"
                : ""
            }
          `}
        >
          <div className="aspect-square relative mb-3 bg-gradient-to-br from-pink-50 to-rose-100 rounded-xl overflow-hidden">
            <Image
              src={template.illustrationPath}
              alt={template.name}
              fill
              className="object-contain p-4"
            />
          </div>
          {showLabels && (
            <p className="text-center font-medium text-gray-700">
              {template.name}
            </p>
          )}
        </button>
      ))}
    </div>
  );
}
