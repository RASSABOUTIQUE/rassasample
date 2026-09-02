import { createFileRoute } from "@tanstack/react-router";
import { useReveal } from "@/lib/use-reveal";
import { Ruler, MessageSquare, Scissors, Truck, CheckCircle, Phone, MessageCircle, ArrowRight } from "lucide-react";
import { Link } from "@tanstack/react-router";
import custom from "@/assets/cat-custom.jpg";
import thread from "@/assets/story-thread.jpg";

export const Route = createFileRoute("/custom-stitching")({
  head: () => ({
    meta: [
      { title: "Custom Stitching — Rassa Boutique, Kozhikode" },
      {
        name: "description",
        content:
          "Custom stitching service at Rassa Boutique, Kozhikode — personal consultation, precise measurements, expert tailoring and timely delivery across Kerala.",
      },
    ],
  }),
  component: CustomPage,
});

const journey = [
  {
    num: "01",
    icon: MessageSquare,
    title: "Choose Your Design",
    desc: "Tell us what you want — a blouse, churidar, salwar, lehenga, or any garment. Share photos or describe your design. We'll guide you if needed.",
  },
  {
    num: "02",
    icon: Ruler,
    title: "Share Your Measurements",
    desc: "Visit our store for a measurement session, or send us your measurements on WhatsApp. Our tailors will advise on any adjustments needed.",
  },
  {
    num: "03",
    icon: MessageCircle,
    title: "Consultation — Online or In-Store",
    desc: "We'll confirm fabric, design, and pricing with you before starting. No surprises. You can discuss changes at this stage.",
  },
  {
    num: "04",
    icon: Scissors,
    title: "Stitching by Our Tailors",
    desc: "Our experienced tailors cut and stitch your garment with care. Quality is checked at every stage.",
  },
  {
    num: "05",
    icon: CheckCircle,
    title: "Trial & Adjustments",
    desc: "Try on your outfit. If anything needs adjusting — we fix it, free of charge.",
  },
  {
    num: "06",
    icon: Truck,
    title: "Ready for Delivery",
    desc: "Pick up from our store or we'll deliver across Kerala and India. Your outfit, ready when promised.",
  },
];

const pricing = [
  { item: "Blouse (plain)", time: "5–7 days", from: "₹800" },
  { item: "Blouse (embroidery)", time: "7–14 days", from: "₹1,500" },
  { item: "Churidar Set", time: "7–14 days", from: "₹1,500" },
  { item: "Salwar Suit", time: "10–18 days", from: "₹2,000" },
  { item: "Anarkali", time: "14–21 days", from: "₹3,000" },
  { item: "Lehenga", time: "21–35 days", from: "₹5,000" },
  { item: "Bridal Outfits", time: "21–35 days", from: "Custom Quote" },
];

const faqs = [
  {
    q: "Can I bring my own fabric?",
    a: "Yes, absolutely. Bring your fabric to our store and we'll stitch it to your design and measurements.",
  },
  {
    q: "What if the outfit doesn't fit perfectly?",
    a: "We offer free alterations for all custom-stitched orders from our store. Just bring it back and we'll fix it.",
  },
  {
    q: "Can I order custom stitching online (not in-store)?",
    a: "Yes. WhatsApp us your design reference, measurements, and fabric preference. We'll guide you through the process remotely.",
  },
  {
    q: "Do you stitch bridal outfits?",
    a: "Yes, we stitch complete bridal outfits including lehengas, saree blouses, and custom wedding sets. Book a bridal consultation for the best experience.",
  },
];

function Field({ label, name, type = "text", required, placeholder }: { label: string; name: string; type?: string; required?: boolean; placeholder?: string }) {
  return (
    <div>
      <label className="block text-[10px] tracking-luxury uppercase text-gold mb-2">{label}</label>
      <input
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        className="w-full bg-background border border-border px-4 py-3 text-sm outline-none focus:border-gold transition-colors"
      />
    </div>
  );
}

