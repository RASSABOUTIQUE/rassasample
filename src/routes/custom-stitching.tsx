import { createFileRoute } from "@tanstack/react-router";
import { useReveal } from "@/lib/use-reveal";
import { Ruler, MessageSquare, Scissors, Truck } from "lucide-react";
import custom from "@/assets/cat-custom.jpg";

export const Route = createFileRoute("/custom-stitching")({
  head: () => ({
    meta: [
      { title: "Custom Stitching — Rassa Boutique" },
      {
        name: "description",
        content:
          "Bespoke couture and custom stitching service at Rassa Boutique — personal consultation, precise measurements, atelier craftsmanship and timely delivery.",
      },
      { property: "og:title", content: "Custom Stitching — Rassa Boutique" },
      {
        property: "og:description",
        content: "Bespoke couture and custom stitching at Rassa Boutique, Kozhikode.",
      },
      { property: "og:image", content: custom },
    ],
  }),
  component: CustomPage,
});

const steps = [
  {
    icon: MessageSquare,
    title: "Consultation",
    body: "Sit with our stylist in-store or over a private call. We listen to the occasion, the silhouette you dream of, the colours that move you.",
  },
  {
    icon: Ruler,
    title: "Measurements",
    body: "Precise body measurements taken by our master tailor. Every contour is noted so the garment moves with you, not against you.",
  },
  {
    icon: Scissors,
    title: "Atelier Stitching",
    body: "Karigars hand-cut, embroider and finish each piece in our atelier. Quality is reviewed at four stages before approval.",
  },
  {
    icon: Truck,
    title: "Final Fitting & Delivery",
    body: "A private fitting refines the final piece. Worldwide and pan-India shipping available, or collect in-store with a tea.",
  },
];

function CustomPage() {
  useReveal();
  return (
    <div>
      {/* HERO */}
      <section className="relative pt-32 pb-24 overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <img src={custom} alt="" aria-hidden className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-background via-background/70 to-background" />
        </div>
        <div className="relative max-w-3xl mx-auto px-6 text-center">
          <span className="divider-gold text-[10px] tracking-luxury uppercase">
            Bespoke Service
          </span>
          <h1 className="mt-6 font-display text-5xl md:text-7xl leading-tight">
            Custom <span className="italic text-gradient-gold">Stitching</span>
          </h1>
          <p className="mt-6 font-serif italic text-lg text-foreground/80">
            Couture is a conversation. Tell us yours, and we will weave it.
          </p>
        </div>
      </section>

      {/* PROCESS */}
      <section className="py-24 border-t border-border">
        <div className="max-w-6xl mx-auto px-6 lg:px-10">
          <div className="text-center mb-16 reveal">
            <span className="divider-gold text-[10px] tracking-luxury uppercase">The Process</span>
            <h2 className="mt-4 font-display text-4xl md:text-5xl">Four Quiet Steps</h2>
          </div>
          <ol className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((s, i) => (
              <li key={s.title} className="reveal text-center">
                <div className="mx-auto w-16 h-16 rounded-full border border-gold flex items-center justify-center text-gold mb-5">
                  <s.icon className="w-6 h-6" />
                </div>
                <div className="text-[10px] tracking-luxury uppercase text-gold mb-2">
                  Step 0{i + 1}
                </div>
                <h3 className="font-display text-2xl mb-3">{s.title}</h3>
                <p className="text-sm text-foreground/75 leading-relaxed">{s.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* TIMELINE */}
      <section className="py-24 bg-card border-t border-border">
        <div className="max-w-4xl mx-auto px-6 grid md:grid-cols-3 gap-8 text-center">
          {[
            { k: "7–14 days", v: "Ethnic wear" },
            { k: "21–35 days", v: "Bridal couture" },
            { k: "10–18 days", v: "Sarees & blouses" },
          ].map((t) => (
            <div key={t.v} className="reveal">
              <div className="font-display text-4xl text-gold">{t.k}</div>
              <div className="text-xs tracking-luxury uppercase mt-2 text-muted-foreground">
                {t.v}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* INQUIRY FORM */}
      <section className="py-28 border-t border-border">
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-center mb-12 reveal">
            <span className="divider-gold text-[10px] tracking-luxury uppercase">
              Begin Your Piece
            </span>
            <h2 className="mt-4 font-display text-4xl md:text-5xl">Bespoke Inquiry</h2>
            <p className="mt-4 text-sm text-muted-foreground">
              We respond within one working day, by WhatsApp or email.
            </p>
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const f = new FormData(e.currentTarget);
              const message = `Hello Rassa Boutique, I would like to inquire about bespoke custom stitching.

Name: ${f.get("name")}
Phone: ${f.get("phone")}
Garment: ${f.get("type")}
Date Needed: ${f.get("date")}
Notes: ${f.get("notes")}`;

              const encoded = encodeURIComponent(message);
              window.open(
                `https://wa.me/919633419902?text=${encoded}`,
                "_blank",
                "noopener,noreferrer",
              );
            }}
            className="reveal grid sm:grid-cols-2 gap-5 p-8 md:p-10 border border-border bg-card"
          >
            <Field label="Full Name" name="name" required />
            <Field label="Phone / WhatsApp" name="phone" required />
            <Field
              label="Garment Type"
              name="type"
              placeholder="e.g. Bridal lehenga, anarkali, saree blouse"
              required
            />
            <Field label="Date Needed" name="date" type="date" required />
            <div className="sm:col-span-2">
              <label className="block text-[10px] tracking-luxury uppercase text-gold mb-2">
                Notes & Inspiration
              </label>
              <textarea
                name="notes"
                rows={5}
                className="w-full bg-background border border-border px-4 py-3 text-sm outline-none focus:border-gold transition-colors"
                placeholder="Tell us about colours, fabrics, embroidery..."
              />
            </div>
            <div className="sm:col-span-2 flex justify-center mt-2">
              <button className="btn-gold">Send Inquiry</button>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
}

function Field({
  label,
  name,
  type = "text",
  required,
  placeholder,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
}) {
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
