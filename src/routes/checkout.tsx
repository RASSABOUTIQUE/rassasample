import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useCart } from "@/lib/cart";
import { useAuth } from "@/lib/auth";
import { orderActions, generateOrderNo, estimateDelivery } from "@/lib/orders";
import { inr } from "@/lib/products";
import { useState, useEffect } from "react";
import {
  CheckCircle,
  ShieldCheck,
  Truck,
  CreditCard,
  Smartphone,
  Package,
  Lock,
  ChevronRight,
} from "lucide-react";

export const Route = createFileRoute("/checkout")({
  head: () => ({
    meta: [
      { title: "Checkout — Rassa Boutique" },
      { name: "description", content: "Checkout securely at Rassa Boutique." },
    ],
  }),
  component: CheckoutPage,
});

// ─── Razorpay types ──────────────────────────────────────────────────────────
declare global {
  interface Window {
    Razorpay: new (opts: Record<string, unknown>) => { open: () => void };
  }
}

function loadRazorpay(): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window !== "undefined" && window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

// Razorpay key — replace with your real key from razorpay.com/dashboard
const RAZORPAY_KEY = import.meta.env.VITE_RAZORPAY_KEY ?? "rzp_test_REPLACE_WITH_YOUR_KEY";

// ─── Step types ──────────────────────────────────────────────────────────────
type Step = "details" | "shipping" | "payment" | "review";

const STEPS: { id: Step; label: string }[] = [
  { id: "details", label: "Details" },
  { id: "shipping", label: "Shipping" },
  { id: "payment", label: "Payment" },
  { id: "review", label: "Review" },
];

// ─── Small field component ────────────────────────────────────────────────────
function InputField({
  label,
  name,
  type = "text",
  required,
  placeholder,
  value,
  onChange,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label className="block text-[10px] tracking-luxury uppercase text-gold mb-2">
        {label}
        {required && <span className="text-red-400 ml-0.5">*</span>}
      </label>
      <input
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-background border border-border px-4 py-3 text-sm outline-none focus:border-gold transition-colors"
      />
    </div>
  );
}

