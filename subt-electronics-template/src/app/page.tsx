import React from "react";
import Link from "next/link";
import { ProductCard } from "@/components/product-card";
import { ProductSvg } from "@/components/product-svg";
import {
  createWhatsAppEnquiryUrl,
  createSolarAssessmentUrl,
} from "@/lib/catalogue-data";
import {
  getStoreProducts,
  getStoreCategories,
  getStoreBrands,
  getStoreSettings,
} from "@/lib/catalogue-db";

export default async function HomePage() {
  const [allProducts, categories, brands, storeSettings] = await Promise.all([
    getStoreProducts(),
    getStoreCategories(),
    getStoreBrands(),
    getStoreSettings(),
  ]);

  const featuredProducts = allProducts.filter((p) => p.isFeatured);

  const whatsappUrl = createWhatsAppEnquiryUrl(
    "General Enquiry",
    "",
    "",
    storeSettings.whatsapp
  );
  const solarAssessmentUrl = createSolarAssessmentUrl(storeSettings.whatsapp);

  return (
    <>
      {/* ----------------------------------------------------------------------
          1. Product-Led Hero Section
      ---------------------------------------------------------------------- */}
      <section className="hero-section" aria-label="Storefront Introduction">
        <div className="container">
          <div className="hero-layout">
            <div>
              <div className="hero-tag">
                <span>☀️</span> Specialized Solar &amp; Electronics Retailer · Jos
              </div>
              <h1 className="hero-title">
                Reliable Electronics. <span className="highlight">Smarter Solar Power.</span>
              </h1>
              <p className="hero-description">
                Explore genuine hybrid solar inverters, high-capacity lithium batteries, Tier-1 solar
                panels, 4K Smart TVs, and tropicalized home appliances. Visit our showroom at {storeSettings.address} or chat directly with our technical sales team on WhatsApp.
              </p>

              <div className="hero-cta-bar">
                <Link href="/products?category=solar-power-solutions" className="btn btn-primary">
                  ☀️ Explore Solar Solutions
                </Link>
                <Link href="/products" className="btn btn-navy">
                  Browse Full Catalogue
                </Link>
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-whatsapp"
                >
                  <span>💬</span> Enquire on WhatsApp
                </a>
              </div>

              {/* Verified Trust Strip */}
              <div className="hero-trust-bar">
                <div className="hero-trust-box">
                  <span className="hero-trust-icon">📍</span>
                  <div>
                    <strong>Jos Showroom</strong>
                    <span>Rochas Plaza, Ahmadu Bello Way</span>
                  </div>
                </div>

                <div className="hero-trust-box">
                  <span className="hero-trust-icon">🛡️</span>
                  <div>
                    <strong>Official Warranties</strong>
                    <span>Direct manufacturer backed</span>
                  </div>
                </div>

                <div className="hero-trust-box">
                  <span className="hero-trust-icon">⚡</span>
                  <div>
                    <strong>Pre-Tested Before Pickup</strong>
                    <span>100% genuine equipment</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Hero Featured Hero Visual */}
            <div className="hero-visual-card">
              <div className="hero-visual-badge">Featured Solar Core</div>
              <ProductSvg type="inverter" alt="Solar Inverter System" />
              <div className="hero-visual-caption">
                <strong>Felicity Solar 5kVA Hybrid Inverter</strong>
                <span>Pure Sine Wave · 120A MPPT · Lithium Ready</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ----------------------------------------------------------------------
          2. Category Gateway Grid
      ---------------------------------------------------------------------- */}
      <section className="section" aria-label="Product Categories">
        <div className="container">
          <div className="section-head">
            <div>
              <span className="section-eyebrow">Browse by Specialization</span>
              <h2 className="section-title">Showroom Departments</h2>
            </div>
            <Link href="/products" className="section-link">
              View all products →
            </Link>
          </div>

          <div className="category-grid">
            {categories.map((cat) => (
              <Link
                key={cat.slug}
                href={`/products?category=${cat.slug}`}
                className="category-card"
              >
                <div className="category-card-icon">
                  <ProductSvg type={cat.iconType} alt={cat.name} />
                </div>
                <div className="category-card-content">
                  <span className="category-department-pill">
                    {cat.department === "solar" ? "☀️ Solar & Power" : "📺 Electronics"}
                  </span>
                  <h3 className="category-card-title">{cat.name}</h3>
                  <p className="category-card-description">{cat.description}</p>
                  <span className="category-card-count">{cat.itemCountEstimate}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ----------------------------------------------------------------------
          3. Featured Showroom Hardware (Dynamic DB Backed)
      ---------------------------------------------------------------------- */}
      <section className="section" style={{ background: "white" }} aria-label="Featured Products">
        <div className="container">
          <div className="section-head">
            <div>
              <span className="section-eyebrow">Hand-Picked Recommendations</span>
              <h2 className="section-title">Featured Showroom Equipment</h2>
            </div>
            <Link href="/products" className="section-link">
              Browse full inventory ({allProducts.length} items) →
            </Link>
          </div>

          <div className="product-grid">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* ----------------------------------------------------------------------
          4. Solar Solutions Ecosystem Hub
      ---------------------------------------------------------------------- */}
      <section className="container">
        <div className="solar-showcase-section">
          <div className="container">
            <div className="solar-showcase-head">
              <span className="section-eyebrow" style={{ color: "var(--amber)" }}>
                Renewable Energy Architecture
              </span>
              <h2>Complete Solar Power Ecosystem</h2>
              <p>
                Say goodbye to blackout anxiety and soaring fuel costs. Muhammad Kairu Electronics
                supplies fully matched solar setups engineered for long-term reliability.
              </p>
            </div>

            <div className="solar-pillars-grid">
              <div className="solar-pillar-card">
                <div className="solar-pillar-icon">⚡</div>
                <h3>1. Hybrid Inverters</h3>
                <p>
                  High-efficiency pure sine wave inverters with built-in MPPT controllers. Seamlessly blends
                  solar, grid, and battery energy with zero transfer delay.
                </p>
              </div>

              <div className="solar-pillar-card">
                <div className="solar-pillar-icon">🔋</div>
                <h3>2. Lithium Storage</h3>
                <p>
                  Grade-A LiFePO4 battery modules offering 6000+ cycles, 90% depth of discharge, and smart BMS
                  protection against thermal spikes and overcharging.
                </p>
              </div>

              <div className="solar-pillar-card">
                <div className="solar-pillar-icon">☀️</div>
                <h3>3. Solar Panels</h3>
                <p>
                  Tier-1 Monocrystalline PERC half-cell panels. Maximum energy capture even in overcast Jos
                  weather, with 25-year linear performance warranties.
                </p>
              </div>

              <div className="solar-pillar-card">
                <div className="solar-pillar-icon">🛡️</div>
                <h3>4. Power Protection</h3>
                <p>
                  Automatic voltage switchers (AVS30), DC circuit breakers, and double-insulated tinned copper
                  cables to safeguard your valuable investment.
                </p>
              </div>
            </div>

            {/* Assessment Call-to-Action Banner */}
            <div className="solar-assessment-banner">
              <div className="solar-assessment-text">
                <h4>Need Help Sizing Your Home or Office Solar System?</h4>
                <p>
                  Not sure whether you need a 3.5kVA, 5kVA, or 10kVA system? Send us your load list
                  (appliances, hours of use) and our Jos technical team will advise on the optimal configuration.
                </p>
              </div>
              <a
                href={solarAssessmentUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary"
                style={{ flexShrink: 0 }}
              >
                <span>⚡</span> Get Free Solar Sizing Advice
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ----------------------------------------------------------------------
          5. Brand Partners Strip
      ---------------------------------------------------------------------- */}
      <section className="brand-strip-section" aria-label="Brand Partners">
        <div className="container">
          <div className="brand-strip-grid">
            {brands.map((brand) => (
              <div key={brand.slug} className="brand-strip-item">
                <strong>{brand.name}</strong>
                <span>{brand.specialty}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ----------------------------------------------------------------------
          6. Trust, Showroom Information & FAQ
      ---------------------------------------------------------------------- */}
      <section className="section" aria-label="Showroom and Support">
        <div className="container">
          <div className="trust-faq-grid">
            {/* Showroom Details */}
            <div className="showroom-card">
              <span className="section-eyebrow">Physical Showroom</span>
              <h3>Visit Us in Jos, Plateau State</h3>
              <p style={{ color: "var(--ink-secondary)", marginBottom: 14 }}>
                We believe high-value electronics and solar investments should be inspected in person.
                Come test our equipment, inspect packaging, and verify warranty certificates before you buy.
              </p>

              <ul className="showroom-detail-list">
                <li className="showroom-detail-item">
                  <span className="icon">📍</span>
                  <div>
                    <strong>Showroom Address</strong>
                    <span>{storeSettings.address}</span>
                  </div>
                </li>
                <li className="showroom-detail-item">
                  <span className="icon">🕒</span>
                  <div>
                    <strong>Operating Hours</strong>
                    <span>{storeSettings.openingHours}</span>
                  </div>
                </li>
                <li className="showroom-detail-item">
                  <span className="icon">📞</span>
                  <div>
                    <strong>Showroom Telephone / WhatsApp</strong>
                    <span>{storeSettings.phoneDisplay}</span>
                  </div>
                </li>
                <li className="showroom-detail-item">
                  <span className="icon">🚚</span>
                  <div>
                    <strong>Pickup &amp; Logistics</strong>
                    <span>Same-day pickup in Jos; secure transport across Plateau and Northern Nigeria</span>
                  </div>
                </li>
              </ul>

              <div style={{ display: "flex", gap: 12, marginTop: 20 }}>
                <a
                  href={`tel:${storeSettings.phone}`}
                  className="btn btn-navy btn-sm"
                >
                  📞 Call Showroom
                </a>
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-whatsapp btn-sm"
                >
                  💬 Chat on WhatsApp
                </a>
              </div>
            </div>

            {/* Frequently Asked Questions */}
            <div>
              <span className="section-eyebrow">Customer Guidance</span>
              <h3 style={{ fontSize: "1.35rem", fontWeight: 800, color: "var(--navy)", marginBottom: 16 }}>
                Frequently Asked Questions
              </h3>

              <div className="faq-accordion">
                <details className="faq-item" open>
                  <summary className="faq-summary">
                    <span>How do I purchase a product from your store?</span>
                    <span>▾</span>
                  </summary>
                  <div className="faq-content">
                    This website serves as our live product catalogue and enquiry platform. To purchase, click the
                    WhatsApp button on any product card or contact our Jos showroom. You can visit in person to test
                    the product and pick it up, or arrange secure delivery.
                  </div>
                </details>

                <details className="faq-item">
                  <summary className="faq-summary">
                    <span>Are products covered by manufacturer warranties?</span>
                    <span>▾</span>
                  </summary>
                  <div className="faq-content">
                    Yes. All brand-new electronics (LG, Samsung, Hisense, Nexus) and solar equipment (Felicity Solar,
                    Sollatek) come with official manufacturer warranty cards stamped upon purchase. We also assist with
                    warranty servicing if needed.
                  </div>
                </details>

                <details className="faq-item">
                  <summary className="faq-summary">
                    <span>Do you offer solar installation services in Jos?</span>
                    <span>▾</span>
                  </summary>
                  <div className="faq-content">
                    Yes. We partner with certified solar engineers and technicians across Jos and surrounding areas in
                    Plateau State to ensure your inverters, solar panels, and batteries are correctly sized, wired,
                    and protected.
                  </div>
                </details>

                <details className="faq-item">
                  <summary className="faq-summary">
                    <span>Can I confirm prices and stock availability before visiting?</span>
                    <span>▾</span>
                  </summary>
                  <div className="faq-content">
                    Absolutely. Due to exchange rate shifts and daily showroom sales, we encourage customers to send a
                    quick WhatsApp message or call {storeSettings.phone} to confirm current stock and exact price before visiting.
                  </div>
                </details>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
