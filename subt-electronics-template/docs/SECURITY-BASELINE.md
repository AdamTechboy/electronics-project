# Security baseline and implementation gates

## Current safety state

This repository is a scaffold. Admin mutations are not enabled, enquiry POST fails closed, and the admin page guard always redirects to sign-in. These choices are intentional until persistence, sessions, authorization, and abuse controls are complete.

## Before enabling real enquiries

- Persist validated submissions using Prisma and a transaction-safe reference generator.
- Add server-side rate limiting (IP and other risk signals; avoid retaining raw IP longer than justified).
- Validate origin/content type/body size; add CSRF/origin protections appropriate to the request model.
- Add spam controls and operational monitoring.
- Set a retention period and access policy for enquiry PII.
- Notify users clearly about how the information will be used.
- Keep PII out of logs and analytics.
- Add tests for malformed input, duplicate submissions, flood attempts, DB errors, and output encoding.

## Before enabling admin

- Implement database-backed sessions with high-entropy identifiers, server-side revocation, rotation on authentication/privilege change, idle and absolute expiry.
- Set cookies `HttpOnly`, `Secure` in production, `SameSite=Lax` or stricter as appropriate, and narrow path/domain.
- Add CSRF protections for cookie-authenticated state-changing requests.
- Use Argon2id where supported; benchmark parameters. Enforce password policy and breached-password protections where feasible.
- Implement login and invitation rate limits, generic authentication errors, alerting, and lockout/throttling policy that avoids easy denial of service.
- Create invitations only from an authorised operator; use cryptographically random tokens, store hashes, expire them, redeem once in a transaction, and revoke prior outstanding invitations.
- Require role/tenant checks in every protected server action and API route; never rely on UI visibility.
- Add MFA for privileged accounts where feasible.
- Audit security-sensitive actions without secrets or unnecessary PII.
- Test IDOR, CSRF, session fixation, privilege escalation, replay, brute force, reset/revocation, and tenant boundary cases.

## Database and tenant isolation

The starting deployment model is one database and secret set per client. The schema includes `tenantId` for explicit scoping and future portability, but it does not by itself provide isolation. Every repository query must scope tenant IDs; test this explicitly. Do not share one database between clients without a separate reviewed isolation design.

## Uploads

No upload endpoint is enabled. If introduced, enforce file-size limits, content inspection, allowlisted formats, random storage keys, private-by-default storage, malware scanning where appropriate, and safe serving headers. Never trust filenames or browser MIME types alone.

## HTTP / deployment

Add and verify security headers (CSP, HSTS in production, frame protections, nosniff, referrer policy, restrictive permissions policy). Keep preview deployments private/noindex. Verify CORS rather than using wildcard origins. Keep dependencies patched and run automated dependency/security scans.

## Privacy

Complete a data map and document purposes, lawful basis, recipients/processors, retention, privacy-request contact, deletion/export handling, and controller/processor responsibilities. Review Nigerian Data Protection Act 2023 applicability and cross-border processing with appropriate counsel. Do not treat this checklist as legal advice.
