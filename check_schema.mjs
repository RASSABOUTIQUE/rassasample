import { createClient } from '@supabase/supabase-js';

const url = "https://pjjiwghqfonoirxtpkgd.supabase.co";
const key = "sb_publishable_cfp0bMan8m7a113w3U6uQw_p1nZco9n";
const supabase = createClient(url, key);

async function checkSchema() {
  const { data, error } = await supabase
      .from('product_images')
      .select('*')
      .limit(1);
      
  if (error) {
    console.error("Error fetching product_images:", error);
    return;
  }
  
  if (data && data.length > 0) {
    console.log("product_images columns:", Object.keys(data[0]));
  } else {
    console.log("No data in product_images, can't infer schema.");
  }
}

checkSchema();
