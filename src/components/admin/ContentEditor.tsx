import { useState } from "react";
import { Save, Plus, Trash2, ChevronUp, ChevronDown } from "lucide-react";
import { useCMS, cmsActions, type CMSFAQItem } from "@/lib/cms";
import type { ToastFn } from "@/routes/admin";

type ContentTab = "faq" | "about" | "returns" | "shipping" | "privacy";

const TABS: { id: ContentTab; label: string }[] = [
  { id: "faq", label: "FAQ" },
  { id: "about", label: "About Page" },
  { id: "returns", label: "Return Policy" },
  { id: "shipping", label: "Shipping Policy" },
  { id: "privacy", label: "Privacy Policy" },
];

function PolicyEditor({
  label, value, onChange, hint,
}: { label: string; value: string; onChange: (v: string) => void; hint?: string }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <div className="text-[10px] tracking-luxury uppercase text-gold">{label}</div>
        {hint && <div className="text-[10px] text-muted-foreground">{hint}</div>}
      </div>
      <textarea rows={12} value={value} onChange={e => onChange(e.target.value)}
        className="w-full bg-background border border-border px-4 py-3 text-sm outline-none focus:border-gold transition-colors resize-y font-sans leading-relaxed" />
    </div>
  );
}

function FAQEditor({ showToast }: { showToast: ToastFn }) {
  const { cms } = useCMS();
  const [adding, setAdding] = useState(false);
  const [newFAQ, setNewFAQ] = useState({ question: "", answer: "", category: "General", visible: true });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<Partial<CMSFAQItem>>({});

  const FAQ_CATS = ["General", "Shipping", "Returns", "Payment", "Stitching", "Orders", "Products"];

  const startEdit = (faq: CMSFAQItem) => {
    setEditingId(faq.id);
    setEditData({ question: faq.question, answer: faq.answer, category: faq.category, visible: faq.visible });
  };

  const saveEdit = () => {
    if (editingId) {
      cmsActions.updateFAQ(editingId, editData);
      showToast("FAQ updated.");
      setEditingId(null);
      setEditData({});
    }
  };

  const addFAQ = () => {
    if (!newFAQ.question.trim() || !newFAQ.answer.trim()) {
      showToast("Question and answer are required.", "error");
      return;
    }
    cmsActions.addFAQ(newFAQ);
    showToast("FAQ added.");
    setAdding(false);
    setNewFAQ({ question: "", answer: "", category: "General", visible: true });
  };

  const moveUp = (i: number) => {
    const items = [...cms.faq].sort((a, b) => a.order - b.order);
    if (i === 0) return;
    [items[i].order, items[i - 1].order] = [items[i - 1].order, items[i].order];
    items.forEach(faq => cmsActions.updateFAQ(faq.id, { order: faq.order }));
  };

  const sorted = [...cms.faq].sort((a, b) => a.order - b.order);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">{cms.faq.length} questions</div>
        <button onClick={() => setAdding(!adding)} className="btn-gold flex items-center gap-2 text-sm py-2">
          <Plus className="w-3.5 h-3.5" /> Add Question
        </button>
      </div>

      {adding && (
        <div className="border border-gold/30 bg-card p-5 space-y-4">
          <div className="grid sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] text-gold mb-1.5">Category</label>
              <select value={newFAQ.category} onChange={e => setNewFAQ(f => ({ ...f, category: e.target.value }))}
                className="w-full bg-background border border-border px-3 py-2.5 text-sm outline-none focus:border-gold">
                {FAQ_CATS.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="flex items-center gap-3 p-3 border border-border bg-background self-end">
              <button type="button" onClick={() => setNewFAQ(f => ({ ...f, visible: !f.visible }))}
                className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors shrink-0 ${newFAQ.visible ? "bg-gold" : "bg-border"}`}>
                <span className={`inline-block h-3.5 w-3.5 rounded-full bg-white shadow transition-transform ${newFAQ.visible ? "translate-x-[18px]" : "translate-x-0.5"}`} />
              </button>
              <span className="text-sm text-ivory">Visible to customers</span>
            </div>
          </div>
          <div>
            <label className="block text-[10px] text-gold mb-1.5">Question *</label>
            <input value={newFAQ.question} onChange={e => setNewFAQ(f => ({ ...f, question: e.target.value }))}
              placeholder="e.g. How long does delivery take?"
              className="w-full bg-background border border-border px-3 py-2.5 text-sm outline-none focus:border-gold" />
          </div>
          <div>
            <label className="block text-[10px] text-gold mb-1.5">Answer *</label>
            <textarea rows={3} value={newFAQ.answer} onChange={e => setNewFAQ(f => ({ ...f, answer: e.target.value }))}
              placeholder="Detailed answer..."
              className="w-full bg-background border border-border px-3 py-2.5 text-sm outline-none focus:border-gold resize-none" />
          </div>
          <div className="flex gap-3">
            <button onClick={() => setAdding(false)} className="btn-ghost-gold flex-1">Cancel</button>
            <button onClick={addFAQ} className="btn-gold flex-1">Add FAQ</button>
          </div>
        </div>
      )}

      <div className="space-y-2">
        {sorted.map((faq, i) => (
          <div key={faq.id} className={`border border-border bg-card ${!faq.visible ? "opacity-60" : ""}`}>
            {editingId === faq.id ? (
              <div className="p-4 space-y-3">
                <input value={editData.question ?? ""} onChange={e => setEditData(d => ({ ...d, question: e.target.value }))}
                  className="w-full bg-background border border-border px-3 py-2 text-sm outline-none focus:border-gold" />
                <textarea rows={3} value={editData.answer ?? ""} onChange={e => setEditData(d => ({ ...d, answer: e.target.value }))}
                  className="w-full bg-background border border-border px-3 py-2 text-sm outline-none focus:border-gold resize-none" />
                <div className="flex gap-2">
                  <button onClick={saveEdit} className="btn-gold px-4 py-1.5 text-sm">Save</button>
                  <button onClick={() => { setEditingId(null); setEditData({}); }}
                    className="btn-ghost-gold px-4 py-1.5 text-sm">Cancel</button>
                </div>
              </div>
            ) : (
              <div className="flex items-start gap-3 px-4 py-3">
                <div className="flex flex-col gap-1 shrink-0 mt-0.5">
                  <button onClick={() => moveUp(i)} disabled={i === 0} className="text-muted-foreground hover:text-gold disabled:opacity-30 transition-colors">
                    <ChevronUp className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => moveUp(i + 1)} disabled={i === sorted.length - 1} className="text-muted-foreground hover:text-gold disabled:opacity-30 transition-colors">
                    <ChevronDown className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-medium text-ivory">{faq.question}</div>
                  <div className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{faq.answer}</div>
                  <div className="text-[9px] text-gold/60 mt-1">{faq.category}</div>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button onClick={() => cmsActions.updateFAQ(faq.id, { visible: !faq.visible })}
                    className="text-[9px] text-muted-foreground hover:text-gold px-2 py-1 border border-border hover:border-gold/40 transition-colors">
                    {faq.visible ? "Hide" : "Show"}
                  </button>
                  <button onClick={() => startEdit(faq)}
                    className="text-[9px] text-muted-foreground hover:text-gold px-2 py-1 border border-border hover:border-gold/40 transition-colors">
                    Edit
                  </button>
                  <button onClick={() => { cmsActions.deleteFAQ(faq.id); showToast("FAQ deleted.", "error"); }}
                    className="text-muted-foreground hover:text-red-400 transition-colors p-1">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
        {sorted.length === 0 && (
          <div className="text-center py-8 text-sm text-muted-foreground border border-dashed border-border">No FAQ items yet.</div>
        )}
      </div>
    </div>
  );
}

export function AdminContent({ showToast }: { showToast: ToastFn }) {
  const { cms } = useCMS();
  const [tab, setTab] = useState<ContentTab>("faq");
  const [saving, setSaving] = useState(false);
  const [pageEdits, setPageEdits] = useState<Partial<typeof cms.pages>>({});

  const savePages = async () => {
    setSaving(true);
    await new Promise(r => setTimeout(r, 300));
    cmsActions.updatePages(pageEdits);
    setPageEdits({});
    setSaving(false);
    showToast("Content updated. Changes are live.");
  };

  const current = { ...cms.pages, ...pageEdits };

  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-display text-2xl">Pages & Content</h1>
        <p className="text-xs text-muted-foreground mt-0.5">Edit all website content without touching code.</p>
      </div>

      <div className="flex gap-0 border border-border overflow-hidden">
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`flex-1 py-2.5 text-[11px] tracking-luxury uppercase transition-colors whitespace-nowrap ${tab === t.id ? "bg-gold text-onyx" : "text-muted-foreground hover:text-gold"}`}>
            {t.label}
          </button>
        ))}
      </div>

      {tab === "faq" && <FAQEditor showToast={showToast} />}

      {tab !== "faq" && (
        <div className="space-y-4">
          {tab === "about" && (
            <PolicyEditor label="About Page Text"
              hint="Shown on the /about page"
              value={current.about}
              onChange={v => setPageEdits(e => ({ ...e, about: v }))} />
          )}
          {tab === "returns" && (
            <PolicyEditor label="Return Policy"
              hint="Shown on the /faq return section and checkout"
              value={current.returnPolicy}
              onChange={v => setPageEdits(e => ({ ...e, returnPolicy: v }))} />
          )}
          {tab === "shipping" && (
            <PolicyEditor label="Shipping Policy"
              hint="Shown at checkout and FAQ"
              value={current.shippingPolicy}
              onChange={v => setPageEdits(e => ({ ...e, shippingPolicy: v }))} />
          )}
          {tab === "privacy" && (
            <PolicyEditor label="Privacy Policy"
              hint="Shown in the footer"
              value={current.privacyPolicy}
              onChange={v => setPageEdits(e => ({ ...e, privacyPolicy: v }))} />
          )}
          <button onClick={savePages} disabled={saving} className="btn-gold flex items-center gap-2">
            <Save className="w-4 h-4" />
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      )}
    </div>
  );
}
