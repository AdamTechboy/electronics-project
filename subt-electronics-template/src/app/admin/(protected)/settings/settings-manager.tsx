"use client";

import React, { useState, useTransition } from "react";
import { updateSettingsAction } from "@/server/actions/settings";

export interface SettingsData {
  business_name: string;
  tagline: string;
  address: string;
  phone: string;
  whatsapp: string;
  email: string;
  opening_hours: string;
  delivery_info: string;
  warranty_policy: string;
  about_text: string;
}

export function SettingsManager({ initialSettings }: { initialSettings: SettingsData }) {
  const [businessName, setBusinessName] = useState(initialSettings.business_name);
  const [tagline, setTagline] = useState(initialSettings.tagline);
  const [address, setAddress] = useState(initialSettings.address);
  const [phone, setPhone] = useState(initialSettings.phone);
  const [whatsapp, setWhatsapp] = useState(initialSettings.whatsapp);
  const [email, setEmail] = useState(initialSettings.email);
  const [openingHours, setOpeningHours] = useState(initialSettings.opening_hours);
  const [deliveryInfo, setDeliveryInfo] = useState(initialSettings.delivery_info);
  const [warrantyPolicy, setWarrantyPolicy] = useState(initialSettings.warranty_policy);
  const [aboutText, setAboutText] = useState(initialSettings.about_text);

  const [isPending, startTransition] = useTransition();
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setFeedback(null);

    const formData = new FormData();
    formData.set("business_name", businessName);
    formData.set("tagline", tagline);
    formData.set("address", address);
    formData.set("phone", phone);
    formData.set("whatsapp", whatsapp);
    formData.set("email", email);
    formData.set("opening_hours", openingHours);
    formData.set("delivery_info", deliveryInfo);
    formData.set("warranty_policy", warrantyPolicy);
    formData.set("about_text", aboutText);

    startTransition(async () => {
      const res = await updateSettingsAction(formData);
      if (!res.success) {
        setFeedback({ type: "error", message: res.error || "Failed to update store settings." });
      } else {
        setFeedback({ type: "success", message: "Store settings updated and published to public storefront!" });
      }
    });
  }

  return (
    <div style={{ maxWidth: "860px" }}>
      <div style={{ marginBottom: "24px" }}>
        <h1 style={{ fontSize: "1.6rem", fontWeight: 800, color: "var(--navy, #1F2A44)", margin: "0 0 4px" }}>
          Store Configuration & Brand Settings
        </h1>
        <p style={{ color: "var(--ink-secondary, #475569)", fontSize: "0.875rem", margin: 0 }}>
          Manage showroom details, contact numbers, delivery terms, and customer warranty policies.
        </p>
      </div>

      {feedback && (
        <div
          style={{
            padding: "12px 16px",
            borderRadius: "6px",
            marginBottom: "20px",
            background: feedback.type === "success" ? "#F0FDF4" : "#FEF2F2",
            color: feedback.type === "success" ? "#166534" : "#991B1B",
            border: `1px solid ${feedback.type === "success" ? "#86EFAC" : "#FCA5A5"}`,
            fontSize: "0.875rem",
          }}
        >
          {feedback.message}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        style={{
          background: "white",
          borderRadius: "8px",
          border: "1px solid var(--line, #E2E8F0)",
          padding: "28px",
          display: "flex",
          flexDirection: "column",
          gap: "20px",
        }}
      >
        <h2 style={{ fontSize: "1.1rem", fontWeight: 800, color: "var(--navy, #1F2A44)", margin: 0 }}>
          Business Identity & Contact Details
        </h2>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
          <div>
            <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 700, marginBottom: "4px" }}>
              Business Name *
            </label>
            <input
              type="text"
              required
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              style={{ width: "100%", padding: "8px 12px", borderRadius: "4px", border: "1px solid #CBD5E1", fontSize: "0.875rem" }}
            />
          </div>
          <div>
            <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 700, marginBottom: "4px" }}>
              Tagline
            </label>
            <input
              type="text"
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              style={{ width: "100%", padding: "8px 12px", borderRadius: "4px", border: "1px solid #CBD5E1", fontSize: "0.875rem" }}
            />
          </div>
        </div>

        <div>
          <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 700, marginBottom: "4px" }}>
            Showroom Physical Address *
          </label>
          <input
            type="text"
            required
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            style={{ width: "100%", padding: "8px 12px", borderRadius: "4px", border: "1px solid #CBD5E1", fontSize: "0.875rem" }}
          />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "16px" }}>
          <div>
            <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 700, marginBottom: "4px" }}>
              Phone Number *
            </label>
            <input
              type="text"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              style={{ width: "100%", padding: "8px 12px", borderRadius: "4px", border: "1px solid #CBD5E1", fontSize: "0.875rem" }}
            />
          </div>
          <div>
            <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 700, marginBottom: "4px" }}>
              WhatsApp Number *
            </label>
            <input
              type="text"
              required
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
              style={{ width: "100%", padding: "8px 12px", borderRadius: "4px", border: "1px solid #CBD5E1", fontSize: "0.875rem" }}
            />
          </div>
          <div>
            <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 700, marginBottom: "4px" }}>
              Email Address *
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ width: "100%", padding: "8px 12px", borderRadius: "4px", border: "1px solid #CBD5E1", fontSize: "0.875rem" }}
            />
          </div>
        </div>

        <div>
          <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 700, marginBottom: "4px" }}>
            Showroom Opening Hours
          </label>
          <input
            type="text"
            value={openingHours}
            onChange={(e) => setOpeningHours(e.target.value)}
            placeholder="e.g. Mon - Sat: 8:30 AM - 6:00 PM"
            style={{ width: "100%", padding: "8px 12px", borderRadius: "4px", border: "1px solid #CBD5E1", fontSize: "0.875rem" }}
          />
        </div>

        <hr style={{ border: "none", borderTop: "1px solid #E2E8F0", margin: "8px 0" }} />

        <h2 style={{ fontSize: "1.1rem", fontWeight: 800, color: "var(--navy, #1F2A44)", margin: 0 }}>
          Public Policy & Page Content
        </h2>

        <div>
          <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 700, marginBottom: "4px" }}>
            Delivery Information (/delivery page)
          </label>
          <textarea
            rows={4}
            value={deliveryInfo}
            onChange={(e) => setDeliveryInfo(e.target.value)}
            placeholder="Explain pickup at Rochas Plaza, Plateau State delivery routes, and interstate logistics..."
            style={{ width: "100%", padding: "8px 12px", borderRadius: "4px", border: "1px solid #CBD5E1", fontSize: "0.875rem" }}
          />
        </div>

        <div>
          <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 700, marginBottom: "4px" }}>
            Warranty & Returns Policy (/warranty-returns page)
          </label>
          <textarea
            rows={4}
            value={warrantyPolicy}
            onChange={(e) => setWarrantyPolicy(e.target.value)}
            placeholder="Explain manufacturer warranties for inverters, solar panels, and electronics..."
            style={{ width: "100%", padding: "8px 12px", borderRadius: "4px", border: "1px solid #CBD5E1", fontSize: "0.875rem" }}
          />
        </div>

        <div>
          <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 700, marginBottom: "4px" }}>
            About the Business (/about page)
          </label>
          <textarea
            rows={4}
            value={aboutText}
            onChange={(e) => setAboutText(e.target.value)}
            placeholder="Muhammad Kairu Electronics heritage, founder story, mission in Plateau State..."
            style={{ width: "100%", padding: "8px 12px", borderRadius: "4px", border: "1px solid #CBD5E1", fontSize: "0.875rem" }}
          />
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end", paddingTop: "12px" }}>
          <button
            type="submit"
            disabled={isPending}
            className="btn btn-navy"
            style={{ padding: "12px 28px", fontSize: "0.9375rem", cursor: isPending ? "wait" : "pointer" }}
          >
            {isPending ? "Saving Settings..." : "Save & Publish Store Settings"}
          </button>
        </div>
      </form>
    </div>
  );
}
