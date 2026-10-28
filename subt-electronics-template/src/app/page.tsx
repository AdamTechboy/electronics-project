import React from "react";
import Link from "next/link";
import { ProductCard } from "@/components/product-card";
import { ProductSvg } from "@/components/product-svg";
import {
  STORE_INFO,
  CATEGORIES,
  BRANDS,
  getFeaturedProducts,
  createWhatsAppEnquiryUrl,
  createSolarAssessmentUrl,
} from "@/lib/catalogue-data";

export default function HomePage() {
  const featuredProducts = getFeaturedProducts();
  const whatsappUrl = createWhatsAppEnquiryUrl();
  const solarAssessmentUrl = createSolarAssessmentUrl();

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
                <span>☀️</span> Specialized Solar & Electronics Retailer · Jos
              </div>
              <h1 className="hero-title">
                Reliable Electronics. <span className="highlight">Smarter Solar Power.</span>
              </h1>
              <p className="hero-description">
                Explore genuine hybrid solar inverters, high-capacity lithium batteries, Tier-1 solar
                panels, 4K Smart TVs, and tropicalized home appliances. Visit our showroom at Rochas
                Plaza, Jos or chat directly with our technical sales team on WhatsApp.
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
                  <div className="hero-trust-text">
                    <strong>Jos Showroom</strong>
                    <span>Rochas Plaza, opp. Zenith Bank</span>
                  </div>
                </div>
                <div className="hero-trust-box">
                  <span className="hero-trust-icon">🛡️</span>
                  <div className="hero-trust-text">
                    <strong>Genuine Warranties</strong>
                    <span>1 to 5 Years Official Manufacturer</span>
                  </div>
                </div>
                <div className="hero-trust-box">
                  <span className="hero-trust-icon">⚡</span>
                  <div className="hero-trust-text">
                    <strong>Solar Load Sizing</strong>
                    <span>Expert Advice for Homes & Offices</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Composite Hardware Showcase Visual */}
            <div className="hero-visual-card">
              <div className="hero-visual-header">
                <span className="hero-visual-badge">SHOWROOM HIGHLIGHTS</span>
                <span style={{ fontSize: "0.8rem", color: "#CBD5E1" }}>In Stock in Jos</span>
              </div>

              <div className="hero-visual-grid">
                <div className="hero-showcase-tile">
                  <div className="hero-showcase-tile-svg">
                    <ProductSvg type="inverter" alt="Hybrid Solar Inverter" />
                  </div>
                  <h4>Felicity 5kVA Hybrid</h4>
                  <p>48V Pure Sine Wave</p>
                  <div className="price-tag">₦845,000</div>
                </div>

                <div className="hero-showcase-tile">
                  <div className="hero-showcase-tile-svg">
                    <ProductSvg type="battery" alt="LiFePO4 Lithium Battery" />
                  </div>
                  <h4>10kWh LiFePO4</h4>
                  <p>48V 200Ah Wall-Mount</p>
                  <div className="price-tag">₦2,150,000</div>
                </div>

                <div className="hero-showcase-tile">
                  <div className="hero-showcase-tile-svg">
                    <ProductSvg type="tv" alt="LG 65 Inch 4K Smart TV" />
                  </div>
                  <h4>LG 65&quot; 4K Smart TV</h4>
                  <p>webOS with Magic Remote</p>
                  <div className="price-tag">₦890,000</div>
                </div>

                <div className="hero-showcase-tile">
                  <div className="hero-showcase-tile-svg">
                    <ProductSvg type="fridge" alt="Hisense Double Door Refrigerator" />
                  </div>
                  <h4>Hisense 250L Refrigerator</h4>
                  <p>Total No-Frost Inverter</p>
                  <div className="price-tag">₦385,000</div>
                </div>
              </div>

              <div className="hero-visual-footer">
                <span>✓ Tested before dispatch</span>
                <span>✓ Pick up in showroom today</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ----------------------------------------------------------------------
          2. Shop by Category (Visual Department Cards)
      ---------------------------------------------------------------------- */}
      <section className="section" aria-label="Product Categories">
        <div className="container">
          <div className="section-head">
            <div>
              <span className="section-eyebrow">Product Departments</span>
              <h2 className="section-title">Shop by Category</h2>
              <p className="section-subtitle">
                Explore curated power solutions and electronics tailored for Nigerian homes and businesses.
              </p>
            </div>
            <Link href="/categories" className="section-link">
              All categories →
            </Link>
          </div>

          <div className="category-grid">
            {CATEGORIES.map((category) => (
              <Link
                key={category.slug}
                href={`/products?category=${category.slug}`}
                className={`category-card ${category.department === "solar" ? "solar-category" : ""}`}
              >
                <div className="category-card-top">
                  <div className="category-icon-box">
                    {category.slug === "solar-power-solutions" && "☀️"}
                    {category.slug === "television-visuals" && "📺"}
                    {category.slug === "home-audio" && "🔊"}
                    {category.slug === "refrigeration-cooling" && "❄️"}
                    {category.slug === "kitchen-appliances" && "🍳"}
                    {category.slug === "electrical-accessories" && "🔌"}
                  </div>
                  <span className="category-badge">{category.itemCountEstimate}</span>
                </div>
                <h3 className="category-title">{category.name}</h3>
                <p className="category-desc">{category.description}</p>
                <div className="category-footer">
                  <span>Browse Products</span>
                  <span>→</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ----------------------------------------------------------------------
          3. Featured Products Grid (Image-First, Realistic Prices & Specs)
      ---------------------------------------------------------------------- */}
      <section className="section" style={{ background: "#FFFFFF" }} aria-label="Featured Products">
        <div className="container">
          <div className="section-head">
            <div>
              <span className="section-eyebrow">Curated Catalogue</span>
              <h2 className="section-title">Featured Products in Showroom</h2>
              <p className="section-subtitle">
                Genuine equipment currently available for inspection and pickup at Rochas Plaza, Jos.
              </p>
            </div>
            <Link href="/products" className="section-link">
              View all products ({featuredProducts.length}+) →
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
            {BRANDS.map((brand) => (
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
                    <span>{STORE_INFO.address}</span>
                  </div>
                </li>
                <li className="showroom-detail-item">
                  <span className="icon">🕒</span>
                  <div>
                    <strong>Operating Hours</strong>
                    <span>{STORE_INFO.openingHours}</span>
                  </div>
                </li>
                <li className="showroom-detail-item">
                  <span className="icon">📞</span>
                  <div>
                    <strong>Showroom Telephone / WhatsApp</strong>
                    <span>{STORE_INFO.phoneDisplay}</span>
                  </div>
                </li>
                <li className="showroom-detail-item">
                  <span className="icon">🚚</span>
                  <div>
                    <strong>Pickup & Logistics</strong>
                    <span>Same-day pickup in Jos; secure transport across Plateau and Northern Nigeria</span>
                  </div>
                </li>
              </ul>

              <div style={{ display: "flex", gap: 12, marginTop: 20 }}>
                <a
                  href={`tel:${STORE_INFO.phone}`}
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
                    quick WhatsApp message or call 07038365737 to confirm current stock and exact price before visiting.
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
