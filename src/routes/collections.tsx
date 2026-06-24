import { createFileRoute, Link } from "@tanstack/react-router";
import { useReveal } from "@/lib/use-reveal";
import { categories } from "@/lib/products";
import { GoldParticles } from "@/components/GoldParticles";

export const Route = createFileRoute("/collections")({
  head: () => ({
    meta: [
      { title: "Collections — Rassa Boutique" },
      {
        name: "description",
        content:
          "Discover the world of Rassa Boutique — sarees, ethnic wear, casual luxury, bridal couture and bespoke custom stitching.",
      },
      { property: "og:title", content: "Collections — Rassa Boutique" },
      {
        property: "og:description",
        content: "Sarees, ethnic, bridal and bespoke couture from Rassa Boutique.",
      },
    ],
  }),
  component: CollectionsPage,
});

function CollectionsPage() {
  useReveal();
  return (
    <div className="pt-32 pb-24">
      <section className="relative text-center max-w-3xl mx-auto px-6 mb-24">
        <GoldParticles count={14} />
        <span className="divider-gold text-[10px] tracking-luxury uppercase">The Houses</span>
        <h1 className="mt-6 font-display text-5xl md:text-7xl leading-tight">
          Our <span className="italic text-gradient-gold">Collections</span>
        </h1>
        <p className="mt-6 font-serif italic text-lg text-foreground/80">
          Five distinct worlds, one philosophy — that beauty is a quiet act of confidence.
        </p>
      </section>

      <div className="max-w-7xl mx-auto px-6 lg:px-10 space-y-32">
        {categories.map((c, i) => (
          <article key={c.slug} className="reveal grid md:grid-cols-2 gap-12 items-center">
            <div
              className={`relative aspect-[4/5] overflow-hidden ${i % 2 === 1 ? "md:order-2" : ""}`}
            >
              <div className="absolute inset-0 border border-gold/30 translate-x-4 translate-y-4" />
              <img
                src={c.image}
                alt={c.name}
                loading="lazy"
                className="relative w-full h-full object-cover"
              />
            </div>
            <div className={i % 2 === 1 ? "md:order-1" : ""}>
              <span className="text-[10px] tracking-luxury uppercase text-gold">
                0{i + 1} — Collection
              </span>
              <h2 className="mt-4 font-display text-4xl md:text-6xl leading-tight">{c.name}</h2>
              <p className="mt-6 font-serif text-lg leading-relaxed text-foreground/80 max-w-md">
                {c.blurb} Each piece is selected with the same reverence we reserve for the bride in
                the mirror — to be worn slowly, lived in fully.
              </p>
              <div className="mt-8 flex gap-4">
                <Link to="/shop" className="btn-gold">
                  Shop The Edit
                </Link>
                {c.slug === "custom-stitching" && (
                  <Link to="/custom-stitching" className="btn-ghost-gold">
                    Learn More
                  </Link>
                )}
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
