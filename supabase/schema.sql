-- =================================================================================
-- RASSA BOUTIQUE - SUPABASE POSTGRESQL SCHEMA
-- =================================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm"; -- For typo-tolerant searches

-- =================================================================================
-- 2. CUSTOM TYPES & ENUMS
-- =================================================================================

CREATE TYPE user_role AS ENUM ('CUSTOMER', 'STAFF', 'MANAGER', 'ADMIN');
CREATE TYPE order_status AS ENUM ('PENDING_PAYMENT', 'PAID', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'RETURN_REQUESTED', 'REFUNDED');
CREATE TYPE return_status AS ENUM ('REQUESTED', 'APPROVED', 'REJECTED', 'REFUNDED');
CREATE TYPE review_status AS ENUM ('PENDING_MODERATION', 'APPROVED', 'REJECTED');

-- =================================================================================
-- 3. CORE ENTITIES
-- =================================================================================

-- Profiles (Linked to auth.users)
CREATE TABLE profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    first_name TEXT,
    last_name TEXT,
    phone TEXT,
    role user_role DEFAULT 'CUSTOMER'::user_role NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Addresses
CREATE TABLE addresses (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    type TEXT CHECK (type IN ('BILLING', 'SHIPPING')) NOT NULL,
    full_name TEXT NOT NULL,
    address_line1 TEXT NOT NULL,
    address_line2 TEXT,
    city TEXT NOT NULL,
    state TEXT NOT NULL,
    postal_code TEXT NOT NULL,
    country TEXT DEFAULT 'India' NOT NULL,
    phone TEXT,
    is_default BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =================================================================================
-- 4. PRODUCT CATALOG
-- =================================================================================

-- Categories
CREATE TABLE categories (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    slug TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    parent_category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    description TEXT,
    image_url TEXT,
    is_active BOOLEAN DEFAULT true,
    seo_title TEXT,
    seo_description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Products
CREATE TABLE products (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    slug TEXT UNIQUE NOT NULL,
    category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    short_description TEXT,
    description TEXT,
    fabric_details TEXT,
    care_instructions TEXT,
    delivery_days TEXT,
    is_active BOOLEAN DEFAULT true,
    is_new_arrival BOOLEAN DEFAULT false,
    is_bestseller BOOLEAN DEFAULT false,
    is_featured BOOLEAN DEFAULT false,
    is_custom BOOLEAN DEFAULT false,
    seo_title TEXT,
    seo_description TEXT,
    keywords TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Product Variants (SKU Level)
CREATE TABLE product_variants (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    product_id UUID REFERENCES products(id) ON DELETE CASCADE NOT NULL,
    sku TEXT UNIQUE NOT NULL,
    size TEXT,
    color_name TEXT,
    color_hex TEXT,
    price NUMERIC(10,2) NOT NULL,
    compare_at_price NUMERIC(10,2),
    stock_quantity INTEGER DEFAULT 0 NOT NULL,
    low_stock_threshold INTEGER DEFAULT 3,
    weight_grams NUMERIC(8,2),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Product Images
CREATE TABLE product_images (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    product_id UUID REFERENCES products(id) ON DELETE CASCADE NOT NULL,
    storage_url TEXT NOT NULL,
    display_order INTEGER DEFAULT 0 NOT NULL,
    is_primary BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Product Reviews
CREATE TABLE product_reviews (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    product_id UUID REFERENCES products(id) ON DELETE CASCADE NOT NULL,
    profile_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5) NOT NULL,
    review_text TEXT,
    status review_status DEFAULT 'PENDING_MODERATION'::review_status NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =================================================================================
-- 5. WISHLIST & CART (Guest and Auth Support)
-- =================================================================================

-- Wishlist
CREATE TABLE wishlist_items (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    session_id TEXT, -- For guest wishlists
    product_id UUID REFERENCES products(id) ON DELETE CASCADE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT wishlist_user_or_session CHECK (profile_id IS NOT NULL OR session_id IS NOT NULL),
    UNIQUE (profile_id, product_id),
    UNIQUE (session_id, product_id)
);

-- Carts
CREATE TABLE carts (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    session_id TEXT UNIQUE, -- For guest carts
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT cart_user_or_session CHECK (profile_id IS NOT NULL OR session_id IS NOT NULL)
);

CREATE TABLE cart_items (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    cart_id UUID REFERENCES carts(id) ON DELETE CASCADE NOT NULL,
    variant_id UUID REFERENCES product_variants(id) ON DELETE CASCADE NOT NULL,
    quantity INTEGER DEFAULT 1 NOT NULL CHECK (quantity > 0),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(cart_id, variant_id)
);

-- =================================================================================
-- 6. ORDERS & RETURNS
-- =================================================================================

-- Coupons
CREATE TABLE coupons (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    code TEXT UNIQUE NOT NULL,
    discount_type TEXT CHECK (discount_type IN ('PERCENTAGE', 'FIXED_AMOUNT')) NOT NULL,
    discount_value NUMERIC(10,2) NOT NULL,
    min_order_amount NUMERIC(10,2) DEFAULT 0,
    valid_from TIMESTAMPTZ,
    valid_until TIMESTAMPTZ,
    usage_limit INTEGER,
    usage_count INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Orders
CREATE TABLE orders (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    order_number TEXT UNIQUE NOT NULL,
    profile_id UUID REFERENCES profiles(id) ON DELETE SET NULL, -- Nullable for Guest
    guest_email TEXT,
    guest_phone TEXT,
    status order_status DEFAULT 'PENDING_PAYMENT'::order_status NOT NULL,
    
    -- Pricing
    subtotal NUMERIC(10,2) NOT NULL,
    tax NUMERIC(10,2) DEFAULT 0,
    shipping_fee NUMERIC(10,2) DEFAULT 0,
    discount_amount NUMERIC(10,2) DEFAULT 0,
    total NUMERIC(10,2) NOT NULL,
    
    -- Links
    coupon_id UUID REFERENCES coupons(id) ON DELETE SET NULL,
    billing_address_id UUID REFERENCES addresses(id) ON DELETE SET NULL,
    shipping_address_id UUID REFERENCES addresses(id) ON DELETE SET NULL,
    
    -- Razorpay
    razorpay_order_id TEXT UNIQUE,
    razorpay_payment_id TEXT UNIQUE,
    
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Order Items
CREATE TABLE order_items (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE NOT NULL,
    variant_id UUID REFERENCES product_variants(id) ON DELETE SET NULL,
    
    -- Snapshots at time of order
    product_name TEXT NOT NULL,
    sku TEXT NOT NULL,
    size TEXT,
    color TEXT,
    price_at_purchase NUMERIC(10,2) NOT NULL,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Return Requests
CREATE TABLE return_requests (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE NOT NULL,
    profile_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    reason TEXT NOT NULL,
    customer_notes TEXT,
    admin_notes TEXT,
    status return_status DEFAULT 'REQUESTED'::return_status NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =================================================================================
-- 7. CMS, LOGS & NOTIFICATIONS
-- =================================================================================

-- CMS Settings (Singleton pattern using id=1)
CREATE TABLE cms_settings (
    id INTEGER PRIMARY KEY CHECK (id = 1),
    homepage_hero JSONB,
    store_contact JSONB,
    social_links JSONB,
    footer_text TEXT,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Custom Stitching Requests
CREATE TABLE custom_stitching_requests (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    profile_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    measurements JSONB,
    reference_images_urls JSONB,
    status TEXT DEFAULT 'PENDING' NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Audit Logs for Admin Actions
CREATE TABLE audit_logs (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    admin_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    action TEXT NOT NULL,
    table_name TEXT NOT NULL,
    record_id UUID,
    old_data JSONB,
    new_data JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Notification Outbox (for Edge Functions to process)
CREATE TABLE outbox_notifications (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    type TEXT NOT NULL, -- e.g., 'ORDER_CONFIRMATION', 'LOW_STOCK'
    payload JSONB NOT NULL,
    status TEXT DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'SENT', 'FAILED')),
    error_message TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    processed_at TIMESTAMPTZ
);

-- =================================================================================
-- 8. INDEXES FOR PERFORMANCE
-- =================================================================================

CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_is_active ON products(is_active);
CREATE INDEX idx_variants_product ON product_variants(product_id);
CREATE INDEX idx_orders_profile ON orders(profile_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_order_items_order ON order_items(order_id);

-- Full text search indexes
CREATE INDEX idx_products_name_trgm ON products USING gin(name gin_trgm_ops);
CREATE INDEX idx_products_desc_trgm ON products USING gin(description gin_trgm_ops);

-- =================================================================================
-- 9. TRIGGERS (UPDATED_AT & INVENTORY)
-- =================================================================================

-- Trigger Function for updated_at
CREATE OR REPLACE FUNCTION trigger_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply timestamp triggers
CREATE TRIGGER set_timestamp_profiles BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE PROCEDURE trigger_set_timestamp();
CREATE TRIGGER set_timestamp_products BEFORE UPDATE ON products FOR EACH ROW EXECUTE PROCEDURE trigger_set_timestamp();
CREATE TRIGGER set_timestamp_variants BEFORE UPDATE ON product_variants FOR EACH ROW EXECUTE PROCEDURE trigger_set_timestamp();
CREATE TRIGGER set_timestamp_orders BEFORE UPDATE ON orders FOR EACH ROW EXECUTE PROCEDURE trigger_set_timestamp();
CREATE TRIGGER set_timestamp_cms BEFORE UPDATE ON cms_settings FOR EACH ROW EXECUTE PROCEDURE trigger_set_timestamp();

-- Create Auth Profile automatically on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, first_name, last_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'first_name',
    NEW.raw_user_meta_data->>'last_name',
    'CUSTOMER'::user_role
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- =================================================================================
-- 10. ROW LEVEL SECURITY (RLS) POLICIES
-- =================================================================================

-- Enable RLS on all relevant tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE wishlist_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE carts ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE cms_settings ENABLE ROW LEVEL SECURITY;

-- Helper Function for Admin Check
CREATE OR REPLACE FUNCTION public.is_admin() RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('ADMIN', 'MANAGER')
  );
$$ LANGUAGE sql SECURITY DEFINER;

-- Profiles: Users can read/update their own profile. Admins can read all.
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id OR public.is_admin());
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id OR public.is_admin());

-- Products & Categories: Anyone can read active products. Admins can do full CRUD.
CREATE POLICY "Public can view active categories" ON categories FOR SELECT USING (is_active = true OR public.is_admin());
CREATE POLICY "Admins full access categories" ON categories USING (public.is_admin());

CREATE POLICY "Public can view active products" ON products FOR SELECT USING (is_active = true OR public.is_admin());
CREATE POLICY "Admins full access products" ON products USING (public.is_admin());

CREATE POLICY "Public can view variants" ON product_variants FOR SELECT USING (
    EXISTS (SELECT 1 FROM products WHERE products.id = product_variants.product_id AND (products.is_active = true OR public.is_admin()))
);
CREATE POLICY "Admins full access variants" ON product_variants USING (public.is_admin());

CREATE POLICY "Public can view images" ON product_images FOR SELECT USING (true);
CREATE POLICY "Admins full access images" ON product_images USING (public.is_admin());

-- CMS: Public read, Admin write
CREATE POLICY "Public can view CMS" ON cms_settings FOR SELECT USING (true);
CREATE POLICY "Admins can update CMS" ON cms_settings FOR UPDATE USING (public.is_admin());

-- Orders: Users can view their own orders. Admins can view all.
CREATE POLICY "Users can view own orders" ON orders FOR SELECT USING (auth.uid() = profile_id OR public.is_admin());
CREATE POLICY "Admins can update orders" ON orders FOR UPDATE USING (public.is_admin());
-- Insert is usually handled securely by Edge Functions for Razorpay, but for now we'll allow users to insert their own orders if needed.
CREATE POLICY "Users can insert own orders" ON orders FOR INSERT WITH CHECK (auth.uid() = profile_id);

CREATE POLICY "Users can view own order items" ON order_items FOR SELECT USING (
    EXISTS (SELECT 1 FROM orders WHERE orders.id = order_items.order_id AND (orders.profile_id = auth.uid() OR public.is_admin()))
);

-- Carts & Wishlist: Access via auth.uid() or session_id
-- (Policies can be expanded based on exact session_id tracking implementation)
CREATE POLICY "Users can manage their carts" ON carts USING (
    profile_id = auth.uid() OR (session_id IS NOT NULL AND auth.uid() IS NULL)
);

CREATE POLICY "Users can manage their cart items" ON cart_items USING (
    EXISTS (SELECT 1 FROM carts WHERE carts.id = cart_items.cart_id AND (carts.profile_id = auth.uid() OR (carts.session_id IS NOT NULL AND auth.uid() IS NULL)))
);
