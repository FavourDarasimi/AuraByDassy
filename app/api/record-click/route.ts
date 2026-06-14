import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/supabase/lib/client";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { product_id, product_name, sku, source } = body;

    const { error } = await supabaseAdmin.from("order_clicks").insert({
      product_id: product_id || null,
      product_name: product_name || "",
      sku: sku || "",
      source: source || "unknown",
    } as never);

    if (error) {
      console.error("Error recording click:", error);
      return NextResponse.json({ success: false }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ success: false }, { status: 400 });
  }
}
