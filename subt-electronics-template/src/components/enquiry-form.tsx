"use client";

import { useState } from "react";

export function EnquiryForm({ productName = "" }: { productName?: string }) {
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const [reference, setReference] = useState<string | null>(null);

  async function submit(formData: FormData) {
    setStatus("sending");
    setMessage("");
    setReference(null);

    const payload = {
      name: String(formData.get("name") ?? ""),
      phone: String(formData.get("phone") ?? ""),
      email: String(formData.get("email") ?? ""),
      productName: String(formData.get("productName") ?? ""),
      message: String(formData.get("message") ?? ""),
      website: String(formData.get("website") ?? ""), // honeypot
    };

    try {
      const response = await fetch("/api/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error ?? "Unable to submit enquiry.");
      }

      setStatus("success");
      setReference(result.reference || null);
      setMessage(
        result.reference
          ? `Your enquiry has been received (Ref: ${result.reference}). Our technical sales team in Jos will contact you promptly.`
          : "Your enquiry has been received. Our team will contact you shortly."
      );
    } catch (err: unknown) {
      setStatus("error");
      const msg = err instanceof Error ? err.message : "We could not submit your enquiry. Please check your details and try again.";
      setMessage(msg);
    }
  }

  return (
    <form action={submit} className="enquiry-form">
      <div className="form-row">
        <label>
          Full Name
          <input name="name" autoComplete="name" required minLength={2} maxLength={100} placeholder="e.g. Ibrahim Danladi" />
        </label>
        <label>
          Phone Number (WhatsApp preferred)
          <input name="phone" autoComplete="tel" required minLength={7} maxLength={30} placeholder="e.g. 0803 123 4567" />
        </label>
      </div>

      <label>
        Email Address (optional)
        <input name="email" type="email" autoComplete="email" maxLength={254} placeholder="e.g. ibrahim@example.com" />
      </label>

      <label>
        Product of Interest
        <input name="productName" defaultValue={productName} maxLength={160} placeholder="e.g. Felicity 5kVA Solar Inverter" />
      </label>

      <label>
        What would you like to know?
        <textarea
          name="message"
          required
          minLength={5}
          maxLength={2000}
          rows={4}
          placeholder="Please describe your power load, appliance specs, or delivery questions..."
        />
      </label>

      <div className="honeypot" aria-hidden="true" style={{ display: "none" }}>
        <label>
          Leave this field empty
          <input name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <button className="button" type="submit" disabled={status === "sending"}>
        {status === "sending" ? "Submitting Enquiry..." : "Submit Enquiry"}
      </button>

      {message && (
        <div
          role="status"
          className={status === "error" ? "form-error" : "form-message"}
          style={{
            marginTop: "16px",
            padding: "12px 14px",
            borderRadius: "6px",
            background: status === "error" ? "#FEF2F2" : "#F0FDF4",
            color: status === "error" ? "#991B1B" : "#166534",
            border: `1px solid ${status === "error" ? "#FCA5A5" : "#86EFAC"}`,
            fontSize: "0.9rem",
            lineHeight: 1.5,
          }}
        >
          {reference && <strong>Reference Code: {reference} — </strong>}
          {message}
        </div>
      )}
    </form>
  );
}
