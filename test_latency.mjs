import { createClient } from '@supabase/supabase-js';
const url = "https://pjjiwghqfonoirxtpkgd.supabase.co";
const key = "sb_publishable_cfp0bMan8m7a113w3U6uQw_p1nZco9n";
const supabase = createClient(url, key);

async function run() {
  const start = Date.now();
  await Promise.all([
    supabase.from("cms_settings").select("*").eq("id", 1).single(),
    supabase.from("categories").select("*").order("order_index", { ascending: true }),
    supabase.from("products").select("id").limit(1)
  ]);
  const end = Date.now();
  console.log(`Supabase fetch took ${end - start}ms`);
}
run();
