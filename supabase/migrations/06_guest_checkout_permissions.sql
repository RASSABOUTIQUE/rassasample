-- Migration: Enable Guest Checkout
-- Description: Updates Row-Level Security (RLS) policies to allow anonymous users (guests) to insert orders, order_items, and addresses during checkout.

-- 1. Policies for orders table
CREATE POLICY "Allow anonymous users to insert orders"
ON public.orders
FOR INSERT 
TO anon, authenticated 
WITH CHECK (true);

-- 2. Policies for order_items table
CREATE POLICY "Allow anonymous users to insert order items"
ON public.order_items
FOR INSERT 
TO anon, authenticated 
WITH CHECK (true);

-- 3. Policies for addresses table
CREATE POLICY "Allow anonymous users to insert addresses"
ON public.addresses
FOR INSERT 
TO anon, authenticated 
WITH CHECK (true);
