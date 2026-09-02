import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';

const url = "https://pjjiwghqfonoirxtpkgd.supabase.co";
const key = "sb_publishable_cfp0bMan8m7a113w3U6uQw_p1nZco9n";
const supabase = createClient(url, key);

async function checkData() {
  const { data: products, error } = await supabase.from('products').select(`
    id,
    name,
    is_active,
    category_id,
    product_variants ( price, stock_quantity )
  `);

  if (error) {
    console.error("Error fetching products:", error);
    return;
  }

  console.log(`PRODUCT COUNT: ${products.length}`);
  for (const p of products) {
    console.log(`- ${p.id} | ${p.name} | is_active: ${p.is_active} | cat_id: ${p.category_id} | variants: ${p.product_variants?.length}`);
  }
}

checkData();
