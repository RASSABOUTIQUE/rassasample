-- Migration for Phase 4B: Add missing CMS and Category columns

ALTER TABLE cms_settings ADD COLUMN IF NOT EXISTS announcement JSONB;
ALTER TABLE cms_settings ADD COLUMN IF NOT EXISTS homepage JSONB;
ALTER TABLE cms_settings ADD COLUMN IF NOT EXISTS store JSONB;
ALTER TABLE cms_settings ADD COLUMN IF NOT EXISTS pages JSONB;
ALTER TABLE cms_settings ADD COLUMN IF NOT EXISTS faq JSONB;
ALTER TABLE cms_settings ADD COLUMN IF NOT EXISTS reviews JSONB;

-- Rename some columns or just use the new ones
ALTER TABLE categories ADD COLUMN IF NOT EXISTS featured BOOLEAN DEFAULT false;
ALTER TABLE categories ADD COLUMN IF NOT EXISTS order_index INTEGER DEFAULT 0;

-- Insert initial empty CMS row if it doesn't exist
INSERT INTO cms_settings (id, homepage_hero, announcement, homepage, store, pages, faq, reviews)
VALUES (1, '{}', '{}', '{}', '{}', '{}', '[]', '[]')
ON CONFLICT (id) DO NOTHING;
