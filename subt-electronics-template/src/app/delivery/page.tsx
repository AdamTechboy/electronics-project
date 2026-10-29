import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { createWhatsAppEnquiryUrl } from "@/lib/catalogue-data";
import { getStoreSettings } from "@/lib/catalogue-db";

export const metadata: Metadata = {
  title: "Delivery & Pickup Information | Muhammad Kairu Electronics (Jos)",
  description:
    "Pickup and dispatch options for electronics and solar equipment from Muhammad Kairu Electronics, Shop 31A Rochas Plaza, Jos, Plateau State.",
};

export default async function DeliveryPage() {
  const storeSettings = await getStoreSettings();
  const whatsappUrl = createWhatsAppEnquiryUrl("Delivery Enquiry", "", "", storeSettings.whatsapp);

  return (
    <div className="container" style={{ padding: "40px 0 60px" }}>
      <div style={{ marginBottom: "32px" }}>
        <span className="section-eyebrow">Customer Logistics</span>
        <h1 style={{ fontSize: "clamp(2rem, 3.5vw, 2.8rem)", fontWeight: 900, color: "var(--navy)", marginBottom: "8px" }}>
          Collection & Delivery Options
        </h1>
        <p style={{ color: "var(--ink-secondary)", fontSize: "1.05rem", maxWidth: "700px", lineHeight: 1.6 }}>
          We provide flexible arrangements for equipment collection in Jos, as well as coordinated transport
          across Plateau State and surrounding areas.
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.2fr 0.8fr", gap: "36px", alignItems: "start" }}>
        <div>
          {storeSettings.deliveryInfo && (
            <div className="content-card" style={{ marginBottom: "24px" }}>
              <h2 style={{ fontSize: "1.3rem", fontWeight: 800, color: "var(--navy)", marginBottom: "12px" }}>
                Current Logistics Notice
              </h2>
              <div style={{ color: "var(--ink-secondary)", lineHeight: 1.65, whiteSpace: "pre-line" }}>
                {storeSettings.deliveryInfo}
              </div>
            </div>
          )}

          <div className="content-card">
            <h2 style={{ fontSize: "1.3rem", fontWeight: 800, color: "var(--navy)", marginBottom: "12px" }}>
              1. Same-Day Showroom Collection (Recommended)
            </h2>
            <p style={{ color: "var(--ink-secondary)", lineHeight: 1.65, marginBottom: "14px" }}>
              The fastest and most reliable way to receive your equipment is by direct pickup from our Jos showroom:
            </p>
            <ul style={{ paddingLeft: "20px", color: "var(--ink-secondary)", lineHeight: 1.7, marginBottom: "16px" }}>
              <li>
                <strong>Live Demonstration & Testing:</strong> Our technicians unbox televisions, soundbars, or inverters
                and power them on in your presence to confirm full operational integrity.
              </li>
              <li>
                <strong>Zero Transit Risk:</strong> You inspect all seals, display panels, and accessories before departure.
              </li>
              <li>
                <strong>Immediate Handover:</strong> No waiting for couriers; take your items home immediately upon confirmation.
              </li>
            </ul>
          </div>

          <div className="content-card">
            <h2 style={{ fontSize: "1.3rem", fontWeight: 800, color: "var(--navy)", marginBottom: "12px" }}>
              2. Coordinated Logistics Across Plateau & Northern Nigeria
            </h2>
            <p style={{ color: "var(--ink-secondary)", lineHeight: 1.65, marginBottom: "14px" }}>
              For bulky hardware such as commercial solar panels (550W), heavy lithium batteries (65kg+), and double-door
              refrigerators, we coordinate with trusted transport carriers:
            </p>
            <ul style={{ paddingLeft: "20px", color: "var(--ink-secondary)", lineHeight: 1.7, marginBottom: "16px" }}>
              <li>
                <strong>Jos Metropolis:</strong> Direct doorstep dispatch arranged via local logistics partners.
              </li>
              <li>
                <strong>Plateau State (Bukuru, Pankshin, Shendam, Mangu, Langtang):</strong> Waybill via registered regional motor parks.
              </li>
              <li>
                <strong>Protective Packaging:</strong> All solar panels and fragile displays are reinforced with corner guards and heavy strapping.
              </li>
            </ul>
          </div>
        </div>

        <div className="showroom-card">
          <span className="section-eyebrow">Showroom Pickup Point</span>
          <h3>{storeSettings.name}</h3>
          <p style={{ color: "var(--ink-secondary)", fontSize: "0.9rem", marginBottom: "14px" }}>
            {storeSettings.address}
          </p>
          <p style={{ color: "var(--ink-secondary)", fontSize: "0.9rem", marginBottom: "18px" }}>
            <strong>Collection Hours:</strong> {storeSettings.openingHours}
          </p>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-whatsapp btn-sm"
            style={{ width: "100%", textAlign: "center", marginBottom: "10px" }}
          >
            <span>💬</span> Confirm Delivery Route via WhatsApp
          </a>
          <Link href="/products" className="btn btn-outline btn-sm" style={{ width: "100%", textAlign: "center" }}>
            Browse Store Catalogue
          </Link>
        </div>
      </div>
    </div>
  );
}
