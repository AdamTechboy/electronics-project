"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { STORE_INFO, CATEGORIES, createWhatsAppEnquiryUrl } from "@/lib/catalogue-data";

export function SiteHeader() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?q=${encodeURIComponent(searchQuery.trim())}`);
      setIsMobileMenuOpen(false);
    }
  };

  const whatsappUrl = createWhatsAppEnquiryUrl();

  return (
    <>
      <header className="site-header">
        <div className="container">
          <div className="header-main">
            {/* Brand Logo & Tagline */}
            <Link href="/" className="brand-wrapper" aria-label={`${STORE_INFO.name} home`}>
              <div className="brand-badge" aria-hidden="true">MK</div>
              <div className="brand-text">
                <span className="brand-title">{STORE_INFO.name}</span>
                <span className="brand-subtitle">Electronics & Solar Solutions · Jos</span>
              </div>
            </Link>

            {/* Desktop Search Bar */}
            <form onSubmit={handleSearchSubmit} className="header-search" role="search">
              <div className="search-input-wrapper">
                <span className="search-icon" aria-hidden="true">🔍</span>
                <input
                  type="search"
                  name="q"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search inverters, solar panels, TVs, LG, Felicity..."
                  className="search-field"
                  aria-label="Search electronics and solar products"
                />
                <button type="submit" className="search-submit-btn">Search</button>
              </div>
            </form>

            {/* Desktop Navigation Links */}
            <nav className="nav-links-desktop" aria-label="Main Store Navigation">
              <Link href="/products?category=solar-power-solutions" className="nav-link solar-highlight">
                ☀️ Solar Solutions
              </Link>
              <Link href="/products" className="nav-link">
                Catalogue
              </Link>
              <Link href="/categories" className="nav-link">
                Categories
              </Link>
              <Link href="/contact" className="nav-link">
                Showroom & Contact
              </Link>
            </nav>

            {/* Header CTA & Mobile Toggle */}
            <div className="header-cta-group">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-whatsapp btn-sm"
                aria-label="Enquire directly on WhatsApp"
              >
                <span>💬</span> WhatsApp
              </a>

              <button
                type="button"
                className="mobile-menu-toggle"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                aria-expanded={isMobileMenuOpen}
                aria-label="Toggle mobile menu"
              >
                ☰
              </button>
            </div>
          </div>
        </div>

        {/* Department / Category Quick Bar */}
        <div className="department-bar">
          <div className="container">
            <ul className="department-list" role="list">
              <li>
                <Link href="/products" className="department-chip active">
                  All Departments
                </Link>
              </li>
              {CATEGORIES.map((cat) => (
                <li key={cat.slug}>
                  <Link href={`/products?category=${cat.slug}`} className="department-chip">
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Drawer */}
      <div
        className={`mobile-drawer-overlay ${isMobileMenuOpen ? "open" : ""}`}
        onClick={() => setIsMobileMenuOpen(false)}
        aria-hidden={!isMobileMenuOpen}
      />
      <div className={`mobile-drawer ${isMobileMenuOpen ? "open" : ""}`} aria-hidden={!isMobileMenuOpen}>
        <div className="mobile-drawer-header">
          <div className="brand-wrapper">
            <div className="brand-badge" style={{ width: 34, height: 34, fontSize: "0.9rem" }}>MK</div>
            <span style={{ fontWeight: 800, fontSize: "0.95rem", color: "var(--navy)" }}>{STORE_INFO.name}</span>
          </div>
          <button
            type="button"
            className="mobile-drawer-close"
            onClick={() => setIsMobileMenuOpen(false)}
            aria-label="Close navigation menu"
          >
            ✕
          </button>
        </div>

        <div className="mobile-drawer-body">
          {/* Mobile Search */}
          <form onSubmit={handleSearchSubmit} role="search" style={{ marginBottom: 12 }}>
            <div className="search-input-wrapper">
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products & brands..."
                className="search-field"
              />
              <button type="submit" className="search-submit-btn">Go</button>
            </div>
          </form>

          <Link href="/" className="mobile-nav-item" onClick={() => setIsMobileMenuOpen(false)}>
            🏠 Storefront Home
          </Link>
          <Link href="/products?category=solar-power-solutions" className="mobile-nav-item" onClick={() => setIsMobileMenuOpen(false)} style={{ color: "#B45309" }}>
            ☀️ Solar Power & Inverters
          </Link>
          <Link href="/products" className="mobile-nav-item" onClick={() => setIsMobileMenuOpen(false)}>
            📦 Full Product Catalogue
          </Link>
          <Link href="/categories" className="mobile-nav-item" onClick={() => setIsMobileMenuOpen(false)}>
            📑 Browse by Category
          </Link>
          <Link href="/contact" className="mobile-nav-item" onClick={() => setIsMobileMenuOpen(false)}>
            📍 Showroom Address & Hours
          </Link>
          <Link href="/warranty-returns" className="mobile-nav-item" onClick={() => setIsMobileMenuOpen(false)}>
            🛡️ Warranty & Pickup Policy
          </Link>

          <div style={{ marginTop: "auto", paddingTop: 16 }}>
            <p style={{ fontSize: "0.8rem", color: "var(--ink-muted)", marginBottom: 8 }}>Direct Showroom Enquiries:</p>
            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="btn btn-whatsapp" style={{ width: "100%", marginBottom: 8 }}>
              💬 Chat on WhatsApp
            </a>
            <a href={`tel:${STORE_INFO.phone}`} className="btn btn-outline" style={{ width: "100%" }}>
              📞 Call {STORE_INFO.phoneDisplay}
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
