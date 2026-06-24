import { createFileRoute } from "@tanstack/react-router";
import { useReveal } from "@/lib/use-reveal";
import { MapPin, Clock, Phone } from "lucide-react";
import store from "@/assets/store-interior.jpg";

export const Route = createFileRoute("/visit-store")({
  head: () => ({
    meta: [
      { title: "Visit Our Atelier — Rassa Boutique" },
      {
        name: "description",
        content:
          "Visit Rassa Boutique in Poolacode, Chathamangalam, Kozhikode. Step into our luxury atelier for sarees, lehengas, ethnic wear and bespoke couture.",
      },
      { property: "og:title", content: "Visit Our Atelier — Rassa Boutique" },
      { property: "og:description", content: "Step into our luxury atelier in Kozhikode, Kerala." },
      { property: "og:image", content: store },
    ],
  }),
  component: VisitStore,
});

function VisitStore() {
  useReveal();
  return (
    <div className="pt-28">
      <section className="relative h-[60vh] overflow-hidden">
        <img src={store} alt="Rassa boutique interior" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-background/40" />
        <div className="absolute inset-0 flex items-end justify-center pb-16 text-center px-6">
          <div>
            <span className="divider-gold text-[10px] tracking-luxury uppercase">Our Atelier</span>
            <h1 className="mt-4 font-display text-5xl md:text-7xl">
              Visit <span className="italic text-gradient-gold">Rassa</span>
            </h1>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 lg:px-10 py-24 grid md:grid-cols-2 gap-12 items-start">
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
            <p className="mt-3 text-sm text-muted-foreground italic">
              Near NIT Employees Co-operative Society &amp; Margin Free Supermarket.
            </p>
          </div>

          <div>
            <div className="flex items-center gap-3 text-gold text-[10px] tracking-luxury uppercase">
              <Clock className="w-4 h-4" /> Hours
            </div>
            <ul className="mt-3 space-y-1 font-serif text-lg">
              <li className="flex justify-between max-w-xs">
                <span>Mon – Sat</span>
                <span>10:00 — 21:00</span>
              </li>
              <li className="flex justify-between max-w-xs">
                <span>Sunday</span>
                <span>11:00 — 20:00</span>
              </li>
            </ul>
          </div>

          <div>
            <div className="flex items-center gap-3 text-gold text-[10px] tracking-luxury uppercase">
              <Phone className="w-4 h-4" /> Appointments
            </div>
            <p className="mt-3 font-serif text-lg">
              Bridal &amp; bespoke consultations are by appointment. <br />
              <a href="tel:+919633419902" className="text-gold underline-offset-4 hover:underline">
                +91 96334 19902
              </a>
            </p>
          </div>

          <div className="flex flex-wrap gap-3 pt-4">
            <a
              href="https://maps.google.com/?q=Chathamangalam+Kozhikode+Kerala+673601"
              target="_blank"
              rel="noreferrer"
              className="btn-gold"
            >
              Get Directions
            </a>
            <a
              href="https://wa.me/919633419902?text=Hello%20Rassa%20Boutique%2C%20I%20would%20like%20to%20schedule%20an%20appointment%20to%20visit%20your%20atelier."
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
            title="Rassa Boutique location"
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
