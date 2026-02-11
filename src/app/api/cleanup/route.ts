import { NextRequest, NextResponse } from "next/server";
import { getServiceSupabase } from "@/lib/supabase";

/**
 * Cleanup endpoint for expired cards
 * Protected by CLEANUP_SECRET environment variable
 * 
 * Can be called by:
 * - Vercel Cron: vercel.json with {"crons": [{"path": "/api/cleanup", "schedule": "0 3 * * *"}]}
 * - External cron service with Authorization header
 */
export async function POST(request: NextRequest) {
  // Check authorization
  const authHeader = request.headers.get("authorization");
  const cleanupSecret = process.env.CLEANUP_SECRET;

  if (!cleanupSecret) {
    console.error("CLEANUP_SECRET not configured");
    return NextResponse.json(
      { error: "Cleanup not configured" },
      { status: 500 }
    );
  }

  if (authHeader !== `Bearer ${cleanupSecret}`) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const supabase = getServiceSupabase();
    const now = new Date().toISOString();

    // Delete expired cards (cascade will delete orders and set null on events)
    const { data: expiredCards, error: selectError } = await supabase
      .from("cards")
      .select("id, token")
      .lt("expires_at", now);

    if (selectError) {
      console.error("Error finding expired cards:", selectError);
      return NextResponse.json(
        { error: "Failed to find expired cards" },
        { status: 500 }
      );
    }

    if (!expiredCards || expiredCards.length === 0) {
      return NextResponse.json({
        message: "No expired cards found",
        deleted: 0,
      });
    }

    // Log expiry events before deletion
    const expiryEvents = expiredCards.map((card) => ({
      card_id: card.id,
      type: "expired" as const,
      meta: { token: card.token },
    }));

    await supabase.from("events").insert(expiryEvents);

    // Delete expired cards
    const { error: deleteError } = await supabase
      .from("cards")
      .delete()
      .lt("expires_at", now);

    if (deleteError) {
      console.error("Error deleting expired cards:", deleteError);
      return NextResponse.json(
        { error: "Failed to delete expired cards" },
        { status: 500 }
      );
    }

    console.log(`Cleanup: deleted ${expiredCards.length} expired cards`);

    return NextResponse.json({
      message: "Cleanup completed",
      deleted: expiredCards.length,
      timestamp: now,
    });
  } catch (error) {
    console.error("Cleanup error:", error);
    return NextResponse.json(
      { error: "Cleanup failed" },
      { status: 500 }
    );
  }
}

// Also support GET for Vercel Cron (sends GET requests)
export async function GET(request: NextRequest) {
  return POST(request);
}
