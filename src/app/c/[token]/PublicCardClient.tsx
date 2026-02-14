"use client";

import { useRef, useState } from "react";
import CardPreview from "@/components/CardPreview";
import type { Template } from "@/types/content";

interface Props {
  template: Template;
  toName?: string;
  fromName?: string;
  text: string;
  token: string;
  imagePath?: string;
}

function inlineStyles(source: Element, target: Element) {
  const computedStyle = window.getComputedStyle(source);
  let styleText = "";

  for (const property of computedStyle) {
    styleText += `${property}:${computedStyle.getPropertyValue(property)};`;
  }

  target.setAttribute("style", styleText);

  const sourceChildren = Array.from(source.children);
  const targetChildren = Array.from(target.children);

  sourceChildren.forEach((sourceChild, index) => {
    const targetChild = targetChildren[index];
    if (targetChild) {
      inlineStyles(sourceChild, targetChild);
    }
  });
}

async function exportElementToPng(element: HTMLElement): Promise<string> {
  const { width, height } = element.getBoundingClientRect();
  const clonedElement = element.cloneNode(true) as HTMLElement;
  inlineStyles(element, clonedElement);

  const serializedNode = new XMLSerializer().serializeToString(clonedElement);
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
      <foreignObject width="100%" height="100%">${serializedNode}</foreignObject>
    </svg>
  `;

  const image = new Image();
  const svgBlob = new Blob([svg], { type: "image/svg+xml;charset=utf-8" });
  const url = URL.createObjectURL(svgBlob);

  const dataUrl = await new Promise<string>((resolve, reject) => {
    image.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = Math.round(width * 2);
      canvas.height = Math.round(height * 2);

      const context = canvas.getContext("2d");
      if (!context) {
        reject(new Error("Canvas context not available"));
        return;
      }

      context.scale(2, 2);
      context.drawImage(image, 0, 0);
      URL.revokeObjectURL(url);
      resolve(canvas.toDataURL("image/png"));
    };

    image.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Image export failed"));
    };

    image.src = url;
  });

  return dataUrl;
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
          {isSaving ? "Ukládám..." : "Uložit jako obrázek"}
        </button>
      </div>
    </>
  );
}
