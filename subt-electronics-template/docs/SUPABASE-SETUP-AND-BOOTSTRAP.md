# Muhammad Kairu Electronics — Supabase Setup & Bootstrap Guide

This document is the authoritative operational guide for provisioning, migrating, securing, and bootstrapping the PostgreSQL database, Row Level Security (RLS) policies, and Storage buckets for **Muhammad Kairu Electronics** using Supabase.

---

## 1. Architectural Foundation & Source of Truth

The database architecture adheres to strict enterprise principles:

1. **Canonical Source of Truth:**
   The version-controlled SQL files in `supabase/migrations/` are the **single source of truth** for all database structures, functions, triggers, RLS policies, and Storage configurations.
2. **Prisma Role:**
   `prisma/schema.prisma` is maintained in complete alignment with the SQL schema (using UUIDs, exact PostgreSQL types, and `@@map` annotations). Prisma serves as a typed query client and schema inspection tool, but all schema alterations are executed strictly through Supabase SQL migrations.
3. **Defense-in-Depth RLS:**
   Every public table has Row Level Security enabled (`ALTER TABLE ... ENABLE ROW LEVEL SECURITY;`). Anonymous storefront visitors only have read access to published catalogue data and write access to create enquiries. Administrative and mutating actions are restricted to verified team members via `SECURITY DEFINER` role functions.
4. **No Online Checkout / Payments:**
   In accordance with the business model of Muhammad Kairu Electronics, the platform operates as a catalogue, pricing display, and customer enquiry system. There are no payment tables, payment gateways, or checkout flows.

---

## 2. Environment Variables Configuration

Copy `.env.example` to `.env` in the project root (`subt-electronics-template/`):

```bash
cp .env.example .env
```

Populate the following variables with credentials from your Supabase Dashboard:

| Variable | Scope | Source / Description |
| :--- | :--- | :--- |
| `NEXT_PUBLIC_SUPABASE_URL` | Public / Client | **Project Settings > API > Project URL** (e.g. `https://xyzcompany.supabase.co`) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public / Client | **Project Settings > API > `anon` `public` key** (Safe for browser) |
| `SUPABASE_SERVICE_ROLE_KEY` | Server Only | **Project Settings > API > `service_role` key** (**SECRET**: Never expose to browser) |
| `DATABASE_URL` | Server Only | **Project Settings > Database > Connection String (URI)** (Use Transaction Pooler port 6543 for serverless) |
| `INVITATION_TOKEN_PEPPER` | Server Only | High-entropy random secret (>= 32 characters) for hashing invitation tokens |
| `SESSION_SECRET` | Server Only | High-entropy random secret (>= 32 characters) for cookie signing |

---

## 3. Migration Sequence

Migrations are located in `supabase/migrations/` and must be executed in numerical order:

### Migration 1: `20261027000001_initial_schema.sql`
- **Purpose:** Core table definitions, UUID generators, updated_at triggers, and Auth synchronization.
- **Key Tables Created (17 total):**
  - `store_settings`: Single-store branding, address, phone/WhatsApp, business hours, and announcement banner.
  - `profiles`: Mirrors `auth.users`, automatically populated via the `handle_new_user()` trigger.
  - `employee_memberships`: Role-based access control linking profiles to roles (`owner`, `product_manager`, `inventory_manager`, `customer_support`, `marketing_manager`, `viewer`).
  - `role_permissions`: Granular matrix mapping roles to permissions (e.g. `products:write`, `enquiries:read`).
  - `categories` & `brands`: Organizes electronics with SEO-friendly slugs.
  - `products`: Product catalogue with prices in Nigerian Kobo (`price_kobo BIGINT`), stock statuses, and JSONB specifications with GIN index.
  - `product_variants`: SKU-level variants (e.g., storage capacity, color).
  - `product_images`: References to images stored in Supabase Storage.
  - `inventory_records`: Stock levels, verification timestamps, and notes.
  - `stock_movements`: Immutable stock audit trail (restock, correction, damage, etc.).
  - `customers`: Phone-indexed customer directory.
  - `enquiries`: Customer product enquiries with unique tracking codes (`reference_code`).
  - `enquiry_notes`: Internal staff notes on customer enquiries.
  - `analytics_events`: Privacy-focused storefront telemetry (page views, search terms, WhatsApp clicks).
  - `audit_logs`: Administrative mutation logs for compliance and tracing.
  - `store_announcements`: Configurable promotional and notice banners.

### Migration 2: `20261027000002_rls_policies.sql`
- **Purpose:** Enable RLS on all 17 tables and establish least-privilege security policies.
- **Security Definer Helpers:**
  - `public.is_owner()`: Checks if current user is an active store owner.
  - `public.is_active_employee()`: Checks if current user has an active employee membership.
  - `public.has_employee_permission(permission_name)`: Verifies role-based permission against `role_permissions`.
- **Policy Summary:**
  - Anonymous visitors: Can read `store_settings`, active `categories`, active `brands`, published `products`/variants/images, active `store_announcements`; can insert `enquiries` and log non-sensitive `analytics_events`.
  - Staff: Granular read/write permissions governed by `has_employee_permission()`.
  - Owners: Full access across all tables.

### Migration 3: `20261027000003_storage_setup.sql`
- **Purpose:** Provision the `product-images` Supabase Storage bucket and configure storage RLS.
- **Bucket Parameters:**
  - `id`: `product-images`
  - `public`: `true` (Images are served via public CDN URLs)
  - `file_size_limit`: 5,242,880 bytes (5 MB maximum per upload)
  - `allowed_mime_types`: `{"image/jpeg", "image/png", "image/webp", "image/avif"}`
