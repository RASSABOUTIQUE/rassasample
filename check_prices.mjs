import { createClient } from '@supabase/supabase-js';

const url = "https://pjjiwghqfonoirxtpkgd.supabase.co";
const key = "sb_publishable_cfp0bMan8m7a113w3U6uQw_p1nZco9n";
const supabase = createClient(url, key);

function formatProduct(row) {
    const variants = row.product_variants || [];
    const images = row.product_images || [];
    
    images.sort((a, b) => a.display_order - b.display_order);
    const imageUrls = images.map((i) => i.storage_url);

    const stock = variants.reduce((acc, v) => acc + (v.stock_quantity || 0), 0);
    const price = variants.length > 0 ? variants[0].price : 0;

    return {
      id: row.id,
      isHidden: !row.is_active,
      price,
      stock,
      category: row.categories?.name || row.category_id || "",
    };
  }

async function checkQuery() {
  const { data, error } = await supabase
      .from("products")
      .select(`
        *,
        categories(name),
        product_variants(price, compare_at_price, stock_quantity, low_stock_threshold, size, color_hex),
        product_images(storage_url, display_order)
      `);
      
  const mapped = data.map(formatProduct);
  console.log(mapped);
}

checkQuery();
