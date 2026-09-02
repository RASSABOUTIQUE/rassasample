import { useState } from "react";
import { useOrders, orderActions, STATUS_LABELS, type Order, type OrderStatus } from "@/lib/orders";
import { inr } from "@/lib/products";
import { Search, ChevronDown, ChevronUp, MessageCircle, Printer } from "lucide-react";
import type { ToastFn } from "@/routes/admin";

const STATUS_COLORS: Record<OrderStatus, string> = {
  placed: "text-blue-400 bg-blue-400/10 border-blue-400/30",
  confirmed: "text-yellow-400 bg-yellow-400/10 border-yellow-400/30",
  processing: "text-purple-400 bg-purple-400/10 border-purple-400/30",
  shipped: "text-orange-400 bg-orange-400/10 border-orange-400/30",
  out_for_delivery: "text-orange-300 bg-orange-300/10 border-orange-300/30",
  delivered: "text-green-400 bg-green-400/10 border-green-400/30",
  cancelled: "text-red-400 bg-red-400/10 border-red-400/30",
  refunded: "text-pink-400 bg-pink-400/10 border-pink-400/30",
};

const ALL_STATUSES: OrderStatus[] = [
  "placed", "confirmed", "processing", "shipped",
  "out_for_delivery", "delivered", "cancelled", "refunded",
];

function printInvoice(order: Order) {
  const w = window.open("", "_blank", "width=800,height=600");
  if (!w) return;
  w.document.write(`
    <html><head><title>Invoice ${order.orderNo}</title>
    <style>
      body { font-family: Georgia, serif; padding: 40px; color: #111; }
      h1 { font-size: 28px; margin-bottom: 4px; }
      .gold { color: #B8941E; }
      table { width: 100%; border-collapse: collapse; margin-top: 20px; }
      th, td { border-bottom: 1px solid #ddd; padding: 10px; text-align: left; }
      th { background: #f9f6ef; }
      .total { font-size: 18px; font-weight: bold; }
      @media print { button { display: none; } }
    </style></head><body>
    <h1 class="gold">RASSA BOUTIQUE</h1>
    <p>Tax Invoice / Receipt</p>
    <hr />
    <p><strong>Order No:</strong> ${order.orderNo}</p>
    <p><strong>Date:</strong> ${new Date(order.createdAt).toLocaleDateString("en-IN", { dateStyle: "long" })}</p>
    <p><strong>Customer:</strong> ${order.customerName} · ${order.customerPhone}</p>
    <p><strong>Address:</strong> ${order.address}, ${order.city}, ${order.state} — ${order.pincode}</p>
    <p><strong>Payment:</strong> ${order.paymentMethod?.toUpperCase()}</p>
    <table>
      <tr><th>Item</th><th>Size</th><th>Qty</th><th>Rate</th><th>Amount</th></tr>
      ${order.items.map(i => `<tr><td>${i.name}</td><td>${i.size}</td><td>${i.quantity}</td><td>₹${i.price}</td><td>₹${i.price * i.quantity}</td></tr>`).join("")}
    </table>
    <br/>
    <p>Subtotal: ₹${order.subtotal}</p>
    ${order.discount ? `<p>Discount: -₹${order.discount}</p>` : ""}
    <p>Shipping: ${order.shippingCost === 0 ? "Free" : "₹" + order.shippingCost}</p>
    <p class="total">Total: ₹${order.total}</p>
    <br/><hr/>
    <p style="font-size:12px;">Thank you for shopping at Rassa Boutique, Kozhikode, Kerala.<br/>Returns within 7 days of delivery. WhatsApp: +91 96334 19902</p>
    <button onclick="window.print()">🖨️ Print Invoice</button>
    </body></html>
  `);
  w.document.close();
  w.focus();
}

