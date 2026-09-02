import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://pjjiwghqfonoirxtpkgd.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_cfp0bMan8m7a113w3U6uQw_p1nZco9n';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function run() {
  const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
    email: 'admin@rassa.com',
    password: 'rassa@admin2026'
  });

  const { data: orders, error: fetchError } = await supabase
    .from("orders")
    .select("*, order_items(*), shipping_address_id(*)")
    .order("created_at", { ascending: false })
    .limit(20);

  if (fetchError) {
    console.error("Fetch Error:", fetchError);
  } else {
    orders.forEach(o => {
      console.log("Order No:", o.order_number, " | Items:", o.order_items?.length, " | Address:", o.shipping_address_id ? 'EXISTS' : 'NULL');
    });
  }
}

run();
