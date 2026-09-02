import { createClient } from '@supabase/supabase-js';

const url = "https://pjjiwghqfonoirxtpkgd.supabase.co";
const key = "sb_publishable_cfp0bMan8m7a113w3U6uQw_p1nZco9n";
const supabase = createClient(url, key);

function formatProduct(row) {
    const variants = row.product_variants || [];
    const images = row.product_images || [];
    
    // Sort images by display_order
    images.sort((a, b) => a.display_order - b.display_order);
    const imageUrls = images.map((i) => i.storage_url);

    // Extract unique colors and sizes
    const colors = Array.from(new Set(variants.map((v) => v.color_hex).filter(Boolean)));
    const sizes = Array.from(new Set(variants.map((v) => v.size).filter(Boolean)));
    
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
  }

async function checkQuery() {
  const { data, error } = await supabase
      .from("products")
      .select(`
        *,
        categories(name),
        product_variants(price, compare_at_price, stock_quantity, low_stock_threshold, size, color_hex),
        product_images(storage_url, display_order)
      `)
      .order("created_at", { ascending: false });

  if (error) {
    console.error("Supabase get products error:", error);
    return;
  }

  const mapped = data.map(formatProduct);
  const visible = mapped.filter(p => !p.isHidden);
  console.log("Total rows:", data.length);
  console.log("Mapped rows:", mapped.length);
  console.log("Visible rows:", visible.length);
  console.log(mapped.map(p => ({id: p.id, isHidden: p.isHidden})));
}

checkQuery();
