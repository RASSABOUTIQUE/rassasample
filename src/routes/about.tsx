import { createFileRoute } from "@tanstack/react-router";
import { useReveal } from "@/lib/use-reveal";
import { GoldParticles } from "@/components/GoldParticles";
import { MapPin, Phone, Instagram, MessageCircle, Heart, Star, Scissors, ShieldCheck } from "lucide-react";
import { Link } from "@tanstack/react-router";
import store from "@/assets/store-interior.jpg";
import thread from "@/assets/story-thread.jpg";
import confidence from "@/assets/story-confidence.jpg";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Rassa Boutique — Kozhikode, Kerala" },
      {
        name: "description",
        content:
          "Learn about Rassa Boutique — Kerala's premier women's boutique in Kozhikode. Silk sarees, kasavu, bridal wear, and custom stitching since our founding.",
      },
      { property: "og:title", content: "About Rassa Boutique — Kozhikode, Kerala" },
    ],
  }),
  component: AboutPage,
});

const values = [
  {
    icon: Heart,
    title: "Made with Care",
    desc: "Every outfit is chosen and stitched with genuine attention to quality and detail.",
  },
  {
    icon: Star,
    title: "Personal Service",
    desc: "We guide each customer from selection to delivery — not just sell products.",
  },
  {
    icon: Scissors,
    title: "Expert Stitching",
    desc: "Our tailors have years of experience tailoring for Kerala occasions.",
  },
  {
    icon: ShieldCheck,
    title: "Trusted by Families",
    desc: "Brides, mothers, and families from across Kozhikode trust us for special occasions.",
  },
];

function AboutPage() {
  useReveal();
  return (
    <div className="bg-background min-h-screen pt-24">
      {/* Hero */}
      <section className="relative h-[60vh] overflow-hidden">
        <img src={store} alt="Rassa Boutique store interior, Kozhikode" className="w-full h-full object-cover brightness-[0.7]" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />
        <div className="absolute inset-0 flex items-end justify-center pb-16 text-center px-6">
          <div className="reveal">
            <span className="divider-gold text-[10px] tracking-luxury uppercase">Kozhikode, Kerala</span>
            <h1 className="mt-4 font-display text-5xl md:text-7xl leading-tight">
              About <span className="italic text-gradient-gold">Rassa</span>
            </h1>
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="max-w-6xl mx-auto px-6 lg:px-10 py-24 grid md:grid-cols-2 gap-14 items-center">
        <div className="reveal">
          <span className="divider-gold text-[10px] tracking-luxury uppercase">Our Story</span>
          <h2 className="mt-5 font-display text-4xl leading-tight">
            A boutique built for <span className="italic text-gradient-gold">Kerala women</span>
          </h2>
          <p className="mt-5 font-serif text-base leading-relaxed text-foreground/80">
            Rassa Boutique was born from a simple belief — every woman deserves to find an outfit
            she truly loves, without compromise on quality or fit.
          </p>
          <p className="mt-4 font-serif text-base leading-relaxed text-foreground/80">
            Located in Chathamangalam, Kozhikode, we are a family boutique that specialises in
            Kerala bridal wear, kasavu sarees, silk sarees, churidars, and custom stitching. We
            serve customers from across Kozhikode and Kerala who are looking for quality outfits
            for weddings, Onam, Eid, and everyday occasions.
          </p>
          <p className="mt-4 font-serif text-base leading-relaxed text-foreground/80">
            Our team personally selects every fabric and garment we stock. If we wouldn't wear it
            ourselves, it doesn't go on our shelves.
          </p>
        </div>
        <div className="reveal relative aspect-[4/5] overflow-hidden">
          <div className="absolute inset-4 border border-gold/25 z-10 pointer-events-none" />
          <img src={thread} alt="Fabric detail — Rassa Boutique" loading="lazy" className="w-full h-full object-cover" />
        </div>
      </section>

      {/* Values */}
      <section className="bg-card border-t border-b border-border py-20">
        <div className="max-w-6xl mx-auto px-6 lg:px-10">
          <div className="text-center mb-14 reveal">
            <span className="divider-gold text-[10px] tracking-luxury uppercase">Our Values</span>
            <h2 className="mt-4 font-display text-4xl">Why Customers Choose Us</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((v) => (
              <div key={v.title} className="reveal text-center">
                <div className="mx-auto w-14 h-14 rounded-full border border-gold/50 flex items-center justify-center text-gold mb-4">
                  <v.icon className="w-6 h-6" />
                </div>
                <h3 className="font-display text-xl text-ivory mb-2">{v.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What we offer */}
      <section className="max-w-6xl mx-auto px-6 lg:px-10 py-24 grid md:grid-cols-2 gap-14 items-center">
        <div className="reveal relative aspect-[4/5] overflow-hidden order-2 md:order-1">
          <img src={confidence} alt="Rassa Boutique collection" loading="lazy" className="w-full h-full object-cover" />
        </div>
        <div className="reveal order-1 md:order-2">
          <span className="divider-gold text-[10px] tracking-luxury uppercase">What We Offer</span>
          <h2 className="mt-5 font-display text-4xl leading-tight">
            Everything a woman needs <br />
            <span className="italic text-gradient-gold">for every occasion</span>
          </h2>
          <ul className="mt-6 space-y-3">
            {[
              "Kerala Bridal Sarees & Kasavu Sets",
              "Silk Sarees — Kanjivaram, Banarasi, Mysore",
              "Designer & Georgette Sarees",
              "Churidar & Salwar Sets",
              "Kurtis for Daily & Party Wear",
              "Onam & Festive Collections",
              "Reception Gowns & Indo-Western Wear",
              "Bridal Lehengas",
              "Kids Ethnic Wear",
              "Custom Stitching — Blouses, Churidars, Salwars",
            ].map((item) => (
              <li key={item} className="flex items-center gap-3 text-sm text-foreground/80">
                <span className="w-1.5 h-1.5 rounded-full bg-gold shrink-0" />
                {item}
              </li>
            ))}
          </ul>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link to="/shop" className="btn-gold">Browse Shop</Link>
            <Link to="/custom-stitching" className="btn-ghost-gold">Custom Stitching</Link>
          </div>
        </div>
      </section>

      {/* Contact strip */}
      <section className="border-t border-border py-20 relative overflow-hidden">
        <GoldParticles count={6} />
        <div className="max-w-4xl mx-auto px-6 text-center reveal">
          <h2 className="font-display text-4xl text-ivory">
            Come Visit <span className="italic text-gradient-gold">Our Store</span>
          </h2>
          <p className="mt-4 font-serif text-base text-foreground/75 max-w-md mx-auto">
            We're located in Chathamangalam, Kozhikode. Walk in anytime — our team is always happy to help.
          </p>
          <div className="mt-6 flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <MapPin className="w-4 h-4 text-gold" />
            <span>Poolacode, Chathamangalam, Kozhikode 673601 · Mon–Sat 10am–9pm</span>
          </div>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <a
              href="https://wa.me/919633419902"
              target="_blank"
              rel="noreferrer"
              className="btn-gold flex items-center gap-2"
            >
              <MessageCircle className="w-4 h-4" />
              Chat on WhatsApp
            </a>
            <Link to="/visit-store" className="btn-ghost-gold flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              Get Directions
            </Link>
            <a href="https://instagram.com" target="_blank" rel="noreferrer" className="btn-ghost-gold flex items-center gap-2">
              <Instagram className="w-4 h-4" />
              Follow on Instagram
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
