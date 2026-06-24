import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef } from "react";
import { useReveal } from "@/lib/use-reveal";
import { GoldParticles } from "@/components/GoldParticles";
import { categories, products, inr } from "@/lib/products";
import hero from "@/assets/hero-bride.jpg";
import fabric from "@/assets/fabric-banner.jpg";
import storyThread from "@/assets/story-thread.jpg";
import storyConfidence from "@/assets/story-confidence.jpg";
import sarees from "@/assets/cat-sarees.jpg";
import bridal from "@/assets/cat-bridal.jpg";
import storeInterior from "@/assets/store-interior.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Rassa Boutique — Where Elegance Becomes Identity" },
      {
        name: "description",
        content:
          "Step into a cinematic world of luxury Indian fashion. Bridal lehengas, sarees, ethnic and bespoke couture from Rassa Boutique, Kozhikode.",
      },
      { property: "og:title", content: "Rassa Boutique — Where Elegance Becomes Identity" },
      {
        property: "og:description",
        content: "Cinematic luxury Indian fashion — sarees, bridal lehengas and bespoke couture.",
      },
      { property: "og:image", content: hero },
      { name: "twitter:image", content: hero },
    ],
  }),
  component: Home,
});

function Home() {
  useReveal();
  const heroRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      if (imgRef.current) {
        const rot = Math.min(y / 40, 8);
        const scale = 1 + Math.min(y / 4000, 0.08);
        imgRef.current.style.transform = `translateY(${y * 0.15}px) scale(${scale}) rotateY(${rot}deg)`;
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const featured = products.slice(0, 4);

  return (
    <div className="bg-background">
      {/* HERO */}
      <section
        ref={heroRef}
        className="relative min-h-[100vh] overflow-hidden flex items-center justify-center"
      >
        <div className="absolute inset-0 [background:var(--gradient-radial-gold)] opacity-70" />
        <GoldParticles count={28} />

        <div className="absolute inset-0 flex items-center justify-center [perspective:1500px]">
          <img
            ref={imgRef}
            src={hero}
            alt="Rassa Boutique bridal lehenga"
            width={1024}
            height={1664}
            className="h-[90vh] w-auto object-contain transition-transform duration-300 will-change-transform drop-shadow-[0_30px_60px_rgba(0,0,0,0.7)]"
          />
        </div>

        <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-background to-transparent" />

        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center pt-32">
          <span className="divider-gold text-[10px] tracking-luxury uppercase">An Atelier</span>
          <h1 className="mt-6 font-display text-[clamp(2.75rem,8vw,7rem)] leading-[0.95] text-ivory">
            Where Elegance
            <br />
            <span className="italic text-gradient-gold">Becomes Identity</span>
          </h1>
          <p className="mt-8 max-w-xl mx-auto font-serif italic text-lg md:text-xl text-foreground/80">
            A women's luxury boutique born in Kerala — woven for the bride, the dreamer, the woman
            who wears her story.
          </p>
        </div>

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-3 text-gold animate-float">
          <span className="text-[10px] tracking-luxury uppercase">Scroll</span>
          <div className="w-px h-12 bg-gradient-to-b from-gold to-transparent" />
        </div>
      </section>

      {/* STORY 1 — Every Thread */}
      <section className="relative py-32 lg:py-40 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 grid md:grid-cols-2 gap-16 items-center">
          <div className="reveal order-2 md:order-1">
            <span className="divider-gold text-[10px] tracking-luxury uppercase">Chapter I</span>
            <h2 className="mt-6 font-display text-5xl md:text-6xl leading-tight">
              Every Thread
              <br />
              <span className="italic text-gradient-gold">Tells A Story</span>
            </h2>
            <p className="mt-6 font-serif text-lg leading-relaxed text-foreground/80">
              From the loom of a Banarasi weaver to the patient hands of our karigars, each garment
              carries the breath of those who made it. Heritage is not borrowed at Rassa — it is
              honoured, thread by thread.
            </p>
          </div>
          <div className="reveal order-1 md:order-2 relative aspect-[4/3] overflow-hidden">
            <div className="absolute inset-0 border border-gold/40 -translate-x-4 -translate-y-4" />
            <img
              src={storyThread}
              alt="Gold zari embroidery"
              width={1280}
              height={960}
              loading="lazy"
              className="relative w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* Fabric drift banner */}
      <section className="relative h-[40vh] overflow-hidden border-y border-border">
        <div className="absolute inset-0 flex">
          <img
            src={fabric}
            alt=""
            aria-hidden
            width={1920}
            height={800}
            loading="lazy"
            className="h-full w-auto max-w-none animate-drift opacity-80"
          />
          <img
            src={fabric}
            alt=""
            aria-hidden
            width={1920}
            height={800}
            loading="lazy"
            className="h-full w-auto max-w-none animate-drift opacity-80"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-background via-transparent to-background" />
      </section>

      {/* STORY 2 — Every Design */}
      <section className="relative py-32 lg:py-40 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 grid md:grid-cols-2 gap-16 items-center">
          <div className="reveal relative aspect-[4/5] overflow-hidden">
            <div className="absolute inset-0 border border-gold/40 translate-x-4 translate-y-4" />
            <img
              src={storyConfidence}
              alt="Confident woman in black and gold saree"
              width={1280}
              height={960}
              loading="lazy"
              className="relative w-full h-full object-cover"
            />
          </div>
          <div className="reveal">
            <span className="divider-gold text-[10px] tracking-luxury uppercase">Chapter II</span>
            <h2 className="mt-6 font-display text-5xl md:text-6xl leading-tight">
              Every Design
              <br />
              <span className="italic text-gradient-gold">Reflects Confidence</span>
            </h2>
            <p className="mt-6 font-serif text-lg leading-relaxed text-foreground/80">
              A silhouette that listens. A drape that empowers. We design for the woman who walks
              into a room and quiets it — not with volume, but with presence.
            </p>
          </div>
        </div>
      </section>

      {/* CATEGORIES — fabric transition */}
      <section className="relative py-28 lg:py-36 bg-gradient-to-b from-background via-background to-card">
        <GoldParticles count={12} />
        <div className="max-w-7xl mx-auto px-6 lg:px-10 text-center mb-20 reveal">
          <span className="divider-gold text-[10px] tracking-luxury uppercase">
            The Collections
          </span>
          <h2 className="mt-6 font-display text-5xl md:text-6xl">
            A House of <span className="italic text-gradient-gold">Many Stories</span>
          </h2>
        </div>

        <div className="max-w-7xl mx-auto px-6 lg:px-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((c, i) => (
            <Link
              key={c.slug}
              to="/shop"
              className={`reveal group relative overflow-hidden block aspect-[4/5] ${i === 0 ? "lg:row-span-2 lg:aspect-auto" : ""}`}
            >
              <img
                src={c.image}
                alt={c.name}
                width={1024}
                height={1280}
                loading="lazy"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-[2000ms] group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
              <div className="absolute inset-0 border border-transparent group-hover:border-gold/60 transition-colors duration-700" />
              <div className="absolute bottom-0 left-0 right-0 p-8">
                <span className="text-[10px] tracking-luxury uppercase text-gold">Atelier</span>
                <h3 className="mt-3 font-display text-3xl md:text-4xl">{c.name}</h3>
                <p className="mt-3 text-sm text-foreground/75 max-w-xs">{c.blurb}</p>
                <span className="inline-block mt-5 text-[11px] tracking-luxury uppercase text-gold border-b border-gold pb-1 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  Discover →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* LUXURY EDITORIAL GALLERY */}
      <section className="py-32 bg-onyx border-t border-border/40 relative overflow-hidden">
        <GoldParticles count={8} />
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="text-center mb-20 reveal">
            <span className="divider-gold text-[10px] tracking-luxury uppercase">The Gallery</span>
            <h2 className="mt-6 font-display text-5xl md:text-6xl">
              Editorial <span className="italic text-gradient-gold">Showcase</span>
            </h2>
            <p className="mt-4 font-serif italic text-lg text-foreground/75 max-w-md mx-auto">
              A cinematic curation of our most prestigious creations, worn by the modern dreamer.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 lg:gap-14">
            {[
              {
                id: "ed1",
                name: "Maroon Zardozi Bridal Lehenga",
                price: "₹48,500",
                image: hero,
                desc: "An heirloom crimson velvet lehenga intricately embellished with traditional hand-crafted gold zardozi threadwork.",
                whatsapp:
                  "Hello Rassa Boutique, I am inquiring about the Maroon Zardozi Bridal Lehenga featured in your Editorial Gallery.",
              },
              {
                id: "ed2",
                name: "Emerald Kanjivaram Silk Saree",
                price: "₹18,900",
                image: sarees,
                desc: "Hand-loomed pure Kanjivaram silk, featuring an exquisite antique gold border and rich traditional pallu.",
                whatsapp:
                  "Hello Rassa Boutique, I am inquiring about the Emerald Kanjivaram Silk Saree featured in your Editorial Gallery.",
              },
              {
                id: "ed3",
                name: "Gold Threadwork Luxury Lehenga",
                price: "₹56,800",
                image: bridal,
                desc: "An ivory-gold masterpiece layered with sheer organza and adorned with delicate hand-painted motifs and crystals.",
                whatsapp:
                  "Hello Rassa Boutique, I am inquiring about the Gold Threadwork Luxury Lehenga featured in your Editorial Gallery.",
              },
            ].map((look, idx) => (
              <div key={look.id} className="reveal group flex flex-col" data-cursor="VIEW">
                <div className="relative aspect-[3/4] overflow-hidden border border-border/40 mb-6">
                  {/* Inner decorative border */}
                  <div className="absolute inset-4 border border-gold/15 pointer-events-none z-10 transition-all duration-700 group-hover:inset-2 group-hover:border-gold/45" />

                  <img
                    src={look.image}
                    alt={look.name}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-[2000ms] cubic-bezier(0.16, 1, 0.3, 1) group-hover:scale-105 filter brightness-[0.92]"
                  />

                  {/* Dark overlay on hover */}
                  <div className="absolute inset-0 bg-black/45 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center z-20">
                    <button
                      onClick={() => {
                        const encoded = encodeURIComponent(look.whatsapp);
                        window.open(
                          `https://wa.me/919633419902?text=${encoded}`,
                          "_blank",
                          "noopener,noreferrer",
                        );
                      }}
                      className="btn-gold scale-90 group-hover:scale-100 transition-transform duration-500"
                    >
                      Inquire Design
                    </button>
                  </div>
                </div>

                <span className="text-[9px] tracking-luxury uppercase text-gold">
                  Look 0{idx + 1}
                </span>
                <h3 className="mt-2 font-display text-2xl group-hover:text-gold transition-colors">
                  {look.name}
                </h3>
                <p className="mt-2 font-serif text-sm text-muted-foreground leading-relaxed flex-1">
                  {look.desc}
                </p>
                <div className="mt-4 pt-4 border-t border-border/30 flex items-center justify-between">
                  <span className="font-sans text-sm text-gold-soft">{look.price}</span>
                  <button
                    onClick={() => {
                      const encoded = encodeURIComponent(look.whatsapp);
                      window.open(
                        `https://wa.me/919633419902?text=${encoded}`,
                        "_blank",
                        "noopener,noreferrer",
                      );
                    }}
                    className="text-[10px] tracking-luxury uppercase text-gold hover:text-ivory transition-colors"
                  >
                    Send Inquiry →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* STORY 3 — Where Elegance */}
      <section className="relative py-40 text-center overflow-hidden">
        <GoldParticles count={20} />
        <div className="max-w-3xl mx-auto px-6 reveal">
          <span className="divider-gold text-[10px] tracking-luxury uppercase">Chapter III</span>
          <h2 className="mt-6 font-display text-5xl md:text-7xl leading-tight">
            Where Elegance
            <br />
            <span className="italic text-gradient-gold">Becomes Identity</span>
          </h2>
          <p className="mt-8 font-serif italic text-xl text-foreground/80">
            It is not the garment that defines you. It is the way you wear it.
          </p>
          <div className="mt-12 flex flex-wrap items-center justify-center gap-4">
            <Link to="/collections" className="btn-gold">
              Explore Collections
            </Link>
            <Link to="/custom-stitching" className="btn-ghost-gold">
              Bespoke Couture
            </Link>
          </div>
        </div>
      </section>

      {/* BRIDAL CONSULTATION EXPERIENCE */}
      <section className="py-32 bg-gradient-to-b from-card to-background border-y border-border/40 relative overflow-hidden">
        <GoldParticles count={10} />
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            {/* Left Image Spreader */}
            <div
              className="lg:col-span-5 reveal relative aspect-[4/5] overflow-hidden border border-border/40 bg-card order-2 lg:order-1"
              data-cursor="VIEW"
            >
              <div className="absolute inset-4 border border-gold/20 pointer-events-none z-10" />
              <img
                src={storeInterior}
                alt="Rassa Boutique Atelier Interior"
                loading="lazy"
                className="w-full h-full object-cover filter brightness-[0.85] contrast-105 hover:scale-105 transition-transform duration-1000"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-8 left-8 right-8 text-center z-20">
                <span className="text-[10px] tracking-luxury uppercase text-gold">The Atelier</span>
                <p className="mt-2 font-serif italic text-sm text-ivory">
                  Chathamangalam, Kozhikode, Kerala
                </p>
              </div>
            </div>

            {/* Right Consultation Text Details */}
            <div className="lg:col-span-7 flex flex-col justify-center order-1 lg:order-2 reveal">
              <span className="divider-gold text-[10px] tracking-luxury uppercase">
                Private Experience
              </span>
              <h2 className="mt-6 font-display text-4xl lg:text-6xl leading-tight text-ivory">
                The Bridal
                <br />
                <span className="italic text-gradient-gold">Consultation</span>
              </h2>
              <p className="mt-6 font-serif text-base lg:text-lg leading-relaxed text-foreground/80">
                Crafting a bridal trousseau is a sacred design journey. We offer a highly
                personalized experience where each contour is measured, each detail discussed, and
                each thread curated to honor your identity.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mt-12 mb-10 border-t border-border/40 pt-8">
                {[
                  {
                    num: "01",
                    title: "Bespoke Consultation",
                    desc: "A private session with our lead designers to align on your aesthetic vision, color stories, and wedding event themes.",
                  },
                  {
                    num: "02",
                    title: "Fabric & Craft Selection",
                    desc: "Explore and select from handpicked silks, premium velvets, and choose heritage embroidery details like authentic zardozi or dabka.",
                  },
                  {
                    num: "03",
                    title: "Atelier Design Sketching",
                    desc: "Watch your couture come to life as our designers translate your discussion into custom, hand-drawn fashion illustrations.",
                  },
                  {
                    num: "04",
                    title: "Precision Fit & Draping",
                    desc: "Experience exact measurement mapping and custom fitting sessions with our master tailors to ensure a flawless, custom-sculpted contour.",
                  },
                ].map((step) => (
                  <div key={step.num} className="flex gap-4">
                    <span className="font-display text-2xl font-light text-gold tracking-widest">
                      {step.num}
                    </span>
                    <div>
                      <h4 className="font-sans text-xs font-semibold tracking-luxury uppercase text-ivory">
                        {step.title}
                      </h4>
                      <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                        {step.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Book button */}
              <div>
                <button
                  onClick={() => {
                    const msg =
                      "Hello Rassa Boutique, I would like to book a luxury Bridal Consultation for my wedding. Please guide me to schedule a session.";
                    const encoded = encodeURIComponent(msg);
                    window.open(
                      `https://wa.me/919633419902?text=${encoded}`,
                      "_blank",
                      "noopener,noreferrer",
                    );
                  }}
                  className="btn-gold group relative"
                  data-cursor="BOOK"
                >
                  <span className="flex items-center gap-2">Book Consultation</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED PIECES */}
      <section className="py-28 border-t border-border">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="flex items-end justify-between flex-wrap gap-6 mb-14 reveal">
            <div>
              <span className="divider-gold text-[10px] tracking-luxury uppercase">
                Editor's Edit
              </span>
              <h2 className="mt-4 font-display text-4xl md:text-5xl">Featured Pieces</h2>
            </div>
            <Link
              to="/shop"
              className="text-[11px] tracking-luxury uppercase text-gold border-b border-gold pb-1"
            >
              View All →
            </Link>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {featured.map((p) => (
              <Link to="/shop" key={p.id} className="reveal group block">
                <div className="relative aspect-[3/4] overflow-hidden mb-4">
                  <img
                    src={p.image}
                    alt={p.name}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                  />
                  {p.tag && (
                    <span className="absolute top-4 left-4 text-[10px] tracking-luxury uppercase bg-gold/95 text-onyx px-3 py-1">
                      {p.tag}
                    </span>
                  )}
                </div>
                <h3 className="font-serif text-lg leading-snug group-hover:text-gold transition-colors">
                  {p.name}
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">{inr(p.price)}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-28 bg-card border-t border-border">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="text-center mb-16 reveal">
            <span className="divider-gold text-[10px] tracking-luxury uppercase">Whispers</span>
            <h2 className="mt-4 font-display text-4xl md:text-5xl">From Our Patrons</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                quote:
                  "My bridal lehenga from Rassa felt like wearing a poem. The craftsmanship is unreal.",
                name: "Aiswarya M.",
                role: "Bride, 2025",
              },
              {
                quote:
                  "From the consultation to the final fitting, every detail was held with such care.",
                name: "Fathima R.",
                role: "Custom Couture",
              },
              {
                quote:
                  "The only boutique in Kerala where I feel truly seen as a modern Indian woman.",
                name: "Nivedita K.",
                role: "Regular Patron",
              },
            ].map((t) => (
              <figure key={t.name} className="reveal p-8 border border-border bg-background/60">
                <p className="font-serif italic text-lg leading-relaxed text-foreground/90">
                  "{t.quote}"
                </p>
                <figcaption className="mt-6 pt-6 border-t border-border">
                  <div className="font-display text-gold">{t.name}</div>
                  <div className="text-xs tracking-wide-luxury uppercase text-muted-foreground mt-1">
                    {t.role}
                  </div>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
