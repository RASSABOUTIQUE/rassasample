import { createClient } from '@supabase/supabase-js';
const url = "https://pjjiwghqfonoirxtpkgd.supabase.co";
const key = "sb_publishable_cfp0bMan8m7a113w3U6uQw_p1nZco9n";
const supabase = createClient(url, key);

async function run() {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: 'admin@rassa.com',
    password: 'rassa@admin2026'
  });
  console.log("Login:", error ? error.message : "SUCCESS");
  
  // Simulate ProductService.add
  const dataPayload = {
    name: "Full Product Test",
    description: "Testing",
    price: 1500,
    stockCount: 10,
    images: ["https://example.com/test.jpg"]
  };
  
  const slug = dataPayload.name.toLowerCase().replace(/[^a-z0-9]+/g, "-") + "-" + Date.now();
  
  const { data: newProd, error: prodError } = await supabase.from("products").insert({
    name: dataPayload.name,
    slug,
    is_active: true,
  }).select().single();
  
  console.log("Product Insert:", prodError ? prodError.message : "SUCCESS");
  if (prodError) return;
  
  const { error: varError } = await supabase.from("product_variants").insert({
    product_id: newProd.id,
    sku: `SKU-${Date.now()}`,
    price: dataPayload.price,
    stock_quantity: dataPayload.stockCount,
  });
  console.log("Variant Insert:", varError ? varError.message : "SUCCESS");
  
  const imgPayload = dataPayload.images.map((url, idx) => ({
    product_id: newProd.id,
    storage_url: url,
    display_order: idx,
    is_primary: idx === 0
  }));
  const { error: imgError } = await supabase.from("product_images").insert(imgPayload);
  console.log("Image Insert:", imgError ? imgError.message : "SUCCESS");
}
run();
