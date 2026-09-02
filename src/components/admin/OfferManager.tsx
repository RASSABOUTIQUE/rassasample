import { useState } from "react";
import { Plus, Tag, Trash2, ToggleLeft, ToggleRight, Copy, AlertTriangle } from "lucide-react";
import { useOffers, offerActions, type Offer, type OfferType } from "@/lib/offers";
import { inr } from "@/lib/products";
import type { ToastFn } from "@/routes/admin";

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

const emptyOffer = (): Omit<Offer, "id" | "usageCount" | "createdAt"> => ({
  name: "",
  description: "",
  type: "percentage" as OfferType,
  value: 10,
  code: `CODE${Math.random().toString(36).slice(2, 6).toUpperCase()}`,
  minPurchase: 0,
  maxDiscount: 0,
  startDate: new Date().toISOString().slice(0, 10),
  endDate: new Date(Date.now() + 30 * 86400000).toISOString().slice(0, 10),
  active: true,
  usageLimit: 0,
  showBanner: false,
  bannerText: "",
  autoApply: false,
});

function OfferForm({
  offer, onSave, onCancel, showToast,
}: {
  offer?: Offer | null;
  onSave: () => void;
  onCancel: () => void;
  showToast: ToastFn;
}) {
  const [form, setForm] = useState<Omit<Offer, "id" | "usageCount" | "createdAt">>(
    offer ? { ...offer } : emptyOffer()
  );

  const set = (k: keyof typeof form) => (v: unknown) => setForm(f => ({ ...f, [k]: v }));

  const save = () => {
    if (!form.name.trim()) { showToast("Offer name is required.", "error"); return; }
    if (!form.code.trim()) { showToast("Coupon code is required.", "error"); return; }
    if (form.value <= 0) { showToast("Discount value must be > 0.", "error"); return; }

    if (offer) {
      offerActions.update(offer.id, form);
      showToast(`"${form.name}" updated.`);
    } else {
      offerActions.add({ ...form, code: form.code.toUpperCase() });
      showToast(`Offer "${form.name}" created.`);
    }
    onSave();
  };

  const typeLabels: Record<OfferType, string> = {
    percentage: "% Percentage Discount",
    flat: "₹ Flat Amount Off",
    free_shipping: "Free Shipping",
    bogo: "Buy One Get One (BOGO)",
  };

  return (
    <div className="border border-gold/30 bg-card p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-display text-lg">{offer ? "Edit Offer" : "Create New Offer"}</h3>
        <button onClick={onCancel} className="text-xs text-muted-foreground hover:text-gold">Cancel</button>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <Field label="Offer Name" required>
          <input value={form.name} onChange={e => set("name")(e.target.value)} placeholder="e.g. Onam Special 2026"
            className="w-full bg-background border border-border px-3 py-2.5 text-sm outline-none focus:border-gold transition-colors" />
        </Field>
        <Field label="Discount Type" required>
          <select value={form.type} onChange={e => set("type")(e.target.value as OfferType)}
            className="w-full bg-background border border-border px-3 py-2.5 text-sm outline-none focus:border-gold transition-colors">
            {(Object.keys(typeLabels) as OfferType[]).map(t => (
              <option key={t} value={t}>{typeLabels[t]}</option>
            ))}
          </select>
        </Field>
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        {form.type !== "free_shipping" && (
          <Field label={form.type === "percentage" ? "Discount %" : "Amount (₹)"} required>
            <input type="number" min={1} value={form.value} onChange={e => set("value")(Number(e.target.value))}
              className="w-full bg-background border border-border px-3 py-2.5 text-sm outline-none focus:border-gold transition-colors" />
          </Field>
        )}
        <Field label="Coupon Code" required>
          <input value={form.code} onChange={e => set("code")(e.target.value.toUpperCase())}
            placeholder="ONAM20" className="w-full bg-background border border-border px-3 py-2.5 text-sm font-mono outline-none focus:border-gold transition-colors uppercase" />
        </Field>
        {form.type === "percentage" && (
          <Field label="Max Discount (₹, 0=no cap)">
            <input type="number" min={0} value={form.maxDiscount} onChange={e => set("maxDiscount")(Number(e.target.value))}
              className="w-full bg-background border border-border px-3 py-2.5 text-sm outline-none focus:border-gold transition-colors" />
          </Field>
        )}
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        <Field label="Min. Purchase (₹, 0=any)">
          <input type="number" min={0} value={form.minPurchase} onChange={e => set("minPurchase")(Number(e.target.value))}
            className="w-full bg-background border border-border px-3 py-2.5 text-sm outline-none focus:border-gold transition-colors" />
        </Field>
        <Field label="Start Date">
          <input type="date" value={form.startDate} onChange={e => set("startDate")(e.target.value)}
            className="w-full bg-background border border-border px-3 py-2.5 text-sm outline-none focus:border-gold transition-colors" />
        </Field>
        <Field label="End Date">
          <input type="date" value={form.endDate} onChange={e => set("endDate")(e.target.value)}
            className="w-full bg-background border border-border px-3 py-2.5 text-sm outline-none focus:border-gold transition-colors" />
        </Field>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <Field label="Usage Limit (0=unlimited)">
          <input type="number" min={0} value={form.usageLimit} onChange={e => set("usageLimit")(Number(e.target.value))}
            className="w-full bg-background border border-border px-3 py-2.5 text-sm outline-none focus:border-gold transition-colors" />
        </Field>
        <Field label="Description (internal note)">
          <input value={form.description} onChange={e => set("description")(e.target.value)} placeholder="For Onam 2026 promotion"
            className="w-full bg-background border border-border px-3 py-2.5 text-sm outline-none focus:border-gold transition-colors" />
        </Field>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div className="flex items-center gap-3 p-3 border border-border bg-background">
          <button type="button" onClick={() => set("showBanner")(!form.showBanner)}
            className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors shrink-0 ${form.showBanner ? "bg-gold" : "bg-border"}`}>
            <span className={`inline-block h-3.5 w-3.5 rounded-full bg-white shadow transition-transform ${form.showBanner ? "translate-x-[18px]" : "translate-x-0.5"}`} />
          </button>
          <div>
            <div className="text-sm text-ivory">Show Banner on Site</div>
            <div className="text-xs text-muted-foreground">Display offer text on the site</div>
          </div>
        </div>
        <div className="flex items-center gap-3 p-3 border border-border bg-background">
          <button type="button" onClick={() => set("active")(!form.active)}
            className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors shrink-0 ${form.active ? "bg-gold" : "bg-border"}`}>
            <span className={`inline-block h-3.5 w-3.5 rounded-full bg-white shadow transition-transform ${form.active ? "translate-x-[18px]" : "translate-x-0.5"}`} />
          </button>
          <div>
            <div className="text-sm text-ivory">Active</div>
            <div className="text-xs text-muted-foreground">Customers can use this code now</div>
          </div>
        </div>
      </div>

      {form.showBanner && (
        <Field label="Banner Text">
          <input value={form.bannerText} onChange={e => set("bannerText")(e.target.value)}
            placeholder="🎉 Onam Special: 20% off with code ONAM20"
            className="w-full bg-background border border-border px-3 py-2.5 text-sm outline-none focus:border-gold transition-colors" />
        </Field>
      )}

      {/* Preview */}
      <div className="bg-gold/5 border border-gold/20 p-4">
        <div className="text-[10px] tracking-luxury uppercase text-gold mb-2">Offer Summary</div>
        <div className="text-sm text-ivory">
          Code: <span className="font-mono text-gold">{form.code || "—"}</span> ·{" "}
          {form.type === "percentage" ? `${form.value}% off` : form.type === "flat" ? `₹${form.value} off` : "Free Shipping"}
          {form.minPurchase > 0 && ` on orders ≥ ${inr(form.minPurchase)}`}
          {form.maxDiscount > 0 && form.type === "percentage" && ` (max ${inr(form.maxDiscount)})`}
        </div>
        <div className="text-xs text-muted-foreground mt-1">
          Valid: {form.startDate} → {form.endDate}
          {form.usageLimit > 0 && ` · Limit: ${form.usageLimit} uses`}
        </div>
      </div>

      <div className="flex gap-3 pt-2">
        <button onClick={onCancel} className="btn-ghost-gold flex-1">Cancel</button>
        <button onClick={save} className="btn-gold flex-1">
          {offer ? "Update Offer" : "Create Offer"}
        </button>
      </div>
    </div>
  );
}

