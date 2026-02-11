import { NextRequest, NextResponse } from "next/server";
import { supabase, getServiceSupabase } from "@/lib/supabase";
import { isValidToken } from "@/lib/token";
import type { Card, PublicCard } from "@/types/database";

interface RouteParams {
  params: Promise<{ token: string }>;
}

export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  const { token } = await params;

  // Validate token format
  if (!isValidToken(token)) {
    return NextResponse.json(
      { error: "Neplatný formát tokenu" },
      { status: 400 }
    );
  }

  try {
    // Fetch card (uses RLS policy - only non-blocked, non-expired cards)
    const { data: card, error } = await supabase
      .from("cards")
      .select("*")
      .eq("token", token)
      .single();

    if (error || !card) {
      return NextResponse.json(
        { error: "Kartička nenalezena" },
        { status: 404 }
      );
    }

    // Log view event (fire and forget, don't block response)
    const serviceSupabase = getServiceSupabase();
    serviceSupabase.from("events").insert({
      card_id: card.id,
      type: "opened",
      meta: {
        userAgent: request.headers.get("user-agent") ?? "unknown",
        timestamp: new Date().toISOString(),
      },
    }).then(() => {});

    // Transform to public response (hide internal fields)
    const publicCard: PublicCard = {
      token: card.token,
      toName: card.to_name,
      fromName: card.from_name,
      messageText: card.message_text,
      tone: card.tone,
      imagePath: card.image_path,
      template: card.template_snapshot,
      createdAt: card.created_at,
      expiresAt: card.expires_at,
    };

    return NextResponse.json(publicCard);
  } catch (error) {
    console.error("Error fetching card:", error);
    return NextResponse.json(
      { error: "Něco se pokazilo" },
      { status: 500 }
    );
  }
}
