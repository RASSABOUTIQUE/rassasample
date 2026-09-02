import { createClient } from '@supabase/supabase-js';

const url = "https://pjjiwghqfonoirxtpkgd.supabase.co";
const key = "sb_publishable_cfp0bMan8m7a113w3U6uQw_p1nZco9n";
const supabase = createClient(url, key);

async function checkData() {
  const { data: products, error } = await supabase.from('products').select(`
    id,
    name,
    price,
    is_hidden,
    category_id,
    product_images ( id )
  `);

  if (error) {
    console.error("Error fetching products:", error);
    return;
  }

  console.log(`PRODUCT COUNT: ${products.length}`);
  for (const p of products) {
    console.log(`- ${p.id} | ${p.name} | $${p.price} | is_hidden: ${p.is_hidden} | cat_id: ${p.category_id} | images: ${p.product_images?.length}`);
  }
}

checkData();
