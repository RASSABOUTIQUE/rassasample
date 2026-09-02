import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useReveal } from "@/lib/use-reveal";
import { useCart } from "@/lib/cart";
import { inr } from "@/lib/products";
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight, Tag, Truck } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/cart")({
  head: () => ({
    meta: [
      { title: "Cart — Rassa Boutique" },
      { name: "description", content: "Your Rassa Boutique shopping cart." },
    ],
  }),
  component: CartPage,
});

function CartPage() {
  useReveal();
  const { items, subtotal, removeFromCart, setQty } = useCart();
  const navigate = useNavigate();
  const [coupon, setCoupon] = useState("");
  const [couponMsg, setCouponMsg] = useState("");

  const shipping = subtotal >= 2000 ? 0 : 80;
  const total = subtotal + shipping;

  const applyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponMsg("Coupon codes coming soon! WhatsApp us for special offers.");
  };

  if (items.length === 0) {
    return (
      <div className="pt-32 pb-24 min-h-screen flex items-center justify-center">
        <div className="text-center px-6">
          <ShoppingBag className="w-16 h-16 text-gold/30 mx-auto mb-6" />
          <h1 className="font-display text-4xl text-ivory">Your Cart is Empty</h1>
          <p className="mt-3 text-muted-foreground">Add some beautiful outfits to get started.</p>
          <Link to="/shop" className="btn-gold mt-8 inline-flex items-center gap-2">
            <ShoppingBag className="w-4 h-4" />
            Browse Collections
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-28 pb-24">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="mb-8">
          <span className="divider-gold text-[10px] tracking-luxury uppercase">Your Selection</span>
          <h1 className="mt-3 font-display text-4xl md:text-5xl">
            Shopping <span className="italic text-gradient-gold">Cart</span>
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">{items.length} item{items.length > 1 ? "s" : ""}</p>
        </div>

        <div className="grid lg:grid-cols-12 gap-10">
          {/* Cart items */}
          <div className="lg:col-span-7 space-y-4">
            {items.map((item) => (
              <div key={`${item.productId}-${item.size}-${item.color}`} className="flex gap-4 p-4 border border-border bg-card">
                {/* Image */}
                <Link to="/product/$id" params={{ id: item.productId }} className="w-24 aspect-[3/4] overflow-hidden bg-background shrink-0">
                  <img src={item.image} alt={item.name} loading="lazy" className="w-full h-full object-cover" />
                </Link>
                {/* Details */}
                <div className="flex-1 min-w-0">
                  <Link to="/product/$id" params={{ id: item.productId }}>
                    <h3 className="font-serif text-base leading-snug hover:text-gold transition-colors line-clamp-2">
                      {item.name}
                    </h3>
                  </Link>
                  <div className="mt-1.5 flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted-foreground">
                    <span>Size: {item.size}</span>
                    <span>Colour: {item.color}</span>
                  </div>
                  <div className="mt-3 flex items-center justify-between flex-wrap gap-3">
                    {/* Qty */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setQty(item.productId, item.size, item.color, item.quantity - 1)}
                        className="w-7 h-7 border border-border flex items-center justify-center hover:border-gold transition-colors"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-6 text-center text-sm">{item.quantity}</span>
                      <button
                        onClick={() => setQty(item.productId, item.size, item.color, item.quantity + 1)}
                        className="w-7 h-7 border border-border flex items-center justify-center hover:border-gold transition-colors"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="font-display text-lg text-gold">{inr(item.price * item.quantity)}</span>
                      <button
                        onClick={() => removeFromCart(item.productId, item.size, item.color)}
                        className="text-muted-foreground hover:text-red-400 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Continue shopping */}
            <Link to="/shop" className="inline-flex items-center gap-2 text-xs tracking-luxury uppercase text-gold hover:text-ivory transition-colors mt-4">
              ← Continue Shopping
            </Link>
          </div>

          {/* Order summary */}
          <div className="lg:col-span-5">
            <div className="border border-border bg-card p-6 sticky top-28">
              <h2 className="font-display text-2xl pb-5 border-b border-border mb-5">Order Summary</h2>

              <div className="space-y-3 text-sm mb-5">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal ({items.reduce((s, i) => s + i.quantity, 0)} items)</span>
                  <span>{inr(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className={shipping === 0 ? "text-green-500" : ""}>
                    {shipping === 0 ? "Free" : inr(shipping)}
                  </span>
                </div>
                {subtotal < 2000 && (
                  <p className="text-xs text-muted-foreground bg-card border border-border/50 p-2">
                    Add {inr(2000 - subtotal)} more to get free delivery
                  </p>
                )}
              </div>

              {/* Coupon */}
              <form onSubmit={applyCoupon} className="flex gap-2 mb-5">
                <input
                  value={coupon}
                  onChange={(e) => setCoupon(e.target.value)}
                  placeholder="Coupon code"
                  className="flex-1 bg-background border border-border px-3 py-2.5 text-sm outline-none focus:border-gold transition-colors"
                />
                <button type="submit" className="px-4 border border-gold text-gold text-xs tracking-luxury uppercase hover:bg-gold hover:text-onyx transition-all">
                  <Tag className="w-3.5 h-3.5" />
                </button>
              </form>
              {couponMsg && <p className="text-xs text-muted-foreground mb-4 -mt-3">{couponMsg}</p>}

              <div className="flex justify-between font-medium text-lg pb-5 border-b border-border mb-5">
                <span className="font-display">Total</span>
                <span className="font-display text-gold">{inr(total)}</span>
              </div>

              <button
                onClick={() => navigate({ to: "/checkout" })}
                className="btn-gold w-full flex items-center justify-center gap-2"
              >
                Proceed to Checkout
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="mt-4 flex items-center gap-2 justify-center text-xs text-muted-foreground">
                <Truck className="w-3.5 h-3.5 text-gold" />
                <span>Free delivery above ₹2,000 · Secure checkout</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
