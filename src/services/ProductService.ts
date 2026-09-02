import type { ManagedProduct } from "@/lib/productStore";
import { supabase } from "@/lib/supabase";

export interface IProductService {
  getAll(): Promise<ManagedProduct[]>;
  getById(id: string): Promise<ManagedProduct | undefined>;
  add(product: Omit<ManagedProduct, "id" | "createdAt" | "updatedAt">): Promise<ManagedProduct>;
  update(id: string, updates: Partial<ManagedProduct>): Promise<void>;
  delete(id: string): Promise<void>;
}

export class SupabaseProductService implements IProductService {
  
  private formatProduct(row: any): ManagedProduct {
    const variants = row.product_variants || [];
    const images = row.product_images || [];
    
    // Sort images by display_order
    images.sort((a: any, b: any) => a.display_order - b.display_order);
    const imageUrls = images.map((i: any) => i.storage_url);

    // Extract unique colors and sizes
    const colors = Array.from(new Set(variants.map((v: any) => v.color_hex).filter(Boolean))) as string[];
    const sizes = Array.from(new Set(variants.map((v: any) => v.size).filter(Boolean))) as string[];
    
    const stock = variants.reduce((acc: number, v: any) => acc + (v.stock_quantity || 0), 0);
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

  async getAll(): Promise<ManagedProduct[]> {
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
      return [];
    }

    
    const rawData = data || [];
    console.log("[TRACE: 1. Raw Database Query] Products fetched:", rawData.length);
    if (rawData.length > 0) {
      console.log("[TRACE: Raw Sample]", { id: rawData[0].id, category_id: rawData[0].category_id, categories: rawData[0].categories });
    }
    const mapped = rawData.map(this.formatProduct);
    console.log("[TRACE: 2. Mapped Products] Count:", mapped.length);
    if (mapped.length > 0) {
      console.log("[TRACE: Mapped Sample]", { id: mapped[0].id, category: mapped[0].category, isHidden: mapped[0].isHidden });
    }
    return mapped;
    
  }

  async getById(id: string): Promise<ManagedProduct | undefined> {
    const { data, error } = await supabase
      .from("products")
      .select(`
        *,
        categories(name),
        product_variants(price, compare_at_price, stock_quantity, low_stock_threshold, size, color_hex),
        product_images(storage_url, display_order)
      `)
      .eq("id", id)
      .single();

    if (error || !data) return undefined;
    return this.formatProduct(data);
  }

  async add(data: Omit<ManagedProduct, "id" | "createdAt" | "updatedAt">): Promise<ManagedProduct> {
    // 1. Resolve category ID
    let categoryId = null;
    if (data.category) {
      // data.category is the name, so we search by name
      const { data: cat } = await supabase.from("categories").select("id").ilike("name", data.category).single();
      if (cat) categoryId = cat.id;
    }

    const slug = data.slug || data.name.toLowerCase().replace(/[^a-z0-9]+/g, "-") + "-" + Date.now();

    // 2. Insert Product
    const { data: newProd, error: prodError } = await supabase.from("products").insert({
      name: data.name,
      slug,
      category_id: categoryId,
      description: data.description,
      fabric_details: data.fabric,
      care_instructions: data.careInstructions,
      delivery_days: data.deliveryDays,
      is_new_arrival: data.isNewArrival,
      is_featured: data.isFeatured,
      is_custom: data.isCustom,
      is_active: !data.isHidden,
    }).select().single();

    if (prodError || !newProd) throw new Error(prodError?.message || "Failed to create product");

    // 3. Insert single default variant (flattened logic backwards compatibility)
    const { error: varError } = await supabase.from("product_variants").insert({
      product_id: newProd.id,
      sku: `SKU-${Date.now()}`,
      price: data.price,
      compare_at_price: data.compareAtPrice,
      stock_quantity: data.stockCount ?? data.stock ?? 0,
      size: data.sizes && data.sizes.length > 0 ? data.sizes[0] : null,
      color_hex: data.colors && data.colors.length > 0 ? (typeof data.colors[0] === 'string' ? data.colors[0] : data.colors[0].hex) : null,
      color_name: data.colors && data.colors.length > 0 ? (typeof data.colors[0] === 'string' ? data.colors[0] : data.colors[0].name) : null,
    });
    
    if (varError) throw new Error(varError.message);

    // 4. Insert Images
    const imagesToInsert = [];
    if (data.image) imagesToInsert.push(data.image);
    if (data.hoverImage) imagesToInsert.push(data.hoverImage);
    if (data.images) data.images.forEach(img => {
      if (!imagesToInsert.includes(img)) imagesToInsert.push(img);
    });

    if (imagesToInsert.length > 0) {
      const imgPayload = imagesToInsert.map((url, idx) => ({
        product_id: newProd.id,
        storage_url: url,
        display_order: idx,
        is_primary: idx === 0
      }));
      await supabase.from("product_images").insert(imgPayload);
    }

    return this.getById(newProd.id) as Promise<ManagedProduct>;
  }

