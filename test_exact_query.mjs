import { createClient } from '@supabase/supabase-js';

const url = "https://pjjiwghqfonoirxtpkgd.supabase.co";
const key = "sb_publishable_cfp0bMan8m7a113w3U6uQw_p1nZco9n";
const supabase = createClient(url, key);

async function checkQuery() {
  const { data, error } = await supabase
      .from("products")
      .select(`
        *,
        categories(name),
        product_variants(price, compare_at_price, stock_quantity, low_stock_threshold, size, color_hex),
        product_images(storage_url, display_order)
      `)
      .order("created_at", { ascending: false });

  if (error) {
    console.error("Supabase get products error:", error);
    return;
  }

  console.log("Query SUCCESS. Rows:", data?.length);
}

checkQuery();
