import { useState } from "react";
import { Plus, Trash2, ChevronDown, ChevronUp, Eye, EyeOff } from "lucide-react";
import { useCMS, cmsActions, type CMSCategory } from "@/lib/cms";
import type { ToastFn } from "@/routes/admin";
import { ImageUpload } from "./ImageUpload";

const SEASONAL_OPTIONS = ["", "onam", "eid", "christmas", "vishu", "diwali", "wedding-season"];

export function AdminCategories({ showToast }: { showToast: ToastFn }) {
  const { cms } = useCMS();
  const [adding, setAdding] = useState(false);
  const [newCat, setNewCat] = useState<Omit<CMSCategory, "id" | "order">>({
    name: "", description: "", image: "", slug: "", visible: true, featured: true, seasonal: "",
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<Partial<CMSCategory>>({});

  const sorted = [...cms.categories].sort((a, b) => a.order - b.order);

  const startEdit = (cat: CMSCategory) => {
    setEditingId(cat.id);
    setEditData({ ...cat });
  };

  const saveEdit = () => {
    if (editingId) {
      cmsActions.updateCategory(editingId, editData);
      showToast("Category updated.");
      setEditingId(null);
    }
  };

  const addCategory = () => {
    if (!newCat.name.trim()) { showToast("Category name is required.", "error"); return; }
    cmsActions.addCategory({
      ...newCat,
      slug: newCat.name.toLowerCase().replace(/\s+/g, "-"),
    });
    showToast(`"${newCat.name}" category added.`);
    setAdding(false);
    setNewCat({ name: "", description: "", image: "", slug: "", visible: true, featured: true, seasonal: "" });
  };

  const moveUp = (i: number) => {
    if (i === 0) return;
    const items = [...sorted];
    [items[i].order, items[i - 1].order] = [items[i - 1].order, items[i].order];
    items.forEach(c => cmsActions.updateCategory(c.id, { order: c.order }));
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="font-display text-2xl">Categories</h1>
          <p className="text-xs text-muted-foreground mt-0.5">{cms.categories.length} categories · {cms.categories.filter(c => c.featured).length} featured</p>
        </div>
        <button onClick={() => setAdding(!adding)} className="btn-gold flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add Category
        </button>
      </div>

      {adding && (
        <div className="border border-gold/30 bg-card p-5 space-y-4">
          <h3 className="font-display text-lg">New Category</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] text-gold mb-1.5">Name *</label>
              <input value={newCat.name} onChange={e => setNewCat(n => ({ ...n, name: e.target.value }))}
                placeholder="e.g. Kasavu Sarees"
                className="w-full bg-background border border-border px-3 py-2.5 text-sm outline-none focus:border-gold" />
            </div>
            <div>
              <label className="block text-[10px] text-gold mb-1.5">Seasonal Tag</label>
              <select value={newCat.seasonal ?? ""} onChange={e => setNewCat(n => ({ ...n, seasonal: e.target.value }))}
                className="w-full bg-background border border-border px-3 py-2.5 text-sm outline-none focus:border-gold">
                {SEASONAL_OPTIONS.map(o => <option key={o} value={o}>{o || "None"}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-[10px] text-gold mb-1.5">Description</label>
            <input value={newCat.description} onChange={e => setNewCat(n => ({ ...n, description: e.target.value }))}
              placeholder="Brief description shown on the shop page"
              className="w-full bg-background border border-border px-3 py-2.5 text-sm outline-none focus:border-gold" />
          </div>
          <div className="mb-4">
            <ImageUpload 
              label="Category Image URL" 
              value={newCat.image} 
              onChange={v => setNewCat(n => ({ ...n, image: v }))} 
            />
          </div>
          <div className="flex gap-3">
            {[
              { key: "visible", label: "Visible" },
              { key: "featured", label: "Featured on Homepage" },
            ].map(item => (
              <div key={item.key} className="flex items-center gap-2 p-3 border border-border bg-background flex-1">
                <button type="button" onClick={() => setNewCat(n => ({ ...n, [item.key]: !(n as Record<string, unknown>)[item.key] }))}
                  className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors shrink-0 ${(newCat as Record<string, unknown>)[item.key] ? "bg-gold" : "bg-border"}`}>
                  <span className={`inline-block h-3.5 w-3.5 rounded-full bg-white shadow transition-transform ${(newCat as Record<string, unknown>)[item.key] ? "translate-x-[18px]" : "translate-x-0.5"}`} />
                </button>
                <span className="text-sm text-ivory">{item.label}</span>
              </div>
            ))}
          </div>
          <div className="flex gap-3">
            <button onClick={() => setAdding(false)} className="btn-ghost-gold flex-1">Cancel</button>
            <button onClick={addCategory} className="btn-gold flex-1">Add Category</button>
          </div>
        </div>
      )}

      <div className="space-y-2">
        {sorted.map((cat, i) => (
          <div key={cat.id} className={`border border-border bg-card overflow-hidden ${!cat.visible ? "opacity-60" : ""}`}>
            {editingId === cat.id ? (
              <div className="p-4 space-y-3">
                <div className="grid sm:grid-cols-2 gap-3">
                  <input value={editData.name ?? ""} onChange={e => setEditData(d => ({ ...d, name: e.target.value }))}
                    placeholder="Category name"
                    className="bg-background border border-border px-3 py-2 text-sm outline-none focus:border-gold" />
                  <select value={editData.seasonal ?? ""} onChange={e => setEditData(d => ({ ...d, seasonal: e.target.value }))}
                    className="bg-background border border-border px-3 py-2 text-sm outline-none focus:border-gold">
                    {SEASONAL_OPTIONS.map(o => <option key={o} value={o}>{o || "None"}</option>)}
                  </select>
                </div>
                <input value={editData.description ?? ""} onChange={e => setEditData(d => ({ ...d, description: e.target.value }))}
                  placeholder="Description"
                  className="w-full bg-background border border-border px-3 py-2 text-sm outline-none focus:border-gold" />
                <div className="mb-2">
                  <ImageUpload 
                    value={editData.image ?? ""} 
                    onChange={v => setEditData(d => ({ ...d, image: v }))} 
                  />
                </div>
                <div className="flex gap-2">
                  <button onClick={saveEdit} className="btn-gold px-4 py-1.5 text-sm">Save</button>
                  <button onClick={() => { setEditingId(null); setEditData({}); }} className="btn-ghost-gold px-4 py-1.5 text-sm">Cancel</button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                {/* Drag Handle */}
                <div className="hidden sm:flex flex-col gap-1 items-center justify-center shrink-0">
                  <button onClick={() => moveUp(i)} disabled={i === 0} className="text-muted-foreground hover:text-gold disabled:opacity-30 transition-colors">
                    <ChevronUp className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => moveUp(i + 1)} disabled={i === sorted.length - 1} className="text-muted-foreground hover:text-gold disabled:opacity-30 transition-colors">
                    <ChevronDown className="w-3.5 h-3.5" />
                  </button>
                </div>
                {/* Image */}
                <div className="flex items-start gap-4 flex-1 min-w-0">
                  {cat.image ? (
                    <img src={cat.image} alt={cat.name} className="w-10 h-12 object-cover border border-border shrink-0" onError={e => (e.currentTarget.style.display = "none")} />
                  ) : (
                    <div className="w-10 h-12 bg-muted-foreground/10 border border-border flex items-center justify-center shrink-0 text-muted-foreground/50 text-xs">img</div>
                  )}
                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-medium text-ivory text-sm">{cat.name}</span>
                      {cat.featured && <span className="text-[8px] px-1.5 py-0.5 bg-gold/20 text-gold border border-gold/30">FEATURED</span>}
                      {cat.seasonal && <span className="text-[8px] px-1.5 py-0.5 bg-purple-500/20 text-purple-400 border border-purple-500/30 capitalize">{cat.seasonal}</span>}
                    </div>
                    <div className="text-xs text-muted-foreground truncate">{cat.description || "No description"}</div>
                  </div>
                </div>
                {/* Actions */}
                <div className="flex items-center gap-1 shrink-0 pt-2 sm:pt-0 border-t border-border sm:border-0 mt-2 sm:mt-0 flex-wrap">
                  <button onClick={() => cmsActions.updateCategory(cat.id, { visible: !cat.visible })} title={cat.visible ? "Hide" : "Show"}
                    className="w-8 h-8 flex items-center justify-center text-muted-foreground hover:text-gold transition-colors">
                    {cat.visible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                  </button>
                  <button onClick={() => cmsActions.updateCategory(cat.id, { featured: !cat.featured })}
                    className={`text-[9px] px-2 py-1 border transition-colors ${cat.featured ? "border-gold/40 text-gold bg-gold/10" : "border-border text-muted-foreground hover:border-gold/40"}`}>
                    {cat.featured ? "★ Featured" : "☆ Feature"}
                  </button>
                  <button onClick={() => startEdit(cat)}
                    className="text-[9px] px-2 py-1 border border-border text-muted-foreground hover:text-gold hover:border-gold/40 transition-colors">
                    Edit
                  </button>
                  <button onClick={() => { cmsActions.deleteCategory(cat.id); showToast("Category deleted.", "error"); }}
                    className="w-8 h-8 flex items-center justify-center text-muted-foreground hover:text-red-400 transition-colors">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
