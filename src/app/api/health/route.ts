import { NextResponse } from "next/server";
import { getServiceSupabase } from "@/lib/supabase";

export async function GET() {
  try {
    const supabase = getServiceSupabase();
    
    // Simple query to check connection
    const { data, error } = await supabase
      .from("cards")
      .select("count")
      .limit(1);
    
    // If table doesn't exist yet, that's fine - connection works
    if (error && error.code !== "42P01") {
      return NextResponse.json(
        { status: "error", message: error.message },
        { status: 500 }
      );
    }
    
    return NextResponse.json({
      status: "ok",
      database: "connected",
      tablesExist: !error,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json(
      { status: "error", message: String(error) },
      { status: 500 }
    );
  }
}
