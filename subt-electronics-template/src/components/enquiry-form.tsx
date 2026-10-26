"use client";

import { useState } from "react";

export function EnquiryForm({ productName = "" }: { productName?: string }) {
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function submit(formData: FormData) {
    setStatus("sending");
    setMessage("");
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
      if (!response.ok) throw new Error(result.error ?? "Unable to submit enquiry.");
      setStatus("success");
      setMessage("Your enquiry has been received. The store can follow up once notification delivery is configured.");
    } catch {
      setStatus("error");
      setMessage("We could not submit your enquiry. Please check your details and try again.");
    }
  }

  return (
    <form action={submit} className="enquiry-form">
      <div className="form-row">
        <label>Name<input name="name" autoComplete="name" required minLength={2} maxLength={100} /></label>
        <label>Phone number<input name="phone" autoComplete="tel" required minLength={7} maxLength={30} /></label>
      </div>
      <label>Email (optional)<input name="email" type="email" autoComplete="email" maxLength={254} /></label>
      <label>Product<input name="productName" defaultValue={productName} maxLength={160} /></label>
      <label>What would you like to know?<textarea name="message" required minLength={5} maxLength={2000} rows={4} /></label>
      <div className="honeypot" aria-hidden="true"><label>Leave this field empty<input name="website" tabIndex={-1} autoComplete="off" /></label></div>
      <button className="button" type="submit" disabled={status === "sending"}>{status === "sending" ? "Sending…" : "Submit enquiry"}</button>
      {message && <p role="status" className={status === "error" ? "form-error" : "form-message"}>{message}</p>}
    </form>
  );
}
