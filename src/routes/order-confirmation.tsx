import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { CheckCircle, Package, MessageCircle, ShoppingBag, Copy } from "lucide-react";
import { useCart } from "@/lib/cart";

export const Route = createFileRoute("/order-confirmation")({
  head: () => ({
    meta: [
      { title: "Order Placed — Rassa Boutique" },
      { name: "description", content: "Your Rassa Boutique order has been placed successfully." },
    ],
  }),
  component: OrderConfirmationPage,
});

interface OrderData {
  orderNo: string;
  items: { name: string; size: string; color: string; quantity: number; price: number }[];
  subtotal: number;
  shipping: string;
  name: string;
  phone: string;
  address: string;
  paymentMethod: string;
}

function OrderConfirmationPage() {
  const { clearCart } = useCart();
  const navigate = useNavigate();
  const [order, setOrder] = useState<OrderData | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const raw = sessionStorage.getItem("rassa_last_order");
    if (!raw) {
      navigate({ to: "/" });
      return;
    }
    try {
      setOrder(JSON.parse(raw) as OrderData);
    } catch {
      navigate({ to: "/" });
    }
    // Clear cart after confirmation
    clearCart();
  }, []);

  const copyOrderNo = () => {
    if (!order) return;
    navigator.clipboard.writeText(order.orderNo).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  if (!order) return null;

  const inr = (n: number) =>
    new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);

  const deliveryDate = new Date();
  deliveryDate.setDate(deliveryDate.getDate() + 5);
  const estimatedDelivery = deliveryDate.toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  return (
    <div className="pt-32 pb-24">
      <div className="max-w-2xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="mx-auto w-16 h-16 rounded-full bg-gold/15 border border-gold flex items-center justify-center mb-5">
            <CheckCircle className="w-8 h-8 text-gold" />
          </div>
          <h1 className="font-display text-4xl text-ivory">
            Order <span className="italic text-gradient-gold">Confirmed!</span>
          </h1>
          <p className="mt-3 text-base text-muted-foreground">
            Thank you, {order.name}. Your order has been placed successfully.
          </p>
        </div>

        {/* Order number */}
        <div className="p-5 border border-gold/40 bg-card mb-6 flex items-center justify-between">
          <div>
            <div className="text-[10px] tracking-luxury uppercase text-gold">Order Number</div>
            <div className="mt-1 font-display text-2xl text-ivory">{order.orderNo}</div>
          </div>
          <button onClick={copyOrderNo} className="text-muted-foreground hover:text-gold transition-colors flex items-center gap-1.5 text-xs">
            <Copy className="w-4 h-4" />
            {copied ? "Copied!" : "Copy"}
          </button>
        </div>

        {/* Order summary */}
        <div className="border border-border bg-card p-6 mb-6">
          <h2 className="font-display text-xl mb-5 pb-4 border-b border-border">Your Order</h2>
          <div className="space-y-4">
            {order.items.map((item, i) => (
              <div key={i} className="flex items-start justify-between gap-4 text-sm">
                <div>
                  <div className="font-medium text-ivory">{item.name}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">
                    Size: {item.size} · Colour: {item.color} · Qty: {item.quantity}
                  </div>
                </div>
                <div className="text-gold shrink-0">{inr(item.price * item.quantity)}</div>
              </div>
            ))}
          </div>
          <div className="mt-5 pt-4 border-t border-border space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Subtotal</span>
              <span>{inr(order.subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Shipping</span>
              <span>{order.shipping === "free" ? "Free" : order.shipping === "store-pickup" ? "Store Pickup" : "₹80"}</span>
            </div>
            <div className="flex justify-between font-medium text-gold">
              <span>Total Paid</span>
              <span>{inr(order.subtotal + (order.shipping === "standard" ? 80 : 0))}</span>
            </div>
          </div>
        </div>

        {/* Delivery details */}
        <div className="border border-border bg-card p-6 mb-6 space-y-3 text-sm">
          <div className="flex items-center gap-2 text-[10px] tracking-luxury uppercase text-gold pb-3 border-b border-border">
            <Package className="w-4 h-4" />
            Delivery Details
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Delivery Address</span>
            <span className="text-right max-w-[60%]">{order.address}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Estimated Delivery</span>
            <span className="text-gold">{estimatedDelivery}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Payment</span>
            <span>{order.paymentMethod === "cod" ? "Cash on Delivery" : order.paymentMethod}</span>
          </div>
        </div>

        {/* WhatsApp update + CTAs */}
        <div className="p-5 bg-gold/10 border border-gold/30 text-sm text-center mb-6">
          We'll send order updates to your WhatsApp (+91 {order.phone.replace("+91", "").trim()}).
          You can also WhatsApp us anytime with your order number.
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <a
            href={`https://wa.me/919633419902?text=Hello%20Rassa%20Boutique%2C%20I%20placed%20an%20order%20${encodeURIComponent(order.orderNo)}%20and%20would%20like%20an%20update.`}
            target="_blank"
            rel="noreferrer"
            className="btn-gold flex-1 text-center flex items-center justify-center gap-2"
          >
            <MessageCircle className="w-4 h-4" />
            WhatsApp for Updates
          </a>
          <Link to="/track-order" className="btn-ghost-gold flex-1 text-center flex items-center justify-center gap-2">
            <Package className="w-4 h-4" />
            Track Order
          </Link>
        </div>
        <div className="mt-4 text-center">
          <Link to="/shop" className="text-xs tracking-luxury uppercase text-gold border-b border-gold/50 pb-1 flex items-center justify-center gap-2 hover:text-ivory transition-colors">
            <ShoppingBag className="w-3.5 h-3.5" />
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
