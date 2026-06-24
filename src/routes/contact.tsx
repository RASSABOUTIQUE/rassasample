import { createFileRoute } from "@tanstack/react-router";
import { useReveal } from "@/lib/use-reveal";
import { Phone, Mail, MapPin, Instagram, MessageCircle } from "lucide-react";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Rassa Boutique" },
      {
        name: "description",
        content:
          "Get in touch with Rassa Boutique — call, email, WhatsApp or visit our atelier in Kozhikode, Kerala.",
      },
      { property: "og:title", content: "Contact — Rassa Boutique" },
      {
        property: "og:description",
        content: "Connect with Rassa Boutique — call, email or WhatsApp our atelier.",
      },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  useReveal();
  return (
    <div className="pt-32 pb-24">
      <section className="max-w-3xl mx-auto px-6 text-center mb-16 reveal">
        <span className="divider-gold text-[10px] tracking-luxury uppercase">Get In Touch</span>
        <h1 className="mt-4 font-display text-5xl md:text-7xl">
          Let's <span className="italic text-gradient-gold">Talk</span>
        </h1>
        <p className="mt-6 font-serif italic text-lg text-foreground/80">
          Every garment begins with a conversation. We'd love to start yours.
        </p>
      </section>

      <div className="max-w-6xl mx-auto px-6 lg:px-10 grid md:grid-cols-2 gap-10">
        {/* Contact cards */}
        <div className="reveal space-y-5">
          {[
            { icon: Phone, label: "Call", value: "+91 96334 19902", href: "tel:+919633419902" },
            {
              icon: MessageCircle,
              label: "WhatsApp",
              value: "Chat with our stylist",
              href: "https://wa.me/919633419902?text=Hello%20Rassa%20Boutique%2C%20I%20would%20like%20to%20connect%20with%20an%20atelier%20stylist.",
            },
            {
              icon: Mail,
              label: "Email",
              value: "rassaboutique@gmail.com",
              href: "mailto:rassaboutique@gmail.com",
            },
            {
              icon: Instagram,
              label: "Instagram",
              value: "@rassaboutique",
              href: "https://instagram.com",
            },
            {
              icon: MapPin,
              label: "Visit",
              value: "Poolacode, Chathamangalam, Kozhikode 673601",
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

I would like to send an inquiry regarding your collections.

Name: ${f.get("name")}
Email: ${f.get("email")}
Message: ${f.get("message")}`;

            window.location.href = `mailto:rassaboutique@gmail.com?subject=Inquiry from ${f.get("name")}&body=${encodeURIComponent(bodyText)}`;
          }}
          className="reveal p-8 border border-border bg-card space-y-5"
        >
          <h2 className="font-display text-3xl text-gold">Send a Message</h2>
          <div>
            <label className="block text-[10px] tracking-luxury uppercase text-gold mb-2">
              Name
            </label>
            <input
              name="name"
              required
              className="w-full bg-background border border-border px-4 py-3 text-sm outline-none focus:border-gold"
            />
          </div>
          <div>
            <label className="block text-[10px] tracking-luxury uppercase text-gold mb-2">
              Email
            </label>
            <input
              name="email"
              type="email"
              required
              className="w-full bg-background border border-border px-4 py-3 text-sm outline-none focus:border-gold"
            />
          </div>
          <div>
            <label className="block text-[10px] tracking-luxury uppercase text-gold mb-2">
              Message
            </label>
            <textarea
              name="message"
              rows={5}
              required
              className="w-full bg-background border border-border px-4 py-3 text-sm outline-none focus:border-gold"
            />
          </div>
          <button className="btn-gold w-full">Send</button>
        </form>
      </div>
    </div>
  );
}
