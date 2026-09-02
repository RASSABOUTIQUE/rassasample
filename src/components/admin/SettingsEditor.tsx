import { useState } from "react";
import { Save } from "lucide-react";
import { useCMS, cmsActions, type CMSStore } from "@/lib/cms";
import type { ToastFn } from "@/routes/admin";
import { ImageUpload } from "./ImageUpload";

type SettingsTab = "store" | "contact" | "social" | "payments" | "shipping";

const TABS: { id: SettingsTab; label: string }[] = [
  { id: "store",    label: "Store Info" },
  { id: "contact",  label: "Contact & Hours" },
  { id: "social",   label: "Social Media" },
  { id: "payments", label: "Payments" },
  { id: "shipping", label: "Shipping" },
];

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-[10px] tracking-luxury uppercase text-gold mb-1.5">{label}</label>
      {children}
      {hint && <div className="text-[10px] text-muted-foreground mt-1">{hint}</div>}
    </div>
  );
}

function TextInput({ value, onChange, placeholder, type = "text" }: { value: string; onChange: (v: string) => void; placeholder?: string; type?: string }) {
  return (
    <input type={type} value={value} placeholder={placeholder} onChange={e => onChange(e.target.value)}
      className="w-full bg-background border border-border px-3 py-2.5 text-sm outline-none focus:border-gold transition-colors" />
  );
}

