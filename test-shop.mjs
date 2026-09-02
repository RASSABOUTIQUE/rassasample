
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://pjjiwghqfonoirxtpkgd.supabase.co",
  "sb_publishable_cfp0bMan8m7a113w3U6uQw_p1nZco9n"
);

async function run() {
  console.log("--- 1. Raw Data Fetch ---");
  const { data, error } = await supabase
    .from("products")
    .select(`
      *,
      categories(name),
      product_variants(price, compare_at_price, stock_quantity, size, color_hex),
      product_images(storage_url, display_order)
    `)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Supabase Error:", error);
    return;
  }
  
  console.log(`Database count: ${data.length}`);
  
  if (data.length > 0) {
    console.log("Sample raw product[0]:");
    const p = data[0];
    console.log({
      id: p.id,
      name: p.name,
      category_id: p.category_id,
      categories: p.categories
    });
  }

  console.log("\n--- 2. Mapped Products ---");
  const products = data.map((row) => {
    const variants = row.product_variants || [];
    const stock = variants.reduce((acc, v) => acc + (v.stock_quantity || 0), 0);
    const price = variants.length > 0 ? variants[0].price : 0;
    
    return {
      id: row.id,
      name: row.name,
      category: row.categories?.name || row.category_id || "",
      isHidden: !row.is_active,
      price: price,
      inStock: stock > 0,
      occasions: []
    };
  });
  
  console.log(`Mapped products: ${products.length}`);
  if (products.length > 0) {
    console.log("Sample mapped product[0]:");
    console.log(products[0]);
  }

  console.log("\n--- 3. Visible Products ---");
  const visible = products.filter(p => !p.isHidden);
  console.log(`Visible products: ${visible.length}`);

  console.log("\n--- 4. Filtering for KURTIS ---");
  const selectedCategory = "KURTIS";
  const query = "";
  const selectedOccasion = "";
  const maxPrice = 60000;
  const showInStockOnly = false;

  const filtered = visible.filter((p) => {
    const matchQuery = !query || p.name.toLowerCase().includes(query.toLowerCase()) || p.category.toLowerCase().includes(query.toLowerCase());
    const matchCat = !selectedCategory || p.category === selectedCategory;
    const matchOcc = !selectedOccasion || (p.occasions || []).includes(selectedOccasion);
    const matchPrice = p.price <= maxPrice;
    const matchStock = !showInStockOnly || p.inStock;
    return matchQuery && matchCat && matchOcc && matchPrice && matchStock;
  });

  console.log(`Rendered count: ${filtered.length}`);
  
  console.log("\n--- 5. First place it changes ---");
  if (visible.length !== products.length) {
    console.log("Count changed at: isHidden filter");
  } else if (filtered.length !== visible.length) {
    console.log("Count changed at: Shop page filters");
    
    // Check individual filters
    console.log("\nFilter breakdown:");
    const matchCatFailures = visible.filter(p => !( !selectedCategory || p.category === selectedCategory ));
    console.log(`Failed category match: ${matchCatFailures.length}. Example: ${matchCatFailures[0]?.category} !== ${selectedCategory}`);
  }
}

run();

