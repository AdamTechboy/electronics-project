-- ==============================================================================
-- Muhammad Kairu Electronics — Migration 3: Storage Configuration & Policies
-- Creates the public product-images bucket with strict upload size/type limits
-- and role-based permissions on storage.objects.
-- ==============================================================================

-- 1. Create product-images storage bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'product-images',
    'product-images',
    true,
    5242880, -- 5 MB in bytes
    ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/avif']::text[]
)
ON CONFLICT (id) DO UPDATE
SET public = true,
    file_size_limit = 5242880,
    allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/avif']::text[];

-- 2. Storage Policies for storage.objects

-- Allow public read access to images in the product-images bucket
CREATE POLICY "Public can view product images"
ON storage.objects FOR SELECT
USING (bucket_id = 'product-images');

-- Allow staff with images:manage permission to upload images
CREATE POLICY "Authorized staff can upload product images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
    bucket_id = 'product-images'
    AND public.has_employee_permission(auth.uid(), 'images:manage')
);

-- Allow staff with images:manage permission to update images
CREATE POLICY "Authorized staff can update product images"
ON storage.objects FOR UPDATE
TO authenticated
USING (
    bucket_id = 'product-images'
    AND public.has_employee_permission(auth.uid(), 'images:manage')
)
WITH CHECK (
    bucket_id = 'product-images'
    AND public.has_employee_permission(auth.uid(), 'images:manage')
);

-- Allow staff with images:manage permission to delete images
CREATE POLICY "Authorized staff can delete product images"
ON storage.objects FOR DELETE
TO authenticated
USING (
    bucket_id = 'product-images'
    AND public.has_employee_permission(auth.uid(), 'images:manage')
);

