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
        a: "We're located at Poolacode, Chathamangalam, Kattangal–Koduvally Road, Kozhikode, Kerala — 673601. Near NIT Employees Co-operative Society.",
      },
      {
        q: "What are your store hours?",
        a: "Monday to Saturday: 10:00 am – 9:00 pm. Sunday: 11:00 am – 8:00 pm.",
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
    </div>
  );
}
