import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'https://pjjiwghqfonoirxtpkgd.supabase.co';
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_cfp0bMan8m7a113w3U6uQw_p1nZco9n';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function runTests() {
  console.log("Starting Database Verification...");
  let errors = 0;

  // 1. Fetch a product variant to test with
  const { data: variants, error: varErr } = await supabase.from('product_variants').select('id, stock_quantity, price').limit(1);
  if (varErr || !variants || variants.length === 0) {
    console.error("Failed to fetch product variant for testing:", varErr);
    process.exit(1);
  }
  const variant = variants[0];
  const initialStock = variant.stock_quantity;
  console.log(`Found variant ${variant.id} with stock ${initialStock}`);

  // 2. Place a valid order
  const orderNo = 'TEST-' + Date.now();
  console.log("Placing order:", orderNo);
  
  const { data: order, error: orderErr } = await supabase.from('orders').insert({
    order_no: orderNo,
    customer_name: 'Test User',
    customer_phone: '+919999999999',
    customer_email: 'test@example.com',
    subtotal: variant.price,
    total: variant.price,
    payment_method: 'cod',
    shipping_method: 'standard',
    address: '123 Test St',
    city: 'Test City',
    state: 'Test State',
    pincode: '123456',
    status: 'placed'
  }).select().single();

  if (orderErr) {
    console.error("Failed to create order:", orderErr);
    errors++;
  } else {
    console.log("✓ Order created successfully:", order.id);
  }

  // 3. Add order items
  const { error: itemsErr } = await supabase.from('order_items').insert({
    order_id: order.id,
    variant_id: variant.id,
    quantity: 1,
    price_at_time: variant.price
  });

  if (itemsErr) {
    console.error("Failed to add order items:", itemsErr);
    errors++;
  } else {
    console.log("✓ Order items created successfully");
  }

  // 4. Trigger inventory reduction RPC
  const { data: rpcData, error: rpcErr } = await supabase.rpc('process_order_inventory', {
    p_order_id: order.id
  });

  if (rpcErr) {
    console.error("Inventory deduction failed:", rpcErr);
    errors++;
  } else {
    console.log("✓ Inventory deducted successfully");
    
    // Verify stock was actually reduced by 1
    const { data: newVar } = await supabase.from('product_variants').select('stock_quantity').eq('id', variant.id).single();
    if (newVar.stock_quantity !== initialStock - 1) {
      console.error(`Stock deduction mismatch! Expected ${initialStock - 1}, got ${newVar.stock_quantity}`);
      errors++;
    } else {
       console.log(`✓ Stock verified: ${initialStock} -> ${newVar.stock_quantity}`);
    }
  }

  // 5. Test overselling prevention
  console.log("Testing overselling prevention...");
  const { data: newVar } = await supabase.from('product_variants').select('stock_quantity').eq('id', variant.id).single();
  const currentStock = newVar.stock_quantity;
  
  const overOrderNo = 'TEST-OVER-' + Date.now();
  const { data: overOrder } = await supabase.from('orders').insert({
    order_no: overOrderNo,
    customer_name: 'Test Over User',
    customer_phone: '+919999999999',
    total: variant.price * (currentStock + 5),
    payment_method: 'cod',
    shipping_method: 'standard',
    address: '123 Test',
    city: 'Test',
    state: 'Test',
    pincode: '123456',
    status: 'placed'
  }).select().single();

  await supabase.from('order_items').insert({
    order_id: overOrder.id,
    variant_id: variant.id,
    quantity: currentStock + 5,
    price_at_time: variant.price
  });

  const { error: overRpcErr } = await supabase.rpc('process_order_inventory', {
    p_order_id: overOrder.id
  });

  if (overRpcErr) {
    console.log("✓ Overselling correctly prevented by RPC:", overRpcErr.message);
  } else {
    console.error("ERROR: Overselling was allowed! RPC succeeded when it should have failed.");
    errors++;
  }

  // Cleanup testing data
  await supabase.from('orders').delete().in('order_no', [orderNo, overOrderNo]);
  
  if (errors > 0) {
    console.error(`\nDatabase verification failed with ${errors} errors.`);
    process.exit(1);
  } else {
    console.log("\nDatabase verification completed successfully.");
    
    // Fetch Final Report data
    const { count: orderCount } = await supabase.from('orders').select('*', { count: 'exact', head: true });
    const { count: itemCount } = await supabase.from('order_items').select('*', { count: 'exact', head: true });
    const { data: stockSum } = await supabase.from('product_variants').select('stock_quantity');
    const remainingStock = stockSum.reduce((acc, v) => acc + v.stock_quantity, 0);
    const { data: latestOrder } = await supabase.from('orders').select('order_no, status').order('created_at', { ascending: false }).limit(1).single();
    
    console.log("\n=============================");
    console.log("FINAL REPORT");
    console.log("Total Orders:", orderCount || 0);
    console.log("Total Order Items:", itemCount || 0);
    console.log("Remaining Inventory:", remainingStock || 0);
    console.log("Latest Order ID:", latestOrder?.order_no || 'None');
    console.log("Latest Order Status:", latestOrder?.status || 'None');
    console.log("=============================");
  }
}

runTests();
