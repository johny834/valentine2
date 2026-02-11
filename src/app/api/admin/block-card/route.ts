import { NextRequest, NextResponse } from "next/server";
import { getServiceSupabase } from "@/lib/supabase";
import { isValidToken } from "@/lib/token";

/**
 * Admin endpoint to block/unblock cards
 * Protected by ADMIN_SECRET environment variable
 */
export async function POST(request: NextRequest) {
  // Check authorization
  const authHeader = request.headers.get("authorization");
  const adminSecret = process.env.ADMIN_SECRET;

  if (!adminSecret) {
    console.error("ADMIN_SECRET not configured");
    return NextResponse.json(
      { error: "Admin not configured" },
      { status: 500 }
    );
  }

  if (authHeader !== `Bearer ${adminSecret}`) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();
    const { token, block = true } = body;

    if (!token) {
      return NextResponse.json(
        { error: "Token is required" },
        { status: 400 }
      );
    }

    if (!isValidToken(token)) {
      return NextResponse.json(
        { error: "Invalid token format" },
        { status: 400 }
      );
    }

    const supabase = getServiceSupabase();

    // Find card
    const { data: card, error: findError } = await supabase
      .from("cards")
      .select("id, is_blocked")
      .eq("token", token)
      .single();

    if (findError || !card) {
      return NextResponse.json(
        { error: "Card not found" },
        { status: 404 }
      );
    }

    // Update blocked status
    const { error: updateError } = await supabase
      .from("cards")
      .update({ is_blocked: block })
      .eq("id", card.id);

    if (updateError) {
      console.error("Error updating card:", updateError);
      return NextResponse.json(
        { error: "Failed to update card" },
        { status: 500 }
      );
    }

    // Log event
    await supabase.from("events").insert({
      card_id: card.id,
      type: block ? "blocked" : "unblocked",
      meta: {
        previousState: card.is_blocked,
        newState: block,
      },
    });

    return NextResponse.json({
      message: block ? "Card blocked" : "Card unblocked",
      token,
      isBlocked: block,
    });
  } catch (error) {
    console.error("Admin error:", error);
    return NextResponse.json(
      { error: "Operation failed" },
      { status: 500 }
    );
  }
}
