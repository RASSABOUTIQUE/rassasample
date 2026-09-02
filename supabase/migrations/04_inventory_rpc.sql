-- RPC to safely process inventory deduction for multiple items in a single transaction
-- Prevents race conditions and partial stock updates

CREATE OR REPLACE FUNCTION process_order_inventory(items JSONB)
RETURNS BOOLEAN AS $$
DECLARE
  item JSONB;
  current_stock INTEGER;
BEGIN
  -- 1. Loop through each item to check stock and lock rows
  FOR item IN SELECT * FROM jsonb_array_elements(items)
  LOOP
    SELECT stock_quantity INTO current_stock
    FROM product_variants
    WHERE id = (item->>'variant_id')::UUID
    FOR UPDATE;

    IF current_stock < (item->>'quantity')::INTEGER THEN
      -- If any item fails, raise an exception to rollback the transaction
      RAISE EXCEPTION 'Insufficient stock for variant %', item->>'variant_id';
    END IF;
  END LOOP;

  -- 2. Loop again to deduct stock
  FOR item IN SELECT * FROM jsonb_array_elements(items)
  LOOP
    UPDATE product_variants
    SET stock_quantity = stock_quantity - (item->>'quantity')::INTEGER
    WHERE id = (item->>'variant_id')::UUID;
  END LOOP;

  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