export function AdminOrdersSection({ showToast }: { showToast: ToastFn }) {
  const { orders } = useOrders();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | OrderStatus>("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [editingStatus, setEditingStatus] = useState<{ id: string; val: OrderStatus } | null>(null);

  const filtered = orders.filter(o => {
    const q = search.toLowerCase();
    const matchSearch = !search || o.orderNo.toLowerCase().includes(q) || o.customerName.toLowerCase().includes(q) || o.customerPhone.includes(q);
    const matchStatus = statusFilter === "all" || o.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const saveStatus = (orderId: string) => {
    if (!editingStatus || editingStatus.id !== orderId) return;
    orderActions.updateStatus(orderId, editingStatus.val);
    showToast("Order status updated.");
    setEditingStatus(null);
  };

  const whatsappCustomer = (order: Order) => {
    const msg = `Hello ${order.customerName},\n\nYour Rassa Boutique order *${order.orderNo}* is now *${STATUS_LABELS[order.status]}*.\n\nThank you for shopping with us!\n— Rassa Boutique, Kozhikode`;
    window.open(`https://wa.me/${order.customerPhone.replace(/\D/g, "")}?text=${encodeURIComponent(msg)}`, "_blank");
  };

  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-display text-2xl">Orders</h1>
        <p className="text-xs text-muted-foreground mt-0.5">{orders.length} total orders</p>
      </div>

      <div className="flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search order, customer, phone..."
            className="w-full bg-card border border-border pl-9 pr-4 py-2.5 text-sm outline-none focus:border-gold transition-colors" />
        </div>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value as typeof statusFilter)}
          className="bg-card border border-border px-3 py-2.5 text-sm outline-none focus:border-gold transition-colors">
          <option value="all">All Statuses</option>
          {ALL_STATUSES.map(s => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
        </select>
      </div>

      <div className="border border-border bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-background">
                {["Order", "Customer", "Items", "Total", "Payment", "Status", "Date", ""].map(h => (
                  <th key={h} className={`px-4 py-3 text-[10px] tracking-luxury uppercase text-gold font-normal text-left ${["Payment", "Date"].includes(h) ? "hidden md:table-cell" : ""}`}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr><td colSpan={8} className="text-center py-12 text-muted-foreground text-sm">No orders found.</td></tr>
              )}
              {filtered.map(order => (
                <>
                  <tr key={order.orderNo}
                    className={`border-b border-border hover:bg-gold/5 transition-colors cursor-pointer ${expandedId === order.id ? "bg-gold/5" : ""}`}
                    onClick={() => setExpandedId(expandedId === order.id ? null : order.id)}>
                    <td className="px-4 py-3 font-mono text-xs text-gold">{order.orderNo}</td>
                    <td className="px-4 py-3">
                      <div className="text-ivory">{order.customerName}</div>
                      <div className="text-xs text-muted-foreground">{order.customerPhone}</div>
                    </td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">
                      <div className="space-y-0.5">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="truncate max-w-[200px]">
                            {item.name} ×{item.quantity}
                          </div>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-3 font-medium text-ivory">{inr(order.total)}</td>
                    <td className="px-4 py-3 text-xs text-muted-foreground hidden md:table-cell capitalize">{order.paymentMethod}</td>
                    <td className="px-4 py-3">
                      <span className={`text-[9px] tracking-luxury uppercase px-2 py-1 border ${STATUS_COLORS[order.status] ?? "text-muted-foreground"}`}>
                        {STATUS_LABELS[order.status]}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-muted-foreground hidden md:table-cell">
                      {new Date(order.createdAt).toLocaleDateString("en-IN")}
                    </td>
                    <td className="px-4 py-3">
                      {expandedId === order.id ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
                    </td>
                  </tr>

                  {/* Expanded row */}
                  {expandedId === order.id && (
                    <tr key={`${order.orderNo}-expanded`} className="border-b border-border">
                      <td colSpan={8} className="px-4 py-4 bg-card">
                        <div className="grid md:grid-cols-2 gap-6">
                          {/* Items */}
                          <div>
                            <div className="text-[10px] tracking-luxury uppercase text-gold mb-3">Items Ordered</div>
                            <div className="space-y-2">
                              {order.items.map((item, i) => (
                                <div key={i} className="flex gap-3 text-sm pb-3 border-b border-border/50 last:border-0 last:pb-0">
                                  {item.image && <img src={item.image} alt="" className="w-12 h-16 object-cover border border-border shrink-0" />}
                                  <div className="flex-1 min-w-0">
                                    <div className="text-ivory font-medium truncate">• {item.name}</div>
                                    <div className="text-xs text-muted-foreground mt-1 space-y-0.5">
                                      <div>Size : {item.size || "N/A"}</div>
                                      <div>Qty : {item.quantity}</div>
                                      <div>Price : {inr(item.price)}</div>
                                    </div>
                                  </div>
                                  <div className="text-gold shrink-0 font-medium">{inr(item.price * item.quantity)}</div>
                                </div>
                              ))}
                            </div>
                            <div className="mt-3 pt-3 border-t border-border space-y-1 text-xs text-muted-foreground">
                              <div className="flex justify-between"><span>Subtotal</span><span>{inr(order.subtotal)}</span></div>
                              {order.discount > 0 && <div className="flex justify-between text-green-400"><span>Discount</span><span>-{inr(order.discount)}</span></div>}
                              <div className="flex justify-between"><span>Shipping</span><span>{order.shippingCost === 0 ? "Free" : inr(order.shippingCost)}</span></div>
                              <div className="flex justify-between font-medium text-ivory text-sm pt-1 border-t border-border"><span>Total</span><span>{inr(order.total)}</span></div>
                            </div>
                          </div>

                          {/* Details + actions */}
                          <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <div className="text-[10px] tracking-luxury uppercase text-gold mb-2">Customer Details</div>
                                <div className="text-sm text-ivory">{order.customerName}</div>
                                <div className="text-xs text-muted-foreground">{order.customerPhone}</div>
                                {order.customerEmail && <div className="text-xs text-muted-foreground">{order.customerEmail}</div>}
                              </div>
                              <div>
                                <div className="text-[10px] tracking-luxury uppercase text-gold mb-2">Delivery Address</div>
                                <div className="text-xs text-muted-foreground">{order.address}</div>
                                <div className="text-xs text-muted-foreground">{order.city}, {order.state} — {order.pincode}</div>
                              </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <div className="text-[10px] tracking-luxury uppercase text-gold mb-2">Payment Method</div>
                                <div className="text-sm text-ivory capitalize">{order.paymentMethod === 'cod' ? 'Cash on Delivery' : order.paymentMethod}</div>
                              </div>
                              <div>
                                <div className="text-[10px] tracking-luxury uppercase text-gold mb-2">Payment Status</div>
                                <div className={`text-xs capitalize ${order.paymentStatus === 'paid' ? 'text-green-400' : 'text-yellow-400'}`}>{order.paymentStatus}</div>
                              </div>
                            </div>
                            {order.razorpayPaymentId && (
                              <div>
                                <div className="text-[10px] tracking-luxury uppercase text-gold mb-2">Transaction ID</div>
                                <div className="text-xs text-muted-foreground font-mono">{order.razorpayPaymentId}</div>
                              </div>
                            )}
                            <div>
                              <div className="text-[10px] tracking-luxury uppercase text-gold mb-2">Update Status</div>
                              <div className="flex gap-2">
                                <select
                                  value={editingStatus?.id === order.id ? editingStatus.val : order.status}
                                  onChange={e => setEditingStatus({ id: order.id, val: e.target.value as OrderStatus })}
                                  className="flex-1 bg-background border border-border px-3 py-2 text-sm outline-none focus:border-gold transition-colors">
                                  {ALL_STATUSES.map(s => (
                                    <option key={s} value={s}>{STATUS_LABELS[s]}</option>
                                  ))}
                                </select>
                                {editingStatus?.id === order.id && (
                                  <button onClick={() => saveStatus(order.id)} className="btn-gold px-4 py-2 text-sm">Save</button>
                                )}
                              </div>
                            </div>
                            <div className="flex flex-wrap gap-2">
                              <button onClick={() => whatsappCustomer(order)}
                                className="flex items-center gap-1.5 px-3 py-2 border border-green-500/50 text-green-400 text-xs hover:bg-green-500/10 transition-colors">
                                <MessageCircle className="w-3.5 h-3.5" /> WhatsApp Customer
                              </button>
                              <button onClick={() => printInvoice(order)}
                                className="flex items-center gap-1.5 px-3 py-2 border border-border text-muted-foreground text-xs hover:text-gold hover:border-gold/40 transition-colors">
                                <Printer className="w-3.5 h-3.5" /> Print Invoice
                              </button>
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