  async update(id: string, updates: Partial<ManagedProduct>): Promise<void> {
    const prodPayload: any = {};
    if (updates.name !== undefined) prodPayload.name = updates.name;
    if (updates.slug !== undefined) prodPayload.slug = updates.slug;
    if (updates.description !== undefined) prodPayload.description = updates.description;
    if (updates.fabric !== undefined) prodPayload.fabric_details = updates.fabric;
    if (updates.careInstructions !== undefined) prodPayload.care_instructions = updates.careInstructions;
    if (updates.deliveryDays !== undefined) prodPayload.delivery_days = updates.deliveryDays;
    if (updates.isNewArrival !== undefined) prodPayload.is_new_arrival = updates.isNewArrival;
    if (updates.isFeatured !== undefined) prodPayload.is_featured = updates.isFeatured;
    if (updates.isCustom !== undefined) prodPayload.is_custom = updates.isCustom;

    // Resolve category name to id
    if (updates.category) {
      const { data: cat } = await supabase.from("categories").select("id").ilike("name", updates.category).single();
      if (cat) prodPayload.category_id = cat.id;
    }

    if (updates.isHidden !== undefined) prodPayload.is_active = !updates.isHidden;

    if (Object.keys(prodPayload).length > 0) {
      await supabase.from("products").update(prodPayload).eq("id", id);
    }

    // Very simplistic variant update for UI compatibility
    if (updates.price !== undefined || updates.compareAtPrice !== undefined || updates.stock !== undefined) {
      const varPayload: any = {};
      if (updates.price !== undefined) varPayload.price = updates.price;
      if (updates.compareAtPrice !== undefined) varPayload.compare_at_price = updates.compareAtPrice;
      if (updates.stock !== undefined) varPayload.stock_quantity = updates.stock;
      
      await supabase.from("product_variants").update(varPayload).eq("product_id", id); // Updates all variants of this product roughly
    }

    // Simplistic image sync: delete old and recreate to mirror flattened frontend array
    if (updates.image !== undefined || updates.hoverImage !== undefined || updates.images !== undefined) {
      const current = await this.getById(id);
      if (current) {
        const imagesToInsert = [];
        const prim = updates.image !== undefined ? updates.image : current.image;
        const hov = updates.hoverImage !== undefined ? updates.hoverImage : current.hoverImage;
        const arr = updates.images !== undefined ? updates.images : current.images || [];

        if (prim) imagesToInsert.push(prim);
        if (hov && !imagesToInsert.includes(hov)) imagesToInsert.push(hov);
        arr.forEach(img => {
          if (!imagesToInsert.includes(img)) imagesToInsert.push(img);
        });

        await supabase.from("product_images").delete().eq("product_id", id);
        
        if (imagesToInsert.length > 0) {
          const imgPayload = imagesToInsert.map((url, idx) => ({
            product_id: id,
            storage_url: url,
            display_order: idx,
            is_primary: idx === 0
          }));
          await supabase.from("product_images").insert(imgPayload);
        }
      }
    }
  }

  async delete(id: string): Promise<void> {
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) throw new Error(error.message);
  }
}

import { isSupabaseConfigured } from "@/lib/supabase";
import { products } from "@/lib/products";
import { seedToManaged } from "@/lib/productStore";

export class LocalProductService implements IProductService {
  async getAll(): Promise<ManagedProduct[]> {
    return products.map(seedToManaged);
  }
  async getById(id: string): Promise<ManagedProduct | undefined> {
    const p = products.find(p => p.id === id);
    return p ? seedToManaged(p) : undefined;
  }
  async add(product: Omit<ManagedProduct, "id" | "createdAt" | "updatedAt">): Promise<ManagedProduct> {
    return { ...product, id: `p_${Date.now()}`, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
  }
  async update(id: string, updates: Partial<ManagedProduct>): Promise<void> {}
  async delete(id: string): Promise<void> {}
}

export const productService = isSupabaseConfigured ? new SupabaseProductService() : new LocalProductService();
