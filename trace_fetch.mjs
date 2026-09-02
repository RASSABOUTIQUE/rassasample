import { createClient } from '@supabase/supabase-js';
const url = "https://pjjiwghqfonoirxtpkgd.supabase.co";
const key = "sb_publishable_cfp0bMan8m7a113w3U6uQw_p1nZco9n";
const supabase = createClient(url, key);

async function run() {
  const { data, error } = await supabase
    .from("products")
    .select(`
      *,
      categories(name),
      product_variants(price, compare_at_price, stock_quantity, low_stock_threshold, size, color_hex),
      product_images(storage_url, display_order)
    `)
    .order("created_at", { ascending: false });
    
  console.log("Error:", error);
  console.log("Returned rows:", data.length);
  
  if (data.length > 0) {
    const p = data[0]; // The newest product (which I just inserted)
    console.log("Newest Product:", JSON.stringify(p, null, 2));
    
    // Now let's trace formatProduct
    const variants = p.product_variants || [];
    const images = p.product_images || [];
    images.sort((a, b) => a.display_order - b.display_order);
    const imageUrls = images.map(i => i.storage_url);
    const colors = Array.from(new Set(variants.map(v => v.color_hex).filter(Boolean)));
    const sizes = Array.from(new Set(variants.map(v => v.size).filter(Boolean)));
    const stock = variants.reduce((acc, v) => acc + (v.stock_quantity || 0), 0);
    const price = variants.length > 0 ? variants[0].price : 0;
    
    console.log("Mapped ID:", p.id);
    console.log("Mapped Price:", price);
    console.log("Mapped inStock:", stock > 0);
    console.log("Mapped isHidden:", !p.is_active);
    console.log("Mapped Images:", imageUrls.length);
  }
}
run();
