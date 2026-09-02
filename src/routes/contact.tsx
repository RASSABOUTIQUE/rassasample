import { createFileRoute } from "@tanstack/react-router";
import { useReveal } from "@/lib/use-reveal";
import { Phone, Mail, MapPin, Instagram, MessageCircle } from "lucide-react";
import { useCMS } from "@/lib/cms";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Rassa Boutique" },
      {
        name: "description",
        content:
          "Get in touch with Rassa Boutique — call, email, WhatsApp, or visit our store in Kozhikode, Kerala.",
      },
      { property: "og:title", content: "Contact — Rassa Boutique" },
      {
        property: "og:description",
        content: "Call, email, or WhatsApp Rassa Boutique in Kozhikode, Kerala.",
      },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  useReveal();
  const { cms } = useCMS();
  const store = cms.store;

  return (
    <div className="pt-32 pb-24">
      <section className="max-w-3xl mx-auto px-6 text-center mb-14 reveal">
        <span className="divider-gold text-[10px] tracking-luxury uppercase">Get in Touch</span>
        <h1 className="mt-4 font-display text-5xl md:text-6xl">
          We're Happy to <span className="italic text-gradient-gold">Help</span>
        </h1>
        <p className="mt-5 font-serif text-lg text-foreground/80 leading-relaxed">
          Have a question about our collections, custom stitching, or bridal wear? Reach out and
          our team will get back to you quickly.
        </p>
      </section>

      <div className="max-w-6xl mx-auto px-6 lg:px-10 grid md:grid-cols-2 gap-10">
        {/* Contact cards */}
        <div className="reveal space-y-4">
          {[
            {
              icon: Phone,
              label: "Call Us",
              value: store.phone,
              href: `tel:${store.phone.replace(/[^0-9+]/g, "")}`,
            },
            {
              icon: MessageCircle,
              label: "WhatsApp",
              value: "Chat with our team",
              href: `https://wa.me/${store.whatsapp.replace(/[^0-9+]/g, "")}?text=Hello%20Rassa%20Boutique%2C%20I%20would%20like%20to%20connect%20with%20your%20team.`,
            },
            {
              icon: Mail,
              label: "Email",
              value: store.email,
              href: `mailto:${store.email}`,
            },
            {
              icon: Instagram,
              label: "Instagram",
              value: store.instagram.replace("https://instagram.com/", "@").replace("https://www.instagram.com/", "@"),
              href: store.instagram,
            },
            {
              icon: MapPin,
              label: "Visit Our Store",
              value: `${store.address}, ${store.city} ${store.pincode}`,
              href: "/visit-store",
            },
          ].map((c) => (
            <a
              key={c.label}
              href={c.href}
              target={c.href.startsWith("http") ? "_blank" : undefined}
              rel="noreferrer"
              className="group flex items-start gap-5 p-6 border border-border bg-card hover:border-gold transition-colors"
            >
              <div className="w-11 h-11 rounded-full border border-gold flex items-center justify-center text-gold shrink-0">
                <c.icon className="w-5 h-5" />
              </div>
              <div>
                <div className="text-[10px] tracking-luxury uppercase text-gold">{c.label}</div>
                <div className="mt-1 font-serif text-lg group-hover:text-gold transition-colors">
                  {c.value}
                </div>
              </div>
            </a>
          ))}
        </div>

        {/* Form */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const f = new FormData(e.currentTarget);
            const bodyText = `Hello Rassa Boutique,

I would like to send an inquiry.

Name: ${f.get("name")}
Email: ${f.get("email")}
Message: ${f.get("message")}`;

            window.location.href = `mailto:rassaboutique@gmail.com?subject=Inquiry from ${f.get("name")}&body=${encodeURIComponent(bodyText)}`;
          }}
          className="reveal p-8 border border-border bg-card space-y-5"
        >
          <h2 className="font-display text-3xl text-gold">Send a Message</h2>
          <p className="text-sm text-muted-foreground">
            We'll reply within one working day — or WhatsApp us for a faster response.
          </p>
          <div>
            <label className="block text-[10px] tracking-luxury uppercase text-gold mb-2">
              Your Name
            </label>
            <input
              name="name"
              required
              className="w-full bg-background border border-border px-4 py-3 text-sm outline-none focus:border-gold transition-colors"
            />
          </div>
          <div>
            <label className="block text-[10px] tracking-luxury uppercase text-gold mb-2">
              Your Email
            </label>
            <input
              name="email"
              type="email"
              required
              className="w-full bg-background border border-border px-4 py-3 text-sm outline-none focus:border-gold transition-colors"
            />
          </div>
          <div>
            <label className="block text-[10px] tracking-luxury uppercase text-gold mb-2">
              Your Message
            </label>
            <textarea
              name="message"
              rows={5}
              required
              placeholder="Tell us what you're looking for — a bridal outfit, a saree, custom stitching, or anything else."
              className="w-full bg-background border border-border px-4 py-3 text-sm outline-none focus:border-gold transition-colors"
            />
          </div>
          <button className="btn-gold w-full">Send Message</button>
        </form>
      </div>
    </div>
  );
}
