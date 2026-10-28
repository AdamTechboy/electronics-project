import React from "react";
import type { Metadata } from "next";
import { EnquiryForm } from "@/components/enquiry-form";
import { STORE_INFO, createWhatsAppEnquiryUrl } from "@/lib/catalogue-data";

export const metadata: Metadata = {
  title: "Showroom Contact & Enquiries | Jos, Plateau State",
  description:
    "Contact Muhammad Kairu Electronics at Shop 31A, Rochas Plaza, 41 Ahmadu Bello Way, Jos. Call 07038365737 or enquire directly on WhatsApp.",
};

export default function ContactPage() {
  const whatsappUrl = createWhatsAppEnquiryUrl();

  return (
    <div className="container" style={{ padding: "40px 0 60px" }}>
      <div style={{ marginBottom: "32px" }}>
        <span className="section-eyebrow">Direct Showroom Access</span>
        <h1 style={{ fontSize: "clamp(2rem, 3.5vw, 2.8rem)", fontWeight: 900, color: "var(--navy)", marginBottom: "8px" }}>
          Contact Our Jos Showroom
        </h1>
        <p style={{ color: "var(--ink-secondary)", fontSize: "1.05rem", maxWidth: "680px", lineHeight: 1.6 }}>
          We welcome direct telephone enquiries, WhatsApp consultations, and in-person visits to our showroom
          opposite Zenith Bank on Ahmadu Bello Way, Jos.
        </p>
      </div>

      <div className="trust-faq-grid">
        {/* Showroom Details Card */}
        <div className="showroom-card">
          <span className="section-eyebrow">Location & Direct Channels</span>
          <h3>{STORE_INFO.name}</h3>

          <ul className="showroom-detail-list">
            <li className="showroom-detail-item">
              <span className="icon">📍</span>
              <div>
                <strong>Physical Address:</strong>
                <span>{STORE_INFO.address}</span>
              </div>
            </li>
            <li className="showroom-detail-item">
              <span className="icon">🕒</span>
              <div>
                <strong>Operating Hours:</strong>
                <span>{STORE_INFO.openingHours}</span>
              </div>
            </li>
            <li className="showroom-detail-item">
              <span className="icon">📞</span>
              <div>
                <strong>Direct Telephone:</strong>
                <a href={`tel:${STORE_INFO.phone}`} style={{ color: "var(--navy)", fontWeight: 700 }}>
                  {STORE_INFO.phoneDisplay}
                </a>
              </div>
            </li>
            <li className="showroom-detail-item">
              <span className="icon">💬</span>
              <div>
                <strong>WhatsApp Hotline:</strong>
                <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" style={{ color: "var(--green-dark)", fontWeight: 700 }}>
                  07038365737 (Click to Chat)
                </a>
              </div>
            </li>
            <li className="showroom-detail-item">
              <span className="icon">✉️</span>
              <div>
                <strong>Email Address:</strong>
                <a href={`mailto:${STORE_INFO.email}`} style={{ color: "var(--navy)" }}>
                  {STORE_INFO.email}
                </a>
              </div>
            </li>
          </ul>

          <div style={{ display: "flex", gap: "12px", marginTop: "24px" }}>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-whatsapp"
              style={{ flex: 1 }}
            >
              <span>💬</span> Chat on WhatsApp
            </a>
            <a
              href={`tel:${STORE_INFO.phone}`}
              className="btn btn-navy"
              style={{ flex: 1 }}
            >
              <span>📞</span> Call Now
            </a>
          </div>
        </div>

        {/* Web Enquiry Form */}
        <div className="content-card">
          <h2 style={{ fontSize: "1.3rem", fontWeight: 800, color: "var(--navy)", marginBottom: "8px" }}>
            Send an Online Product Enquiry
          </h2>
          <p style={{ color: "var(--ink-secondary)", fontSize: "0.875rem", marginBottom: "20px" }}>
            Ask about product availability, current pricing, solar system sizing recommendations, or collection times.
          </p>
          <EnquiryForm />
        </div>
      </div>
    </div>
  );
}
