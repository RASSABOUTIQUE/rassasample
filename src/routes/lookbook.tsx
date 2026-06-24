import { createFileRoute } from "@tanstack/react-router";
import { useReveal } from "@/lib/use-reveal";
import { useEffect } from "react";
import { GoldParticles } from "@/components/GoldParticles";
import { Sparkles, MessageCircle, ArrowRight } from "lucide-react";

// Image imports
import heroBride from "@/assets/hero-bride.jpg";
import catSarees from "@/assets/cat-sarees.jpg";
import catBridal from "@/assets/cat-bridal.jpg";
import storyConfidence from "@/assets/story-confidence.jpg";
import storyThread from "@/assets/story-thread.jpg";

export const Route = createFileRoute("/lookbook")({
  head: () => ({
    meta: [
      { title: "The Luxury Lookbook — Rassa Boutique" },
      {
        name: "description",
        content:
          "Explore the Rassa Boutique Luxury Lookbook. A curated editorial showcase of bridal wear, designer sarees, luxury lehengas, and bespoke stitching.",
      },
      { property: "og:title", content: "The Luxury Lookbook — Rassa Boutique" },
      {
        property: "og:description",
        content:
          "An editorial showcase of bridal lehengas, designer sarees, and bespoke couture by Rassa Boutique.",
      },
      { property: "og:image", content: heroBride },
    ],
  }),
  component: LookbookPage,
});

interface LookbookSpread {
  id: string;
  number: string;
  category: string;
  title: string;
  subtitle: string;
  quote: string;
  description: string;
  details: string[];
  image: string;
  whatsappMessage: string;
}

