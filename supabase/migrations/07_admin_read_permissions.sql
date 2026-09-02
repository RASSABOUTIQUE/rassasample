-- Migration: Enable Admin Read Permissions
-- Description: Updates Row-Level Security (RLS) policies to allow SELECT operations for orders, order_items, and addresses.
-- This is necessary for the admin panel to fetch complete order details (including joined tables) when using the anon key.

-- 1. Policies for orders table (SELECT)
CREATE POLICY "Allow anon to select orders"
ON public.orders
FOR SELECT 
TO anon, authenticated 
USING (true);

-- 2. Policies for order_items table (SELECT)
CREATE POLICY "Allow anon to select order items"
ON public.order_items
FOR SELECT 
TO anon, authenticated 
USING (true);

-- 3. Policies for addresses table (SELECT)
CREATE POLICY "Allow anon to select addresses"
ON public.addresses
FOR SELECT 
TO anon, authenticated 
USING (true);
