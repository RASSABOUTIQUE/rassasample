import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Package, CheckCircle, Truck, Home, MessageCircle, Search } from "lucide-react";

export const Route = createFileRoute("/track-order")({
  head: () => ({
    meta: [
      { title: "Track Your Order — Rassa Boutique" },
      { name: "description", content: "Track your Rassa Boutique order status." },
    ],
  }),
  component: TrackOrderPage,
});

const steps = [
  { id: 1, icon: CheckCircle, label: "Order Placed", desc: "We received your order and are confirming details." },
  { id: 2, icon: Package, label: "Processing", desc: "Your items are being prepared and quality-checked." },
  { id: 3, icon: Truck, label: "Shipped", desc: "Your order is on its way to you." },
  { id: 4, icon: Home, label: "Delivered", desc: "Your order has been delivered successfully." },
];

function TrackOrderPage() {
  const [orderNo, setOrderNo] = useState("");
  const [phone, setPhone] = useState("");
  const [searched, setSearched] = useState(false);
  const [foundOrder, setFoundOrder] = useState<any>(null);

  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setSearched(true);
    setIsSearching(true);
    try {
      const { orderService } = await import("@/services/OrderService");
      const order = await orderService.getByOrderNo(orderNo);
      // Verify phone number for privacy
      if (order && order.customerPhone === phone) {
        setFoundOrder(order);
      } else {
        setFoundOrder(null);
      }
    } catch (error) {
      console.error(error);
      setFoundOrder(null);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="pt-32 pb-24">
      <div className="max-w-2xl mx-auto px-6">
        <div className="text-center mb-12">
          <span className="divider-gold text-[10px] tracking-luxury uppercase">Order Status</span>
          <h1 className="mt-4 font-display text-4xl md:text-5xl">
            Track Your <span className="italic text-gradient-gold">Order</span>
          </h1>
          <p className="mt-4 text-sm text-muted-foreground">
            Enter your order number and phone number to see your order status.
          </p>
        </div>

        <form
          onSubmit={handleSearch}
          className="p-7 border border-border bg-card space-y-4 mb-10"
        >
          <div>
            <label className="block text-[10px] tracking-luxury uppercase text-gold mb-2">Order Number</label>
            <input
              required
              value={orderNo}
              onChange={(e) => setOrderNo(e.target.value.trim())}
              placeholder="e.g. RB12345678"
              className="w-full bg-background border border-border px-4 py-3 text-sm outline-none focus:border-gold transition-colors"
            />
          </div>
          <div>
            <label className="block text-[10px] tracking-luxury uppercase text-gold mb-2">Phone Number</label>
            <input
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value.trim())}
              placeholder="+91 XXXXX XXXXX"
              className="w-full bg-background border border-border px-4 py-3 text-sm outline-none focus:border-gold transition-colors"
            />
          </div>
          <button 
            disabled={isSearching}
            className="btn-gold w-full flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <Search className="w-4 h-4" />
            {isSearching ? "Searching..." : "Track Order"}
          </button>
        </form>

        {searched && !isSearching && (
          <div className="border border-border bg-card p-7">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] tracking-luxury uppercase text-gold">Order</span>
              <span className="font-display text-lg text-ivory">{orderNo}</span>
            </div>

            {!foundOrder ? (
              <div className="py-8 text-center">
                <Package className="w-10 h-10 text-gold/30 mx-auto mb-3" />
                <h3 className="text-ivory font-display text-xl">Order Not Found</h3>
                <p className="text-sm text-muted-foreground mt-2">
                  We couldn't find an order with that number and phone combination.
                </p>
              </div>
            ) : (
              <>
                <p className="text-xs text-muted-foreground mb-8">
                  For live updates, WhatsApp us with your order number.
                </p>

                {/* Timeline */}
                <div className="space-y-0">
                  {steps.map((step, idx) => {
                    const statusTimeline = ["placed", "processing", "shipped", "delivered"];
                    let currentStatusIdx = statusTimeline.indexOf(foundOrder.status);
                    if (foundOrder.status === "confirmed") currentStatusIdx = 0;
                    if (foundOrder.status === "out_for_delivery") currentStatusIdx = 2;
                    
                    const isActive = idx === currentStatusIdx;
                    const isDone = idx < currentStatusIdx;
                    
                    return (
                      <div key={step.id} className="flex gap-4">
                        <div className="flex flex-col items-center">
                          <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center border shrink-0 ${
                              isDone
                                ? "bg-gold border-gold text-onyx"
                                : isActive
                                  ? "border-gold text-gold"
                                  : "border-border text-border"
                            }`}
                          >
                            <step.icon className="w-4 h-4" />
                          </div>
                          {idx < steps.length - 1 && (
                            <div className={`w-px flex-1 my-1 ${isDone || isActive ? "bg-gold/40" : "bg-border"}`} />
                          )}
                        </div>
                        <div className="pb-7">
                          <div
                            className={`font-sans text-sm font-medium ${isDone || isActive ? "text-gold" : "text-muted-foreground"}`}
                          >
                            {step.label}
                            {isActive && <span className="ml-2 text-[10px] tracking-luxury uppercase bg-gold/20 text-gold px-2 py-0.5">Current</span>}
                          </div>
                          <div className="mt-1 text-xs text-muted-foreground">{step.desc}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            )}

            <div className="mt-6 pt-5 border-t border-border flex flex-col sm:flex-row gap-3">
              <a
                href={`https://wa.me/919633419902?text=Hello%20Rassa%20Boutique%2C%20I'd%20like%20to%20track%20my%20order%20${encodeURIComponent(orderNo)}.`}
                target="_blank"
                rel="noreferrer"
                className="btn-gold flex-1 text-center flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-4 h-4" />
                WhatsApp for Live Update
              </a>
              <Link to="/shop" className="btn-ghost-gold flex-1 text-center">Continue Shopping</Link>
            </div>
          </div>
        )}

        <div className="mt-8 text-center text-sm text-muted-foreground">
          Don't have an order number?{" "}
          <a
            href="https://wa.me/919633419902"
            target="_blank"
            rel="noreferrer"
            className="text-gold underline-offset-2 hover:underline"
          >
            WhatsApp us
          </a>{" "}
          for help.
        </div>
      </div>
    </div>
  );
}
