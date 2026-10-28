import React from "react";
import Link from "next/link";
import { ProductSvg } from "./product-svg";
import {
  type CatalogueProduct,
  createWhatsAppEnquiryUrl,
} from "@/lib/catalogue-data";
import type { DemoProduct } from "@/lib/demo-products";

interface ProductCardProps {
  product: CatalogueProduct | DemoProduct;
}

export function ProductCard({ product }: ProductCardProps) {
  const isSolar =
    "isSolar" in product
      ? product.isSolar
      : product.category.toLowerCase().includes("solar");

  let priceFormatted = "Confirm with Store";
  if ("priceFormatted" in product && product.priceFormatted) {
    priceFormatted = product.priceFormatted;
  } else if ("price" in product && typeof (product as DemoProduct).price === "number") {
    priceFormatted = `₦${((product as DemoProduct).price as number).toLocaleString("en-NG")}`;
  }

  const imageSvg = "imageSvg" in product && product.imageSvg ? product.imageSvg : "inverter";
  const stockLabel =
    "stockLabel" in product && product.stockLabel
      ? product.stockLabel
      : product.stockStatus === "in-stock"
      ? "In Stock"
      : "Confirm Availability";
  const isInStock = product.stockStatus === "in_stock" || product.stockStatus === "in-stock";

  const whatsappUrl = createWhatsAppEnquiryUrl(product.name, product.slug, priceFormatted);

  return (
    <article className="product-card">
      <div className="product-card-image-wrap">
        <Link href={`/products/${product.slug}`} tabIndex={-1} aria-hidden="true">
          <ProductSvg type={imageSvg} alt={product.name} />
        </Link>
        <div className="product-badge-group">
          <span className="badge-brand">{product.brand}</span>
          {isSolar && <span className="badge-solar">☀️ Solar Power</span>}
        </div>
      </div>

      <div className="product-card-body">
        <span className="product-card-category">{product.category}</span>
        <h3 className="product-card-name">
          <Link href={`/products/${product.slug}`}>{product.name}</Link>
        </h3>

        {/* 2 to 3 Essential Specification Chips */}
        {product.specifications && product.specifications.length > 0 && (
          <div className="product-specs-chips">
            {product.specifications.slice(0, 3).map((spec) => (
              <span key={spec.label} className="spec-chip">
                {spec.label}: {spec.value.split("(")[0].trim()}
              </span>
            ))}
          </div>
        )}

        <div className="product-card-pricing-row">
          <div>
            <div className="product-card-price">{priceFormatted}</div>
          </div>
          <span className={`product-stock-tag ${isInStock ? "stock-in" : "stock-confirm"}`}>
            ● {stockLabel}
          </span>
        </div>

        <div className="product-card-actions">
          <Link href={`/products/${product.slug}`} className="btn btn-outline btn-sm">
            View Details
          </Link>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-whatsapp btn-sm"
            aria-label={`Enquire about ${product.name} on WhatsApp`}
          >
            <span>💬</span> Enquire
          </a>
        </div>
      </div>
    </article>
  );
}
