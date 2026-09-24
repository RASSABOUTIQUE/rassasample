import { createFileRoute } from "@tanstack/react-router";
import { useReveal } from "@/lib/use-reveal";
import { useState } from "react";
import { ChevronDown } from "lucide-react";

export const Route = createFileRoute("/faq")({
  head: () => ({
    meta: [
      { title: "FAQ — Rassa Boutique" },
      {
        name: "description",
        content:
          "Frequently asked questions about Rassa Boutique — shipping, returns, custom stitching, sizing, payments, and visiting our store in Kozhikode.",
      },
    ],
  }),
  component: FaqPage,
});

interface FaqItem {
  q: string;
  a: string;
}

const sections: { title: string; items: FaqItem[] }[] = [
  {
    title: "Ordering & Payment",
    items: [
      {
        q: "How do I place an order?",
        a: "You can order directly from our website by adding products to your cart and checking out. For now, you can also WhatsApp us at +91 96334 19902 with the product name, size, and colour — we'll confirm availability and arrange delivery.",
      },
      {
        q: "What payment methods do you accept?",
        a: "We currently accept Cash on Delivery (COD) for all orders within Kerala. Online payment via UPI, cards, and Razorpay will be available very soon. WhatsApp orders can be paid via bank transfer or UPI.",
      },
      {
        q: "Is it safe to order online from Rassa Boutique?",
        a: "Yes, absolutely. Your payment and personal information are processed securely. We are a trusted local boutique from Kozhikode, Kerala — you can also visit us in store before buying.",
      },
      {
        q: "Can I cancel or change my order?",
        a: "Yes, you can cancel or change your order within 24 hours of placing it. WhatsApp us immediately at +91 96334 19902 with your order number.",
      },
    ],
  },
  {
    title: "Shipping & Delivery",
    items: [
      {
        q: "Do you ship across Kerala and India?",
        a: "Yes, we ship across all of Kerala and most of India. Standard delivery takes 3–7 working days depending on your location.",
      },
      {
        q: "What is the delivery charge?",
        a: "Delivery within Kozhikode district: free above ₹2,000. For other Kerala districts and Pan-India: ₹60–₹150 depending on order weight and location. Exact charges shown at checkout.",
      },
      {
        q: "How long does delivery take?",
        a: "Within Kozhikode: 1–2 working days. Rest of Kerala: 2–4 working days. Other states: 4–7 working days. Custom stitching orders take additional time (7–35 days depending on garment type).",
      },
      {
        q: "Can I track my order?",
        a: "Yes, once your order is dispatched, we'll send you a tracking link via WhatsApp. You can also use our Track Order page with your order number.",
      },
    ],
  },
  {
    title: "Returns & Exchanges",
    items: [
      {
        q: "What is your return policy?",
        a: "We accept returns within 7 days of delivery for non-stitched items (sarees, ready-made garments) — provided the item is in original condition with tags attached. Custom-stitched items cannot be returned unless there is a stitching defect.",
      },
      {
        q: "How do I return an item?",
        a: "WhatsApp us at +91 96334 19902 with your order number and reason for return. We'll arrange a pickup or ask you to drop it at our store.",
      },
      {
        q: "Can I exchange an item for a different size or colour?",
        a: "Yes, we accept exchanges within 7 days of delivery subject to availability. Please WhatsApp us as soon as possible to check if your preferred size/colour is in stock.",
      },
      {
        q: "When will I receive my refund?",
        a: "Refunds are processed within 5–7 working days after we receive and inspect the returned item. Amount will be returned to your original payment method.",
      },
    ],
  },
  {
    title: "Custom Stitching",
    items: [
      {
        q: "How does custom stitching work?",
        a: "Visit our Custom Stitching page for a full step-by-step guide. Briefly: you share your design, we take measurements (in-store or you send us measurements), we stitch it, and deliver or you collect.",
      },
      {
        q: "How long does custom stitching take?",
        a: "Blouses & simple alterations: 5–7 days. Churidars & salwar sets: 7–14 days. Saree blouses with embroidery: 10–18 days. Bridal outfits & lehengas: 21–35 days.",
      },
      {
        q: "Can I give my own fabric for stitching?",
        a: "Yes, absolutely. You can bring your own fabric to our store and our tailors will stitch it to your measurements and design preferences.",
      },
      {
        q: "Do you do alterations?",
        a: "Yes, we do alterations on existing garments. Bring the item to our store and our team will advise on what changes can be made and the cost.",
      },
    ],
  },
  {
    title: "Sizing & Fit",
    items: [
      {
        q: "How do I find my size?",
        a: "Visit our Size Guide for detailed measurements. For Indian standard sizes: XS (chest 32\"), S (34\"), M (36\"), L (38\"), XL (40\"), XXL (42\"). If you're between sizes, we recommend going one size up.",
      },
      {
        q: "What if the item doesn't fit?",
        a: "You can exchange for a different size within 7 days (subject to availability) or bring it to our store for alterations. WhatsApp us and we'll find the best solution.",
      },
      {
        q: "Do sarees come with a blouse?",
        a: "All sarees include an unstitched blouse piece unless otherwise noted. You can have it stitched at our store or by your local tailor. Blouse stitching is available from ₹500.",
      },
    ],
  },
  {
    title: "Visiting the Store",
    items: [
      {
        q: "Where is Rassa Boutique located?",
        a: "We're located near NIT Calicut Campus, Kattangal-Koduvally Road, Kattangal, Kozhikode, Kerala — 673601. Near Foodies Restaurant, easily accessible from NIT Calicut main gate.",
      },
      {
        q: "What are your store hours?",
        a: "Monday to Saturday: 11:00 am – 11:00 pm. Sunday: 11:00 am – 8:00 pm.",
      },
      {
        q: "Do I need an appointment to visit?",
        a: "No, you're welcome to walk in anytime. However, for bridal consultations and custom stitching sessions, we recommend booking an appointment via WhatsApp to ensure our team is available for you.",
      },
      {
        q: "Can I buy online and pick up from the store?",
        a: "Yes, store pickup is available free of charge. Select 'Pick up from Store' at checkout and we'll have your order ready within 1 working day.",
      },
    ],
  },
];

