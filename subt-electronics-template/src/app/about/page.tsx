import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { createWhatsAppEnquiryUrl } from "@/lib/catalogue-data";
import { getStoreSettings } from "@/lib/catalogue-db";

export const metadata: Metadata = {
  title: "About Us | Muhammad Kairu Electronics (Jos)",
  description:
    "Learn about Muhammad Kairu Electronics — Plateau State's specialist retailer for hybrid solar inverters, lithium batteries, solar panels, and quality home electronics.",
};

export default async function AboutPage() {
  const storeSettings = await getStoreSettings();
  const whatsappUrl = createWhatsAppEnquiryUrl("About Us Enquiry", "", "", storeSettings.whatsapp);

  return (
    <div className="container" style={{ padding: "40px 0 60px" }}>
      <div style={{ marginBottom: "32px" }}>
        <span className="section-eyebrow">Retailer Profile</span>
        <h1 style={{ fontSize: "clamp(2rem, 3.5vw, 2.8rem)", fontWeight: 900, color: "var(--navy)", marginBottom: "8px" }}>
          About {storeSettings.name}
        </h1>
        <p style={{ color: "var(--ink-secondary)", fontSize: "1.05rem", maxWidth: "700px", lineHeight: 1.6 }}>
          {storeSettings.tagline} — Supplying durable electronics and proven solar energy hardware to families,
          offices, and institutions across Jos and Plateau State.
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.2fr 0.8fr", gap: "36px", alignItems: "start" }}>
        <div>
          {storeSettings.aboutText && (
            <div className="content-card" style={{ marginBottom: "24px" }}>
              <h2 style={{ fontSize: "1.3rem", fontWeight: 800, color: "var(--navy)", marginBottom: "12px" }}>
                Company Overview
              </h2>
              <div style={{ color: "var(--ink-secondary)", lineHeight: 1.65, whiteSpace: "pre-line" }}>
                {storeSettings.aboutText}
              </div>
            </div>
          )}

          <div className="content-card">
            <h2 style={{ fontSize: "1.3rem", fontWeight: 800, color: "var(--navy)", marginBottom: "12px" }}>
              Our Business Mission
            </h2>
            <p style={{ color: "var(--ink-secondary)", lineHeight: 1.65, marginBottom: "14px" }}>
              Based at Rochas Plaza on Ahmadu Bello Way, Jos, <strong>{storeSettings.name}</strong> was established
              to solve two fundamental everyday challenges for Nigerian households and businesses:
            </p>
            <ul style={{ paddingLeft: "20px", color: "var(--ink-secondary)", lineHeight: 1.7, marginBottom: "16px" }}>
              <li>
                <strong>Energy Independence:</strong> Providing reliable solar power components — including pure sine wave
                hybrid inverters, high-cycle LiFePO4 lithium batteries, and Tier-1 solar panels — that free customers from
                unreliable grid supply and escalating generator fuel expenses.
              </li>
              <li>
                <strong>Quality Home Entertainment & Living:</strong> Offering authentic 4K Smart TVs, crystal-clear soundbars,
                low-voltage inverter refrigerators, and durable kitchen appliances backed by genuine manufacturer warranties.
              </li>
            </ul>
            <p style={{ color: "var(--ink-secondary)", lineHeight: 1.65 }}>
              We operate on an enquiry and showroom verification model. Every product can be inspected, tested, and verified
              in person at our Jos store before purchase.
            </p>
          </div>

          <div className="content-card">
            <h2 style={{ fontSize: "1.3rem", fontWeight: 800, color: "var(--navy)", marginBottom: "12px" }}>
              Why Choose {storeSettings.name}?
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
              <div style={{ padding: "12px", background: "var(--bg-warm)", borderRadius: "var(--radius-sm)" }}>
                <strong style={{ color: "var(--navy)", display: "block", marginBottom: "4px" }}>📍 Physical Presence</strong>
                <span style={{ fontSize: "0.85rem", color: "var(--ink-secondary)" }}>
                  Permanent, accessible showroom in the commercial heart of Jos, opposite Zenith Bank.
                </span>
              </div>
              <div style={{ padding: "12px", background: "var(--bg-warm)", borderRadius: "var(--radius-sm)" }}>
                <strong style={{ color: "var(--navy)", display: "block", marginBottom: "4px" }}>🛡️ Genuine Equipment</strong>
                <span style={{ fontSize: "0.85rem", color: "var(--ink-secondary)" }}>
                  Official distribution from Felicity Solar, LG, Samsung, Hisense, Nexus, and Sollatek.
                </span>
              </div>
              <div style={{ padding: "12px", background: "var(--bg-warm)", borderRadius: "var(--radius-sm)" }}>
                <strong style={{ color: "var(--navy)", display: "block", marginBottom: "4px" }}>⚡ System Sizing Advice</strong>
                <span style={{ fontSize: "0.85rem", color: "var(--ink-secondary)" }}>
                  Technical consultation to correctly match inverter capacity with battery storage and solar arrays.
                </span>
              </div>
              <div style={{ padding: "12px", background: "var(--bg-warm)", borderRadius: "var(--radius-sm)" }}>
                <strong style={{ color: "var(--navy)", display: "block", marginBottom: "4px" }}>🔍 In-Store Testing</strong>
                <span style={{ fontSize: "0.85rem", color: "var(--ink-secondary)" }}>
                  All units are unboxed, powered, and verified in front of the customer prior to collection.
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Info Box */}
        <div className="showroom-card">
          <span className="section-eyebrow">Showroom Details</span>
          <h3>Visit Our Jos Store</h3>
          <p style={{ color: "var(--ink-secondary)", fontSize: "0.9rem", marginBottom: "16px" }}>
            {storeSettings.address}
          </p>
          <p style={{ color: "var(--ink-secondary)", fontSize: "0.9rem", marginBottom: "16px" }}>
            <strong>Opening Hours:</strong> {storeSettings.openingHours}
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <Link href="/products" className="btn btn-navy btn-sm" style={{ textAlign: "center" }}>
              Explore Catalogue
            </Link>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-whatsapp btn-sm"
              style={{ textAlign: "center" }}
            >
              <span>💬</span> Chat with Us on WhatsApp
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