function CustomPage() {
  useReveal();
  return (
    <div>
      {/* HERO */}
      <section className="relative pt-28 pb-20 overflow-hidden">
        <div className="absolute inset-0 opacity-25">
          <img src={custom} alt="" aria-hidden className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-background via-background/60 to-background" />
        </div>
        <div className="relative max-w-3xl mx-auto px-6 text-center">
          <span className="divider-gold text-[10px] tracking-luxury uppercase">Rassa Boutique</span>
          <h1 className="mt-5 font-display text-5xl md:text-7xl leading-tight">
            Custom <span className="italic text-gradient-gold">Stitching</span>
          </h1>
          <p className="mt-6 font-serif text-lg text-foreground/80 leading-relaxed max-w-md mx-auto">
            Your design, your measurements, stitched with care — blouses, churidars, salwars,
            lehengas, and more.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <a
              href="https://wa.me/919633419902?text=Hello%20Rassa%20Boutique%2C%20I'm%20interested%20in%20your%20custom%20stitching%20service.%20Could%20you%20help%20me%20get%20started?"
              target="_blank"
              rel="noreferrer"
              className="btn-gold flex items-center gap-2"
            >
              <MessageCircle className="w-4 h-4" />
              WhatsApp to Get Started
            </a>
            <a href="tel:+919633419902" className="btn-ghost-gold flex items-center gap-2">
              <Phone className="w-4 h-4" />
              Call Us
            </a>
          </div>
        </div>
      </section>

      {/* JOURNEY */}
      <section className="py-24 border-t border-border">
        <div className="max-w-6xl mx-auto px-6 lg:px-10">
          <div className="text-center mb-16 reveal">
            <span className="divider-gold text-[10px] tracking-luxury uppercase">The Process</span>
            <h2 className="mt-4 font-display text-4xl md:text-5xl">
              How Custom Stitching <span className="italic text-gradient-gold">Works</span>
            </h2>
            <p className="mt-4 text-sm text-muted-foreground max-w-sm mx-auto">
              Six simple steps from your idea to your perfect outfit.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {journey.map((step) => (
              <div key={step.num} className="reveal flex gap-5">
                <div className="shrink-0">
                  <div className="w-12 h-12 rounded-full border border-gold/50 flex items-center justify-center text-gold">
                    <step.icon className="w-5 h-5" />
                  </div>
                </div>
                <div>
                  <div className="text-[10px] tracking-luxury uppercase text-gold mb-1">Step {step.num}</div>
                  <h3 className="font-display text-xl text-ivory mb-2">{step.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING TABLE */}
      <section className="py-20 bg-card border-t border-border">
        <div className="max-w-4xl mx-auto px-6 lg:px-10">
          <div className="text-center mb-12 reveal">
            <span className="divider-gold text-[10px] tracking-luxury uppercase">Pricing & Timeline</span>
            <h2 className="mt-4 font-display text-3xl md:text-4xl">What to Expect</h2>
          </div>
          <div className="border border-border overflow-hidden reveal">
            <table className="w-full text-sm">
              <thead className="bg-gold/10">
                <tr>
                  <th className="text-left px-5 py-3 text-[10px] tracking-luxury uppercase text-gold font-medium">Garment</th>
                  <th className="text-left px-5 py-3 text-[10px] tracking-luxury uppercase text-gold font-medium">Ready In</th>
                  <th className="text-right px-5 py-3 text-[10px] tracking-luxury uppercase text-gold font-medium">Starting From</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {pricing.map((row) => (
                  <tr key={row.item} className="hover:bg-gold/5 transition-colors">
                    <td className="px-5 py-4 text-ivory">{row.item}</td>
                    <td className="px-5 py-4 text-muted-foreground">{row.time}</td>
                    <td className="px-5 py-4 text-gold text-right font-medium">{row.from}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-muted-foreground text-center mt-4">
            Final pricing depends on fabric, embroidery, and design complexity. We'll confirm the exact quote before starting.
          </p>
        </div>
      </section>

      {/* SIDE BY SIDE CTA */}
      <section className="py-24 border-t border-border">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 grid md:grid-cols-2 gap-10 items-center">
          <div className="reveal relative aspect-[4/5] overflow-hidden border border-border">
            <img src={thread} alt="Custom stitching at Rassa Boutique" loading="lazy" className="w-full h-full object-cover" />
          </div>
          <div className="reveal">
            <span className="divider-gold text-[10px] tracking-luxury uppercase">Book a Session</span>
            <h2 className="mt-5 font-display text-4xl leading-tight">
              Start your custom <span className="italic text-gradient-gold">design today</span>
            </h2>
            <p className="mt-5 font-serif text-base leading-relaxed text-foreground/80">
              Visit us in Kozhikode for an in-person consultation, or WhatsApp us with your design
              idea and measurements. We'll take it from there.
            </p>
            <ul className="mt-6 space-y-3">
              {[
                "Free consultation — no obligation",
                "We work with your fabric or ours",
                "On-time delivery, guaranteed",
                "Free alterations until you're happy",
              ].map((item) => (
                <li key={item} className="flex items-center gap-3 text-sm text-foreground/80">
                  <CheckCircle className="w-4 h-4 text-gold shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
            <div className="mt-8 flex flex-wrap gap-4">
              <a
                href="https://wa.me/919633419902?text=Hello%20Rassa%20Boutique%2C%20I'd%20like%20to%20book%20a%20custom%20stitching%20consultation."
                target="_blank"
                rel="noreferrer"
                className="btn-gold flex items-center gap-2"
              >
                <MessageCircle className="w-4 h-4" />
                Book on WhatsApp
              </a>
              <Link to="/visit-store" className="btn-ghost-gold">Visit Our Store</Link>
            </div>
          </div>
        </div>
      </section>

      {/* REQUEST FORM */}
      <section className="py-28 bg-card border-t border-border">
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-center mb-12 reveal">
            <span className="divider-gold text-[10px] tracking-luxury uppercase">Start Here</span>
            <h2 className="mt-4 font-display text-4xl md:text-5xl">Request Custom Stitching</h2>
            <p className="mt-4 text-sm text-muted-foreground">
              Fill in the form below and we'll reply via WhatsApp within one working day.
            </p>
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const f = new FormData(e.currentTarget);
              const msg = `Hello Rassa Boutique, I'd like to place a custom stitching request.

Name: ${f.get("name")}
Phone: ${f.get("phone")}
Garment: ${f.get("type")}
Date Needed By: ${f.get("date")}
Design Notes: ${f.get("notes")}`;
              window.open(`https://wa.me/919633419902?text=${encodeURIComponent(msg)}`, "_blank", "noopener,noreferrer");
            }}
            className="reveal grid sm:grid-cols-2 gap-5 p-8 md:p-10 border border-border bg-background"
          >
            <Field label="Full Name" name="name" required />
            <Field label="Phone / WhatsApp" name="phone" type="tel" required placeholder="+91 XXXXX XXXXX" />
            <Field label="What would you like stitched?" name="type" required placeholder="e.g. Blouse, churidar, lehenga" />
            <Field label="When do you need it?" name="date" type="date" required />
            <div className="sm:col-span-2">
              <label className="block text-[10px] tracking-luxury uppercase text-gold mb-2">
                Design Notes & Preferences
              </label>
              <textarea
                name="notes"
                rows={4}
                className="w-full bg-card border border-border px-4 py-3 text-sm outline-none focus:border-gold transition-colors resize-none"
                placeholder="Colours, neckline, embroidery style, reference photos — tell us as much as you can..."
              />
            </div>
            <div className="sm:col-span-2 flex justify-center">
              <button className="btn-gold flex items-center gap-2">
                <ArrowRight className="w-4 h-4" />
                Send via WhatsApp
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 border-t border-border">
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-center mb-10 reveal">
            <h2 className="font-display text-3xl">Common Questions</h2>
          </div>
          <div className="space-y-5 reveal">
            {faqs.map((faq) => (
              <div key={faq.q} className="border border-border p-5 bg-card">
                <div className="font-serif text-base text-ivory mb-2">{faq.q}</div>
                <div className="text-sm text-muted-foreground leading-relaxed">{faq.a}</div>
              </div>
            ))}
          </div>
          <div className="text-center mt-8 reveal">
            <Link to="/faq" className="text-[11px] tracking-luxury uppercase text-gold border-b border-gold/50 pb-0.5 flex items-center justify-center gap-2">
              View All FAQs →
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