function Accordion({ item }: { item: FaqItem }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-border last:border-0">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full text-left py-5 flex items-start justify-between gap-4 group"
      >
        <span className="font-serif text-base text-ivory group-hover:text-gold transition-colors leading-snug">
          {item.q}
        </span>
        <ChevronDown
          className={`w-4 h-4 text-gold shrink-0 mt-0.5 transition-transform duration-300 ${open ? "rotate-180" : ""}`}
        />
      </button>
      <div
        className={`overflow-hidden transition-all duration-400 ${open ? "max-h-[500px] pb-5" : "max-h-0"}`}
      >
        <p className="text-sm text-muted-foreground leading-relaxed pr-8">{item.a}</p>
      </div>
    </div>
  );
}

function FaqPage() {
  useReveal();
  return (
    <div className="pt-32 pb-24">
      <section className="max-w-3xl mx-auto px-6 text-center mb-16 reveal">
        <span className="divider-gold text-[10px] tracking-luxury uppercase">Help & Support</span>
        <h1 className="mt-4 font-display text-5xl md:text-6xl">
          Frequently Asked <span className="italic text-gradient-gold">Questions</span>
        </h1>
        <p className="mt-5 font-serif text-base text-foreground/75">
          Everything you need to know about ordering, shipping, returns, and visiting Rassa Boutique.
        </p>
      </section>

      <div className="max-w-3xl mx-auto px-6 space-y-10">
        {sections.map((section) => (
          <div key={section.title} className="reveal">
            <h2 className="font-display text-2xl text-gold mb-4 pb-3 border-b border-border/60">
              {section.title}
            </h2>
            <div>
              {section.items.map((item) => (
                <Accordion key={item.q} item={item} />
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="max-w-3xl mx-auto px-6 mt-16 reveal">
        <div className="p-8 border border-border bg-card text-center">
          <h3 className="font-display text-2xl">Still have a question?</h3>
          <p className="mt-3 text-sm text-muted-foreground">
            WhatsApp us and our team will get back to you quickly.
          </p>
          <a
            href="https://wa.me/919633419902?text=Hello%20Rassa%20Boutique%2C%20I%20have%20a%20question."
            target="_blank"
            rel="noreferrer"
            className="btn-gold inline-flex mt-5"
          >
            WhatsApp Us
          </a>
        </div>
      </div>

      {/* ─── Legal Policies ─────────────────────────────────────────────────── */}
      <div id="policies" className="max-w-3xl mx-auto px-6 mt-20 pb-10 reveal">
        <div className="border-t border-border/40 pt-12">
          <h2 className="font-display text-3xl text-gold mb-2 text-center">Store Policies</h2>
          <p className="text-xs text-muted-foreground text-center mb-12">
            Rassa Boutique operates in compliance with the Consumer Protection (E-Commerce) Rules 2020 and the Information Technology Act, India.
          </p>

          <div className="space-y-10">

            {/* Privacy Policy */}
            <section>
              <h3 className="font-display text-xl text-gold mb-4 pb-2 border-b border-border/50">Privacy Policy</h3>
              <div className="text-sm text-muted-foreground leading-relaxed space-y-3">
                <p><strong className="text-foreground/80">Information We Collect:</strong> We collect only the information necessary to process your orders — your name, delivery address, phone number, and email. Payment details are processed securely and never stored on our servers.</p>
                <p><strong className="text-foreground/80">How We Use Your Information:</strong> Your information is used solely to fulfill your orders, communicate order updates via WhatsApp, and provide customer support. We do not sell, rent, or share your personal data with any third party.</p>
                <p><strong className="text-foreground/80">Data Storage:</strong> Order information is stored securely in our database. We retain order records for up to 2 years for legal and accounting compliance.</p>
                <p><strong className="text-foreground/80">Cookies:</strong> Our website uses minimal cookies to maintain your cart and session state. No tracking or advertising cookies are used.</p>
                <p><strong className="text-foreground/80">Contact:</strong> For privacy concerns, email us at rassaboutique@gmail.com or WhatsApp +91 9633419902.</p>
              </div>
            </section>

            {/* Return & Refund Policy */}
            <section>
              <h3 className="font-display text-xl text-gold mb-4 pb-2 border-b border-border/50">Return &amp; Refund Policy</h3>
              <div className="text-sm text-muted-foreground leading-relaxed space-y-3">
                <p><strong className="text-foreground/80">Return Window:</strong> We accept returns within 7 days of delivery for non-stitched items (sarees, ready-made garments) — provided the item is unused, unwashed, and in original condition with tags attached.</p>
                <p><strong className="text-foreground/80">Non-Returnable Items:</strong> Custom-stitched garments cannot be returned unless there is a verified stitching defect. Items marked as final sale are also non-returnable.</p>
                <p><strong className="text-foreground/80">How to Initiate a Return:</strong> WhatsApp us at +91 9633419902 with your Order ID and reason for return within 7 days of delivery.</p>
                <p><strong className="text-foreground/80">Refund Processing:</strong> Refunds are processed within 5–7 working days after we receive and inspect the returned item. Amount will be refunded to your original payment method or via bank transfer/UPI.</p>
                <p><strong className="text-foreground/80">Exchange:</strong> We accept size/colour exchanges within 7 days of delivery, subject to stock availability.</p>
              </div>
            </section>

            {/* Shipping Policy */}
            <section>
              <h3 className="font-display text-xl text-gold mb-4 pb-2 border-b border-border/50">Shipping Policy</h3>
              <div className="text-sm text-muted-foreground leading-relaxed space-y-3">
                <p><strong className="text-foreground/80">Delivery Areas:</strong> We ship across Kerala and all major cities in India. Some remote pin codes may not be serviceable — we will inform you via WhatsApp if your area is not reachable.</p>
                <p><strong className="text-foreground/80">Standard Delivery:</strong> 3–7 working days · ₹80 (Free on orders above ₹2,000).</p>
                <p><strong className="text-foreground/80">Express Delivery:</strong> 1–3 working days · ₹150.</p>
                <p><strong className="text-foreground/80">Store Pickup:</strong> Free — ready at our Kattangal store within 1 working day.</p>
                <p><strong className="text-foreground/80">Tracking:</strong> Once dispatched, we'll send your tracking details via WhatsApp. You can also use our Track Order page.</p>
              </div>
            </section>

            {/* Terms & Conditions */}
            <section>
              <h3 className="font-display text-xl text-gold mb-4 pb-2 border-b border-border/50">Terms &amp; Conditions</h3>
              <div className="text-sm text-muted-foreground leading-relaxed space-y-3">
                <p><strong className="text-foreground/80">Acceptance:</strong> By placing an order on our website, you agree to these terms and conditions. These terms are governed by the laws of India.</p>
                <p><strong className="text-foreground/80">Product Information:</strong> We make every effort to display accurate colours and descriptions. Slight colour variations may occur due to screen settings. Fabric pattern placement may vary slightly from images shown.</p>
                <p><strong className="text-foreground/80">Pricing:</strong> All prices are in Indian Rupees (INR). We reserve the right to correct pricing errors before processing an order.</p>
                <p><strong className="text-foreground/80">Order Cancellation:</strong> You can cancel your order within 24 hours of placing it by contacting us on WhatsApp at +91 9633419902. After 24 hours, cancellation may not be possible if the order has been dispatched.</p>
                <p><strong className="text-foreground/80">Liability:</strong> Rassa Boutique is not liable for delays or failures due to circumstances beyond our control (natural disasters, courier disruptions, etc.).</p>
                <p><strong className="text-foreground/80">Dispute Resolution:</strong> Any disputes shall be subject to the exclusive jurisdiction of the courts in Kozhikode, Kerala, India.</p>
                <p><strong className="text-foreground/80">Contact:</strong> Rassa Boutique · Near NIT Calicut Campus, Kattangal-Koduvally Road, Kattangal, Kozhikode, Kerala 673601 · rassaboutique@gmail.com · +91 9633419902.</p>
              </div>
            </section>

          </div>

          <p className="mt-10 text-[10px] text-muted-foreground text-center">
            Last updated: September 2026 · Rassa Boutique · Kozhikode, Kerala
          </p>
        </div>
      </div>
    </div>
  );
}
