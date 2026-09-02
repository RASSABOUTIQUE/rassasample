import { createClient } from '@supabase/supabase-js';
const url = "https://pjjiwghqfonoirxtpkgd.supabase.co";
const key = "sb_publishable_cfp0bMan8m7a113w3U6uQw_p1nZco9n";
const supabase = createClient(url, key);

async function run() {
  console.log("--- TEST EXACT PRODUCT QUERY ---");
  const { data, error, status } = await supabase
    .from("products")
    .select(`
      *,
      categories(name),
      product_variants(price, compare_at_price, stock_quantity, low_stock_threshold, size, color_hex),
      product_images(storage_url, display_order)
    `)
    .order("created_at", { ascending: false });
    
  if (error) {
    console.log(`QUERY ERROR (Status: ${status}):`, error.message, error.details, error.hint);
  } else {
    console.log(`QUERY OK (Status: ${status}): Rows = ${data?.length}`);
    if (data?.length > 0) {
      console.log("Sample Data:", JSON.stringify(data[0], null, 2));
    }
  }
  
  console.log("--- TEST STORAGE UPLOAD ---");
  const dummyFile = new Blob(["test"], { type: "text/plain" });
  const { data: upData, error: upError } = await supabase.storage
    .from("rassa-assets")
    .upload("products/test-upload.txt", dummyFile, { upsert: false });
    
  if (upError) {
    console.log("UPLOAD ERROR:", upError.message);
    console.log("UPLOAD ERROR DETAILS:", JSON.stringify(upError));
  } else {
    console.log("UPLOAD OK:", upData);
  }
}
run();
