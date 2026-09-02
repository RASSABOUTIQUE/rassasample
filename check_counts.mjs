import { createClient } from '@supabase/supabase-js';
const url = "https://pjjiwghqfonoirxtpkgd.supabase.co";
const key = "sb_publishable_cfp0bMan8m7a113w3U6uQw_p1nZco9n";
const supabase = createClient(url, key);

async function run() {
  const tables = ['products', 'product_images', 'product_variants', 'categories'];
  for (const t of tables) {
    const { data, count, error } = await supabase.from(t).select('*', { count: 'exact', head: true });
    console.log(`Table ${t}: ${count} rows`);
  }
}
run();
