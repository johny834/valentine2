import { NextRequest, NextResponse } from "next/server";
import { getServiceSupabase } from "@/lib/supabase";
import { generateToken } from "@/lib/token";
import { containsBlockedContent, escapeHtml, MAX_LENGTHS } from "@/lib/validation";
import templates from "../../../../content/templates.json";
import type { CardInsert, TemplateSnapshot, CreateCardResponse } from "@/types/database";

const VALID_TONES = ["cute", "funny", "spicy", "office", "taylor"] as const;

interface CreateCardRequest {
  templateId: string;
  toName?: string;
  fromName?: string;
  isAnonymous?: boolean;
  tone: string;
  messageText: string;
  imagePath?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: CreateCardRequest = await request.json();

    // Validate required fields
    if (!body.templateId || !body.tone || !body.messageText) {
      return NextResponse.json(
        { error: "Chybí povinná pole: templateId, tone, messageText" },
        { status: 400 }
      );
    }

    // Validate tone
    if (!VALID_TONES.includes(body.tone as typeof VALID_TONES[number])) {
      return NextResponse.json(
        { error: `Neplatný tón. Povolené: ${VALID_TONES.join(", ")}` },
        { status: 400 }
      );
    }

    // Validate template exists
    const template = templates.find((t) => t.id === body.templateId);
    if (!template) {
      return NextResponse.json(
        { error: "Šablona neexistuje" },
        { status: 400 }
      );
    }

    // Validate message length
    if (body.messageText.length > MAX_LENGTHS.message) {
      return NextResponse.json(
        { error: `Zpráva je příliš dlouhá (max ${MAX_LENGTHS.message} znaků)` },
        { status: 400 }
      );
    }

    // Check blocklist
    const textsToCheck = [
      body.messageText,
      body.toName,
      body.fromName,
    ].filter(Boolean) as string[];

    for (const text of textsToCheck) {
      if (containsBlockedContent(text)) {
        return NextResponse.json(
          { error: "Text obsahuje nevhodný obsah" },
          { status: 403 }
        );
      }
    }

    // Validate name lengths
    if (body.toName && body.toName.length > MAX_LENGTHS.toName) {
      return NextResponse.json(
        { error: `Jméno příjemce je příliš dlouhé (max ${MAX_LENGTHS.toName} znaků)` },
        { status: 400 }
      );
    }
    if (body.fromName && body.fromName.length > MAX_LENGTHS.fromName) {
      return NextResponse.json(
        { error: `Jméno odesílatele je příliš dlouhé (max ${MAX_LENGTHS.fromName} znaků)` },
        { status: 400 }
      );
    }

    const sanitizedImagePath = body.imagePath?.trim();
    const hasCustomIllustration = Boolean(
      sanitizedImagePath && sanitizedImagePath.startsWith("/illustrations/")
    );

    // Build template snapshot
    const templateSnapshot: TemplateSnapshot = {
      id: template.id,
      name: template.name,
      illustrationPath: hasCustomIllustration
        ? sanitizedImagePath as string
        : template.illustrationPath,
      styleTokens: template.styleTokens as TemplateSnapshot["styleTokens"],
    };

    // Generate unique token
    const token = generateToken();

    // Prepare card data
    const cardData: CardInsert = {
      token,
      template_snapshot: templateSnapshot,
      to_name: body.toName ? escapeHtml(body.toName.trim()) : null,
      from_name: body.isAnonymous ? null : (body.fromName ? escapeHtml(body.fromName.trim()) : null),
      is_anonymous: body.isAnonymous ?? false,
      tone: body.tone,
      message_text: escapeHtml(body.messageText.trim()),
      image_path: hasCustomIllustration ? sanitizedImagePath : null,
    };

    // Insert into database
    const supabase = getServiceSupabase();

    // Insert card
    const { data: card, error: cardError } = await supabase
      .from("cards")
      .insert(cardData)
      .select("id")
      .single();

    if (cardError) {
      console.error("Card insert error:", cardError);
      return NextResponse.json(
        { error: "Nepodařilo se vytvořit kartičku" },
        { status: 500 }
      );
    }

    // Insert draft order
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        card_id: card.id,
        status: "draft",
      })
      .select("id")
      .single();

    if (orderError) {
      console.error("Order insert error:", orderError);
      // Card was created but order failed - still return the card info
    }

    // Log creation event
    await supabase.from("events").insert({
      card_id: card.id,
      order_id: order?.id ?? null,
      type: "created",
      meta: {
        tone: body.tone,
        templateId: body.templateId,
        isAnonymous: body.isAnonymous ?? false,
      },
    });

    const response: CreateCardResponse = {
      token,
      publicUrl: `/c/${token}`,
      orderId: order?.id ?? "",
    };

    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { error: "Něco se pokazilo" },
      { status: 500 }
    );
  }
}
