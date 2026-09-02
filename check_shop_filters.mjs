import { createClient } from '@supabase/supabase-js';

const url = "https://pjjiwghqfonoirxtpkgd.supabase.co";
const key = "sb_publishable_cfp0bMan8m7a113w3U6uQw_p1nZco9n";
const supabase = createClient(url, key);

async function checkData() {
  const { data: rowProducts, error } = await supabase.from('products').select(`
    *,
    categories ( * ),
    product_images ( * ),
    product_variants ( * )
  `);

  if (error) {
    console.error("Error fetching products:", error);
    return;
  }

  const products = rowProducts.map(row => {
    const variants = row.product_variants || [];
    const images = row.product_images || [];
    
    // Sort images by display_order
    images.sort((a, b) => a.display_order - b.display_order);
    const imageUrls = images.map(i => i.storage_url);

    // Extract unique colors and sizes
    const colors = Array.from(new Set(variants.map(v => v.color_hex).filter(Boolean)));
    const sizes = Array.from(new Set(variants.map(v => v.size).filter(Boolean)));
    
    const stock = variants.reduce((acc, v) => acc + (v.stock_quantity || 0), 0);
    const price = variants.length > 0 ? variants[0].price : 0;
    const compareAtPrice = variants.length > 0 ? variants[0].compare_at_price : undefined;
    const lowStockThreshold = variants.length > 0 ? variants[0].low_stock_threshold : 3;

    return {
      id: row.id,
      slug: row.slug,
      name: row.name,
      description: row.description,
      category: row.categories?.name || row.category_id || "",
      isNewArrival: row.is_new_arrival,
      isFeatured: row.is_featured,
      isCustom: row.is_custom,
      isHidden: !row.is_active,
      fabric: row.fabric_details,
      careInstructions: row.care_instructions,
      deliveryDays: row.delivery_days,
      price,
      compareAtPrice,
      stock,
      colors,
      sizes,
      image: imageUrls[0] || "",
      hoverImage: imageUrls[1],
      images: imageUrls,
      inStock: stock > 0,
      stockCount: stock,
      lowStockThreshold,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  });

  console.log(`AFTER ProductService format: ${products.length} products`);

  const visible = products.filter(p => !p.isHidden);
  console.log(`AFTER !p.isHidden filter: ${visible.length} products`);

  const filtered = visible.filter((p) => {
    const query = "";
    const selectedCategory = "";
    const selectedOccasion = "";
    const maxPrice = 60000;
    const showInStockOnly = false;

    const matchQuery =
      !query ||
      p.name.toLowerCase().includes(query.toLowerCase()) ||
      p.category?.toLowerCase().includes(query.toLowerCase());
    const matchCat = !selectedCategory || p.category === selectedCategory;
    const matchOcc = !selectedOccasion || (p.occasions && p.occasions.includes(selectedOccasion));
    const matchPrice = (p.price || 0) <= maxPrice;
    const matchStock = !showInStockOnly || p.inStock;
    
    if (!(matchQuery && matchCat && matchOcc && matchPrice && matchStock)) {
      console.log(`Product ${p.name} failed filter:`, { matchQuery, matchCat, matchOcc, matchPrice, matchStock });
    }
    
    return matchQuery && matchCat && matchOcc && matchPrice && matchStock;
  });

  console.log(`AFTER shop.tsx filters: ${filtered.length} products`);
}

checkData();
