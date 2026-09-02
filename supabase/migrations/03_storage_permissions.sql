-- =================================================================================
-- Storage Bucket Permissions for 'rassa-assets'
-- =================================================================================

-- 1. Ensure the bucket exists (in case it wasn't fully created)
INSERT INTO storage.buckets (id, name, public)
VALUES ('rassa-assets', 'rassa-assets', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- 2. Allow public access to read images
CREATE POLICY "Public Access" 
ON storage.objects FOR SELECT 
USING ( bucket_id = 'rassa-assets' );

-- 3. Allow Admin users to upload images
-- (Using the same auth check as other tables)
CREATE POLICY "Admin Insert Access" 
ON storage.objects FOR INSERT 
WITH CHECK (
    bucket_id = 'rassa-assets' 
    AND (auth.role() = 'authenticated')
);

-- 4. Allow Admin users to update images
CREATE POLICY "Admin Update Access" 
ON storage.objects FOR UPDATE 
USING (
    bucket_id = 'rassa-assets' 
    AND (auth.role() = 'authenticated')
);

-- 5. Allow Admin users to delete images
CREATE POLICY "Admin Delete Access" 
ON storage.objects FOR DELETE 
USING (
    bucket_id = 'rassa-assets' 
    AND (auth.role() = 'authenticated')
);
