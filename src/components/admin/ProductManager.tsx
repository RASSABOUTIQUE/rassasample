import { useState, useRef, useEffect } from "react";
import {
  Plus, Search, Edit2, Trash2, Copy, Eye, EyeOff,
  Star, Package, ChevronDown, ChevronUp, X, Check, AlertTriangle,
} from "lucide-react";
import {
  useProducts, productStoreActions, AVAILABLE_SIZES,
  ALL_OCCASIONS, type ManagedProduct,
} from "@/lib/productStore";
import { inr } from "@/lib/products";
import type { Category, Occasion } from "@/lib/products";
import type { ToastFn } from "@/routes/admin";
import { ImageUpload } from "./ImageUpload";
import { useCMS } from "@/lib/cms";

// ─── Shared form helpers ───────────────────────────────────────────────────────

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-[10px] tracking-luxury uppercase text-gold mb-1.5">
        {label}{required && <span className="text-red-400 ml-0.5">*</span>}
      </label>
      {children}
    </div>
  );
}

function TextInput({ value, onChange, placeholder, type = "text", ...rest }: { value: string; onChange: (v: string) => void; placeholder?: string; type?: string; [k: string]: unknown }) {
  return (
    <input
      type={type} value={value} placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
      {...rest}
      className="w-full bg-background border border-border px-3 py-2.5 text-sm outline-none focus:border-gold transition-colors"
    />
  );
}

function NumberInput({ value, onChange, min = 0, isCurrency = false }: { value: number; onChange: (v: number) => void; min?: number; isCurrency?: boolean }) {
  const [localVal, setLocalVal] = useState(value ? (isCurrency ? value.toLocaleString("en-IN") : value.toString()) : "");

  // Sync when value changes externally
  useEffect(() => {
    if (value === 0 && !localVal) return; // Don't overwrite empty input with "0"
    if (value.toString() !== localVal.replace(/\D/g, "")) {
      setLocalVal(value ? (isCurrency ? value.toLocaleString("en-IN") : value.toString()) : "");
    }
  }, [value, isCurrency]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, "");
    if (!raw) {
      setLocalVal("");
      onChange(0);
      return;
    }
    const num = parseInt(raw, 10);
    setLocalVal(isCurrency ? num.toLocaleString("en-IN") : num.toString());
    onChange(num);
  };

  return (
    <div className="relative">
      {isCurrency && <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">₹</span>}
      <input
        type="text"
        inputMode="numeric"
        value={localVal}
        onChange={handleChange}
        className={`w-full bg-background border border-border ${isCurrency ? "pl-7 pr-3" : "px-3"} py-2.5 text-sm outline-none focus:border-gold transition-colors`}
      />
    </div>
  );
}

