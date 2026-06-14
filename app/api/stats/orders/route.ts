import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/supabase/lib/client";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const [totalRes, todayRes] = await Promise.all([
      supabaseAdmin
        .from("order_clicks")
        .select("*", { count: "exact", head: true }),
      supabaseAdmin
        .from("order_clicks")
        .select("*", { count: "exact", head: true })
        .gte("created_at", new Date(new Date().setHours(0, 0, 0, 0)).toISOString()),
    ]);

    // Build source breakdown manually since we can't groupBy
    const { data: allClicks } = await supabaseAdmin
      .from("order_clicks")
      .select("source")
      .limit(5000);

    const sourceBreakdown: Record<string, number> = {};
    (allClicks || []).forEach((c: { source: string }) => {
      const s = c.source || "unknown";
      sourceBreakdown[s] = (sourceBreakdown[s] || 0) + 1;
    });

    return NextResponse.json({
      total: totalRes.count || 0,
      today: todayRes.count || 0,
      bySource: sourceBreakdown,
    });
  } catch (err) {
    console.error("Error fetching order stats:", err);
    return NextResponse.json(
      { total: 0, today: 0, bySource: {} },
      { status: 500 },
    );
  }
}
