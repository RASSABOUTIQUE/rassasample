import { createFileRoute } from "@tanstack/react-router";
import { useReveal } from "@/lib/use-reveal";
import { MapPin, Clock, Phone } from "lucide-react";
import store from "@/assets/store-interior.jpg";

export const Route = createFileRoute("/visit-store")({
  head: () => ({
    meta: [
      { title: "Visit Rassa Boutique — Kozhikode, Kerala" },
      {
        name: "description",
        content:
          "Visit Rassa Boutique in Poolacode, Chathamangalam, Kozhikode. Sarees, bridal wear, churidars, kurtis, and custom stitching — open 7 days a week.",
      },
      { property: "og:title", content: "Visit Rassa Boutique — Kozhikode, Kerala" },
      {
        property: "og:description",
        content: "Visit our boutique in Kozhikode, Kerala — open Mon–Sat 10am–9pm.",
      },
      { property: "og:image", content: store },
    ],
  }),
  component: VisitStore,
});

function VisitStore() {
  useReveal();
  return (
    <div className="pt-28">
      <section className="relative h-[55vh] overflow-hidden">
        <img src={store} alt="Rassa Boutique interior, Kozhikode Kerala" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-background/30" />
        <div className="absolute inset-0 flex items-end justify-center pb-14 text-center px-6">
          <div>
            <span className="divider-gold text-[10px] tracking-luxury uppercase">
              Rassa Boutique · Kozhikode, Kerala
            </span>
            <h1 className="mt-4 font-display text-5xl md:text-6xl">
              Visit <span className="italic text-gradient-gold">Our Store</span>
            </h1>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 lg:px-10 py-20 grid md:grid-cols-2 gap-12 items-start">
        <div className="reveal space-y-8">
          <div>
            <div className="flex items-center gap-3 text-gold text-[10px] tracking-luxury uppercase">
              <MapPin className="w-4 h-4" /> Address
            </div>
            <p className="mt-3 font-serif text-xl leading-relaxed">
              Poolacode, Chathamangalam,
              <br />
              Kattangal–Koduvally Road,
              <br />
              Kozhikode, Kerala — 673601
            </p>
            <p className="mt-3 text-sm text-muted-foreground">
              Near NIT Employees Co-operative Society &amp; Margin Free Supermarket.
            </p>
          </div>

          <div>
            <div className="flex items-center gap-3 text-gold text-[10px] tracking-luxury uppercase">
              <Clock className="w-4 h-4" /> Store Hours
            </div>
            <ul className="mt-3 space-y-2 font-serif text-lg">
              <li className="flex justify-between max-w-xs">
                <span>Monday – Saturday</span>
                <span>10:00 am – 9:00 pm</span>
              </li>
              <li className="flex justify-between max-w-xs">
                <span>Sunday</span>
                <span>11:00 am – 8:00 pm</span>
              </li>
            </ul>
          </div>

          <div>
            <div className="flex items-center gap-3 text-gold text-[10px] tracking-luxury uppercase">
              <Phone className="w-4 h-4" /> Appointments
            </div>
            <p className="mt-3 font-serif text-lg leading-relaxed">
              Bridal consultations and custom stitching sessions are by appointment. Call or WhatsApp
              us to schedule your visit at a time that works for you.
              <br />
              <a href="tel:+919633419902" className="text-gold underline-offset-4 hover:underline mt-2 inline-block">
                +91 96334 19902
              </a>
            </p>
          </div>

          <div className="flex flex-wrap gap-3 pt-2">
            <a
              href="https://maps.google.com/?q=Chathamangalam+Kozhikode+Kerala+673601"
              target="_blank"
              rel="noreferrer"
              className="btn-gold"
            >
              Get Directions
            </a>
            <a
              href="https://wa.me/919633419902?text=Hello%20Rassa%20Boutique%2C%20I%20would%20like%20to%20schedule%20an%20appointment%20to%20visit%20your%20store."
              target="_blank"
              rel="noreferrer"
              className="btn-ghost-gold"
            >
              Book Appointment
            </a>
          </div>
        </div>

        <div className="reveal relative aspect-[4/5] overflow-hidden border border-border">
          <iframe
            title="Rassa Boutique location, Kozhikode Kerala"
            src="https://www.google.com/maps?q=Chathamangalam,+Kozhikode,+Kerala+673601&output=embed"
            className="absolute inset-0 w-full h-full grayscale contrast-125"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </section>
    </div>
  );
}
