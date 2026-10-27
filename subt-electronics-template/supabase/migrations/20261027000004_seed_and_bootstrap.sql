-- ==============================================================================
-- Muhammad Kairu Electronics — Migration 4: Seed Data & Initial Owner Bootstrap
-- Populates initial verified store settings, role permissions, default categories,
-- and establishes a secure, fail-safe first-owner bootstrap procedure.
-- ==============================================================================

-- 1. Initial Store Configuration (Muhammad Kairu Electronics)
INSERT INTO public.store_settings (
    id,
    business_name,
    tagline,
    address,
    phone,
    whatsapp,
    email,
    primary_color,
    secondary_color,
    background_color,
    accent_color,
    font_family,
    opening_hours,
    currency,
    contact_links,
    features,
    seo_title,
    seo_description
)
VALUES (
    '00000000-0000-0000-0000-000000000001'::uuid,
    'Muhammad Kairu Electronics',
    'Quality electronics, mobile devices, and home appliances.',
    '41 Ahmadu Bello Way, Shop 31A, Rochas Plaza, opposite Zenith Bank',
    '07038365737',
    '07038365737',
    'mkelectronics@gmail.com',
    '#1F2A44', -- Deep Navy
    '#F5A623', -- Solar Amber
    '#F7F5F0', -- Light Background
    '#2ECC71', -- Energy Green
    'Arial, Helvetica, sans-serif',
    'Monday – Saturday: 8:30 AM – 6:30 PM',
    'NGN',
    '{"whatsapp": true, "phone": true, "email": true}'::jsonb,
    '{"catalogue": true, "enquiries": true, "inventory_management": true, "online_checkout": false, "customer_accounts": false}'::jsonb,
    'Muhammad Kairu Electronics | Quality Electronics in Nigeria',
    'Explore mobile phones, home appliances, audio equipment, and solar solutions at Muhammad Kairu Electronics.'
)
ON CONFLICT (id) DO UPDATE
SET business_name = EXCLUDED.business_name,
    address = EXCLUDED.address,
    phone = EXCLUDED.phone,
    whatsapp = EXCLUDED.whatsapp,
    email = EXCLUDED.email,
    primary_color = EXCLUDED.primary_color,
    secondary_color = EXCLUDED.secondary_color,
    background_color = EXCLUDED.background_color,
    features = EXCLUDED.features;

-- 2. Role Permissions Matrix
INSERT INTO public.role_permissions (role, permission, description)
VALUES
    -- Owner / Super Admin (Inherently possesses all permissions via is_owner())
    ('owner', 'system:all', 'Complete administrative authority over all store resources and configurations'),

    -- Product Manager
    ('product_manager', 'products:read', 'View all products including unpublished and archived'),
    ('product_manager', 'products:write', 'Create, update, and manage products and variants'),
    ('product_manager', 'images:manage', 'Upload, reorder, and remove product images'),
    ('product_manager', 'categories:manage', 'Create, update, and organize catalogue categories'),
    ('product_manager', 'brands:manage', 'Create, update, and organize electronics brands'),

    -- Inventory Manager
    ('inventory_manager', 'products:read', 'View products to check stock and specs'),
    ('inventory_manager', 'inventory:read', 'View current stock levels and inventory records'),
    ('inventory_manager', 'inventory:adjust', 'Perform stock adjustments and record verified movements'),

    -- Customer Support
    ('customer_support', 'products:read', 'View product details to answer customer enquiries'),
    ('customer_support', 'enquiries:read', 'View customer enquiries and submission history'),
    ('customer_support', 'enquiries:update', 'Update enquiry statuses and reassign staff'),
    ('customer_support', 'enquiry_notes:create', 'Add internal notes to enquiries'),

    -- Marketing Manager
    ('marketing_manager', 'products:read', 'View catalogue for promotional planning'),
    ('marketing_manager', 'promotions:manage', 'Manage store announcements, badges, and banners'),
    ('marketing_manager', 'analytics:read', 'View visitor, search, and enquiry analytics reports'),

    -- Viewer / Analyst
    ('viewer', 'products:read', 'Read-only access to product information'),
    ('viewer', 'inventory:read', 'Read-only access to stock indicators'),
    ('viewer', 'analytics:read', 'Read-only access to analytics dashboards')
ON CONFLICT (role, permission) DO NOTHING;

