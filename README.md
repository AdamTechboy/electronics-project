# SUBT Electronics Template — Muhammad Kairu Electronics

Reusable, configuration-driven Next.js starter for electronics retailers. This is an implementation scaffold, not a production-certified deployment.

## Initial release scope

- Responsive public catalogue and product detail pages
- Product enquiry form (no checkout or online payments)
- Admin sign-in UI and protected admin route layout
- Product/category/brand/inventory/enquiry data model
- Invitation-based first-admin setup primitives
- Server-side authorization helper and audit-event model
- Zod-validated tenant configuration
- PostgreSQL + Prisma schema and migration workflow
- Security and launch checklist

## Not included / not enabled

- Online checkout, orders, payment provider SDKs, payment credentials, or payment webhooks
- Customer accounts
- Live inventory synchronization
- Real client contact details, prices, policies, logo, or product images
- Production email delivery for invitations/enquiry notifications
- Production-ready MFA, password reset delivery, or session-store integration

Do not advertise this scaffold as production-ready until the deployment checklist is completed and reviewed.

## Requirements

- Node.js 20.9+
- npm
- PostgreSQL database
- A Vercel project (or another compatible Next.js host)

## Local setup

1. Copy `.env.example` to `.env`.
2. Set `DATABASE_URL` to a PostgreSQL database.
3. Install dependencies: `npm install`
4. Generate Prisma Client: `npm run db:generate`
5. Apply schema in development: `npm run db:migrate`
6. Start the app: `npm run dev`

The current UI uses clearly marked placeholder content until verified client data is supplied. Do not enter real customer data before access controls, retention, privacy notice, and backups are reviewed.

## Environment variables

- `DATABASE_URL`: PostgreSQL connection string; secret
- `APP_BASE_URL`: canonical app URL, e.g. `http://localhost:3000`
- `TENANT_ID`: stable deployment-specific tenant identifier
- `INVITATION_TOKEN_PEPPER`: high-entropy secret used to hash invitation tokens; secret
- `SESSION_SECRET`: high-entropy secret reserved for a production session implementation; secret
- `NODE_ENV`: set by the runtime

Never commit `.env` or place secrets in client-side configuration.

## Client configuration

Edit `src/config/tenant.ts`. Validate all values with the Zod schema. Set `features.onlineCheckout` to `false` for this initial release. Do not enable checkout without a separately approved threat model, payment provider review, webhook verification, idempotency, and security testing.

## Database

Prisma schema is in `prisma/schema.prisma`. Use migrations for schema changes; do not use `prisma db push` in production. Use a separate database and secrets for each client deployment.

## Tests and quality gates

- `npm run lint`
- `npm run typecheck`
- `npm run test`
- `npm run build`

Some tests are scaffold tests only. Add integration and end-to-end tests against a real disposable PostgreSQL database before staging acceptance.

## Production launch checklist

- [ ] Replace all placeholder business content with client-approved facts and assets.
- [ ] Verify all contact details, delivery zones, warranty/returns policies, and product claims with the client.
- [ ] Implement a production session store, CSRF protections where applicable, session rotation/revocation, and secure cookie settings.
- [ ] Wire invitation issuance/redeeming to a trusted delivery channel; store only token hashes; enforce single-use expiry.
- [ ] Add rate limits for login, invitation redemption, and enquiry submission.
- [ ] Add server-side role checks to every protected read/write operation and test privilege escalation/IDOR.
- [ ] Add safe image upload pipeline if uploads are enabled (size/type/content validation, storage isolation, malware scanning as appropriate).
- [ ] Configure transactional email provider only after approval; never expose tokens in logs.
- [ ] Add privacy notice, terms, retention schedule, privacy-request contact, and confirm NDPA 2023 obligations with appropriate counsel.
- [ ] Add monitoring, dependency scanning, security headers, CSP, CORS review, backups, and a successful restore test.
- [ ] Configure staging, run migration/rollback rehearsal, and complete manual mobile/accessibility checks.
- [ ] Confirm Vercel plan/limits and database region/backup capabilities.
- [ ] Obtain client acceptance and record the primary conversion event definition.

## Primary conversion tracking

Track successful product enquiry submissions and phone/WhatsApp click events once verified contact links are configured. Distinguish a click from a qualified enquiry or sale. Do not put names, phone numbers, messages, or other personal data into analytics events.

## Architecture

- `src/app`: App Router pages
- `src/components`: reusable UI
- `src/config`: validated tenant settings
- `src/server`: server-only authorization/audit helpers
- `prisma`: PostgreSQL schema
- `tests`: starter unit tests
- `docs`: security and acceptance notes
