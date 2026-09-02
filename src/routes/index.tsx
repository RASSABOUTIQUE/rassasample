import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef } from "react";
import { useReveal } from "@/lib/use-reveal";
import { GoldParticles } from "@/components/GoldParticles";
import { inr, occasions } from "@/lib/products";
import { useProducts, type ManagedProduct } from "@/lib/productStore";
import { useCMS } from "@/lib/cms";
import { useWishlist } from "@/lib/wishlist";
import { useCart } from "@/lib/cart";
import {
  Scissors,
  Sparkles,
  ShieldCheck,
  Truck,
  RotateCcw,
  Heart,
  ShoppingBag,
  MessageCircle,
  MapPin,
  Instagram,
  Bell,
} from "lucide-react";
import hero from "@/assets/hero-bride.jpg";
import storeInterior from "@/assets/store-interior.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Rassa Boutique — Kerala's Premier Women's Boutique, Kozhikode" },
      {
        name: "description",
        content:
          "Rassa Boutique in Kozhikode, Kerala — silk sarees, kasavu sarees, bridal wear, designer sarees, custom stitching and ethnic wear. Shop online or visit us.",
      },
      { property: "og:title", content: "Rassa Boutique — Kerala's Premier Women's Boutique" },
      {
        property: "og:description",
        content:
          "Silk sarees, kasavu, bridal wear, churidars, kurtis and custom stitching from Rassa Boutique, Kozhikode.",
      },
      { property: "og:image", content: hero },
    ],
  }),
  component: Home,
});

const trustSignals = [
  { icon: Scissors, label: "Custom Stitching", desc: "Tailored to your exact measurements" },
  { icon: Sparkles, label: "Premium Fabrics", desc: "Silks, kasavu & quality textiles" },
  { icon: ShieldCheck, label: "Secure Checkout", desc: "Safe & trusted payments" },
  { icon: Truck, label: "Kerala-wide Delivery", desc: "Fast shipping across Kerala & India" },
  { icon: RotateCcw, label: "Easy Returns", desc: "7-day hassle-free return policy" },
  { icon: MapPin, label: "Kozhikode Store", desc: "Visit us in Chathamangalam" },
];

function ProductCard({ p }: { p: ManagedProduct }) {
  const { isWishlisted, toggleWishlist } = useWishlist();
  const { addToCart } = useCart();
  const wishlisted = isWishlisted(p.id);

  return (
    <div className="group reveal">
      <div className="relative aspect-[3/4] overflow-hidden mb-3">
        <Link to="/product/$id" params={{ id: p.id }}>
          <img
            src={p.images[0]}
            alt={p.name}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
          />
        </Link>
        {p.tag && (
          <span className="absolute top-3 left-3 text-[10px] tracking-luxury uppercase bg-gold/95 text-onyx px-3 py-1 pointer-events-none">
            {p.tag}
          </span>
        )}
        <div className="absolute top-3 right-3 flex flex-col gap-2">
          <button
            onClick={() => toggleWishlist(p.id)}
            className={`w-8 h-8 flex items-center justify-center rounded-full backdrop-blur-sm transition-all ${
              wishlisted ? "bg-red-500/80 text-white" : "bg-black/50 text-white hover:bg-gold hover:text-onyx"
            }`}
          >
            <Heart className={`w-3.5 h-3.5 ${wishlisted ? "fill-white" : ""}`} />
          </button>
        </div>
        <div className="absolute inset-x-3 bottom-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button
            onClick={() => {
              addToCart({
                productId: p.id,
                name: p.name,
                price: p.price,
                image: p.images[0],
                size: p.sizes[0] ?? "Free Size",
                color: p.colors[0]?.name ?? "Default",
                quantity: 1,
              });
            }}
            className="w-full py-2.5 bg-gradient-gold text-onyx text-[10px] tracking-luxury uppercase font-medium flex items-center justify-center gap-2"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            Add to Cart
          </button>
        </div>
      </div>
      <div className="text-[10px] tracking-luxury uppercase text-muted-foreground">{p.category}</div>
      <Link to="/product/$id" params={{ id: p.id }}>
        <h3 className="mt-1 font-serif text-base leading-snug hover:text-gold transition-colors line-clamp-2">{p.name}</h3>
      </Link>
      <div className="mt-1 flex items-center gap-2">
        <p className="text-sm text-gold">{inr(p.price)}</p>
        {p.originalPrice && (
          <p className="text-xs text-muted-foreground line-through">{inr(p.originalPrice)}</p>
        )}
      </div>
    </div>
  );
}

