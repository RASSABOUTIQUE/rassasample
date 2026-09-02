import { useState } from "react";
import {
  useStitching, stitchingActions,
  STITCHING_STATUS_LABELS, STITCHING_STATUS_COLORS,
  type StitchingRequest, type StitchingStatus,
} from "@/lib/stitching";
import { MessageCircle, ChevronDown, ChevronUp, Search, LayoutList, KanbanSquare } from "lucide-react";
import type { ToastFn } from "@/routes/admin";

const ALL_STATUSES: StitchingStatus[] = ["received", "reviewing", "in_progress", "ready", "delivered", "cancelled"];

export function AdminStitching({ showToast }: { showToast: ToastFn }) {
  const { requests } = useStitching();
  const [expanded, setExpanded] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | StitchingStatus>("all");
  const [editMap, setEditMap] = useState<Record<string, Partial<StitchingRequest>>>({});
  const [viewMode, setViewMode] = useState<"list" | "kanban">("kanban");

  const filtered = requests.filter(r => {
    const q = search.toLowerCase();
    const matchSearch = !search || r.customerName.toLowerCase().includes(q) || r.orderNo.toLowerCase().includes(q) || r.customerPhone.includes(q);
    const matchStatus = statusFilter === "all" || r.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const getEdit = (id: string) => editMap[id] ?? {};
  const setEdit = (id: string, updates: Partial<StitchingRequest>) =>
    setEditMap(m => ({ ...m, [id]: { ...(m[id] ?? {}), ...updates } }));

  const saveEdit = (id: string) => {
    stitchingActions.update(id, editMap[id] ?? {});
    setEditMap(m => { const n = { ...m }; delete n[id]; return n; });
    showToast("Stitching order updated.");
  };

  const whatsapp = (r: StitchingRequest) => {
    const msg = `Hello ${r.customerName},\n\nYour custom stitching order *${r.orderNo}* status: *${STITCHING_STATUS_LABELS[r.status]}*.\n${r.deliveryDate ? `Expected delivery: ${r.deliveryDate}` : ""}\n\nContact us for any queries.\n— Rassa Boutique, Kozhikode`;
    window.open(`https://wa.me/${r.customerPhone.replace(/\D/g, "")}?text=${encodeURIComponent(msg)}`, "_blank");
  };

  const moveStatus = (id: string, newStatus: StitchingStatus) => {
    stitchingActions.updateStatus(id, newStatus);
    showToast(`Moved to ${STITCHING_STATUS_LABELS[newStatus]}`);
  };

  return (
    <div className="space-y-5 h-full flex flex-col">
      <div>
        <h1 className="font-display text-2xl">Custom Stitching</h1>
        <p className="text-xs text-muted-foreground mt-0.5">
          {requests.length} total · {stitchingActions.getPending().length} pending
        </p>
      </div>

      <div className="flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name, order no, phone..."
            className="w-full bg-card border border-border pl-9 pr-4 py-2.5 text-sm outline-none focus:border-gold" />
        </div>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value as typeof statusFilter)}
          className="bg-card border border-border px-3 py-2.5 text-sm outline-none focus:border-gold">
          <option value="all">All Statuses</option>
          {ALL_STATUSES.map(s => <option key={s} value={s}>{STITCHING_STATUS_LABELS[s]}</option>)}
        </select>
        <div className="flex bg-card border border-border">
          <button onClick={() => setViewMode("kanban")} className={`p-2 transition-colors ${viewMode === "kanban" ? "bg-gold/20 text-gold" : "text-muted-foreground hover:bg-gold/10 hover:text-gold"}`} title="Kanban View">
            <KanbanSquare className="w-5 h-5" />
          </button>
          <button onClick={() => setViewMode("list")} className={`p-2 transition-colors ${viewMode === "list" ? "bg-gold/20 text-gold" : "text-muted-foreground hover:bg-gold/10 hover:text-gold"}`} title="List View">
            <LayoutList className="w-5 h-5" />
          </button>
        </div>
      </div>

      {requests.length === 0 && (
        <div className="border border-border bg-card p-12 text-center mt-5">
          <div className="text-4xl mb-3">✂️</div>
          <div className="text-sm text-muted-foreground">No custom stitching requests yet.</div>
          <div className="text-xs text-muted-foreground mt-1">Requests submitted via the Custom Stitching page appear here.</div>
        </div>
      )}

      {viewMode === "list" ? (
        <div className="space-y-3 flex-1 overflow-auto">
          {filtered.map(r => {
            const edits = getEdit(r.id);
            const isExpanded = expanded === r.id;
            const hasEdits = Object.keys(edits).length > 0;
            const current = { ...r, ...edits };

            return (
              <div key={r.id} className="border border-border bg-card overflow-hidden">
                {/* Summary row */}
                <button onClick={() => setExpanded(isExpanded ? null : r.id)}
                  className="w-full flex items-center gap-4 px-5 py-4 hover:bg-gold/5 transition-colors text-left">
                  <div className="flex-1 min-w-0 grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div>
                      <div className="text-[9px] tracking-luxury uppercase text-gold/60">Order</div>
                      <div className="text-xs font-mono text-gold">{r.orderNo}</div>
                    </div>
                    <div>
                      <div className="text-[9px] tracking-luxury uppercase text-gold/60">Customer</div>
                      <div className="text-xs text-ivory">{r.customerName}</div>
                    </div>
                    <div className="hidden sm:block">
                      <div className="text-[9px] tracking-luxury uppercase text-gold/60">Garment</div>
                      <div className="text-xs text-ivory">{r.garmentType}</div>
                    </div>
                    <div>
                      <div className="text-[9px] tracking-luxury uppercase text-gold/60">Status</div>
                      <div className={`text-xs ${STITCHING_STATUS_COLORS[r.status]}`}>{STITCHING_STATUS_LABELS[r.status]}</div>
                    </div>
                  </div>
                  <div className="shrink-0 text-muted-foreground">
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                </button>

                {/* Expanded details */}
                {isExpanded && (
                  <div className="border-t border-border px-5 py-5 space-y-5">
                    <div className="grid md:grid-cols-2 gap-6">
                      {/* Customer info */}
                      <div className="space-y-3">
                        <div className="text-[10px] tracking-luxury uppercase text-gold">Customer Details</div>
                        <div className="text-sm space-y-1">
                          <div><span className="text-muted-foreground">Name: </span>{r.customerName}</div>
                          <div><span className="text-muted-foreground">Phone: </span>{r.customerPhone}</div>
                          {r.customerEmail && <div><span className="text-muted-foreground">Email: </span>{r.customerEmail}</div>}
                          <div><span className="text-muted-foreground">Garment: </span>{r.garmentType}</div>
                          {r.fabric && <div><span className="text-muted-foreground">Fabric: </span>{r.fabric}</div>}
                        </div>
                        {r.notes && (
                          <div>
                            <div className="text-[10px] tracking-luxury uppercase text-gold mb-1">Customer Notes</div>
                            <div className="text-sm text-muted-foreground bg-background border border-border px-3 py-2">{r.notes}</div>
                          </div>
                        )}
                        {r.referenceImageUrl && (
                          <div>
                            <div className="text-[10px] tracking-luxury uppercase text-gold mb-1">Reference Image</div>
                            <img src={r.referenceImageUrl} alt="Reference" className="w-32 h-40 object-cover border border-border" onError={e => (e.currentTarget.style.display = "none")} />
                          </div>
                        )}
                        {/* Measurements */}
                        {Object.keys(r.measurements).length > 0 && (
                          <div>
                            <div className="text-[10px] tracking-luxury uppercase text-gold mb-1">Measurements</div>
                            <div className="grid grid-cols-2 gap-1 text-xs">
                              {Object.entries(r.measurements).map(([k, v]) => (
                                <div key={k} className="flex justify-between bg-background border border-border px-2 py-1">
                                  <span className="text-muted-foreground capitalize">{k}</span>
                                  <span className="text-ivory">{v}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Admin controls */}
                      <div className="space-y-4">
                        <div className="text-[10px] tracking-luxury uppercase text-gold">Admin Controls</div>

                        <div>
                          <label className="block text-[10px] text-gold mb-1">Update Status</label>
                          <select value={current.status}
                            onChange={e => setEdit(r.id, { status: e.target.value as StitchingStatus })}
                            className="w-full bg-background border border-border px-3 py-2.5 text-sm outline-none focus:border-gold">
                            {ALL_STATUSES.map(s => <option key={s} value={s}>{STITCHING_STATUS_LABELS[s]}</option>)}
                          </select>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[10px] text-gold mb-1">Tailor Name</label>
                            <input value={current.tailorName ?? ""} onChange={e => setEdit(r.id, { tailorName: e.target.value })}
                              placeholder="Assign tailor"
                              className="w-full bg-background border border-border px-3 py-2 text-sm outline-none focus:border-gold" />
                          </div>
                          <div>
                            <label className="block text-[10px] text-gold mb-1">Delivery Date</label>
                            <input type="date" value={current.deliveryDate ?? ""} onChange={e => setEdit(r.id, { deliveryDate: e.target.value })}
                              className="w-full bg-background border border-border px-3 py-2 text-sm outline-none focus:border-gold" />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[10px] text-gold mb-1">Estimated Price (₹)</label>
                            <input type="number" min={0} value={current.estimatedPrice ?? 0}
                              onChange={e => setEdit(r.id, { estimatedPrice: Number(e.target.value) })}
                              className="w-full bg-background border border-border px-3 py-2 text-sm outline-none focus:border-gold" />
                          </div>
                          <div>
                            <label className="block text-[10px] text-gold mb-1">Final Price (₹)</label>
                            <input type="number" min={0} value={current.finalPrice ?? ""}
                              onChange={e => setEdit(r.id, { finalPrice: Number(e.target.value) || undefined })}
                              className="w-full bg-background border border-border px-3 py-2 text-sm outline-none focus:border-gold" />
                          </div>
                        </div>

                        <div>
                          <label className="block text-[10px] text-gold mb-1">Designer Notes (internal)</label>
                          <textarea rows={3} value={current.designerNotes ?? ""}
                            onChange={e => setEdit(r.id, { designerNotes: e.target.value })}
                            placeholder="Add notes for the design team..."
                            className="w-full bg-background border border-border px-3 py-2 text-sm outline-none focus:border-gold resize-none" />
                        </div>

                        <div className="flex gap-3">
                          {hasEdits && (
                            <button onClick={() => saveEdit(r.id)} className="btn-gold flex-1">Save Changes</button>
                          )}
                          <button onClick={() => whatsapp(r)}
                            className="flex items-center gap-2 px-4 py-2 border border-green-500/50 text-green-400 text-sm hover:bg-green-500/10 transition-colors">
                            <MessageCircle className="w-4 h-4" /> WhatsApp
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="flex-1 overflow-x-auto pb-4 mt-2">
          <div className="flex gap-4 min-w-max h-full">
            {ALL_STATUSES.map(status => {
              const columnRequests = filtered.filter(r => r.status === status);
              return (
                <div key={status} className="w-72 flex flex-col bg-card/50 border border-border rounded">
                  <div className={`p-3 border-b border-border font-medium text-sm flex justify-between items-center ${STITCHING_STATUS_COLORS[status]}`}>
                    <span>{STITCHING_STATUS_LABELS[status]}</span>
                    <span className="bg-background px-2 py-0.5 rounded-full text-[10px] border border-border text-ivory">{columnRequests.length}</span>
                  </div>
                  <div className="flex-1 p-2 space-y-2 overflow-y-auto min-h-[300px]">
                    {columnRequests.map(r => (
                      <div key={r.id} className="bg-card border border-border p-3 rounded shadow-sm hover:border-gold/50 transition-colors group">
                        <div className="flex justify-between items-start mb-2">
                          <span className="text-[10px] font-mono text-gold">{r.orderNo}</span>
                          <span className="text-[9px] text-muted-foreground">{new Date(r.createdAt).toLocaleDateString()}</span>
                        </div>
                        <div className="font-medium text-sm text-ivory mb-1">{r.customerName}</div>
                        <div className="text-xs text-muted-foreground mb-3">{r.garmentType}</div>
                        
                        {r.tailorName && <div className="text-[10px] text-blue-400 mb-2">Tailor: {r.tailorName}</div>}
                        
                        <div className="flex justify-between items-center pt-2 border-t border-border">
                           <button onClick={() => whatsapp(r)} className="text-green-400 hover:text-green-300">
                             <MessageCircle className="w-4 h-4" />
                           </button>
                           
                           <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                             <select 
                               className="text-[10px] bg-background border border-border outline-none text-muted-foreground p-1"
                               value={r.status}
                               onChange={(e) => moveStatus(r.id, e.target.value as StitchingStatus)}
                             >
                               <option value="" disabled>Move to...</option>
                               {ALL_STATUSES.filter(s => s !== r.status).map(s => (
                                 <option key={s} value={s}>{STITCHING_STATUS_LABELS[s]}</option>
                               ))}
                             </select>
                           </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
