import { useCMS, cmsActions, type CMSReview } from "@/lib/cms";
import { Star, Pin, Eye, EyeOff, Trash2, Check, X } from "lucide-react";
import { useState } from "react";
import type { ToastFn } from "@/routes/admin";

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1,2,3,4,5].map(s => (
        <Star key={s} className={`w-3 h-3 ${s <= rating ? "text-gold fill-gold" : "text-border"}`} />
      ))}
    </div>
  );
}

export function AdminReviews({ showToast }: { showToast: ToastFn }) {
  const { cms } = useCMS();
  const [addForm, setAddForm] = useState(false);
  const [newReview, setNewReview] = useState<Omit<CMSReview, "id">>({
    name: "", rating: 5, text: "", product: "", verified: true, visible: true, pinned: false, date: new Date().toISOString().slice(0, 10),
  });
  const [replyId, setReplyId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");

  const saveReply = (id: string) => {
    cmsActions.updateReview(id, { reply: replyText });
    showToast("Reply saved.");
    setReplyId(null);
    setReplyText("");
  };

  const addReview = () => {
    if (!newReview.name.trim() || !newReview.text.trim()) {
      showToast("Name and review text are required.", "error");
      return;
    }
    cmsActions.addReview(newReview);
    showToast("Review added.");
    setAddForm(false);
    setNewReview({ name: "", rating: 5, text: "", product: "", verified: true, visible: true, pinned: false, date: new Date().toISOString().slice(0, 10) });
  };

  const visible = cms.reviews.filter(r => r.visible).length;
  const pinned = cms.reviews.filter(r => r.pinned).length;

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="font-display text-2xl">Reviews</h1>
          <p className="text-xs text-muted-foreground mt-0.5">{cms.reviews.length} total · {visible} visible · {pinned} pinned</p>
        </div>
        <button onClick={() => setAddForm(!addForm)} className="btn-gold flex items-center gap-2">
          <Star className="w-4 h-4" /> Add Review
        </button>
      </div>

      {addForm && (
        <div className="border border-gold/30 bg-card p-5 space-y-4">
          <h3 className="font-display text-lg">Add Customer Review</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] text-gold mb-1.5">Customer Name *</label>
              <input value={newReview.name} onChange={e => setNewReview(n => ({ ...n, name: e.target.value }))}
                className="w-full bg-background border border-border px-3 py-2.5 text-sm outline-none focus:border-gold" />
            </div>
            <div>
              <label className="block text-[10px] text-gold mb-1.5">Rating *</label>
              <div className="flex gap-2 mt-1">
                {[1,2,3,4,5].map(s => (
                  <button key={s} type="button" onClick={() => setNewReview(n => ({ ...n, rating: s }))}>
                    <Star className={`w-6 h-6 ${s <= newReview.rating ? "text-gold fill-gold" : "text-border"}`} />
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div>
            <label className="block text-[10px] text-gold mb-1.5">Review Text *</label>
            <textarea rows={3} value={newReview.text} onChange={e => setNewReview(n => ({ ...n, text: e.target.value }))}
              className="w-full bg-background border border-border px-3 py-2.5 text-sm outline-none focus:border-gold resize-none" />
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] text-gold mb-1.5">Product (optional)</label>
              <input value={newReview.product ?? ""} onChange={e => setNewReview(n => ({ ...n, product: e.target.value }))}
                placeholder="e.g. Kasavu Bridal Set"
                className="w-full bg-background border border-border px-3 py-2.5 text-sm outline-none focus:border-gold" />
            </div>
            <div>
              <label className="block text-[10px] text-gold mb-1.5">Date</label>
              <input type="date" value={newReview.date} onChange={e => setNewReview(n => ({ ...n, date: e.target.value }))}
                className="w-full bg-background border border-border px-3 py-2.5 text-sm outline-none focus:border-gold" />
            </div>
          </div>
          <div className="flex gap-3">
            <button onClick={() => setAddForm(false)} className="btn-ghost-gold flex-1">Cancel</button>
            <button onClick={addReview} className="btn-gold flex-1">Add Review</button>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {cms.reviews.length === 0 && (
          <div className="text-center py-12 border border-dashed border-border text-sm text-muted-foreground">No reviews yet.</div>
        )}
        {[...cms.reviews].sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0) || new Date(b.date).getTime() - new Date(a.date).getTime())
          .map(review => (
          <div key={review.id} className={`border border-border bg-card p-4 space-y-3 ${!review.visible ? "opacity-50" : ""}`}>
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="font-medium text-ivory text-sm">{review.name}</span>
                  <Stars rating={review.rating} />
                  {review.verified && <span className="text-[8px] px-1.5 py-0.5 bg-green-500/20 text-green-400 border border-green-500/30">VERIFIED</span>}
                  {review.pinned && <span className="text-[8px] px-1.5 py-0.5 bg-gold/20 text-gold border border-gold/30">PINNED</span>}
                  <span className="text-[10px] text-muted-foreground">{review.date}</span>
                </div>
                {review.product && <div className="text-xs text-gold mt-0.5">Re: {review.product}</div>}
                <p className="text-sm text-muted-foreground mt-2">{review.text}</p>
                {review.reply && (
                  <div className="mt-2 border-l-2 border-gold/40 pl-3">
                    <div className="text-[10px] text-gold">Rassa Boutique replied:</div>
                    <div className="text-xs text-muted-foreground">{review.reply}</div>
                  </div>
                )}
                {replyId === review.id && (
                  <div className="mt-3 flex gap-2">
                    <textarea rows={2} value={replyText} onChange={e => setReplyText(e.target.value)}
                      placeholder="Write a reply..."
                      className="flex-1 bg-background border border-border px-3 py-2 text-sm outline-none focus:border-gold resize-none" />
                    <div className="flex flex-col gap-1">
                      <button onClick={() => saveReply(review.id)} className="w-8 h-8 flex items-center justify-center bg-gold/20 border border-gold/40 text-gold hover:bg-gold/30 transition-colors">
                        <Check className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => setReplyId(null)} className="w-8 h-8 flex items-center justify-center border border-border text-muted-foreground hover:text-red-400 transition-colors">
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <button onClick={() => cmsActions.updateReview(review.id, { pinned: !review.pinned })} title={review.pinned ? "Unpin" : "Pin"}
                  className={`w-8 h-8 flex items-center justify-center transition-colors ${review.pinned ? "text-gold" : "text-muted-foreground hover:text-gold"}`}>
                  <Pin className="w-3.5 h-3.5" />
                </button>
                <button onClick={() => cmsActions.updateReview(review.id, { visible: !review.visible })} title={review.visible ? "Hide" : "Show"}
                  className="w-8 h-8 flex items-center justify-center text-muted-foreground hover:text-gold transition-colors">
                  {review.visible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                </button>
                <button onClick={() => { setReplyId(review.id); setReplyText(review.reply ?? ""); }}
                  className="text-[9px] px-2 py-1 border border-border text-muted-foreground hover:text-gold hover:border-gold/40 transition-colors">
                  Reply
                </button>
                <button onClick={() => { cmsActions.deleteReview(review.id); showToast("Review deleted.", "error"); }}
                  className="w-8 h-8 flex items-center justify-center text-muted-foreground hover:text-red-400 transition-colors">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
