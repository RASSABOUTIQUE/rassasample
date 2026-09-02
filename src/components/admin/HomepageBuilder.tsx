import { useState } from "react";
import { Save, Eye, EyeOff, Plus, X, ChevronUp, ChevronDown, Megaphone } from "lucide-react";
import { useCMS, cmsActions } from "@/lib/cms";
import { useProducts } from "@/lib/productStore";
import type { ToastFn } from "@/routes/admin";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-[10px] tracking-luxury uppercase text-gold mb-1.5">{label}</label>
      {children}
    </div>
  );
}

function Toggle({ value, onChange, label, desc }: { value: boolean; onChange: (v: boolean) => void; label?: string; desc?: string }) {
  return (
    <div className="flex items-center gap-3">
      <button type="button" onClick={() => onChange(!value)}
        className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors shrink-0 ${value ? "bg-gold" : "bg-border"}`}>
        <span className={`inline-block h-3.5 w-3.5 rounded-full bg-white shadow transition-transform ${value ? "translate-x-[18px]" : "translate-x-0.5"}`} />
      </button>
      {label && (
        <div>
          <div className="text-sm text-ivory">{label}</div>
          {desc && <div className="text-xs text-muted-foreground">{desc}</div>}
        </div>
      )}
    </div>
  );
}

function Input({ value, onChange, placeholder, type = "text" }: { value: string; onChange: (v: string) => void; placeholder?: string; type?: string }) {
  return (
    <input type={type} value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)}
      className="w-full bg-background border border-border px-3 py-2.5 text-sm outline-none focus:border-gold transition-colors" />
  );
}

function SectionCard({ title, icon: Icon, children, hint }: { title: string; icon?: React.ElementType; children: React.ReactNode; hint?: string }) {
  const [open, setOpen] = useState(true);
  return (
    <div className="border border-border bg-card">
      <button onClick={() => setOpen(o => !o)} type="button"
        className="w-full flex items-center justify-between px-5 py-4 hover:bg-gold/5 transition-colors">
        <div className="flex items-center gap-3">
          {Icon && <Icon className="w-4 h-4 text-gold" />}
          <div className="text-left">
            <div className="font-medium text-ivory text-sm">{title}</div>
            {hint && <div className="text-[10px] text-muted-foreground">{hint}</div>}
          </div>
        </div>
        {open ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
      </button>
      {open && <div className="px-5 pb-5 border-t border-border pt-4 space-y-4">{children}</div>}
    </div>
  );
}

export function AdminHomepageBuilder({ showToast }: { showToast: ToastFn }) {
  const { cms } = useCMS();
  const { products } = useProducts();
  const [saving, setSaving] = useState(false);

  const save = async () => {
    setSaving(true);
    await new Promise(r => setTimeout(r, 400));
    setSaving(false);
    showToast("Homepage updated! Changes are live.");
  };

  const visibleProducts = products.filter(p => !p.isHidden);

  const updateAnn = (k: keyof typeof cms.announcement, v: unknown) =>
    cmsActions.updateAnnouncement({ [k]: v } as never);

  const updateHero = (k: keyof typeof cms.hero, v: string) =>
    cmsActions.updateHero({ [k]: v });

  const updateHP = (k: keyof typeof cms.homepage, v: unknown) =>
    cmsActions.updateHomepage({ [k]: v } as never);

  const toggleProductInList = (id: string, listKey: "newArrivalProductIds" | "featuredProductIds") => {
    const current = cms.homepage[listKey] as string[];
    const updated = current.includes(id) ? current.filter(i => i !== id) : [...current, id];
    updateHP(listKey, updated);
    showToast("Homepage updated.");
  };

  const updateTrustItem = (i: number, key: "icon" | "text", val: string) => {
    const items = [...cms.homepage.trustItems];
    items[i] = { ...items[i], [key]: val };
    updateHP("trustItems", items);
  };

  const addTrustItem = () => updateHP("trustItems", [...cms.homepage.trustItems, { icon: "✨", text: "New feature" }]);
  const removeTrustItem = (i: number) => updateHP("trustItems", cms.homepage.trustItems.filter((_, idx) => idx !== i));

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="font-display text-2xl">Homepage Builder</h1>
          <p className="text-xs text-muted-foreground mt-0.5">Every change is instant — no code, no deployment.</p>
        </div>
        <div className="flex gap-3">
          <a href="/" target="_blank" rel="noreferrer"
            className="flex items-center gap-2 px-4 py-2 border border-border text-sm text-muted-foreground hover:text-gold hover:border-gold/40 transition-colors">
            <Eye className="w-4 h-4" /> Preview ↗
          </a>
          <button onClick={save} disabled={saving}
            className="btn-gold flex items-center gap-2">
            <Save className="w-4 h-4" />
            {saving ? "Saving..." : "Save All Changes"}
          </button>
        </div>
      </div>

      {/* Announcement Bar */}
      <SectionCard title="Announcement Bar" icon={Megaphone} hint="Shown at the top of every page">
        <Toggle value={cms.announcement.enabled} onChange={v => updateAnn("enabled", v)}
          label="Show announcement bar" desc="Displays a slim banner above the navigation" />
        {cms.announcement.enabled && (
          <>
            <Field label="Message">
              <Input value={cms.announcement.text} onChange={v => updateAnn("text", v)}
                placeholder="e.g. Free shipping on orders above ₹2,000 | Onam Sale now on!" />
            </Field>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Link URL">
                <Input value={cms.announcement.link} onChange={v => updateAnn("link", v)} placeholder="/shop" />
              </Field>
              <Field label="Bar Color">
                <select value={cms.announcement.color} onChange={e => updateAnn("color", e.target.value)}
                  className="w-full bg-background border border-border px-3 py-2.5 text-sm outline-none focus:border-gold">
                  <option value="gold">Gold (Default)</option>
                  <option value="red">Red (Sale / Urgency)</option>
                  <option value="green">Green (Offer)</option>
                  <option value="blue">Blue (Info)</option>
                </select>
              </Field>
            </div>
            <div className={`text-xs px-4 py-2 border ${
              cms.announcement.color === "gold" ? "bg-gold/10 border-gold/30 text-gold" :
              cms.announcement.color === "red" ? "bg-red-500/10 border-red-500/30 text-red-400" :
              cms.announcement.color === "green" ? "bg-green-500/10 border-green-500/30 text-green-400" :
              "bg-blue-500/10 border-blue-500/30 text-blue-400"
            }`}>
              Preview: {cms.announcement.text || "(empty)"}
            </div>
          </>
        )}
      </SectionCard>

      {/* Hero Section */}
      <SectionCard title="Hero Section" hint="The first thing customers see on the homepage">
        <Field label="Badge Text (small label above title)">
          <Input value={cms.hero.badge} onChange={v => updateHero("badge", v)} placeholder="Kerala's Premier Boutique" />
        </Field>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Title — Regular Text (line 1)">
            <Input value={cms.hero.line1} onChange={v => updateHero("line1", v)} placeholder="Dressed in" />
          </Field>
          <Field label="Title — Italic Gold Text (line 2)">
            <Input value={cms.hero.line2} onChange={v => updateHero("line2", v)} placeholder="Kerala's Finest" />
          </Field>
        </div>
        <Field label="Subtitle / Tagline">
          <textarea rows={2} value={cms.hero.subtitle} onChange={e => updateHero("subtitle", e.target.value)}
            placeholder="Silk sarees, kasavu wear..."
            className="w-full bg-background border border-border px-3 py-2.5 text-sm outline-none focus:border-gold transition-colors resize-none" />
        </Field>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Field label="Primary Button Text">
              <Input value={cms.hero.cta1Label} onChange={v => updateHero("cta1Label", v)} placeholder="Shop Now" />
            </Field>
            <Field label="Primary Button Link">
              <Input value={cms.hero.cta1Link} onChange={v => updateHero("cta1Link", v)} placeholder="/shop" />
            </Field>
          </div>
          <div className="space-y-2">
            <Field label="Secondary Button Text">
              <Input value={cms.hero.cta2Label} onChange={v => updateHero("cta2Label", v)} placeholder="Custom Stitching" />
            </Field>
            <Field label="Secondary Button Link">
              <Input value={cms.hero.cta2Link} onChange={v => updateHero("cta2Link", v)} placeholder="/custom-stitching" />
            </Field>
          </div>
        </div>
        <div className="bg-background border border-border p-4 text-center">
          <div className="text-[10px] tracking-luxury uppercase text-gold/60 mb-1">Preview</div>
          <div className="text-[10px] tracking-luxury uppercase text-gold">{cms.hero.badge}</div>
          <div className="font-display text-lg text-ivory mt-1">
            {cms.hero.line1} <em className="text-gold">{cms.hero.line2}</em>
          </div>
          <div className="text-xs text-muted-foreground mt-1 max-w-xs mx-auto">{cms.hero.subtitle}</div>
        </div>
      </SectionCard>

      {/* Sections Visibility */}
      <SectionCard title="Section Visibility" hint="Show or hide homepage sections with one click">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { key: "showNewArrivals", label: "New Arrivals Section" },
            { key: "showFeatured", label: "Featured Products Section" },
            { key: "showCategories", label: "Shop by Category Grid" },
            { key: "showCustomStitching", label: "Custom Stitching Banner" },
            { key: "showReviews", label: "Customer Reviews" },
            { key: "showTrustStrip", label: "Trust Strip (shipping, returns...)" },
          ].map(item => (
            <div key={item.key} className="flex items-center justify-between p-3 border border-border bg-background">
              <span className="text-sm text-ivory">{item.label}</span>
              <Toggle value={!!(cms.homepage as Record<string, unknown>)[item.key]}
                onChange={v => updateHP(item.key as keyof typeof cms.homepage, v)} />
            </div>
          ))}
        </div>
      </SectionCard>

      {/* New Arrivals */}
      <SectionCard title="New Arrivals Section" hint="Select products to show in the New Arrivals section">
        <div className="grid grid-cols-2 gap-3">
          <Field label="Section Title">
            <Input value={cms.homepage.newArrivalTitle} onChange={v => updateHP("newArrivalTitle", v)} placeholder="New Arrivals" />
          </Field>
          <Field label="Section Subtitle">
            <Input value={cms.homepage.newArrivalSubtitle} onChange={v => updateHP("newArrivalSubtitle", v)} placeholder="Fresh additions to our collection" />
          </Field>
        </div>
        <div>
          <div className="text-[10px] tracking-luxury uppercase text-gold mb-2">
            Select Products ({cms.homepage.newArrivalProductIds.length} selected)
          </div>
          <div className="max-h-60 overflow-y-auto border border-border divide-y divide-border">
            {visibleProducts.map(p => {
              const selected = cms.homepage.newArrivalProductIds.includes(p.id);
              return (
                <label key={p.id} className={`flex items-center gap-3 px-4 py-2.5 cursor-pointer transition-colors ${selected ? "bg-gold/5" : "hover:bg-gold/5"}`}>
                  <input type="checkbox" checked={selected}
                    onChange={() => toggleProductInList(p.id, "newArrivalProductIds")}
                    className="accent-gold" />
                  {p.images[0] && <img src={p.images[0]} alt="" className="w-8 h-10 object-cover border border-border shrink-0" />}
                  <div className="flex-1 min-w-0">
                    <div className="text-xs text-ivory truncate">{p.name}</div>
                    <div className="text-[10px] text-muted-foreground">{p.category}</div>
                  </div>
                  {selected && <span className="text-[9px] text-gold shrink-0">✓ Selected</span>}
                </label>
              );
            })}
          </div>
        </div>
      </SectionCard>

      {/* Featured Products */}
      <SectionCard title="Featured Products" hint="Select up to 8 products to feature on the homepage">
        <Field label="Section Title">
          <Input value={cms.homepage.featuredTitle} onChange={v => updateHP("featuredTitle", v)} placeholder="Featured Pieces" />
        </Field>
        <div>
          <div className="text-[10px] tracking-luxury uppercase text-gold mb-2">
            Select Products ({cms.homepage.featuredProductIds.length}/8 selected)
          </div>
          <div className="max-h-60 overflow-y-auto border border-border divide-y divide-border">
            {visibleProducts.map(p => {
              const selected = cms.homepage.featuredProductIds.includes(p.id);
              const maxed = cms.homepage.featuredProductIds.length >= 8 && !selected;
              return (
                <label key={p.id} className={`flex items-center gap-3 px-4 py-2.5 cursor-pointer transition-colors ${selected ? "bg-gold/5" : maxed ? "opacity-50 cursor-not-allowed" : "hover:bg-gold/5"}`}>
                  <input type="checkbox" checked={selected} disabled={maxed}
                    onChange={() => !maxed && toggleProductInList(p.id, "featuredProductIds")}
                    className="accent-gold" />
                  {p.images[0] && <img src={p.images[0]} alt="" className="w-8 h-10 object-cover border border-border shrink-0" />}
                  <div className="flex-1 min-w-0">
                    <div className="text-xs text-ivory truncate">{p.name}</div>
                    <div className="text-[10px] text-muted-foreground">{p.category}</div>
                  </div>
                  {selected && <span className="text-[9px] text-gold shrink-0">✓</span>}
                </label>
              );
            })}
          </div>
        </div>
      </SectionCard>

      {/* Trust Strip */}
      <SectionCard title="Trust Strip" hint="The icons and text shown below the hero">
        <div className="space-y-2">
          {cms.homepage.trustItems.map((item, i) => (
            <div key={i} className="flex items-center gap-2">
              <input value={item.icon} onChange={e => updateTrustItem(i, "icon", e.target.value)}
                className="w-12 bg-background border border-border px-2 py-2 text-center text-lg outline-none focus:border-gold" placeholder="✨" />
              <input value={item.text} onChange={e => updateTrustItem(i, "text", e.target.value)}
                placeholder="Trust message..."
                className="flex-1 bg-background border border-border px-3 py-2 text-sm outline-none focus:border-gold" />
              <button type="button" onClick={() => removeTrustItem(i)}
                className="text-muted-foreground hover:text-red-400 transition-colors shrink-0">
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
          {cms.homepage.trustItems.length < 8 && (
            <button type="button" onClick={addTrustItem}
              className="flex items-center gap-2 text-[11px] text-gold border border-gold/30 px-3 py-2 hover:bg-gold/5 transition-colors">
              <Plus className="w-3.5 h-3.5" /> Add Trust Item
            </button>
          )}
        </div>
      </SectionCard>

      {/* Save reminder */}
      <div className="flex justify-end">
        <button onClick={save} disabled={saving} className="btn-gold flex items-center gap-2">
          <Save className="w-4 h-4" />
          {saving ? "Saving..." : "Save All Changes"}
        </button>
      </div>
    </div>
  );
}
