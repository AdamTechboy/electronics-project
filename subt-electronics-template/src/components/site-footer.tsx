import React from "react";
import Link from "next/link";
import { STORE_INFO, CATEGORIES, createWhatsAppEnquiryUrl } from "@/lib/catalogue-data";

export function SiteFooter() {
  const whatsappUrl = createWhatsAppEnquiryUrl();

  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-top-grid">
          {/* Column 1: Store Bio & Identity */}
          <div className="footer-col">
            <h4>{STORE_INFO.name}</h4>
            <p style={{ color: "var(--amber)", fontWeight: 700, marginBottom: 8 }}>
              {STORE_INFO.tagline}
            </p>
            <p>
              Your trusted electronics and renewable power equipment partner in Jos, Plateau State.
              Supplying genuine hybrid inverters, deep-cycle lithium batteries, Tier-1 solar panels,
              and premier home entertainment systems.
            </p>
            <div style={{ marginTop: 14 }}>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-whatsapp btn-sm"
              >
                <span>💬</span> Chat on WhatsApp
              </a>
            </div>
          </div>

          {/* Column 2: Departments */}
          <div className="footer-col">
            <h4>Product Departments</h4>
            <ul className="footer-links-list">
              {CATEGORIES.map((cat) => (
                <li key={cat.slug}>
                  <Link href={`/products?category=${cat.slug}`}>{cat.name}</Link>
                </li>
              ))}
              <li>
                <Link href="/products">View All Products →</Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Customer Service & Policies */}
          <div className="footer-col">
            <h4>Customer Service</h4>
            <ul className="footer-links-list">
              <li>
                <Link href="/contact">Showroom & Directions</Link>
              </li>
              <li>
                <Link href="/warranty-returns">Warranty & Testing Policy</Link>
              </li>
              <li>
                <Link href="/delivery">Pickup & State Delivery</Link>
              </li>
              <li>
                <Link href="/about">About Muhammad Kairu</Link>
              </li>
              <li>
                <Link href="/privacy">Privacy Notice</Link>
              </li>
              <li>
                <Link href="/terms">Terms of Service</Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Showroom & Contact Info */}
          <div className="footer-col">
            <h4>Jos Showroom</h4>
            <div className="footer-contact-item">
              <span>📍</span>
              <div>
                <strong>Showroom Address:</strong>
                <span>{STORE_INFO.address}</span>
              </div>
            </div>
            <div className="footer-contact-item">
              <span>🕒</span>
              <div>
                <strong>Opening Hours:</strong>
                <span>{STORE_INFO.openingHours}</span>
              </div>
            </div>
            <div className="footer-contact-item">
              <span>📞</span>
              <div>
                <strong>Telephone / WhatsApp:</strong>
                <br />
                <a href={`tel:${STORE_INFO.phone}`} style={{ color: "white", fontWeight: 700 }}>
                  {STORE_INFO.phoneDisplay}
                </a>
              </div>
            </div>
            <div className="footer-contact-item">
              <span>✉️</span>
              <div>
                <strong>Email Enquiries:</strong>
                <br />
                <a href={`mailto:${STORE_INFO.email}`} style={{ color: "white" }}>
                  {STORE_INFO.email}
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="footer-bottom-bar">
          <div>
            © {new Date().getFullYear()} {STORE_INFO.name}. All rights reserved.
          </div>
          <div style={{ maxWidth: 600 }}>
            Notice: Muhammad Kairu Electronics is a product catalogue and customer enquiry service.
            Online payments and checkout are not processed on this website. All transactions and
            collections occur directly via our Jos showroom or verified customer support representatives.
          </div>
        </div>
      </div>
    </footer>
  );
}