function Home() {
  useReveal();
  const imgRef = useRef<HTMLImageElement>(null);
  
  const { getNewArrivals, getBestsellers } = useProducts();
  const { cms } = useCMS();

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      if (imgRef.current) {
        imgRef.current.style.transform = `translateY(${y * 0.1}px)`;
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Use dynamic products mapped to the CMS preferences, or default to all new arrivals/bestsellers if none specifically selected
  const popularProducts = cms.homepage.featuredProductIds.length > 0
    ? getBestsellers().filter(p => cms.homepage.featuredProductIds.includes(p.id)).slice(0, 4)
    : getBestsellers().slice(0, 4);
    
  const newProducts = cms.homepage.newArrivalProductIds.length > 0
    ? getNewArrivals().filter(p => cms.homepage.newArrivalProductIds.includes(p.id)).slice(0, 6)
    : getNewArrivals().slice(0, 6);

  return (
    <div className="bg-background">
      {/* ─── HERO ─── */}
      <section className="relative min-h-[100vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 [background:var(--gradient-radial-gold)] opacity-60" />
        <GoldParticles count={20} />
        <div className="absolute inset-0 flex items-center justify-center">
          <img
            ref={imgRef}
            src={hero}
            alt="Rassa Boutique — Kerala's premier women's boutique, Kozhikode"
            className="h-[88vh] w-auto object-contain will-change-transform drop-shadow-[0_30px_60px_rgba(0,0,0,0.7)]"
          />
        </div>
        <div className="absolute inset-x-0 bottom-0 h-56 bg-gradient-to-t from-background to-transparent" />
        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center pt-40">
          <span className="divider-gold text-[10px] tracking-luxury uppercase">{cms.hero.badge || "Rassa Boutique · Kozhikode, Kerala"}</span>
          <h1 className="mt-6 font-display text-[clamp(2.5rem,8vw,6rem)] leading-[0.95] text-ivory">
            {cms.hero.line1}
            <br />
            <span className="italic text-gradient-gold">{cms.hero.line2}</span>
          </h1>
          <p className="mt-6 max-w-md mx-auto font-serif text-lg text-foreground/80 leading-relaxed">
            {cms.hero.subtitle}
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link to={cms.hero.cta1Link} className="btn-gold flex items-center gap-2">
              <ShoppingBag className="w-4 h-4" />
              {cms.hero.cta1Label}
            </Link>
            <Link to={cms.hero.cta2Link} className="btn-ghost-gold flex items-center gap-2">
              <Scissors className="w-4 h-4" />
              {cms.hero.cta2Label}
            </Link>
            <Link to="/visit-store" className="flex items-center gap-2 text-[11px] tracking-luxury uppercase text-gold border-b border-gold/50 pb-1 hover:text-ivory transition-colors">
              <MapPin className="w-4 h-4" />
              Visit Boutique
            </Link>
          </div>
        </div>
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 text-gold animate-float">
          <span className="text-[9px] tracking-luxury uppercase">Scroll</span>
          <div className="w-px h-10 bg-gradient-to-b from-gold to-transparent" />
        </div>
      </section>

      {/* ─── TRUST STRIP ─── */}
      <section className="border-y border-border/40 py-10 bg-card/40">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6">
          {trustSignals.map((t) => (
            <div key={t.label} className="reveal flex flex-col items-center text-center gap-2">
              <div className="w-10 h-10 rounded-full border border-gold/40 flex items-center justify-center text-gold">
                <t.icon className="w-4 h-4" />
              </div>
              <div className="font-sans text-[10px] font-semibold tracking-wide-luxury uppercase text-ivory">{t.label}</div>
              <div className="text-[10px] text-muted-foreground leading-tight">{t.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── NEW ARRIVALS ─── */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="flex items-end justify-between flex-wrap gap-4 mb-10 reveal">
            <div>
              <span className="divider-gold text-[10px] tracking-luxury uppercase">Just In</span>
              <h2 className="mt-3 font-display text-4xl md:text-5xl">
                New <span className="italic text-gradient-gold">Arrivals</span>
              </h2>
            </div>
            <Link to="/shop" className="text-[11px] tracking-luxury uppercase text-gold border-b border-gold/50 pb-0.5">
              View All →
            </Link>
          </div>
          {/* Horizontal scroll on mobile, grid on desktop */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {newProducts.map((p) => (
              <ProductCard key={p.id} p={p} />
            ))}
          </div>
        </div>
      </section>

      {/* ─── SHOP BY OCCASION ─── */}
      <section className="py-20 bg-card border-t border-border">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="text-center mb-10 reveal">
            <span className="divider-gold text-[10px] tracking-luxury uppercase">What's the Occasion?</span>
            <h2 className="mt-3 font-display text-4xl md:text-5xl">
              Shop by <span className="italic text-gradient-gold">Occasion</span>
            </h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {occasions.map((occ) => (
              <Link
                key={occ.name}
                to="/shop"
                search={{ occasion: occ.name } as Record<string, string>}
                className="reveal group relative aspect-square overflow-hidden"
              >
                <img src={occ.image} alt={occ.name} loading="lazy" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 to-black/10" />
                <div className="absolute inset-0 flex flex-col items-center justify-end pb-4 text-center px-2">
                  <div className="font-display text-sm text-ivory leading-tight">{occ.name}</div>
                  <div className="text-[9px] text-foreground/70 mt-0.5 leading-tight">{occ.desc}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ─── SHOP BY CATEGORY ─── */}
      {cms.homepage.showCategories && (
        <section className="py-24 border-t border-border">
          <div className="max-w-7xl mx-auto px-6 lg:px-10">
            <div className="text-center mb-10 reveal">
              <span className="divider-gold text-[10px] tracking-luxury uppercase">Collections</span>
              <h2 className="mt-3 font-display text-4xl md:text-5xl">
                {cms.homepage.categoryTitle.split(" ").slice(0, -1).join(" ")}{" "}
                <span className="italic text-gradient-gold">{cms.homepage.categoryTitle.split(" ").slice(-1)}</span>
              </h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {cms.categories.filter(c => c.visible && c.featured).map((c) => (
                <Link
                  key={c.slug}
                  to="/shop"
                  search={{ category: c.name } as Record<string, string>}
                  className="reveal group relative aspect-[3/4] overflow-hidden"
                >
                  <img src={c.image} alt={c.name} loading="lazy" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="absolute inset-0 border border-transparent group-hover:border-gold/40 transition-colors duration-500" />
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h3 className="font-display text-lg md:text-xl text-ivory leading-tight">{c.name}</h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ─── POPULAR PRODUCTS ─── */}
      <section className="py-24 bg-card border-t border-border">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="flex items-end justify-between flex-wrap gap-4 mb-10 reveal">
            <div>
              <span className="divider-gold text-[10px] tracking-luxury uppercase">Customer Favourites</span>
              <h2 className="mt-3 font-display text-4xl md:text-5xl">Popular <span className="italic text-gradient-gold">Products</span></h2>
            </div>
            <Link to="/shop" className="text-[11px] tracking-luxury uppercase text-gold border-b border-gold/50 pb-0.5">View All →</Link>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {popularProducts.map((p) => (
              <ProductCard key={p.id} p={p} />
            ))}
          </div>
        </div>
      </section>

      {/* ─── WHY RASSA ─── */}
      <section className="py-24 border-t border-border">
        <div className="max-w-6xl mx-auto px-6 lg:px-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="reveal">
              <span className="divider-gold text-[10px] tracking-luxury uppercase">Why Choose Us</span>
              <h2 className="mt-4 font-display text-4xl leading-tight">
                A boutique that truly <span className="italic text-gradient-gold">cares</span>
              </h2>
              <p className="mt-5 font-serif text-base leading-relaxed text-foreground/80">
                We are not just a shop. We're a team from Kozhikode that genuinely cares about every
                customer finding the right outfit — whether it's for a wedding, Onam, or everyday wear.
              </p>
              <ul className="mt-6 space-y-4">
                {[
                  "Personal guidance from selection to delivery",
                  "Every garment quality-checked before shipping",
                  "Custom stitching to your exact measurements",
                  "WhatsApp support — we respond quickly",
                  "Easy 7-day return and exchange policy",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm text-foreground/80">
                    <span className="w-1.5 h-1.5 rounded-full bg-gold mt-2 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <div className="mt-8 flex flex-wrap gap-4">
                <Link to="/shop" className="btn-gold">Shop Now</Link>
                <Link to="/about" className="btn-ghost-gold">About Rassa</Link>
              </div>
            </div>
            <div className="reveal relative aspect-[4/5] overflow-hidden">
              <div className="absolute inset-4 border border-gold/25 z-10 pointer-events-none" />
              <img src={storeInterior} alt="Rassa Boutique, Kozhikode" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      </section>

      {/* ─── CUSTOM STITCHING CTA ─── */}
      <section className="py-24 bg-card border-t border-border">
        <div className="max-w-6xl mx-auto px-6 lg:px-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="text-center md:text-left reveal">
              <span className="divider-gold text-[10px] tracking-luxury uppercase">Tailored for You</span>
              <h2 className="mt-4 font-display text-4xl leading-tight">
                Custom Stitching — <span className="italic text-gradient-gold">your design,<br />your measurements</span>
              </h2>
              <p className="mt-5 font-serif text-base leading-relaxed text-foreground/80">
                Blouses, churidars, salwars, lehengas — we stitch any garment exactly the way you
                want it. Visit our store or WhatsApp us to get started.
              </p>
              <div className="mt-8 flex flex-wrap gap-4 justify-center md:justify-start">
                <Link to="/custom-stitching" className="btn-gold flex items-center gap-2">
                  <Scissors className="w-4 h-4" />
                  Learn How It Works
                </Link>
                <a
                  href="https://wa.me/919633419902?text=Hello%20Rassa%20Boutique%2C%20I%20want%20to%20start%20a%20custom%20stitching%20order."
                  target="_blank"
                  rel="noreferrer"
                  className="btn-ghost-gold flex items-center gap-2"
                >
                  <MessageCircle className="w-4 h-4" />
                  WhatsApp to Order
                </a>
              </div>
            </div>
            <div className="reveal grid grid-cols-2 gap-3">
              {[
                { title: "Blouses", price: "From ₹800" },
                { title: "Churidars", price: "From ₹1,500" },
                { title: "Salwar Sets", price: "From ₹2,000" },
                { title: "Bridal Outfits", price: "Custom Quote" },
              ].map((item) => (
                <div key={item.title} className="p-5 border border-border bg-background text-center">
                  <div className="font-display text-xl text-ivory">{item.title}</div>
                  <div className="text-xs text-gold mt-1">{item.price}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── OPENING SOON ─── */}
      <section className="py-24 border-t border-border relative overflow-hidden">
        <GoldParticles count={10} />
        <div className="max-w-3xl mx-auto px-6 text-center reveal">
          <span className="divider-gold text-[10px] tracking-luxury uppercase">Online Shopping</span>
          <h2 className="mt-4 font-display text-4xl md:text-5xl">
            Online Payments <span className="italic text-gradient-gold">Coming Soon</span>
          </h2>
          <p className="mt-5 font-serif text-base text-foreground/75 max-w-md mx-auto">
            We're launching full online payment (UPI, cards, Razorpay) in{" "}
            <strong className="text-gold">August 2026</strong>. Until then, order via WhatsApp
            or Cash on Delivery — and get the same great prices and service.
          </p>
          <div className="mt-8 grid sm:grid-cols-3 gap-4">
            <a
              href="https://wa.me/919633419902?text=Hello%20Rassa%20Boutique%2C%20I'd%20like%20to%20join%20your%20WhatsApp%20updates%20list%20for%20new%20arrivals%20and%20offers."
              target="_blank"
              rel="noreferrer"
              className="btn-gold flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-4 h-4" />
              Join WhatsApp Updates
            </a>
            <a href="https://instagram.com" target="_blank" rel="noreferrer" className="btn-ghost-gold flex items-center justify-center gap-2">
              <Instagram className="w-4 h-4" />
              Follow on Instagram
            </a>
            <button
              onClick={() => {
                const el = document.getElementById("notify-email");
                el?.scrollIntoView({ behavior: "smooth" });
              }}
              className="btn-ghost-gold flex items-center justify-center gap-2"
            >
              <Bell className="w-4 h-4" />
              Notify Me
            </button>
          </div>
          <form id="notify-email" className="mt-8 flex border border-border max-w-sm mx-auto" onSubmit={(e) => { e.preventDefault(); (e.target as HTMLFormElement).reset(); }}>
            <input type="email" required placeholder="Your email address" className="bg-background flex-1 px-4 py-3 text-sm outline-none focus:ring-0 placeholder:text-muted-foreground" />
            <button type="submit" className="bg-gradient-gold px-5 text-[10px] tracking-luxury uppercase text-onyx font-medium shrink-0">
              Notify
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
