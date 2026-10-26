import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container">
      <section className="page-hero">
        <p className="eyebrow">404 · Not found</p>
        <h1>We couldn’t find that page.</h1>
        <p>The link may be outdated or the product may no longer be listed.</p>
        <Link className="button" href="/products">Browse products</Link>
      </section>
    </div>
  );
}