// ─── Checkout page ────────────────────────────────────────────────────────────
function CheckoutPage() {
  const { items, subtotal, itemCount, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState<Step>("details");
  const [processing, setProcessing] = useState(false);

  const [form, setForm] = useState({
    name: user?.name ?? "",
    phone: user?.phone ?? "",
    email: user?.email ?? "",
    address: user?.defaultAddress?.address ?? "",
    city: user?.defaultAddress?.city ?? "Kozhikode",
    state: user?.defaultAddress?.state ?? "Kerala",
    pincode: user?.defaultAddress?.pincode ?? "",
    shippingMethod: "standard",
    paymentMethod: "cod",
    couponCode: "",
    couponDiscount: 0,
  });

  const set = (key: keyof typeof form) => (val: string) =>
    setForm((f) => ({ ...f, [key]: val }));

  const handlePincodeChange = (val: string) => {
    setForm((f) => {
      const updated = { ...f, pincode: val };
      if (val.length >= 3 && val.length <= 6) {
        const prefix = val.substring(0, 3);
        let city = "";
        if (prefix === "673") city = "Kozhikode";
        else if (prefix === "670") city = "Kannur";
        else if (prefix === "671") city = "Kasaragod";
        else if (prefix === "676") city = "Malappuram";
        else if (prefix === "679") city = "Palakkad";
        else if (prefix === "680") city = "Thrissur";
        else if (prefix === "682" || prefix === "683") city = "Ernakulam";
        else if (prefix === "686") city = "Kottayam";
        else if (prefix === "689") city = "Pathanamthitta";
        else if (prefix === "688") city = "Alappuzha";
        else if (prefix === "691") city = "Kollam";
        else if (prefix === "695") city = "Thiruvananthapuram";
        else if (prefix === "685") city = "Idukki";

        if (city) {
          updated.city = city;
          updated.state = "Kerala";
        }
      }
      return updated;
    });
  };

  // Autofill from user profile if they log in mid-session
  useEffect(() => {
    if (user) {
      setForm((f) => ({
        ...f,
        name: f.name || user.name,
        phone: f.phone || user.phone,
        email: f.email || user.email,
        address: f.address || user.defaultAddress?.address || "",
        city: user.defaultAddress?.city ? user.defaultAddress.city : f.city,
        state: user.defaultAddress?.state ? user.defaultAddress.state : f.state,
        pincode: f.pincode || user.defaultAddress?.pincode || "",
      }));
    }
  }, [user]);

  if (itemCount === 0) {
    return (
      <div className="pt-32 pb-24 min-h-screen flex items-center justify-center text-center px-6">
        <div>
          <h1 className="font-display text-4xl">Your cart is empty</h1>
          <Link to="/shop" className="btn-gold mt-6 inline-block">Shop Now</Link>
        </div>
      </div>
    );
  }

  const shippingCost =
    form.shippingMethod === "store-pickup"
      ? 0
      : form.shippingMethod === "express"
        ? 150
        : subtotal >= 2000
          ? 0
          : 80;

  const total = subtotal + shippingCost - form.couponDiscount;
  const currentIdx = STEPS.findIndex((s) => s.id === step);

  // ─── Coupon logic ──────────────────────────────────────────────────────────
  const COUPONS: Record<string, number> = {
    RASSA10: 0.1,
    WELCOME15: 0.15,
    ONAM20: 0.2,
  };

  const applyCoupon = () => {
    const code = form.couponCode.trim().toUpperCase();
    const discount = COUPONS[code];
    if (discount) {
      setForm((f) => ({ ...f, couponDiscount: Math.round(subtotal * discount) }));
    }
  };

  const handleRazorpayPayment = async () => {
    setProcessing(true);
    const ok = await loadRazorpay();
    if (!ok) {
      alert("Failed to load payment gateway. Please try COD or WhatsApp payment.");
      setProcessing(false);
      return;
    }

    const orderNo = generateOrderNo();

    let razorpayOrderId = "";
    try {
      const { createRazorpayOrder } = await import("@/lib/payment");
      const result = await createRazorpayOrder({ data: { amount: total, receipt: orderNo } });
      if (result.success && result.orderId) {
        razorpayOrderId = result.orderId;
      } else {
        throw new Error("Failed to get orderId");
      }
    } catch (err: any) {
      console.error(err);
      alert("Failed to initialize payment gateway. Please use COD or WhatsApp.");
      setProcessing(false);
      return;
    }

    const options = {
      key: RAZORPAY_KEY,
      amount: total * 100, // paise
      currency: "INR",
      name: "Rassa Boutique",
      description: `Order ${orderNo}`,
      image: "/favicon.ico",
      order_id: razorpayOrderId,
      prefill: {
        name: form.name,
        email: form.email,
        contact: form.phone,
      },
      notes: {
        order_number: orderNo,
        address: `${form.address}, ${form.city}, ${form.state} — ${form.pincode}`,
      },
      theme: { color: "#D4AF37" },
      modal: { backdropclose: false, escape: false },
      handler: async (response: { razorpay_payment_id: string; razorpay_order_id: string; razorpay_signature: string }) => {
        try {
          const { verifyRazorpaySignature } = await import("@/lib/payment");
          const verifyResult = await verifyRazorpaySignature({
            data: {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            }
          });
          if (verifyResult.success) {
            saveAndRedirect(orderNo, "razorpay", "paid", response.razorpay_payment_id);
          } else {
            alert("Payment verification failed! If money was deducted, contact support.");
            setProcessing(false);
          }
        } catch (e) {
          console.error("Verification error", e);
          alert("Payment verification failed! If money was deducted, contact support.");
          setProcessing(false);
        }
      },
    };

    try {
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch {
      alert("Payment gateway error. Please use COD or WhatsApp.");
      setProcessing(false);
    }
  };

  // ─── Place order (COD / WhatsApp) ──────────────────────────────────────────
  const placeOrder = async () => {
    if (form.paymentMethod === "razorpay") {
      await handleRazorpayPayment();
      return;
    }

    setProcessing(true);
    const orderNo = generateOrderNo();
    saveAndRedirect(orderNo, form.paymentMethod, "pending");
  };

  // ─── Save order + redirect ─────────────────────────────────────────────────
  const saveAndRedirect = async (
    orderNo: string,
    paymentMethod: string,
    paymentStatus: "pending" | "paid",
    razorpayPaymentId?: string,
  ) => {
    setProcessing(true);
    try {
      const newOrder = {
        id: `ord_${Date.now()}`,
        orderNo,
        userId: user?.id,
        customerName: form.name,
        customerPhone: form.phone,
        customerEmail: form.email,
        items: items.map((i) => ({
          productId: i.productId,
          name: i.name,
          price: i.price,
          image: i.image,
          size: i.size,
          color: i.color,
          quantity: i.quantity,
        })),
        subtotal,
        shippingCost,
        discount: form.couponDiscount,
        total,
        status: "placed" as const,
        paymentMethod,
        paymentStatus,
        razorpayPaymentId,
        couponCode: form.couponCode || undefined,
        address: form.address,
        city: form.city,
        state: form.state,
        pincode: form.pincode,
        shippingMethod: form.shippingMethod,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        estimatedDelivery: estimateDelivery(form.shippingMethod),
      };

      // 1. Save to Supabase (via OrderService)
      await orderActions.addOrder(newOrder);

      // 2. Also save in sessionStorage for confirmation page
      sessionStorage.setItem("rassa_last_order", JSON.stringify({
        orderNo,
        items: newOrder.items,
        subtotal,
        shipping: form.shippingMethod,
        name: form.name,
        phone: form.phone,
        address: `${form.address}, ${form.city}, ${form.state} — ${form.pincode}`,
        paymentMethod,
      }));

      // 3. WhatsApp notification (open in background) if payment is WhatsApp
      // Or we can always send order confirmation to WhatsApp
      if (paymentMethod === "whatsapp" || paymentMethod === "cod") {
        const itemsList = items
          .map((i) => `• ${i.name}\n  Qty: ${i.quantity} | Size: ${i.size || "N/A"}\n  Price: ${inr(i.price * i.quantity)}`)
          .join("\n\n");

        const waMsg =
          `*RECEIPT | RASSA BOUTIQUE*\n` +
          `------------------------\n` +
          `*Order ID:* ${orderNo}\n` +
          `*Customer:* ${form.name}\n` +
          `*Phone:* ${form.phone}\n` +
          `*Address:* ${form.address}, ${form.city}, ${form.state} — ${form.pincode}\n` +
          `------------------------\n` +
          `*Items:*\n${itemsList}\n` +
          `------------------------\n` +
          `*Subtotal:* ${inr(subtotal)}\n` +
          (form.couponDiscount > 0 ? `*Discount:* -${inr(form.couponDiscount)}\n` : "") +
          `*Shipping:* ${shippingCost === 0 ? "Free" : inr(shippingCost)}\n` +
          `*Total:* ${inr(total)}\n` +
          `------------------------\n` +
          `*Payment Method:* ${paymentMethod === "cod" ? "Cash on Delivery" : paymentMethod === "razorpay" ? "Razorpay" : "WhatsApp Payment"}\n` +
          `------------------------\n` +
          `Thank you for shopping with us!`;

        window.open(
          `https://wa.me/919633419902?text=${encodeURIComponent(waMsg)}`,
          "_blank",
          "noopener,noreferrer",
        );
      }

      // 4. Clear Cart & Redirect to Confirmation
      clearCart();
      navigate({ to: "/order-confirmation" });
    } catch (error) {
      console.error("Failed to place order:", error);
      alert("There was an issue processing your order. Please try again.");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="pt-28 pb-24">
      <div className="max-w-6xl mx-auto px-6 lg:px-10">
        <div className="mb-8">
          <h1 className="font-display text-4xl md:text-5xl">
            Secure <span className="italic text-gradient-gold">Checkout</span>
          </h1>
        </div>

        {/* Step progress */}
        <div className="flex items-center gap-0 mb-10 border border-border overflow-hidden">
          {STEPS.map((s, i) => (
            <button
              key={s.id}
              onClick={() => i < currentIdx && setStep(s.id)}
              className={`flex-1 py-3 text-[10px] tracking-luxury uppercase text-center transition-all border-r border-border last:border-r-0 ${
                s.id === step
                  ? "bg-gold text-onyx font-medium"
                  : i < currentIdx
                    ? "bg-gold/10 text-gold cursor-pointer hover:bg-gold/20"
                    : "text-muted-foreground cursor-default"
              }`}
            >
              <span className="hidden sm:inline">{s.label}</span>
              <span className="sm:hidden">{i + 1}</span>
            </button>
          ))}
        </div>

        <div className="grid lg:grid-cols-12 gap-10">
          {/* Form */}
          <div className="lg:col-span-7">
            {/* ─── Step 1: Details ───────────────────────────────────────────── */}
            {step === "details" && (
              <div className="space-y-5">
                <h2 className="font-display text-2xl text-gold mb-4">Your Details</h2>
                <InputField label="Full Name" name="name" required value={form.name} onChange={set("name")} />
                <div className="grid sm:grid-cols-2 gap-4">
                  <InputField label="Phone / WhatsApp" name="phone" type="tel" required value={form.phone} onChange={set("phone")} placeholder="+91 XXXXX XXXXX" />
                  <InputField label="Email" name="email" type="email" required value={form.email} onChange={set("email")} placeholder="you@example.com" />
                </div>
                <div className="grid sm:grid-cols-3 gap-4">
                  <InputField label="Pincode" name="pincode" required value={form.pincode} onChange={handlePincodeChange} placeholder="6XXXXX" />
                  <InputField label="State" name="state" required value={form.state} onChange={set("state")} />
                  <InputField label="City / District" name="city" required value={form.city} onChange={set("city")} />
                </div>
                <div>
                  <label className="block text-[10px] tracking-luxury uppercase text-gold mb-2">Delivery Address <span className="text-red-400">*</span></label>
                  <textarea
                    rows={3}
                    required
                    placeholder="House / Flat number, Street, Landmark..."
                    value={form.address}
                    onChange={(e) => set("address")(e.target.value)}
                    className="w-full bg-background border border-border px-4 py-3 text-sm outline-none focus:border-gold transition-colors resize-none"
                  />
                </div>
                {!user && (
                  <div className="flex items-center gap-2 text-xs text-muted-foreground py-3 border-t border-border">
                    <Lock className="w-3.5 h-3.5 text-gold" />
                    <Link to="/login" className="text-gold hover:underline">Sign in</Link> to save your details for faster checkout next time.
                  </div>
                )}
                <button
                  onClick={() => { if (form.name && form.phone && form.email && form.address && form.pincode) setStep("shipping"); }}
                  className="btn-gold w-full mt-2 flex items-center justify-center gap-2"
                >
                  Continue to Shipping <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* ─── Step 2: Shipping ──────────────────────────────────────────── */}
            {step === "shipping" && (
              <div>
                <h2 className="font-display text-2xl text-gold mb-6">Shipping Method</h2>
                <div className="space-y-3">
                  {[
                    { id: "standard", label: "Standard Delivery", desc: "3–7 working days", price: subtotal >= 2000 ? "Free" : "₹80", icon: Truck },
                    { id: "express", label: "Express Delivery", desc: "1–3 working days", price: "₹150", icon: Package },
                    { id: "store-pickup", label: "Pick up from Store", desc: "Chathamangalam, Kozhikode · Ready within 1 day", price: "Free", icon: CheckCircle },
                  ].map((opt) => (
                    <label
                      key={opt.id}
                      className={`flex items-start gap-4 p-4 border cursor-pointer transition-colors ${form.shippingMethod === opt.id ? "border-gold bg-gold/5" : "border-border hover:border-gold/40"}`}
                    >
                      <input type="radio" name="shipping" value={opt.id} checked={form.shippingMethod === opt.id} onChange={() => set("shippingMethod")(opt.id)} className="mt-1 accent-gold" />
                      <opt.icon className="w-5 h-5 text-gold mt-0.5 shrink-0" />
                      <div className="flex-1">
                        <div className="font-medium text-sm text-ivory">{opt.label}</div>
                        <div className="text-xs text-muted-foreground">{opt.desc}</div>
                      </div>
                      <div className="text-sm font-medium text-gold">{opt.price}</div>
                    </label>
                  ))}
                </div>
                <div className="flex gap-3 mt-6">
                  <button onClick={() => setStep("details")} className="btn-ghost-gold flex-1">← Back</button>
                  <button onClick={() => setStep("payment")} className="btn-gold flex-1 flex items-center justify-center gap-2">Continue <ChevronRight className="w-4 h-4" /></button>
                </div>
              </div>
            )}

            {/* ─── Step 3: Payment ──────────────────────────────────────────── */}
            {step === "payment" && (
              <div>
                <h2 className="font-display text-2xl text-gold mb-6">Payment Method</h2>
                <div className="space-y-3 mb-6">
                  {/* COD */}
                  <label className={`flex items-start gap-4 p-4 border cursor-pointer transition-colors ${form.paymentMethod === "cod" ? "border-gold bg-gold/5" : "border-border hover:border-gold/40"}`}>
                    <input type="radio" name="payment" value="cod" checked={form.paymentMethod === "cod"} onChange={() => set("paymentMethod")("cod")} className="mt-1 accent-gold" />
                    <Package className="w-5 h-5 text-gold mt-0.5 shrink-0" />
                    <div>
                      <div className="font-medium text-sm text-ivory">Cash on Delivery (COD)</div>
                      <div className="text-xs text-muted-foreground">Pay when your order arrives at your door.</div>
                    </div>
                  </label>
                  {/* WhatsApp */}
                  <label className={`flex items-start gap-4 p-4 border cursor-pointer transition-colors ${form.paymentMethod === "whatsapp" ? "border-gold bg-gold/5" : "border-border hover:border-gold/40"}`}>
                    <input type="radio" name="payment" value="whatsapp" checked={form.paymentMethod === "whatsapp"} onChange={() => set("paymentMethod")("whatsapp")} className="mt-1 accent-gold" />
                    <Smartphone className="w-5 h-5 text-gold mt-0.5 shrink-0" />
                    <div>
                      <div className="font-medium text-sm text-ivory">Pay via WhatsApp (UPI / Bank Transfer)</div>
                      <div className="text-xs text-muted-foreground">We'll send payment details on WhatsApp after confirmation.</div>
                    </div>
                  </label>
                  {/* Razorpay */}
                  <label className={`flex items-start gap-4 p-4 border cursor-pointer transition-colors ${form.paymentMethod === "razorpay" ? "border-gold bg-gold/5" : "border-border hover:border-gold/40"}`}>
                    <input type="radio" name="payment" value="razorpay" checked={form.paymentMethod === "razorpay"} onChange={() => set("paymentMethod")("razorpay")} className="mt-1 accent-gold" />
                    <CreditCard className="w-5 h-5 text-gold mt-0.5 shrink-0" />
                    <div>
                      <div className="font-medium text-sm text-ivory flex items-center gap-2">
                        Online Payment — UPI, Cards, Net Banking
                        <span className="text-[9px] bg-gold/20 text-gold px-1.5 py-0.5 tracking-luxury uppercase">Razorpay</span>
                      </div>
                      <div className="text-xs text-muted-foreground">Secure payment powered by Razorpay. All major cards, UPI, wallets accepted.</div>
                    </div>
                  </label>
                </div>

                {/* Coupon */}
                <div className="mb-5 p-4 border border-border bg-background">
                  <div className="text-[10px] tracking-luxury uppercase text-gold mb-3">Coupon Code</div>
                  <div className="flex gap-2">
                    <input
                      value={form.couponCode}
                      onChange={(e) => set("couponCode")(e.target.value.toUpperCase())}
                      placeholder="Enter coupon code"
                      className="flex-1 bg-card border border-border px-4 py-2.5 text-sm outline-none focus:border-gold transition-colors uppercase"
                    />
                    <button onClick={applyCoupon} className="px-4 py-2.5 border border-gold text-gold text-[10px] tracking-luxury uppercase hover:bg-gold hover:text-onyx transition-all">Apply</button>
                  </div>
                  {form.couponDiscount > 0 && (
                    <div className="mt-2 text-xs text-green-400 flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" />
                      Coupon applied! You save {inr(form.couponDiscount)}
                    </div>
                  )}
                  <div className="mt-2 text-[10px] text-muted-foreground">Try: RASSA10 · WELCOME15 · ONAM20</div>
                </div>

                <div className="flex items-center gap-2 text-xs text-muted-foreground p-3 border border-border bg-card mb-5">
                  <ShieldCheck className="w-4 h-4 text-gold shrink-0" />
                  <span>256-bit SSL encryption. Your payment details are never stored on our servers.</span>
                </div>

                <div className="flex gap-3">
                  <button onClick={() => setStep("shipping")} className="btn-ghost-gold flex-1">← Back</button>
                  <button onClick={() => setStep("review")} className="btn-gold flex-1 flex items-center justify-center gap-2">Review Order <ChevronRight className="w-4 h-4" /></button>
                </div>
              </div>
            )}

            {/* ─── Step 4: Review ────────────────────────────────────────────── */}
            {step === "review" && (
              <div>
                <h2 className="font-display text-2xl text-gold mb-6">Review & Place Order</h2>
                <div className="space-y-4 mb-6">
                  <div className="p-4 border border-border text-sm">
                    <div className="text-[10px] tracking-luxury uppercase text-gold mb-2">Delivering to</div>
                    <div className="text-ivory font-medium">{form.name}</div>
                    <div className="text-muted-foreground">{form.address}, {form.city}, {form.state} — {form.pincode}</div>
                    <div className="text-muted-foreground">{form.phone} {form.email && `· ${form.email}`}</div>
                  </div>
                  <div className="p-4 border border-border text-sm">
                    <div className="text-[10px] tracking-luxury uppercase text-gold mb-2">Shipping</div>
                    <div className="text-ivory">
                      {form.shippingMethod === "store-pickup" ? "Store Pickup — Chathamangalam, Kozhikode" : form.shippingMethod === "express" ? "Express Delivery (1–3 days)" : "Standard Delivery (3–7 days)"}
                    </div>
                  </div>
                  <div className="p-4 border border-border text-sm">
                    <div className="text-[10px] tracking-luxury uppercase text-gold mb-2">Payment</div>
                    <div className="text-ivory">
                      {form.paymentMethod === "cod" ? "Cash on Delivery" : form.paymentMethod === "razorpay" ? "Online Payment (Razorpay)" : "WhatsApp Payment (UPI / Bank Transfer)"}
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button onClick={() => setStep("payment")} className="btn-ghost-gold flex-1">← Back</button>
                  <button
                    onClick={placeOrder}
                    disabled={processing}
                    className="btn-gold flex-1 flex items-center justify-center gap-2 disabled:opacity-60"
                  >
                    {processing ? (
                      <span className="w-4 h-4 border-2 border-onyx/30 border-t-onyx rounded-full animate-spin" />
                    ) : (
                      form.paymentMethod === "razorpay" ? "Pay Now →" : "Place Order →"
                    )}
                  </button>
                </div>

                <p className="mt-4 text-xs text-muted-foreground text-center">
                  By placing this order you agree to our{" "}
                  <Link to="/faq" className="text-gold hover:underline">return policy</Link>.
                </p>
              </div>
            )}
          </div>

          {/* Order summary sidebar */}
          <div className="lg:col-span-5">
            <div className="border border-border bg-card p-6 sticky top-28">
              <h3 className="font-display text-xl mb-4 pb-4 border-b border-border">Order Summary</h3>
              <div className="space-y-3 mb-5">
                {items.map((item) => (
                  <div key={`${item.productId}-${item.size}-${item.color}`} className="flex gap-3 text-sm">
                    <div className="w-14 aspect-[3/4] overflow-hidden shrink-0 border border-border">
                      <img src={item.image} alt={item.name} loading="lazy" className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-serif leading-snug line-clamp-2">{item.name}</div>
                      <div className="text-xs text-muted-foreground mt-0.5">{item.size} · {item.color} · ×{item.quantity}</div>
                      <div className="text-gold text-sm mt-1">{inr(item.price * item.quantity)}</div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="border-t border-border pt-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal ({items.reduce((s, i) => s + i.quantity, 0)} items)</span>
                  <span>{inr(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className={shippingCost === 0 ? "text-green-500" : ""}>{shippingCost === 0 ? "Free" : inr(shippingCost)}</span>
                </div>
                {form.couponDiscount > 0 && (
                  <div className="flex justify-between text-green-400">
                    <span>Coupon ({form.couponCode})</span>
                    <span>−{inr(form.couponDiscount)}</span>
                  </div>
                )}
                <div className="flex justify-between font-medium text-gold pt-2 border-t border-border">
                  <span className="font-display">Total</span>
                  <span className="font-display text-xl">{inr(total)}</span>
                </div>
              </div>
              <div className="mt-4 flex items-center gap-2 justify-center text-xs text-muted-foreground">
                <Lock className="w-3.5 h-3.5 text-gold" />
                <span>Secure checkout · 7-day returns</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
