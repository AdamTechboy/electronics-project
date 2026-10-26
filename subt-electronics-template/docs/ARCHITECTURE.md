# Architecture decisions

- Next.js App Router + TypeScript for the web app.
- PostgreSQL + Prisma for relational data and migrations.
- Zod for boundary/config validation.
- Separate Vercel deployment, database, and secrets for each client.
- Enquiry-first catalogue. Online checkout, customer accounts, orders, and payment processing are disabled.
- Store stock is manually maintained; if not verified, the public UI says to confirm with the store.
- Demo listings are fictional and must not ship as actual client inventory.
- Primary conversion event: successful enquiry submission. Secondary events: phone/WhatsApp clicks after verified contact details are supplied.
- Admin access uses invitation-only onboarding; no public self-registration or default password.