function Toggle({ value, onChange, label, desc }: { value: boolean; onChange: (v: boolean) => void; label: string; desc?: string }) {
  return (
    <div className="flex items-center gap-3 p-3.5 border border-border bg-background">
      <button type="button" onClick={() => onChange(!value)}
        className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors shrink-0 ${value ? "bg-gold" : "bg-border"}`}>
        <span className={`inline-block h-3.5 w-3.5 rounded-full bg-white shadow transition-transform ${value ? "translate-x-[18px]" : "translate-x-0.5"}`} />
      </button>
      <div>
        <div className="text-sm text-ivory">{label}</div>
        {desc && <div className="text-xs text-muted-foreground">{desc}</div>}
      </div>
    </div>
  );
}

export function AdminSettings({ showToast }: { showToast: ToastFn }) {
  const { cms } = useCMS();
  const [tab, setTab] = useState<SettingsTab>("store");
  const [edits, setEdits] = useState<Partial<CMSStore>>({});
  const [saving, setSaving] = useState(false);

  const current: CMSStore = { ...cms.store, ...edits };
  const set = (k: keyof CMSStore) => (v: unknown) => setEdits(e => ({ ...e, [k]: v }));

  const save = async () => {
    setSaving(true);
    await new Promise(r => setTimeout(r, 400));
    cmsActions.updateStore(edits);
    setEdits({});
    setSaving(false);
    showToast("Settings saved. Changes are live.");
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="font-display text-2xl">Settings</h1>
          <p className="text-xs text-muted-foreground mt-0.5">Manage your store settings. All changes go live immediately.</p>
        </div>
        {Object.keys(edits).length > 0 && (
          <button onClick={save} disabled={saving} className="btn-gold flex items-center gap-2">
            <Save className="w-4 h-4" />
            {saving ? "Saving..." : `Save ${Object.keys(edits).length} Change${Object.keys(edits).length > 1 ? "s" : ""}`}
          </button>
        )}
      </div>

      <div className="flex gap-0 border border-border overflow-hidden overflow-x-auto">
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`flex-1 py-2.5 px-3 text-[11px] tracking-luxury uppercase transition-colors whitespace-nowrap ${tab === t.id ? "bg-gold text-onyx" : "text-muted-foreground hover:text-gold"}`}>
            {t.label}
          </button>
        ))}
      </div>

      <div className="border border-border bg-card p-6 space-y-5">
        {/* ── Store Info ── */}
        {tab === "store" && (
          <>
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Store Name">
                <TextInput value={current.name} onChange={set("name")} placeholder="Rassa Boutique" />
              </Field>
              <Field label="Tagline">
                <TextInput value={current.tagline} onChange={set("tagline")} placeholder="Kerala's Premier Women's Boutique" />
              </Field>
            </div>
            <div className="mb-4 mt-2">
              <ImageUpload 
                label="Logo URL" 
                value={current.logoUrl} 
                onChange={set("logoUrl")} 
              />
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="GST Number">
                <TextInput value={current.gst} onChange={set("gst")} placeholder="22ABCDE1234F1Z5" />
              </Field>
            </div>
            <div>
              <Toggle value={current.storeClosed} onChange={v => set("storeClosed")(v)}
                label="Store Temporarily Closed"
                desc="Shows a closed message to all visitors" />
              {current.storeClosed && (
                <div className="mt-2">
                  <Field label="Closed Message">
                    <TextInput value={current.storeClosedMessage} onChange={set("storeClosedMessage")}
                      placeholder="We are temporarily closed. Check back soon." />
                  </Field>
                </div>
              )}
            </div>
          </>
        )}

        {/* ── Contact & Hours ── */}
        {tab === "contact" && (
          <>
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Phone Number">
                <TextInput value={current.phone} onChange={set("phone")} placeholder="+91 96334 19902" type="tel" />
              </Field>
              <Field label="WhatsApp Number" hint="Include country code, no + sign: 919633419902">
                <TextInput value={current.whatsapp} onChange={set("whatsapp")} placeholder="919633419902" />
              </Field>
            </div>
            <Field label="Email Address">
              <TextInput value={current.email} onChange={set("email")} placeholder="hello@rassaboutique.in" type="email" />
            </Field>
            <Field label="Store Address">
              <TextInput value={current.address} onChange={set("address")} placeholder="Chathamangalam" />
            </Field>
            <div className="grid grid-cols-3 gap-4">
              <Field label="City">
                <TextInput value={current.city} onChange={set("city")} placeholder="Kozhikode" />
              </Field>
              <Field label="State">
                <TextInput value={current.state} onChange={set("state")} placeholder="Kerala" />
              </Field>
              <Field label="Pincode">
                <TextInput value={current.pincode} onChange={set("pincode")} placeholder="673601" />
              </Field>
            </div>
            <Field label="Business Hours">
              <TextInput value={current.hours} onChange={set("hours")} placeholder="Mon–Sat: 10am–9pm | Sun: 11am–8pm" />
            </Field>
            <Field label="Google Maps Link" hint="Copy the share link from Google Maps">
              <TextInput value={current.googleMapsLink} onChange={set("googleMapsLink")} placeholder="https://maps.google.com/..." />
            </Field>
          </>
        )}

        {/* ── Social ── */}
        {tab === "social" && (
          <>
            <Field label="Instagram URL">
              <TextInput value={current.instagram} onChange={set("instagram")} placeholder="https://instagram.com/rassa_boutique" />
            </Field>
            <Field label="Facebook URL">
              <TextInput value={current.facebook} onChange={set("facebook")} placeholder="https://facebook.com/rassaboutique" />
            </Field>
            <Field label="YouTube URL">
              <TextInput value={current.youtube} onChange={set("youtube")} placeholder="https://youtube.com/@rassaboutique" />
            </Field>
          </>
        )}

        {/* ── Payments ── */}
        {tab === "payments" && (
          <div className="space-y-3">
            <Toggle value={current.codEnabled} onChange={v => set("codEnabled")(v)}
              label="Cash on Delivery (COD)"
              desc="Customer pays when the order arrives" />
            <Toggle value={current.whatsappPayEnabled} onChange={v => set("whatsappPayEnabled")(v)}
              label="WhatsApp Payment (UPI / Bank Transfer)"
              desc="You share payment details via WhatsApp after order" />
            <Toggle value={current.razorpayEnabled} onChange={v => set("razorpayEnabled")(v)}
              label="Razorpay (Online Payments)"
              desc="Cards, UPI, Net Banking, Wallets — requires Razorpay API key in .env" />
            <div className="p-4 border border-border bg-background text-xs text-muted-foreground">
              <strong className="text-gold">Note:</strong> To enable Razorpay, add <code className="text-gold">VITE_RAZORPAY_KEY=rzp_live_...</code> to your <code>.env</code> file and redeploy.
            </div>
          </div>
        )}

        {/* ── Shipping ── */}
        {tab === "shipping" && (
          <>
            <div className="grid sm:grid-cols-3 gap-4">
              <Field label="Free Shipping Above (₹)">
                <input type="number" min={0} value={current.freeShippingThreshold}
                  onChange={e => set("freeShippingThreshold")(Number(e.target.value))}
                  className="w-full bg-background border border-border px-3 py-2.5 text-sm outline-none focus:border-gold" />
              </Field>
              <Field label="Standard Delivery (₹)">
                <input type="number" min={0} value={current.standardShipping}
                  onChange={e => set("standardShipping")(Number(e.target.value))}
                  className="w-full bg-background border border-border px-3 py-2.5 text-sm outline-none focus:border-gold" />
              </Field>
              <Field label="Express Delivery (₹)">
                <input type="number" min={0} value={current.expressShipping}
                  onChange={e => set("expressShipping")(Number(e.target.value))}
                  className="w-full bg-background border border-border px-3 py-2.5 text-sm outline-none focus:border-gold" />
              </Field>
            </div>
            <div className="p-4 border border-border bg-background text-xs text-muted-foreground space-y-1">
              <div>Standard delivery: 3–7 working days</div>
              <div>Express delivery: 1–3 working days</div>
              <div>Store pickup: Always free</div>
              <div className="text-gold pt-1">Free shipping will apply automatically at checkout when cart ≥ ₹{current.freeShippingThreshold}</div>
            </div>
          </>
        )}
      </div>

      <div className="flex justify-end">
        <button onClick={save} disabled={saving} className="btn-gold flex items-center gap-2">
          <Save className="w-4 h-4" />
          {saving ? "Saving..." : "Save Settings"}
        </button>
      </div>
    </div>
  );
}
