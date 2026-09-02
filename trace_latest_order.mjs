import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://pjjiwghqfonoirxtpkgd.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_cfp0bMan8m7a113w3U6uQw_p1nZco9n';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
const ORDER_NO = 'RB68245102E30';

async function run() {
  console.log("==================================================");
  console.log("STEP 1: Show the COMPLETE row from the orders table.");
  const { data: order, error: orderError } = await supabase
    .from('orders')
    .select('*')
    .eq('order_number', ORDER_NO)
    .single();
  
  if (orderError) {
    console.error("Failed to fetch order:", orderError);
  } else {
    console.log(JSON.stringify(order, null, 2));
  }

  if (!order) return;

  console.log("\n==================================================");
  console.log("STEP 2: Show every row from order_items");
  const { data: items, error: itemsError } = await supabase
    .from('order_items')
    .select('*')
    .eq('order_id', order.id);
  
  if (itemsError) {
    console.error("Failed to fetch items:", itemsError);
  } else {
    console.log(JSON.stringify(items, null, 2));
  }

  console.log("\n==================================================");
  console.log("STEP 3: Show the linked address row.");
  if (order.shipping_address_id) {
    const { data: address, error: addressError } = await supabase
      .from('addresses')
      .select('*')
      .eq('id', order.shipping_address_id)
      .single();
    
    if (addressError) {
      console.error("Failed to fetch address:", addressError);
    } else {
      console.log(JSON.stringify(address, null, 2));
    }
  } else {
    console.log("shipping_address_id is NULL");
  }

  console.log("\n==================================================");
  console.log("STEP 4: EXACT JSON returned by the Supabase query");
  const { data: fullQuery, error: fullError } = await supabase
    .from("orders")
    .select("*, order_items(*), shipping_address_id(*)")
    .eq('order_number', ORDER_NO)
    .single();

  if (fullError) {
    console.error("Failed full query:", fullError);
  } else {
    console.log(JSON.stringify(fullQuery, null, 2));
  }
}

run();
