import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://pjjiwghqfonoirxtpkgd.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_cfp0bMan8m7a113w3U6uQw_p1nZco9n";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function run() {
  console.log("1. Authenticating as Admin...");
  const { error: authError } = await supabase.auth.signInWithPassword({
    email: 'admin@rassa.com',
    password: 'rassa@admin2026'
  });
  if (authError) throw authError;

  console.log("2. Creating 'Test Category'...");
  const slug = `test-category-${Date.now()}`;
  const { data: cat, error: catError } = await supabase
    .from('categories')
    .insert({
      name: 'Test Category',
      slug: slug,
      is_active: true,
      featured: true
    })
    .select()
    .single();
  
  if (catError) throw catError;
  console.log(`   -> Created Category ID: ${cat.id}`);

  console.log("3. Creating product under 'Test Category'...");
  const prodSlug = `test-product-${Date.now()}`;
  const { data: prod, error: prodError } = await supabase
    .from('products')
    .insert({
      name: 'Test Automatic Product',
      slug: prodSlug,
      category_id: cat.id,
      is_active: true
    })
    .select()
    .single();

  if (prodError) throw prodError;
  console.log(`   -> Created Product ID: ${prod.id} with category_id: ${prod.category_id}`);

  console.log("4. Verifying category_id matches...");
  if (prod.category_id === cat.id) {
    console.log("   -> SUCCESS: product.category_id EXACTLY MATCHES category.id UUID.");
  } else {
    console.error("   -> FAILURE: Mismatch!");
  }

  console.log("5. Verifying ProductService query structure...");
  const { data: fetchedProd, error: fetchError } = await supabase
    .from('products')
    .select(`
        *,
        categories(name),
        product_variants(price, compare_at_price, stock_quantity, size, color_hex),
        product_images(storage_url, display_order)
    `)
    .eq('id', prod.id)
    .single();
    
  if (fetchError) throw fetchError;
  
  console.log(`   -> Fetched Product Name: ${fetchedProd.name}`);
  console.log(`   -> Fetched Product Category object:`, fetchedProd.categories);
  
  if (fetchedProd.categories && fetchedProd.categories.name === 'Test Category') {
    console.log("   -> SUCCESS: categories(name) is correctly populated.");
    console.log("   -> ProductService formatProduct() will map this to p.category = 'Test Category'");
    console.log("   -> ProductManager & Shop filters will match successfully!");
  } else {
    console.error("   -> FAILURE: categories(name) is NOT populated correctly.");
  }
}

run().catch(console.error);
