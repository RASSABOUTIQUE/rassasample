import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
const envFile = fs.readFileSync('.env', 'utf-8');
let supabaseUrl = '';
let supabaseKey = '';
for (const line of envFile.split('\n')) {
  if (line.startsWith('VITE_SUPABASE_URL=')) supabaseUrl = line.split('=')[1].trim().replace(/"/g, '');
  if (line.startsWith('VITE_SUPABASE_ANON_KEY=')) supabaseKey = line.split('=')[1].trim().replace(/"/g, '');
}

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase credentials in .env");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function traceData() {
  console.log("--- 1. Fetching recent order ---");
  const { data: orders, error: ordersError } = await supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(1);

  if (ordersError) {
    console.error("Error fetching orders:", ordersError);
    return;
  }

  if (!orders || orders.length === 0) {
    console.log("No orders found.");
    return;
  }

  const order = orders[0];
  console.log("LATEST ORDER ROW:", JSON.stringify(order, null, 2));

  console.log("\n--- 2. Fetching order_items ---");
  const { data: items, error: itemsError } = await supabase
    .from('order_items')
    .select('*')
    .eq('order_id', order.id);

  if (itemsError) {
    console.error("Error fetching order_items:", itemsError);
  } else {
    console.log(`FOUND ${items?.length} items for order_id ${order.id}:`);
    console.log(JSON.stringify(items, null, 2));
  }

  console.log("\n--- 3. Fetching address ---");
  if (order.shipping_address_id) {
    const { data: address, error: addressError } = await supabase
      .from('addresses')
      .select('*')
      .eq('id', order.shipping_address_id)
      .single();

    if (addressError) {
      console.error("Error fetching address:", addressError);
    } else {
      console.log(`FOUND address for shipping_address_id ${order.shipping_address_id}:`);
      console.log(JSON.stringify(address, null, 2));
    }
  } else {
    console.log("shipping_address_id is NULL on the order row!");
  }
  
  console.log("\n--- 4. Supabase Query Used in OrdersSection (getAll) ---");
  const { data: fullQuery, error: fullQueryError } = await supabase
    .from("orders")
    .select("*, order_items(*), shipping_address_id(*)")
    .eq('id', order.id)
    .single();

  if (fullQueryError) {
    console.error("Error with full query:", fullQueryError);
  } else {
    console.log("RESULT OF FULL JOIN QUERY:");
    console.log(JSON.stringify(fullQuery, null, 2));
  }
}

traceData();
