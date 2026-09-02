import { useState, useEffect } from "react";
import { type Product, type Category, type Occasion } from "./products";
import { inr } from "./products";
import { productService } from "@/services/ProductService";

export { inr };

// ─── Extended managed product type ────────────────────────────────────────────

export interface ManagedProduct extends Product {
  sku: string;
  isHidden: boolean;
  isNewArrival: boolean;
  isFeatured: boolean;
  shortDescription: string;
  fabric: string;
  care: string;
  lowStockThreshold: number;
  weight?: number;
  seoTitle?: string;
  seoDescription?: string;
  keywords?: string;
  createdAt: string;
  updatedAt: string;
  isCustom?: boolean;
}

// ─── Singleton store (Cache layer) ───────────────────────────────────────────
const isClient = typeof window !== "undefined";

export function seedToManaged(p: Product): ManagedProduct {
  return {
    ...p,
    sku: `SKU-${p.id.toUpperCase().slice(0, 8)}`,
    isHidden: false,
    isNewArrival: p.isNew ?? false,
    isFeatured: p.isBestseller ?? false,
    shortDescription: p.description?.slice(0, 100) ?? "",
    fabric: p.fabricDetails ?? "",
    care: p.careInstructions ?? "",
    lowStockThreshold: 3,
    createdAt: "2026-01-01T00:00:00Z",
    updatedAt: new Date().toISOString(),
    isCustom: false,
  };
}

let _products: ManagedProduct[] = [];
const _listeners = new Set<() => void>();
let _initialized = false;
let _fetching = false;

function broadcast() {
  _listeners.forEach((fn) => fn());
}

async function initializeStore() {
  if (!isClient) return;
  if (_initialized || _fetching) return;
  _fetching = true;
  try {
    _products = await productService.getAll();
  } catch (err) {
    console.error("Critical error in initializeStore:", err);
  } finally {
    _initialized = true;
    broadcast();
  }
}

if (isClient) {
  initializeStore();
}

// ─── Actions ──────────────────────────────────────────────────────────────────

export const productStoreActions = {
  getAll: () => _products,
  getVisible: () => _products.filter((p) => !p.isHidden),
  getById: (id: string) => _products.find((p) => p.id === id),
  getByCategory: (cat: string) => _products.filter((p) => p.category === cat && !p.isHidden),
  getLowStock: () => _products.filter((p) => p.stockCount > 0 && p.stockCount <= (p.lowStockThreshold ?? 3)),
  getOutOfStock: () => _products.filter((p) => p.stockCount === 0 || !p.inStock),
  getNewArrivals: () => _products.filter((p) => (p.isNew || p.isNewArrival) && !p.isHidden),
  getBestsellers: () => _products.filter((p) => p.isBestseller && !p.isHidden),
  getFeatured: () => _products.filter((p) => p.isFeatured && !p.isHidden),

  async add(data: Omit<ManagedProduct, "id" | "createdAt" | "updatedAt">) {
    const newProduct = await productService.add(data);
    _products = [newProduct, ..._products];
    broadcast();
    return newProduct;
  },

  async update(id: string, updates: Partial<ManagedProduct>) {
    await productService.update(id, updates);
    _products = _products.map((p) =>
      p.id === id ? { ...p, ...updates, updatedAt: new Date().toISOString() } : p,
    );
    broadcast();
  },

  async delete(id: string) {
    await productService.delete(id);
    _products = _products.filter((p) => p.id !== id);
    broadcast();
  },

  async duplicate(id: string) {
    const original = _products.find((p) => p.id === id);
    if (!original) return;
    
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id: _omitId, createdAt: _omitC, updatedAt: _omitU, ...data } = original;
    const dupData = {
      ...data,
      name: `${original.name} (Copy)`,
      sku: `${original.sku}-COPY`,
      isHidden: true,
      isCustom: true,
    };
    const dup = await productService.add(dupData);
    _products = [dup, ..._products];
    broadcast();
  },

  async toggleHidden(id: string) {
    const p = _products.find((x) => x.id === id);
    if (p) await this.update(id, { isHidden: !p.isHidden });
  },
  async toggleFeatured(id: string) {
    const p = _products.find((x) => x.id === id);
    if (p) await this.update(id, { isFeatured: !p.isFeatured });
  },
  async toggleNewArrival(id: string) {
    const p = _products.find((x) => x.id === id);
    if (p) await this.update(id, { isNewArrival: !p.isNewArrival, isNew: !p.isNewArrival });
  },
  async toggleBestseller(id: string) {
    const p = _products.find((x) => x.id === id);
    if (p) await this.update(id, { isBestseller: !p.isBestseller });
  },
  async updateStock(id: string, count: number) {
    await this.update(id, { stockCount: count, inStock: count > 0 });
  },

  getStats() {
    return {
      total: _products.length,
      inStock: _products.filter((p) => p.inStock && !p.isHidden).length,
      outOfStock: _products.filter((p) => !p.inStock || p.stockCount === 0).length,
      lowStock: _products.filter((p) => p.stockCount > 0 && p.stockCount <= (p.lowStockThreshold ?? 3)).length,
      hidden: _products.filter((p) => p.isHidden).length,
      featured: _products.filter((p) => p.isFeatured).length,
      newArrivals: _products.filter((p) => p.isNewArrival || p.isNew).length,
    };
  },
};

// ─── React hook ───────────────────────────────────────────────────────────────

export function useProducts() {
  const [products, setProducts] = useState<ManagedProduct[]>(_products);
  const [loading, setLoading] = useState(!_initialized);

  useEffect(() => {
    setProducts([..._products]);
    setLoading(!_initialized);
    const update = () => {
      setProducts([..._products]);
      setLoading(false);
    };
    _listeners.add(update);
    return () => {
      _listeners.delete(update);
    };
  }, []);

  return { products, loading, ...productStoreActions };
}

export function getProductById(id: string): ManagedProduct | undefined {
  return _products.find((p) => p.id === id);
}

export const AVAILABLE_SIZES = [
  "XS", "S", "M", "L", "XL", "XXL", "XXXL",
  "Free Size", "Pettikot Size", "Custom",
  "28", "30", "32", "34", "36", "38", "40", "42",
];

export const ALL_OCCASIONS: Occasion[] = [
  "Wedding", "Reception", "Onam & Vishu", "Daily Wear",
  "College", "Party", "Festive", "Bridal",
];

export const ALL_CATEGORIES: Category[] = [
  "Kerala Bridal Wear", "Silk Sarees", "Kasavu Sarees",
  "Designer Sarees", "Churidar Sets", "Kurtis", "Festive Wear",
  "Reception Wear", "Kids Ethnic Wear", "Bridal Lehengas", "Custom Stitching",
];