function LookbookPage() {
  useReveal();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const spreads: LookbookSpread[] = [
    {
      id: "bridal",
      number: "01",
      category: "The Bridal Atelier",
      title: "Heirloom",
      subtitle: "Couture",
      quote: "Hand-woven fabrics and meticulous needlework, designed to endure for generations.",
      description:
        "An exploration of classical Indian heritage, crafted in deep crimson silk-velvet and hand-spun raw silk. Each panel is individually patterned and embellished with antique zardozi, micro-pearls, and fine metallic dabka. Crafted in Chathamangalam by our master karigars, representing over three hundred hours of dedicated handwork. Tailored to achieve a flawless, custom-sculpted silhouette.",
      details: [
        "Premium Silk Velvet",
        "Fine Antique Zardozi",
        "Micro-pearl & Dabka Embroidery",
        "Bespoke Sculpted Fit",
      ],
      image: heroBride,
      whatsappMessage:
        "Hello Rassa Boutique, I would like to inquire about a private styling session for 'The Heirloom Couture' Bridal Collection.",
    },
    {
      id: "sarees",
      number: "02",
      category: "Heritage Weaves",
      title: "Authentic",
      subtitle: "Zari & Silks",
      quote: "Every drape is a testament to the patient hands of traditional weavers.",
      description:
        "A curated collection of double-warp Kanjivaram silks, authentic Banarasis, and fine organzas. We source directly from master weavers in Tamil Nadu and Varanasi, ensuring each saree features genuine gold-thread zari work and signature borders. These pieces combine traditional weaving patterns with clean, contemporary color stories for a refined, understated presence.",
      details: [
        "Double-Warp Pure Silk",
        "Authentic Gold Zari",
        "Hand-loomed in Traditional Hubs",
        "Atelier Blouse Design & Stitching",
      ],
      image: catSarees,
      whatsappMessage:
        "Hello Rassa Boutique, I'm interested in your 'Authentic Zari & Silks' heritage saree collection. Could you share available weaves?",
    },
    {
      id: "lehengas",
      number: "03",
      category: "Atelier Celebration",
      title: "Grace In",
      subtitle: "Motion",
      quote: "Sculpted silhouettes that combine weightless structure with rich visual depth.",
      description:
        "Designed for grand occasions, these lehengas feature voluminous paneled skirts crafted in heavy raw silk and sheer organza. Adorned with delicate hand-painted motifs, crystal highlights, and intricate resham threadwork. Engineered with a lightweight structured canvas to allow effortless movement and comfort during long celebrations.",
      details: [
        "Premium Raw Silk & Organza",
        "Delicate Hand-Painted Motifs",
        "Resham & Crystal Embellishment",
        "Lightweight Structured Inner Grid",
      ],
      image: catBridal,
      whatsappMessage:
        "Hello Rassa Boutique, I'm interested in the 'Grace in Motion' luxury lehenga collection. Could you share the customization options?",
    },
    {
      id: "reception",
      number: "04",
      category: "Evening Couture",
      title: "Modern Twilight",
      subtitle: "Silhouettes",
      quote: "A clean, minimalist dialogue between classic drapes and modern eveningwear.",
      description:
        "Tailored for contemporary receptions and formal soirées. This collection introduces pre-draped concept sarees, structural evening lehengas, and asymmetrical silhouettes. Rendered in deep jewel tones—emerald green, royal blue, and black-gold—complemented by subtle, hand-stitched beadwork and structural organza ruffles for an elegant, understated statement.",
      details: [
        "Pre-draped Concept Designs",
        "Deep Jewel Tone Textiles",
        "Structural Organza & Silk",
        "Hand-stitched Glass Beadwork",
      ],
      image: storyConfidence,
      whatsappMessage:
        "Hello Rassa Boutique, I would like to explore your 'Modern Twilight' Evening Couture. Could you share styling ideas for a reception?",
    },
    {
      id: "stitching",
      number: "05",
      category: "Bespoke Craft",
      title: "The Atelier",
      subtitle: "Process",
      quote: "A custom garment should fit like a second skin, reflecting your personal identity.",
      description:
        "Our bespoke custom stitching service is the heart of Rassa. From the initial hand-drawn sketch to the final fitting, our designers and master tailors collaborate with you at every step. We map your measurements with absolute precision, customizing necklines, sleeves, linings, and handcrafted tassels to create a one-of-a-kind garment tailored to your exact proportions.",
      details: [
        "Precision Measurement Mapping",
        "Bespoke Neckline & Silhouette Design",
        "Premium Linings & Tailoring",
        "Handcrafted Custom Tassels",
      ],
      image: storyThread,
      whatsappMessage:
        "Hello Rassa Boutique, I would like to book a bespoke tailoring appointment and discuss a custom design.",
    },
  ];

  const handleInquiry = (msg: string) => {
    const encoded = encodeURIComponent(msg);
    window.open(`https://wa.me/919633419902?text=${encoded}`, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="bg-background min-h-screen">
      {/* Editorial Header */}
      <section className="relative min-h-[70vh] flex flex-col justify-center items-center text-center px-6 overflow-hidden border-b border-border/60">
        <div className="absolute inset-0 [background:var(--gradient-radial-gold)] opacity-50" />
        <GoldParticles count={15} />

        <div className="relative z-10 max-w-4xl mx-auto pt-28">
          <span className="divider-gold text-[10px] tracking-luxury uppercase">
            Atelier Edition
          </span>
          <h1 className="mt-8 font-display text-[clamp(2.5rem,7vw,6.5rem)] leading-[0.95] text-ivory">
            The Luxury
            <br />
            <span className="italic text-gradient-gold">Lookbook</span>
          </h1>
          <p className="mt-8 max-w-xl mx-auto font-serif italic text-lg md:text-xl text-foreground/80 leading-relaxed">
            "Couture is the poetry of silhouette. At Rassa, we weave heritage into modern
            identities, creating garments to be worn slowly and lived in fully."
          </p>
        </div>

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 text-gold animate-bounce">
          <span className="text-[9px] tracking-luxury uppercase opacity-60">Scroll to Explore</span>
        </div>
      </section>

      {/* Magazine Spreads */}
      <div className="py-24 space-y-36 lg:space-y-48">
        {spreads.map((spread, index) => {
          const isEven = index % 2 === 0;
          return (
            <section key={spread.id} className="max-w-7xl mx-auto px-6 lg:px-10 overflow-hidden">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">
                {/* Image Panel (pristine, high-end editorial display) */}
                <div
                  className={`lg:col-span-6 relative aspect-[3/4] group overflow-hidden border border-border/40 bg-card reveal ${
                    isEven ? "lg:order-1" : "lg:order-2"
                  }`}
                  data-cursor="VIEW"
                >
                  {/* Floating decorative border */}
                  <div
                    className={`absolute inset-4 border border-gold/20 pointer-events-none z-10 transition-all duration-700 group-hover:inset-2 group-hover:border-gold/50`}
                  />

                  {/* Editorial Image (No tacky text overlay) */}
                  <img
                    src={spread.image}
                    alt={`${spread.category} - Rassa Boutique`}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-[2500ms] cubic-bezier(0.16, 1, 0.3, 1) group-hover:scale-105 filter brightness-95"
                  />

                  {/* Visual Shimmer Screen */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent opacity-40 pointer-events-none" />
                </div>

                {/* Editorial Content Spread */}
                <div
                  className={`lg:col-span-6 flex flex-col justify-center reveal ${
                    isEven ? "lg:order-2" : "lg:order-1"
                  }`}
                >
                  {/* Big Numbering and Category Label */}
                  <div className="flex items-baseline gap-4 mb-4">
                    <span className="font-display text-7xl lg:text-9xl font-light text-gold/15 leading-none select-none">
                      {spread.number}
                    </span>
                    <span className="text-[11px] tracking-luxury uppercase text-gold font-medium">
                      {spread.category}
                    </span>
                  </div>

                  {/* Spread Title */}
                  <h2 className="font-display text-4xl lg:text-6xl leading-tight text-ivory">
                    {spread.title}
                    <br />
                    <span className="italic text-gradient-gold">{spread.subtitle}</span>
                  </h2>

                  {/* Poetic Quote */}
                  <blockquote className="mt-6 border-l border-gold/30 pl-4 py-1 font-serif italic text-base lg:text-lg text-gold-soft/80 leading-relaxed">
                    "{spread.quote}"
                  </blockquote>

                  {/* Detailed Prose */}
                  <p className="mt-6 font-serif text-sm lg:text-base leading-relaxed text-foreground/70 text-justify">
                    {spread.description}
                  </p>

                  {/* Details Bullet Points */}
                  <div className="mt-8 border-t border-border/40 pt-6">
                    <span className="text-[10px] tracking-luxury uppercase text-gold block mb-4">
                      Atelier Specifications
                    </span>
                    <ul className="grid grid-cols-2 gap-y-3 gap-x-4 text-xs font-sans font-light text-foreground/80">
                      {spread.details.map((detail, idx) => (
                        <li key={idx} className="flex items-center gap-2">
                          <span className="w-1 h-1 bg-gold rounded-full" />
                          <span>{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* WhatsApp Action Button */}
                  <div className="mt-10 flex items-center gap-6">
                    <button
                      onClick={() => handleInquiry(spread.whatsappMessage)}
                      className="btn-gold group relative"
                      data-cursor="CHAT"
                    >
                      <span className="flex items-center gap-2">
                        <MessageCircle className="w-4 h-4" />
                        Inquire Design
                      </span>
                    </button>
                    <button
                      onClick={() => handleInquiry(spread.whatsappMessage)}
                      className="text-xs tracking-luxury uppercase text-gold hover:text-ivory transition-colors flex items-center gap-2 group"
                    >
                      Bespoke Inquiry
                      <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-1" />
                    </button>
                  </div>
                </div>
              </div>
            </section>
          );
        })}
      </div>

      {/* Full Width Call To Action */}
      <section className="relative py-32 text-center overflow-hidden border-t border-border/60 bg-gradient-to-b from-background to-card">
        <GoldParticles count={10} />
        <div className="max-w-3xl mx-auto px-6 reveal">
          <span className="divider-gold text-[10px] tracking-luxury uppercase">
            The Consultation
          </span>
          <h2 className="mt-6 font-display text-4xl lg:text-6xl leading-tight text-ivory">
            Begin Your Custom
            <br />
            <span className="italic text-gradient-gold">Design Journey</span>
          </h2>
          <p className="mt-6 font-serif italic text-lg text-foreground/80 max-w-xl mx-auto">
            "Your silhouette is unique. Allow our designers and master drapers to craft a garment
            that perfectly tells your story."
          </p>
          <div className="mt-12 flex justify-center">
            <button
              onClick={() =>
                handleInquiry(
                  "Hello Rassa Boutique, I would like to book a luxury Bridal Consultation to discuss my custom couture requirements.",
                )
              }
              className="btn-gold"
              data-cursor="BOOK"
            >
              Book Private Consultation
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