-- 3. Initial Product Categories (Standard Electronics Categories)
INSERT INTO public.categories (id, name, slug, description, sort_order, is_active)
VALUES
    ('10000000-0000-0000-0000-000000000001'::uuid, 'Phones & Tablets', 'phones-tablets', 'Smartphones, feature phones, tablets, and mobile devices.', 1, true),
    ('10000000-0000-0000-0000-000000000002'::uuid, 'Audio & Sound', 'audio-sound', 'Headphones, Bluetooth speakers, earphones, and sound systems.', 2, true),
    ('10000000-0000-0000-0000-000000000003'::uuid, 'Televisions & Video', 'televisions-video', 'Smart TVs, digital monitors, and home video electronics.', 3, true),
    ('10000000-0000-0000-0000-000000000004'::uuid, 'Computers & Laptops', 'computers-laptops', 'Laptops, desktop systems, storage, and computing peripherals.', 4, true),
    ('10000000-0000-0000-0000-000000000005'::uuid, 'Power, Inverters & Solar', 'power-inverters-solar', 'Power banks, backup generators, inverters, and solar equipment.', 5, true),
    ('10000000-0000-0000-0000-000000000006'::uuid, 'Accessories & Gadgets', 'accessories-gadgets', 'Chargers, cables, mounts, protective cases, and gadgets.', 6, true)
ON CONFLICT (slug) DO UPDATE
SET name = EXCLUDED.name,
    description = EXCLUDED.description,
    sort_order = EXCLUDED.sort_order;

-- 4. Initial Sample Brands
INSERT INTO public.brands (id, name, slug, is_active)
VALUES
    ('20000000-0000-0000-0000-000000000001'::uuid, 'Samsung', 'samsung', true),
    ('20000000-0000-0000-0000-000000000002'::uuid, 'Apple', 'apple', true),
    ('20000000-0000-0000-0000-000000000003'::uuid, 'Tecno', 'tecno', true),
    ('20000000-0000-0000-0000-000000000004'::uuid, 'Infinix', 'infinix', true),
    ('20000000-0000-0000-0000-000000000005'::uuid, 'Oraimo', 'oraimo', true)
ON CONFLICT (slug) DO NOTHING;

-- 5. Safe First-Owner Bootstrap Procedure
-- Execute this procedure in the Supabase SQL editor or CLI after the owner creates
-- their Supabase Auth account.
CREATE OR REPLACE FUNCTION public.bootstrap_first_owner(target_email TEXT)
RETURNS JSONB AS $$
DECLARE
    target_user_id UUID;
    existing_owner_count INT;
    result JSONB;
BEGIN
    -- 1. Find user in auth.users
    SELECT id INTO target_user_id
    FROM auth.users
    WHERE lower(email) = lower(trim(target_email));

    IF target_user_id IS NULL THEN
        RAISE EXCEPTION 'User with email % does not exist in Supabase Auth. Please register the owner account first.', target_email;
    END IF;

    -- 2. Verify no active owner already exists (prevent hijacking)
    SELECT COUNT(*) INTO existing_owner_count
    FROM public.employee_memberships
    WHERE role = 'owner' AND status = 'active' AND user_id <> target_user_id;

    IF existing_owner_count > 0 THEN
        RAISE EXCEPTION 'An active Owner account already exists. New owners must be designated by the current owner.';
    END IF;

    -- 3. Ensure profile exists
    INSERT INTO public.profiles (id, full_name, email)
    VALUES (target_user_id, 'Store Owner', lower(trim(target_email)))
    ON CONFLICT (id) DO NOTHING;

    -- 4. Assign Owner membership
    INSERT INTO public.employee_memberships (user_id, role, status)
    VALUES (target_user_id, 'owner', 'active')
    ON CONFLICT (user_id) DO UPDATE
    SET role = 'owner',
        status = 'active',
        updated_at = now();

    -- 5. Record Audit Log
    INSERT INTO public.audit_logs (actor_id, action, target_entity, target_id, details)
    VALUES (
        target_user_id,
        'OWNER_BOOTSTRAPPED',
        'employee_memberships',
        target_user_id::text,
        jsonb_build_object('email', lower(trim(target_email)), 'timestamp', now())
    );

    result := jsonb_build_object(
        'success', true,
        'user_id', target_user_id,
        'email', lower(trim(target_email)),
        'role', 'owner',
        'status', 'active'
    );

    RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, auth, pg_temp;

-- Revoke public execution of bootstrap function (callable only by service_role / postgres)
REVOKE EXECUTE ON FUNCTION public.bootstrap_first_owner(TEXT) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.bootstrap_first_owner(TEXT) FROM anon;
REVOKE EXECUTE ON FUNCTION public.bootstrap_first_owner(TEXT) FROM authenticated;
GRANT EXECUTE ON FUNCTION public.bootstrap_first_owner(TEXT) TO service_role;
GRANT EXECUTE ON FUNCTION public.bootstrap_first_owner(TEXT) TO postgres;