export function AdminOffers({ showToast }: { showToast: ToastFn }) {
  const { offers } = useOffers();
  const [showForm, setShowForm] = useState(false);
  const [editingOffer, setEditingOffer] = useState<Offer | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const now = new Date().toISOString().slice(0, 10);

  const getStatus = (offer: Offer) => {
    if (!offer.active) return { label: "Inactive", color: "text-muted-foreground" };
    if (offer.endDate < now) return { label: "Expired", color: "text-red-400" };
    if (offer.startDate > now) return { label: "Scheduled", color: "text-blue-400" };
    return { label: "Active", color: "text-green-400" };
  };

  const getTypeLabel = (type: OfferType) => ({
    percentage: "% Discount",
    flat: "₹ Flat",
    free_shipping: "Free Shipping",
    bogo: "BOGO",
  }[type]);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="font-display text-2xl">Offers & Coupons</h1>
          <p className="text-xs text-muted-foreground mt-0.5">{offers.filter(o => o.active).length} active · {offers.length} total</p>
        </div>
        <button onClick={() => { setShowForm(true); setEditingOffer(null); }}
          className="btn-gold flex items-center gap-2">
          <Plus className="w-4 h-4" /> Create Offer
        </button>
      </div>

      {(showForm || editingOffer) && (
        <OfferForm
          offer={editingOffer}
          onSave={() => { setShowForm(false); setEditingOffer(null); }}
          onCancel={() => { setShowForm(false); setEditingOffer(null); }}
          showToast={showToast}
        />
      )}

      <div className="border border-border bg-card overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-background">
              {["Offer", "Code", "Type", "Value", "Used", "Valid Until", "Status", ""].map(h => (
                <th key={h} className={`px-4 py-3 text-[10px] tracking-luxury uppercase text-gold font-normal ${h === "" || h === "Value" || h === "Used" ? "text-right" : "text-left"} ${["Used", "Valid Until"].includes(h) ? "hidden md:table-cell" : ""}`}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {offers.length === 0 && (
              <tr><td colSpan={8} className="text-center py-12 text-muted-foreground text-sm">No offers created yet.</td></tr>
            )}
            {offers.map(o => {
              const status = getStatus(o);
              return (
                <tr key={o.id} className={`hover:bg-gold/5 transition-colors ${!o.active ? "opacity-60" : ""}`}>
                  <td className="px-4 py-3">
                    <div className="font-medium text-ivory">{o.name}</div>
                    {o.description && <div className="text-xs text-muted-foreground">{o.description}</div>}
                  </td>
                  <td className="px-4 py-3 font-mono text-gold text-xs">{o.code}</td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">{getTypeLabel(o.type)}</td>
                  <td className="px-4 py-3 text-right font-medium">
                    {o.type === "percentage" ? `${o.value}%` : o.type === "flat" ? inr(o.value) : "Free"}
                    {o.minPurchase > 0 && <div className="text-[10px] text-muted-foreground">min {inr(o.minPurchase)}</div>}
                  </td>
                  <td className="px-4 py-3 text-right text-xs text-muted-foreground hidden md:table-cell">
                    {o.usageCount}{o.usageLimit > 0 ? `/${o.usageLimit}` : ""}
                  </td>
                  <td className="px-4 py-3 text-xs text-muted-foreground hidden md:table-cell">{o.endDate}</td>
                  <td className="px-4 py-3">
                    <span className={`text-[10px] tracking-luxury uppercase ${status.color}`}>{status.label}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1 justify-end">
                      <button onClick={() => offerActions.toggle(o.id)} title={o.active ? "Deactivate" : "Activate"}
                        className="w-8 h-8 flex items-center justify-center text-muted-foreground hover:text-gold transition-colors">
                        {o.active ? <ToggleRight className="w-4 h-4 text-gold" /> : <ToggleLeft className="w-4 h-4" />}
                      </button>
                      <button onClick={() => {
                        offerActions.add({ ...o, code: o.code + "_COPY", name: o.name + " (Copy)", active: false, usageCount: 0 } as Omit<Offer, "id" | "usageCount" | "createdAt">);
                        showToast("Offer duplicated.");
                      }} className="w-8 h-8 flex items-center justify-center text-muted-foreground hover:text-blue-400 transition-colors">
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => { setEditingOffer(o); setShowForm(false); }}
                        className="w-8 h-8 flex items-center justify-center text-muted-foreground hover:text-gold transition-colors">
                        <Tag className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => setDeleteConfirm(o.id)}
                        className="w-8 h-8 flex items-center justify-center text-muted-foreground hover:text-red-400 transition-colors">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="bg-card border border-border p-6 max-w-sm mx-4">
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle className="w-5 h-5 text-red-400" />
              <h3 className="font-display text-lg">Delete Offer?</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-5">This coupon code will stop working immediately.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteConfirm(null)} className="btn-ghost-gold flex-1">Cancel</button>
              <button onClick={() => { offerActions.delete(deleteConfirm); showToast("Offer deleted.", "error"); setDeleteConfirm(null); }}
                className="flex-1 px-4 py-2 bg-red-500/20 border border-red-500/50 text-red-400 text-sm hover:bg-red-500/30 transition-colors">Delete</button>
            </div>
          </div>
        </div>
      )}

      <div className="p-4 border border-border bg-card/50 text-xs text-muted-foreground">
        <strong className="text-gold">How coupons work:</strong> Customers enter the code at checkout. Percentage discounts are capped at "Max Discount" if set. The system auto-validates expiry, minimum purchase and usage limits.
      </div>
    </div>
  );
}
