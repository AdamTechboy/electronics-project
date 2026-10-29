import { NextResponse } from "next/server";
import { z } from "zod";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";

const enquirySchema = z.object({
  name: z.string().trim().min(2).max(100),
  phone: z.string().trim().min(7).max(30),
  email: z.string().trim().email().max(254).or(z.literal("")).optional(),
  productName: z.string().trim().max(160).optional().default(""),
  message: z.string().trim().min(5).max(2000),
  website: z.string().max(200).optional().default(""),
});

function generateReference(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 4; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  const timestamp = Date.now().toString(36).toUpperCase().slice(-4);
  return `ENQ-${timestamp}-${code}`;
}

export async function POST(request: Request) {
  const contentType = request.headers.get("content-type") ?? "";
  if (!contentType.toLowerCase().includes("application/json")) {
    return NextResponse.json({ error: "Unsupported content type." }, { status: 415 });
  }

  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const parsed = enquirySchema.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json({ error: "Please review the submitted fields." }, { status: 400 });
  }

  // Honeypot anti-spam check
  if (parsed.data.website) {
    return NextResponse.json({ ok: true, reference: generateReference() });
  }

  const reference = generateReference();

  if (isSupabaseConfigured()) {
    try {
      const supabase = await createClient();
      const { error } = await supabase.from("enquiries").insert({
        reference,
        name: parsed.data.name,
        phone: parsed.data.phone,
        email: parsed.data.email || null,
        product_name: parsed.data.productName || null,
        message: parsed.data.message,
        status: "new",
        source: "storefront_web",
      });

      if (error) {
        console.error("Database enquiry insert failed:", error);
        return NextResponse.json(
          { error: "Failed to record enquiry in store database. Please contact us directly via WhatsApp." },
          { status: 500 }
        );
      }
    } catch (err) {
      console.error("Enquiry processing error:", err);
      return NextResponse.json(
        { error: "An unexpected error occurred while saving your enquiry." },
        { status: 500 }
      );
    }
  }

  return NextResponse.json(
    {
      ok: true,
      reference,
      message: `Enquiry received successfully. Ref: ${reference}`,
    },
    { status: 201 }
  );
}