function Toggle({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) {
  return (
    <button type="button" onClick={() => onChange(!value)}
      className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors shrink-0 ${value ? "bg-gold" : "bg-border"}`}>
      <span className={`inline-block h-3.5 w-3.5 rounded-full bg-white shadow transition-transform ${value ? "translate-x-4.5" : "translate-x-0.5"}`} />
    </button>
  );
}

// ─── Empty product template ────────────────────────────────────────────────────

function emptyProduct(category?: Category): Omit<ManagedProduct, "id" | "createdAt" | "updatedAt"> {
  return {
    name: "", category: category || ("" as Category), occasions: [],
    price: 0, images: [""], sizes: [], colors: [],
    inStock: true, stockCount: 10, description: "",
    fabricDetails: "", careInstructions: "Dry clean recommended.",
    deliveryDays: "3–7 working days",
    isNew: false, isBestseller: false,
    sku: `SKU-${Date.now().toString().slice(-6)}`,
    isHidden: false, isNewArrival: false, isFeatured: false,
    shortDescription: "", fabric: "", care: "", lowStockThreshold: 3,
    isCustom: true,
  };
}

// ─── Product Form (Advanced, slide-over panel) ───────────────────────────────

type FormTab = "basic" | "pricing" | "variants" | "images" | "details" | "seo";
const FORM_TABS: { id: FormTab; label: string }[] = [
  { id: "basic", label: "Basic Info" },
  { id: "pricing", label: "Pricing & Stock" },
  { id: "variants", label: "Variants" },
  { id: "images", label: "Images" },
  { id: "details", label: "Details" },
  { id: "seo", label: "Visibility & SEO" },
];

function ProductForm({
  product, category, initialForm, onClose, onSave, showToast,
}: {
  product: ManagedProduct | null;
  category?: Category;
  initialForm?: any;
  onClose: () => void;
  onSave: () => void;
  showToast: ToastFn;
}) {
  const { cms } = useCMS();
  const ALL_CATEGORIES = cms.categories.map(c => c.name);
  const isNew = !product?.isCustom && !product?.id?.startsWith("prod-") || !product;
  const [tab, setTab] = useState<FormTab>("basic");
  const [form, setForm] = useState<Omit<ManagedProduct, "id" | "createdAt" | "updatedAt">>(
    initialForm || (product ? { ...product } : emptyProduct(category))
  );

  const set = (key: keyof typeof form) => (val: unknown) =>
    setForm((f) => ({ ...f, [key]: val }));

  const save = () => {
    if (!form.name.trim()) { showToast("Product name is required.", "error"); return; }
    if (!form.category) { showToast("Category is required.", "error"); return; }
    if (form.price <= 0) { showToast("Price must be greater than 0.", "error"); return; }
    if (!form.images[0]) { showToast("At least one image URL is required.", "error"); return; }

    if (product) {
      productStoreActions.update(product.id, form);
      showToast(`"${form.name}" updated successfully.`);
    } else {
      productStoreActions.add(form);
      showToast(`"${form.name}" added to catalog.`);
    }
    onSave();
    onClose();
  };

  const toggleOccasion = (occ: Occasion) => {
    const arr = form.occasions as Occasion[];
    set("occasions")(arr.includes(occ) ? arr.filter((o) => o !== occ) : [...arr, occ]);
  };

  const toggleSize = (size: string) => {
    set("sizes")(form.sizes.includes(size) ? form.sizes.filter((s) => s !== size) : [...form.sizes, size]);
  };

  const addColor = () => set("colors")([...form.colors, { name: "", hex: "#D4AF37" }]);
  const updateColor = (i: number, key: "name" | "hex", val: string) => {
    const updated = [...form.colors];
    updated[i] = { ...updated[i], [key]: val };
    set("colors")(updated);
  };
  const removeColor = (i: number) => set("colors")(form.colors.filter((_, idx) => idx !== i));

  const addImage = () => set("images")([...form.images, ""]);
  const updateImage = (i: number, val: string) => {
    const updated = [...form.images];
    updated[i] = val;
    set("images")(updated);
  };
  const removeImage = (i: number) => set("images")(form.images.filter((_, idx) => idx !== i));

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative z-10 ml-auto w-full max-w-2xl bg-card border-l border-border flex flex-col h-full overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-background">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-display text-xl">{product ? "Edit Product" : "Advanced Add Product"}</h2>
              <span className="text-[9px] tracking-luxury uppercase text-gold bg-gold/10 px-2 py-0.5 border border-gold/20">Advanced</span>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">{form.name || "Unnamed product"}</p>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={save} className="btn-gold px-5 py-2 text-sm flex items-center gap-1.5">
              <Check className="w-4 h-4" /> Save
            </button>
            <button onClick={onClose} className="text-muted-foreground hover:text-gold transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-border overflow-x-auto bg-card">
          {FORM_TABS.map((t) => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`px-4 py-3 text-[11px] tracking-luxury uppercase whitespace-nowrap transition-colors ${tab === t.id ? "text-gold border-b-2 border-gold" : "text-muted-foreground hover:text-ivory"}`}>
              {t.label}
            </button>
          ))}
        </div>

        {/* Form content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* ── Basic Info ── */}
          {tab === "basic" && (
            <>
              <Field label="Product Name" required>
                <TextInput value={form.name} onChange={set("name")} placeholder="e.g. Royal Kasavu Set with Embroidery" />
              </Field>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Category" required>
                  <select value={form.category || ""} onChange={(e) => set("category")(e.target.value as Category)}
                    className="w-full bg-background border border-border px-3 py-2.5 text-sm outline-none focus:border-gold transition-colors">
                    <option value="" disabled>Select a category</option>
                    {ALL_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </Field>
                <Field label="Product Tag">
                  <select value={form.tag ?? ""} onChange={(e) => set("tag")(e.target.value)}
                    className="w-full bg-background border border-border px-3 py-2.5 text-sm outline-none focus:border-gold transition-colors">
                    <option value="">None</option>
                    {["New", "Bestseller", "Sale", "Trending", "Signature", "Limited", "Festival"].map(t => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </Field>
              </div>
              <Field label="Short Description">
                <textarea rows={2} value={form.shortDescription} onChange={(e) => set("shortDescription")(e.target.value)}
                  placeholder="1-2 line summary shown on product card"
                  className="w-full bg-background border border-border px-3 py-2.5 text-sm outline-none focus:border-gold transition-colors resize-none" />
              </Field>
              <Field label="Full Description" required>
                <textarea rows={5} value={form.description} onChange={(e) => set("description")(e.target.value)}
                  placeholder="Detailed product description..."
                  className="w-full bg-background border border-border px-3 py-2.5 text-sm outline-none focus:border-gold transition-colors resize-none" />
              </Field>
              <Field label="Occasions">
                <div className="flex flex-wrap gap-2 mt-1">
                  {ALL_OCCASIONS.map((occ) => {
                    const active = (form.occasions as string[]).includes(occ);
                    return (
                      <button type="button" key={occ} onClick={() => toggleOccasion(occ as Occasion)}
                        className={`px-3 py-1.5 text-[11px] border transition-colors ${active ? "border-gold bg-gold/10 text-gold" : "border-border text-muted-foreground hover:border-gold/40"}`}>
                        {occ}
                      </button>
                    );
                  })}
                </div>
              </Field>
            </>
          )}

          {/* ── Pricing & Stock ── */}
          {tab === "pricing" && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Selling Price (₹)" required>
                  <NumberInput value={form.price} onChange={set("price")} isCurrency />
                </Field>
                <Field label="Original Price / MRP (₹)">
                  <NumberInput value={form.originalPrice ?? 0} onChange={(v) => set("originalPrice")(v || undefined)} isCurrency />
                </Field>
              </div>
              {form.originalPrice && form.originalPrice > form.price && (
                <div className="text-xs text-green-400 bg-green-400/10 border border-green-400/20 px-3 py-2">
                  Discount: {Math.round(((form.originalPrice - form.price) / form.originalPrice) * 100)}% off
                </div>
              )}
              <div className="grid grid-cols-2 gap-4">
                <Field label="SKU">
                  <TextInput value={form.sku} onChange={set("sku")} placeholder="e.g. SKU-KASUV-001" />
                </Field>
                <Field label="Stock Count">
                  <NumberInput value={form.stockCount} onChange={set("stockCount")} />
                </Field>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Low Stock Alert (pieces)">
                  <NumberInput value={form.lowStockThreshold ?? 3} onChange={set("lowStockThreshold")} min={1} />
                </Field>
                <Field label="Weight (grams, for shipping)">
                  <NumberInput value={form.weight ?? 0} onChange={set("weight")} />
                </Field>
              </div>
              <div className="flex items-center gap-3 p-4 border border-border bg-background">
                <Toggle value={form.inStock} onChange={set("inStock")} />
                <div>
                  <div className="text-sm text-ivory">In Stock</div>
                  <div className="text-xs text-muted-foreground">Turn off to hide "Out of Stock" — product still visible</div>
                </div>
              </div>
              <Field label="Delivery Days">
                <TextInput value={form.deliveryDays} onChange={set("deliveryDays")} placeholder="e.g. 3–7 working days" />
              </Field>
            </>
          )}

          {/* ── Variants ── */}
          {tab === "variants" && (
            <>
              <Field label="Available Sizes">
                <div className="flex flex-wrap gap-2 mt-1">
                  {AVAILABLE_SIZES.map((size) => {
                    const active = form.sizes.includes(size);
                    return (
                      <button type="button" key={size} onClick={() => toggleSize(size)}
                        className={`px-3 py-1.5 text-[11px] border transition-colors ${active ? "border-gold bg-gold/10 text-gold" : "border-border text-muted-foreground hover:border-gold/40"}`}>
                        {size}
                      </button>
                    );
                  })}
                </div>
              </Field>
              <Field label="Colors">
                <div className="space-y-2 mt-1">
                  {form.colors.map((color, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <input type="color" value={color.hex} onChange={(e) => updateColor(i, "hex", e.target.value)}
                        className="w-10 h-9 p-0 bg-transparent border border-border cursor-pointer rounded-sm" />
                      <TextInput value={color.name} onChange={(v) => updateColor(i, "name", v)} placeholder="Color name (e.g. Ivory Gold)" />
                      <button type="button" onClick={() => removeColor(i)} className="text-muted-foreground hover:text-red-400 transition-colors shrink-0">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  <button type="button" onClick={addColor}
                    className="flex items-center gap-2 text-[11px] text-gold border border-gold/30 px-3 py-2 hover:bg-gold/5 transition-colors">
                    <Plus className="w-3.5 h-3.5" /> Add Color
                  </button>
                </div>
              </Field>
            </>
          )}

          {/* ── Images ── */}
          {tab === "images" && (
            <>
              <p className="text-xs text-muted-foreground">Upload images or paste public URLs. First image is the primary product image.</p>
              <div className="space-y-3">
                {form.images.map((url, i) => (
                  <div key={i} className="space-y-2">
                    <div className="flex gap-2 items-start">
                      <div className="flex-1">
                        <ImageUpload value={url} onChange={(v) => updateImage(i, v)} />
                      </div>
                      {form.images.length > 1 && (
                        <button type="button" onClick={() => removeImage(i)} className="text-muted-foreground hover:text-red-400 transition-colors shrink-0 mt-2">
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                    {i === 0 && <span className="text-[9px] text-gold mt-1 block">Primary Image</span>}
                  </div>
                ))}
                {form.images.length < 6 && (
                  <button type="button" onClick={addImage}
                    className="flex items-center gap-2 text-[11px] text-gold border border-gold/30 px-3 py-2 hover:bg-gold/5 transition-colors mt-2">
                    <Plus className="w-3.5 h-3.5" /> Add Image
                  </button>
                )}
              </div>
            </>
          )}

          {/* ── Details ── */}
          {tab === "details" && (
            <>
              <Field label="Fabric / Material">
                <TextInput value={form.fabricDetails ?? ""} onChange={set("fabricDetails")} placeholder="e.g. Pure Kanjivaram Silk, Zari Border" />
              </Field>
              <Field label="Care Instructions">
                <textarea rows={3} value={form.careInstructions ?? ""} onChange={(e) => set("careInstructions")(e.target.value)}
                  placeholder="e.g. Dry clean only. Store in a cool, dry place."
                  className="w-full bg-background border border-border px-3 py-2.5 text-sm outline-none focus:border-gold transition-colors resize-none" />
              </Field>
            </>
          )}

          {/* ── Visibility & SEO ── */}
          {tab === "seo" && (
            <>
              <div className="space-y-3">
                {[
                  { key: "isNewArrival", label: "New Arrival", desc: "Shows 'New' badge and appears in New Arrivals section" },
                  { key: "isBestseller", label: "Bestseller", desc: "Shows 'Bestseller' badge on product card" },
                  { key: "isFeatured", label: "Featured on Homepage", desc: "Shows in Featured Products section on homepage" },
                  { key: "isHidden", label: "Hide Product", desc: "Hidden from shop — not visible to customers" },
                ].map((item) => (
                  <div key={item.key} className="flex items-center gap-3 p-4 border border-border bg-background">
                    <Toggle value={!!(form as Record<string, unknown>)[item.key]} onChange={(v) => set(item.key as keyof typeof form)(v)} />
                    <div>
                      <div className={`text-sm ${item.key === "isHidden" ? "text-red-400" : "text-ivory"}`}>{item.label}</div>
                      <div className="text-xs text-muted-foreground">{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
              <Field label="SEO Page Title">
                <TextInput value={form.seoTitle ?? ""} onChange={set("seoTitle")} placeholder="e.g. Buy Kasavu Sarees Online — Rassa Boutique" />
              </Field>
              <Field label="SEO Meta Description">
                <textarea rows={3} value={form.seoDescription ?? ""} onChange={(e) => set("seoDescription")(e.target.value)}
                  placeholder="150-160 character description for search engines..."
                  className="w-full bg-background border border-border px-3 py-2.5 text-sm outline-none focus:border-gold transition-colors resize-none" />
              </Field>
              <Field label="Keywords (comma-separated)">
                <TextInput value={form.keywords ?? ""} onChange={set("keywords")} placeholder="kasavu saree, Kerala saree, silk saree online" />
              </Field>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Simple Product Form (Slide-over panel) ───────────────────────────────────

function SimpleProductForm({
  category, onClose, onSave, showToast, onAdvanced,
}: {
  category: Category;
  onClose: () => void;
  onSave: () => void;
  showToast: ToastFn;
  onAdvanced: (formState: any) => void;
}) {
  const [form, setForm] = useState(emptyProduct(category));
  
  const set = (key: keyof typeof form) => (val: unknown) =>
    setForm((f) => ({ ...f, [key]: val }));

  const toggleSize = (size: string) => {
    set("sizes")(form.sizes.includes(size) ? form.sizes.filter((s) => s !== size) : [...form.sizes, size]);
  };
  
  const addColor = () => set("colors")([...form.colors, { name: "", hex: "#D4AF37" }]);
  const updateColor = (i: number, key: "name" | "hex", val: string) => {
    const updated = [...form.colors];
    updated[i] = { ...updated[i], [key]: val };
    set("colors")(updated);
  };
  const removeColor = (i: number) => set("colors")(form.colors.filter((_, idx) => idx !== i));

  const save = () => {
    if (!form.name.trim()) { showToast("Product name is required.", "error"); return; }
    if (form.price <= 0) { showToast("Price must be greater than 0.", "error"); return; }
    if (!form.images[0]) { showToast("At least one image URL is required.", "error"); return; }

    productStoreActions.add(form);
    showToast(`"${form.name}" added to catalog.`);
    onSave();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative z-10 ml-auto w-full max-w-md bg-card border-l border-border flex flex-col h-full overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-background">
          <div>
            <h2 className="font-display text-xl">Quick Add Product</h2>
            <p className="text-xs text-muted-foreground mt-0.5">Category: <span className="text-gold">{category}</span></p>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-gold transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <Field label="Product Images" required>
            <div className="space-y-3 mt-1">
              {form.images.map((url, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex gap-2 items-start">
                    <div className="flex-1">
                      <ImageUpload value={url} onChange={(v) => {
                        const updated = [...form.images];
                        updated[i] = v;
                        set("images")(updated);
                      }} />
                    </div>
                    {form.images.length > 1 && (
                      <button type="button" onClick={() => set("images")(form.images.filter((_, idx) => idx !== i))} className="text-muted-foreground hover:text-red-400 transition-colors shrink-0 mt-2">
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  {i === 0 && <span className="text-[9px] text-gold mt-1 block">Primary Image</span>}
                </div>
              ))}
              {form.images.length < 6 && (
                <button type="button" onClick={() => set("images")([...form.images, ""])}
                  className="flex items-center gap-2 text-[11px] text-gold border border-gold/30 px-3 py-2 hover:bg-gold/5 transition-colors mt-2">
                  <Plus className="w-3.5 h-3.5" /> Add Image
                </button>
              )}
            </div>
          </Field>
          
          <Field label="Product Name" required>
            <TextInput value={form.name} onChange={set("name")} placeholder="e.g. Royal Kasavu Set" />
          </Field>
          
          <div className="grid grid-cols-2 gap-4">
            <Field label="Selling Price (₹)" required>
              <NumberInput value={form.price} onChange={set("price")} isCurrency />
            </Field>
            <Field label="Offer Price / MRP (₹)">
              <NumberInput value={form.originalPrice ?? 0} onChange={(v) => set("originalPrice")(v || undefined)} isCurrency />
            </Field>
          </div>
          
          <Field label="Short Description">
            <textarea rows={2} value={form.shortDescription} onChange={(e) => set("shortDescription")(e.target.value)}
              placeholder="1-2 line summary..."
              className="w-full bg-background border border-border px-3 py-2.5 text-sm outline-none focus:border-gold transition-colors resize-none" />
          </Field>
          
          <Field label="Available Sizes">
            <div className="flex flex-wrap gap-2 mt-1">
              {AVAILABLE_SIZES.slice(0, 8).map((size) => {
                const active = form.sizes.includes(size);
                return (
                  <button type="button" key={size} onClick={() => toggleSize(size)}
                    className={`px-3 py-1.5 text-[11px] border transition-colors ${active ? "border-gold bg-gold/10 text-gold" : "border-border text-muted-foreground hover:border-gold/40"}`}>
                    {size}
                  </button>
                );
              })}
            </div>
          </Field>

          <Field label="Colors">
            <div className="space-y-2 mt-1">
              {form.colors.map((color, i) => (
                <div key={i} className="flex items-center gap-2">
                  <input type="color" value={color.hex} onChange={(e) => updateColor(i, "hex", e.target.value)}
                    className="w-10 h-9 p-0 bg-transparent border border-border cursor-pointer rounded-sm" />
                  <TextInput value={color.name} onChange={(v) => updateColor(i, "name", v)} placeholder="Color name" />
                  <button type="button" onClick={() => removeColor(i)} className="text-muted-foreground hover:text-red-400 transition-colors shrink-0">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
              <button type="button" onClick={addColor}
                className="flex items-center gap-2 text-[11px] text-gold border border-gold/30 px-3 py-2 hover:bg-gold/5 transition-colors">
                <Plus className="w-3.5 h-3.5" /> Add Color
              </button>
            </div>
          </Field>
          
          <Field label="Stock Quantity">
            <NumberInput value={form.stockCount} onChange={set("stockCount")} />
          </Field>
          
          <button onClick={() => onAdvanced(form)} className="w-full py-3 mt-4 border border-border text-[10px] tracking-luxury uppercase text-muted-foreground hover:text-ivory hover:border-gold/50 transition-colors">
            Advanced Options
          </button>
        </div>
        
        <div className="p-4 border-t border-border bg-background">
          <button onClick={save} className="btn-gold w-full flex items-center justify-center gap-2">
            <Check className="w-4 h-4" /> Publish Product
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Product Manager ───────────────────────────────────────────────────────────

export function AdminProducts({ showToast }: { showToast: ToastFn }) {
  const { products } = useProducts();
  const { cms } = useCMS();
  const categories = cms.categories.map(c => c.name);

  const [search, setSearch] = useState("");
  
  // Expanded state for each category folder
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>(
    Object.fromEntries(categories.map(c => [c, true]))
  );

  const toggleCategory = (cat: string) => {
    setExpandedCategories(prev => ({ ...prev, [cat]: !prev[cat] }));
  };

  type EditState = 
    | { type: 'simple', category: Category }
    | { type: 'advanced', product: ManagedProduct | null, category?: Category, initialForm?: any }
    | null;

  const [editingProduct, setEditingProduct] = useState<EditState>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const handleDelete = (id: string) => {
    productStoreActions.delete(id);
    showToast("Product deleted.", "error");
    setDeleteConfirm(null);
  };

  const stats = productStoreActions.getStats();

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="font-display text-2xl">Products</h1>
          <p className="text-xs text-muted-foreground mt-0.5">{stats.total} products · {stats.inStock} in stock · {stats.outOfStock} out of stock</p>
        </div>
        <div className="relative min-w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products..."
            className="w-full bg-card border border-border pl-9 pr-4 py-2.5 text-sm outline-none focus:border-gold transition-colors" />
        </div>
      </div>

      {/* Category Folders */}
      <div className="space-y-6">
        {categories.map((cat) => {
          const catProducts = products.filter(p => p.category === cat && (!search || p.name.toLowerCase().includes(search.toLowerCase()) || p.sku.toLowerCase().includes(search.toLowerCase())));
          
          // Hide category if searching and no products match
          if (search && catProducts.length === 0) return null;
          
          const isExpanded = expandedCategories[cat];
          
          return (
            <div key={cat} className="border border-border bg-card overflow-hidden">
              <div className="px-5 py-4 border-b border-border bg-background flex flex-wrap items-center justify-between gap-3 cursor-pointer hover:bg-gold/5 transition-colors" onClick={() => toggleCategory(cat)}>
                <div className="flex items-center gap-3">
                  <div className="text-muted-foreground bg-black/20 p-1.5 rounded-full border border-border">
                    {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
                  </div>
                  <h3 className="font-display text-lg text-ivory tracking-wide">{cat} <span className="text-muted-foreground text-sm font-sans tracking-normal ml-1">({catProducts.length})</span></h3>
                </div>
                <div className="flex items-center gap-3">
                  <button onClick={(e) => { e.stopPropagation(); setEditingProduct({ type: 'simple', category: cat as Category }); }} className="text-[10px] tracking-luxury uppercase text-gold border border-gold/30 hover:bg-gold hover:text-onyx px-4 py-2 flex items-center gap-1.5 transition-colors">
                    <Plus className="w-3.5 h-3.5" /> Add Product
                  </button>
                </div>
              </div>
              
              {isExpanded && (
                <div className="p-5">
                  {catProducts.length === 0 ? (
                    <div className="text-center py-10 text-sm text-muted-foreground border border-dashed border-border bg-background/50">
                      No products in this category yet. Click "Add Product" to get started.
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                      {catProducts.map(p => (
                        <div key={p.id} className={`flex gap-4 p-3 border border-border bg-background transition-all hover:border-gold/30 ${p.isHidden ? 'opacity-50 grayscale-[50%]' : ''}`}>
                          <div className="w-20 aspect-[3/4] bg-muted-foreground/10 shrink-0 border border-border overflow-hidden relative">
                            {p.images[0] ? <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover" /> : <Package className="w-5 h-5 text-muted-foreground/50 absolute inset-0 m-auto" />}
                            {p.isHidden && <div className="absolute inset-0 bg-black/50 flex items-center justify-center backdrop-blur-[1px]"><EyeOff className="w-4 h-4 text-white/70" /></div>}
                          </div>
                          <div className="flex-1 min-w-0 py-1 flex flex-col">
                            <div className="font-medium text-ivory text-sm truncate">{p.name}</div>
                            <div className="text-[10px] text-muted-foreground font-mono mt-0.5">{p.sku}</div>
                            
                            <div className="flex items-center gap-3 mt-1.5">
                              <div className="text-gold text-sm font-medium">{inr(p.price)}</div>
                              {p.originalPrice && p.originalPrice > p.price && (
                                <div className="text-[10px] line-through text-muted-foreground">{inr(p.originalPrice)}</div>
                              )}
                            </div>

                            <div className="mt-auto flex items-center gap-2 justify-between flex-wrap pt-3 border-t border-border mt-3">
                              <span className={`text-[10px] uppercase tracking-wider ${!p.inStock || p.stockCount === 0 ? "text-red-400 font-medium" : p.stockCount <= (p.lowStockThreshold || 3) ? "text-yellow-400" : "text-green-400"}`}>
                                {!p.inStock || p.stockCount === 0 ? "Out of Stock" : `${p.stockCount} in stock`}
                              </span>
                              <div className="flex items-center gap-1">
                                <button onClick={(e) => { e.stopPropagation(); e.preventDefault(); setEditingProduct({ type: 'advanced', product: p }); }} title="Edit" className="w-7 h-7 flex items-center justify-center text-muted-foreground hover:text-gold hover:bg-gold/10 rounded-sm transition-colors"><Edit2 className="w-3.5 h-3.5" /></button>
                                <button onClick={(e) => { e.stopPropagation(); e.preventDefault(); productStoreActions.duplicate(p.id); showToast("Product duplicated (hidden)."); }} title="Duplicate" className="w-7 h-7 flex items-center justify-center text-muted-foreground hover:text-blue-400 hover:bg-blue-400/10 rounded-sm transition-colors"><Copy className="w-3.5 h-3.5" /></button>
                                <button onClick={(e) => { e.stopPropagation(); e.preventDefault(); productStoreActions.toggleHidden(p.id); showToast(p.isHidden ? "Product visible." : "Product hidden."); }} title={p.isHidden ? "Show" : "Hide"} className="w-7 h-7 flex items-center justify-center text-muted-foreground hover:text-yellow-400 hover:bg-yellow-400/10 rounded-sm transition-colors">{p.isHidden ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}</button>
                                <button onClick={(e) => { e.stopPropagation(); e.preventDefault(); setDeleteConfirm(p.id); }} title="Delete" className="w-7 h-7 flex items-center justify-center text-muted-foreground hover:text-red-400 hover:bg-red-400/10 rounded-sm transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Delete confirm dialog */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-card border border-border p-6 max-w-sm mx-4 shadow-2xl">
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle className="w-5 h-5 text-red-400 shrink-0" />
              <h3 className="font-display text-lg">Delete Product?</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-5">This action cannot be undone. The product will be permanently removed from your catalog.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteConfirm(null)} className="btn-ghost-gold flex-1">Cancel</button>
              <button onClick={() => handleDelete(deleteConfirm)} className="flex-1 px-4 py-2 bg-red-500/20 border border-red-500/50 text-red-400 text-sm hover:bg-red-500/30 transition-colors">Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* Product forms */}
      {editingProduct?.type === 'simple' && (
        <SimpleProductForm
          category={editingProduct.category}
          onClose={() => setEditingProduct(null)}
          onSave={() => {}}
          showToast={showToast}
          onAdvanced={(formState) => setEditingProduct({ type: 'advanced', product: null, category: editingProduct.category, initialForm: formState })}
        />
      )}

      {editingProduct?.type === 'advanced' && (
        <ProductForm
          product={editingProduct.product}
          category={editingProduct.category}
          initialForm={editingProduct.initialForm}
          onClose={() => setEditingProduct(null)}
          onSave={() => {}}
          showToast={showToast}
        />
      )}
    </div>
  );
}
