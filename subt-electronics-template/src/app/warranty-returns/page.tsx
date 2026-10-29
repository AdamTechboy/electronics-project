import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { createWhatsAppEnquiryUrl } from "@/lib/catalogue-data";
import { getStoreSettings } from "@/lib/catalogue-db";

export const metadata: Metadata = {
  title: "Warranty & Return Terms | Muhammad Kairu Electronics (Jos)",
  description:
    "Warranty terms, pre-dispatch testing, and after-sales support details for equipment purchased at Muhammad Kairu Electronics, Jos.",
};

export default async function WarrantyReturnsPage() {
  const storeSettings = await getStoreSettings();
  const whatsappUrl = createWhatsAppEnquiryUrl("Warranty Enquiry", "", "", storeSettings.whatsapp);

  return (
    <div className="container" style={{ padding: "40px 0 60px" }}>
      <div style={{ marginBottom: "32px" }}>
        <span className="section-eyebrow">Customer Protection & Quality Assurance</span>
        <h1 style={{ fontSize: "clamp(2rem, 3.5vw, 2.8rem)", fontWeight: 900, color: "var(--navy)", marginBottom: "8px" }}>
          Warranty & Returns Policy
        </h1>
        <p style={{ color: "var(--ink-secondary)", fontSize: "1.05rem", maxWidth: "700px", lineHeight: 1.6 }}>
          We stand behind the authenticity and quality of every product we stock. Here is how our warranty
          protection, testing, and service claims operate.
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.2fr 0.8fr", gap: "36px", alignItems: "start" }}>
        <div>
          {storeSettings.warrantyPolicy && (
            <div className="content-card" style={{ marginBottom: "24px" }}>
              <h2 style={{ fontSize: "1.3rem", fontWeight: 800, color: "var(--navy)", marginBottom: "12px" }}>
                Current Warranty Notice
              </h2>
              <div style={{ color: "var(--ink-secondary)", lineHeight: 1.65, whiteSpace: "pre-line" }}>
                {storeSettings.warrantyPolicy}
              </div>
            </div>
          )}

          <div className="content-card">
            <h2 style={{ fontSize: "1.3rem", fontWeight: 800, color: "var(--navy)", marginBottom: "12px" }}>
              Official Manufacturer Warranties
            </h2>
            <p style={{ color: "var(--ink-secondary)", lineHeight: 1.65, marginBottom: "14px" }}>
              All brand-new consumer electronics and solar systems carry genuine manufacturer warranties:
            </p>
            <ul style={{ paddingLeft: "20px", color: "var(--ink-secondary)", lineHeight: 1.7, marginBottom: "16px" }}>
              <li>
                <strong>Felicity Solar Inverters & MPPTs:</strong> 1 Year Manufacturer Warranty covering internal boards and components.
              </li>
              <li>
                <strong>Felicity Solar LiFePO4 Lithium Batteries:</strong> Up to 5 Years Warranty on cell chemistry and BMS integrity.
              </li>
              <li>
                <strong>Monocrystalline Solar Panels:</strong> 10-Year product warranty and 25-Year linear performance output guarantee.
              </li>
              <li>
                <strong>LG Electronics (TVs & Audio):</strong> 2 Years Official LG Nigeria Warranty with nationwide service center support.
              </li>
              <li>
                <strong>Samsung Displays & Refrigeration:</strong> 2 Years Official Samsung Warranty (up to 10 years on inverter compressors).
              </li>
              <li>
                <strong>Sollatek Power Protectors:</strong> 5 Years Genuine Manufacturer Warranty against manufacturing defects.
              </li>
            </ul>
          </div>

          <div className="content-card">
            <h2 style={{ fontSize: "1.3rem", fontWeight: 800, color: "var(--navy)", marginBottom: "12px" }}>
              Pre-Dispatch Testing Policy
            </h2>
            <p style={{ color: "var(--ink-secondary)", lineHeight: 1.65, marginBottom: "14px" }}>
              To ensure customer peace of mind, every television, soundbar, and solar inverter purchased at our Jos showroom
              undergoes a physical bench test:
            </p>
            <ul style={{ paddingLeft: "20px", color: "var(--ink-secondary)", lineHeight: 1.7 }}>
              <li>Displays are checked for dead pixels, panel backlight consistency, and Wi-Fi connectivity.</li>
              <li>Inverters are connected to DC battery power to verify sine wave AC output, LCD telemetry, and fan operation.</li>
              <li>Serial numbers are recorded on your sales receipt alongside the official warranty stamp.</li>
            </ul>
          </div>
        </div>

        <div className="showroom-card">
          <span className="section-eyebrow">Warranty Assistance</span>
          <h3>Need Help with a Warranty Claim?</h3>
          <p style={{ color: "var(--ink-secondary)", fontSize: "0.9rem", marginBottom: "14px" }}>
            Bring your equipment and sales receipt directly to our Jos showroom or message our customer service desk:
          </p>
          <p style={{ color: "var(--navy)", fontWeight: 700, fontSize: "0.9rem", marginBottom: "18px" }}>
            📍 {storeSettings.address}
          </p>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-whatsapp btn-sm"
            style={{ width: "100%", textAlign: "center", marginBottom: "10px" }}
          >
            <span>💬</span> Message Warranty Desk
          </a>
          <Link href="/contact" className="btn btn-outline btn-sm" style={{ width: "100%", textAlign: "center" }}>
            View Store Contact Info
          </Link>
        </div>
      </div>
    </div>
  );
}
