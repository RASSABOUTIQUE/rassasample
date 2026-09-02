-- Add image_url to order_items to support the UI snapshot requirement
ALTER TABLE order_items ADD COLUMN IF NOT EXISTS image_url TEXT;
