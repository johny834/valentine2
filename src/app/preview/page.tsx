import Link from "next/link";
import { redirect } from "next/navigation";
import { getTemplateById, loadTexts } from "@/lib/content";
import PreviewPageClient from "./PreviewPageClient";
import type { Tone } from "@/types/content";

interface PageProps {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}

const VALID_TONES: Tone[] = ["cute", "funny", "spicy", "office", "taylor"];

export default async function PreviewPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const templateId = params.t;
  const toName = params.to || "";
  const fromName = params.from || "Anonym";
  const text = params.text || "";
  const tone = params.tone && VALID_TONES.includes(params.tone as Tone)
    ? (params.tone as Tone)
    : "cute";
  const imagePath = params.img || params.image || params.imagePath;

  const matchedTextImage = loadTexts().find((entry) => (
    entry.tone === tone && entry.text === text && entry.image
  ))?.image;

  const resolvedImagePath = imagePath || matchedTextImage;

  // Redirect if missing required data
  if (!templateId || !text) {
    redirect("/create");
  }

  const template = getTemplateById(templateId);
  if (!template) {
    redirect("/create");
  }

  return (
    <main className="py-12">
      <div className="mb-8">
        <Link
          href="/"
          className="text-rose-500 hover:text-rose-600 transition-colors"
        >
          ← Zpět na úpravy
        </Link>
      </div>

      <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-8 text-center">
        Tvá valentýnka je hotová! 🎉
      </h1>

      <PreviewPageClient
        template={template}
        toName={toName}
        fromName={fromName}
        text={text}
        tone={tone}
        imagePath={resolvedImagePath}
      />
    </main>
  );
}
