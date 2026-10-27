-- ==============================================================================
-- Muhammad Kairu Electronics — Migration 2: Row Level Security (RLS) & Policies
-- Implements least-privilege security boundaries, helper functions, and granular
-- role-based access controls across all tables.
-- ==============================================================================

-- 1. Security Helper Functions (SECURITY DEFINER with secure search_path)
CREATE OR REPLACE FUNCTION public.is_owner(lookup_uid UUID)
RETURNS BOOLEAN AS $$
BEGIN
    IF lookup_uid IS NULL THEN
        RETURN FALSE;
    END IF;
    RETURN EXISTS (
        SELECT 1 FROM public.employee_memberships
        WHERE user_id = lookup_uid
          AND role = 'owner'
          AND status = 'active'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

CREATE OR REPLACE FUNCTION public.is_active_employee(lookup_uid UUID)
RETURNS BOOLEAN AS $$
BEGIN
    IF lookup_uid IS NULL THEN
        RETURN FALSE;
    END IF;
    RETURN EXISTS (
        SELECT 1 FROM public.employee_memberships
        WHERE user_id = lookup_uid
          AND status = 'active'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

CREATE OR REPLACE FUNCTION public.has_employee_permission(lookup_uid UUID, required_permission TEXT)
RETURNS BOOLEAN AS $$
BEGIN
    IF lookup_uid IS NULL THEN
        RETURN FALSE;
    END IF;

    -- Owner role inherently possesses all permissions
    IF public.is_owner(lookup_uid) THEN
        RETURN TRUE;
    END IF;

    -- Verify specific role permission assignment
    RETURN EXISTS (
        SELECT 1
        FROM public.employee_memberships em
        JOIN public.role_permissions rp ON em.role = rp.role
        WHERE em.user_id = lookup_uid
          AND em.status = 'active'
          AND rp.permission = required_permission
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

-- 2. Enable RLS on All Tables
ALTER TABLE public.store_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.employee_memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.role_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.brands ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stock_movements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enquiry_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.store_announcements ENABLE ROW LEVEL SECURITY;

-- ------------------------------------------------------------------------------
-- 3. Policies: store_settings
-- ------------------------------------------------------------------------------
CREATE POLICY "Public can view store settings"
ON public.store_settings FOR SELECT
USING (true);

CREATE POLICY "Owner can manage store settings"
ON public.store_settings FOR ALL
USING (public.is_owner(auth.uid()))
WITH CHECK (public.is_owner(auth.uid()));

-- ------------------------------------------------------------------------------
-- 4. Policies: profiles
-- ------------------------------------------------------------------------------
CREATE POLICY "Users can view own profile"
ON public.profiles FOR SELECT
USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
ON public.profiles FOR UPDATE
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

CREATE POLICY "Employees can view colleague profiles"
ON public.profiles FOR SELECT
USING (public.is_active_employee(auth.uid()));

CREATE POLICY "Owner can manage all profiles"
ON public.profiles FOR ALL
USING (public.is_owner(auth.uid()))
WITH CHECK (public.is_owner(auth.uid()));

-- ------------------------------------------------------------------------------
-- 5. Policies: employee_memberships
-- ------------------------------------------------------------------------------
CREATE POLICY "Users can view own membership"
ON public.employee_memberships FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Employees can view team memberships"
ON public.employee_memberships FOR SELECT
USING (public.is_active_employee(auth.uid()));

CREATE POLICY "Owner can manage employee memberships"
ON public.employee_memberships FOR ALL
USING (public.is_owner(auth.uid()))
WITH CHECK (public.is_owner(auth.uid()));

-- ------------------------------------------------------------------------------
-- 6. Policies: role_permissions
-- ------------------------------------------------------------------------------
CREATE POLICY "Authenticated users can read role permissions"
ON public.role_permissions FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Owner can manage role permissions"
ON public.role_permissions FOR ALL
USING (public.is_owner(auth.uid()))
WITH CHECK (public.is_owner(auth.uid()));

-- ------------------------------------------------------------------------------
-- 7. Policies: categories
-- ------------------------------------------------------------------------------
CREATE POLICY "Public can view active categories"
ON public.categories FOR SELECT
USING (is_active = true);

CREATE POLICY "Staff with categories:manage can view all categories"
ON public.categories FOR SELECT
USING (public.has_employee_permission(auth.uid(), 'categories:manage'));

CREATE POLICY "Staff with categories:manage can mutate categories"
ON public.categories FOR INSERT
WITH CHECK (public.has_employee_permission(auth.uid(), 'categories:manage'));

CREATE POLICY "Staff with categories:manage can update categories"
ON public.categories FOR UPDATE
USING (public.has_employee_permission(auth.uid(), 'categories:manage'))
WITH CHECK (public.has_employee_permission(auth.uid(), 'categories:manage'));

CREATE POLICY "Staff with categories:manage can delete categories"
ON public.categories FOR DELETE
USING (public.has_employee_permission(auth.uid(), 'categories:manage'));

-- ------------------------------------------------------------------------------
-- 8. Policies: brands
-- ------------------------------------------------------------------------------
CREATE POLICY "Public can view active brands"
ON public.brands FOR SELECT
USING (is_active = true);

CREATE POLICY "Staff with brands:manage can view all brands"
ON public.brands FOR SELECT
USING (public.has_employee_permission(auth.uid(), 'brands:manage'));

CREATE POLICY "Staff with brands:manage can mutate brands"
ON public.brands FOR INSERT
WITH CHECK (public.has_employee_permission(auth.uid(), 'brands:manage'));

CREATE POLICY "Staff with brands:manage can update brands"
ON public.brands FOR UPDATE
USING (public.has_employee_permission(auth.uid(), 'brands:manage'))
WITH CHECK (public.has_employee_permission(auth.uid(), 'brands:manage'));

CREATE POLICY "Staff with brands:manage can delete brands"
ON public.brands FOR DELETE
USING (public.has_employee_permission(auth.uid(), 'brands:manage'));

-- ------------------------------------------------------------------------------
-- 9. Policies: products
-- ------------------------------------------------------------------------------
CREATE POLICY "Public can view published active products"
ON public.products FOR SELECT
USING (is_published = true AND is_archived = false);

CREATE POLICY "Staff with products:read can view all products"
ON public.products FOR SELECT
USING (public.has_employee_permission(auth.uid(), 'products:read'));

CREATE POLICY "Staff with products:write can insert products"
ON public.products FOR INSERT
WITH CHECK (public.has_employee_permission(auth.uid(), 'products:write'));

CREATE POLICY "Staff with products:write can update products"
ON public.products FOR UPDATE
USING (public.has_employee_permission(auth.uid(), 'products:write'))
WITH CHECK (public.has_employee_permission(auth.uid(), 'products:write'));

CREATE POLICY "Staff with products:write can delete products"
ON public.products FOR DELETE
USING (public.has_employee_permission(auth.uid(), 'products:write'));

-- ------------------------------------------------------------------------------
-- 10. Policies: product_variants
-- ------------------------------------------------------------------------------
CREATE POLICY "Public can view active variants of published products"
ON public.product_variants FOR SELECT
USING (
    is_active = true AND EXISTS (
        SELECT 1 FROM public.products p
        WHERE p.id = product_variants.product_id
          AND p.is_published = true
          AND p.is_archived = false
    )
);

CREATE POLICY "Staff with products:read can view all variants"
ON public.product_variants FOR SELECT
USING (public.has_employee_permission(auth.uid(), 'products:read'));

CREATE POLICY "Staff with products:write can manage variants"
ON public.product_variants FOR ALL
USING (public.has_employee_permission(auth.uid(), 'products:write'))
WITH CHECK (public.has_employee_permission(auth.uid(), 'products:write'));

-- ------------------------------------------------------------------------------
-- 11. Policies: product_images
-- ------------------------------------------------------------------------------
CREATE POLICY "Public can view approved images of published products"
ON public.product_images FOR SELECT
USING (
    is_approved = true AND EXISTS (
        SELECT 1 FROM public.products p
        WHERE p.id = product_images.product_id
          AND p.is_published = true
          AND p.is_archived = false
    )
);

CREATE POLICY "Staff with images:manage can view all images"
ON public.product_images FOR SELECT
USING (public.has_employee_permission(auth.uid(), 'images:manage'));

CREATE POLICY "Staff with images:manage can manage images"
ON public.product_images FOR ALL
USING (public.has_employee_permission(auth.uid(), 'images:manage'))
WITH CHECK (public.has_employee_permission(auth.uid(), 'images:manage'));

-- ------------------------------------------------------------------------------
-- 12. Policies: inventory_records (NO anonymous access)
-- ------------------------------------------------------------------------------
CREATE POLICY "Staff with inventory:read can view inventory"
ON public.inventory_records FOR SELECT
USING (public.has_employee_permission(auth.uid(), 'inventory:read'));

CREATE POLICY "Staff with inventory:adjust can manage inventory"
ON public.inventory_records FOR ALL
USING (public.has_employee_permission(auth.uid(), 'inventory:adjust'))
WITH CHECK (public.has_employee_permission(auth.uid(), 'inventory:adjust'));

-- ------------------------------------------------------------------------------
-- 13. Policies: stock_movements (NO anonymous access)
-- ------------------------------------------------------------------------------
CREATE POLICY "Staff with inventory:read can view stock history"
ON public.stock_movements FOR SELECT
USING (public.has_employee_permission(auth.uid(), 'inventory:read'));

CREATE POLICY "Staff with inventory:adjust can record stock movements"
ON public.stock_movements FOR INSERT
WITH CHECK (public.has_employee_permission(auth.uid(), 'inventory:adjust'));

-- ------------------------------------------------------------------------------
-- 14. Policies: customers (NO anonymous read)
-- ------------------------------------------------------------------------------
CREATE POLICY "Staff with enquiries:read can view customers"
ON public.customers FOR SELECT
USING (public.has_employee_permission(auth.uid(), 'enquiries:read'));

CREATE POLICY "Staff with enquiries:update can update customer records"
ON public.customers FOR UPDATE
USING (public.has_employee_permission(auth.uid(), 'enquiries:update'))
WITH CHECK (public.has_employee_permission(auth.uid(), 'enquiries:update'));

-- ------------------------------------------------------------------------------
-- 15. Policies: enquiries (Public insert only; NO anonymous read)
-- ------------------------------------------------------------------------------
CREATE POLICY "Public can submit enquiries"
ON public.enquiries FOR INSERT
WITH CHECK (true);

CREATE POLICY "Staff with enquiries:read can view enquiries"
ON public.enquiries FOR SELECT
USING (public.has_employee_permission(auth.uid(), 'enquiries:read'));

CREATE POLICY "Staff with enquiries:update can update enquiries"
ON public.enquiries FOR UPDATE
USING (public.has_employee_permission(auth.uid(), 'enquiries:update'))
WITH CHECK (public.has_employee_permission(auth.uid(), 'enquiries:update'));

CREATE POLICY "Owner can delete enquiries"
ON public.enquiries FOR DELETE
USING (public.is_owner(auth.uid()));

-- ------------------------------------------------------------------------------
-- 16. Policies: enquiry_notes (NO anonymous access)
-- ------------------------------------------------------------------------------
CREATE POLICY "Staff with enquiries:read can view enquiry notes"
ON public.enquiry_notes FOR SELECT
USING (public.has_employee_permission(auth.uid(), 'enquiries:read'));

CREATE POLICY "Staff with enquiry_notes:create can insert enquiry notes"
ON public.enquiry_notes FOR INSERT
WITH CHECK (public.has_employee_permission(auth.uid(), 'enquiry_notes:create'));

-- ------------------------------------------------------------------------------
-- 17. Policies: analytics_events (Public insert only; NO anonymous read)
-- ------------------------------------------------------------------------------
CREATE POLICY "Public can insert analytics events"
ON public.analytics_events FOR INSERT
WITH CHECK (true);

CREATE POLICY "Staff with analytics:read can view analytics events"
ON public.analytics_events FOR SELECT
USING (public.has_employee_permission(auth.uid(), 'analytics:read'));

-- ------------------------------------------------------------------------------
-- 18. Policies: audit_logs (NO anonymous access)
-- ------------------------------------------------------------------------------
CREATE POLICY "Owner can view audit logs"
ON public.audit_logs FOR SELECT
USING (public.is_owner(auth.uid()));

CREATE POLICY "Active staff can insert audit logs"
ON public.audit_logs FOR INSERT
WITH CHECK (public.is_active_employee(auth.uid()));

-- ------------------------------------------------------------------------------
-- 19. Policies: store_announcements
-- ------------------------------------------------------------------------------
CREATE POLICY "Public can view active scheduled announcements"
ON public.store_announcements FOR SELECT
USING (
    is_active = true
    AND (starts_at IS NULL OR starts_at <= now())
    AND (expires_at IS NULL OR expires_at >= now())
);

CREATE POLICY "Staff with promotions:manage can view all announcements"
ON public.store_announcements FOR SELECT
USING (public.has_employee_permission(auth.uid(), 'promotions:manage'));

CREATE POLICY "Staff with promotions:manage can manage announcements"
ON public.store_announcements FOR ALL
USING (public.has_employee_permission(auth.uid(), 'promotions:manage'))
WITH CHECK (public.has_employee_permission(auth.uid(), 'promotions:manage'));