- **Storage Policies:**
  - Public `SELECT`: Anyone can view product images.
  - Staff `INSERT` / `UPDATE` / `DELETE`: Authenticated employees with `products:write` permission can manage images.

### Migration 4: `20261027000004_seed_and_bootstrap.sql`
- **Purpose:** Seed initial business data and deploy the first-owner bootstrap procedure.
- **Data Seeded:**
  - Verified store details for **Muhammad Kairu Electronics** (41 Ahmadu Bello Way, Rochas Plaza, Phone/WhatsApp: `07038365737`, Email: `mkelectronics@gmail.com`).
  - Complete role-permission matrix.
  - Core electronics categories:
    1. Solar & Power Solutions (`solar-power-solutions`)
    2. Home & Office Audio (`home-audio`)
    3. Refrigeration & Cooling (`refrigeration-cooling`)
    4. Television & Visuals (`television-visuals`)
    5. Kitchen & Small Appliances (`kitchen-appliances`)
    6. Electrical Accessories (`electrical-accessories`)
  - Foundational electronics brands:
    - LG, Samsung, Hisense, Nexus, Felicity Solar.
  - Bootstrap function `public.bootstrap_first_owner(target_email TEXT)`.

---

## 4. Applying Migrations

### Option A: Using the Supabase CLI (Recommended for Development)

1. Ensure the Supabase CLI is installed and link your project:
   ```bash
   npx supabase link --project-ref your-project-ref
   ```
2. Push all migrations to the remote database:
   ```bash
   npx supabase db push
   ```

### Option B: Using the Supabase Dashboard SQL Editor (Direct)

1. Open the [Supabase Dashboard](https://supabase.com/dashboard).
2. Navigate to your project -> **SQL Editor**.
3. Open and run each migration file sequentially:
   - `supabase/migrations/20261027000001_initial_schema.sql`
   - `supabase/migrations/20261027000002_rls_policies.sql`
   - `supabase/migrations/20261027000003_storage_setup.sql`
   - `supabase/migrations/20261027000004_seed_and_bootstrap.sql`
4. Confirm all statements execute with status `SUCCESS`.

---

## 5. First-Owner Bootstrap Procedure

To grant the initial owner account administrative access:

### Step 1: Create the Supabase Auth Account
1. In the Supabase Dashboard, go to **Authentication > Users**.
2. Click **Add user** > **Create user**.
3. Enter:
   - **Email:** `mkelectronics@gmail.com`
   - **Password:** Provide a strong temporary password.
   - **Auto Confirm User:** Checked (Yes).
4. Click **Create user**.
5. The `handle_new_user()` trigger will automatically insert a corresponding record in `public.profiles`.

### Step 2: Elevate Account to Owner
Open the **SQL Editor** in your Supabase Dashboard and execute:

```sql
SELECT public.bootstrap_first_owner('mkelectronics@gmail.com');
```

This idempotent procedure performs the following operations atomically:
1. Verifies that the user exists in `auth.users` and `public.profiles`.
2. Updates `profiles.is_super_admin = true`.
3. Inserts or activates an `employee_memberships` record with role `owner` and status `active`.
4. Returns a confirmation JSON payload:
   ```json
   {
     "status": "success",
     "email": "mkelectronics@gmail.com",
     "profile_id": "...",
     "role": "owner"
   }
   ```

### Step 3: Verify Elevated Access
Run the following verification query:

```sql
SELECT
  p.id AS profile_id,
  u.email,
  p.full_name,
  p.is_super_admin,
  m.role,
  m.status
FROM public.profiles p
JOIN auth.users u ON u.id = p.id
LEFT JOIN public.employee_memberships m ON m.profile_id = p.id
WHERE u.email = 'mkelectronics@gmail.com';
```

Expected output:
- `is_super_admin`: `true`
- `role`: `owner`
- `status`: `active`

---

## 6. TypeScript Client Integration

The application provides three dedicated client constructors in `src/lib/supabase/`:

### 1. Browser Client (`src/lib/supabase/client.ts`)
```typescript
import { createClient } from "@/lib/supabase/client";

// Used in Client Components ("use client")
const supabase = createClient();
const { data: categories } = await supabase.from("categories").select("*");
```

### 2. Server Client (`src/lib/supabase/server.ts`)
```typescript
import { createClient } from "@/lib/supabase/server";

// Used in Server Components, Server Actions, and Route Handlers
const supabase = await createClient();
const { data: products } = await supabase
  .from("products")
  .select("*, category:categories(*), images:product_images(*)")
  .eq("is_published", true)
  .eq("is_archived", false);
```

### 3. Admin / Service Role Client (`src/lib/supabase/admin.ts`)
```typescript
import { createAdminClient } from "@/lib/supabase/admin";

// Used ONLY in privileged server-side operations (bypasses RLS)
const adminClient = createAdminClient();
```

---

## 7. Prisma Schema Synchronization

If using Prisma alongside Supabase migrations:

1. Always apply schema changes via `supabase/migrations/*.sql` first.
2. Mirror the changes in `prisma/schema.prisma`.
3. Re-generate the local Prisma Client:
   ```bash
   npm run prisma:generate
   ```
4. Never run `prisma migrate dev` against the remote Supabase database, as it will conflict with native PostgreSQL RLS policies, trigger functions, and Supabase Storage tables.

