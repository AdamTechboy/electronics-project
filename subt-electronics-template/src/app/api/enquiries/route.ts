import { NextResponse } from "next/server";
import { z } from "zod";
import { tenantConfig } from "@/config/tenant";

const enquirySchema = z.object({
  name: z.string().trim().min(2).max(100),
  phone: z.string().trim().min(7).max(30),
  email: z.string().trim().email().max(254).or(z.literal("")).optional(),
  productName: z.string().trim().max(160).optional().default(""),
  message: z.string().trim().min(5).max(2000),
  website: z.string().max(200).optional().default(""),
});

export async function POST(request: Request) {
  if (!tenantConfig.features.enquiries) {
    return NextResponse.json({ error: "Enquiries are currently disabled." }, { status: 404 });
  }
  const contentType = request.headers.get("content-type") ?? "";
  if (!contentType.toLowerCase().includes("application/json")) {
    return NextResponse.json({ error: "Unsupported content type." }, { status: 415 });
  }
  let raw: unknown;
  try { raw = await request.json(); }
  catch { return NextResponse.json({ error: "Invalid request body." }, { status: 400 }); }
  const parsed = enquirySchema.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json({ error: "Please review the submitted fields." }, { status: 400 });
  }
  if (parsed.data.website) {
    // Honeypot submissions are discarded without revealing the anti-spam rule.
    return NextResponse.json({ ok: true });
  }

  // Intentionally fail closed until persistence, retention, rate limiting, and notification are wired.
  // Do not return success or collect real customer data without those controls.
  return NextResponse.json(
    { error: "Enquiry submission is not enabled on this preview. Please contact the store through verified channels once configured." },
    { status: 503 }
  );
}
