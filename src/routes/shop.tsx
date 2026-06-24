import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Heart, Search, ShoppingBag, X } from "lucide-react";
import { products, categories, inr, type Category, type Product } from "@/lib/products";

export const Route = createFileRoute("/shop")({
  head: () => ({
    meta: [
      { title: "Shop — Rassa Boutique" },
      {
        name: "description",
        content:
          "Shop sarees, lehengas, ethnic wear and casual luxury from Rassa Boutique. Pan-India shipping, secure checkout.",
      },
      { property: "og:title", content: "Shop — Rassa Boutique" },
      {
        property: "og:description",
        content: "Shop the Rassa Boutique edit — sarees, lehengas, ethnic and casual luxury.",
      },
    ],
  }),
  component: ShopPage,
});

type Sort = "featured" | "low" | "high";

function ShopPage() {
  const [query, setQuery] = useState("");
  const [cat, setCat] = useState<Category | "All">("All");
  const [sort, setSort] = useState<Sort>("featured");
  const [wishlist, setWishlist] = useState<Set<string>>(new Set());
  const [cart, setCart] = useState<Product[]>([]);
  const [cartOpen, setCartOpen] = useState(false);

  const list = useMemo(() => {
    let r = products.filter(
      (p) =>
        (cat === "All" || p.category === cat) && p.name.toLowerCase().includes(query.toLowerCase()),
    );
    if (sort === "low") r = [...r].sort((a, b) => a.price - b.price);
    if (sort === "high") r = [...r].sort((a, b) => b.price - a.price);
    return r;
  }, [query, cat, sort]);

  const toggleWish = (id: string) => {
    setWishlist((w) => {
      const n = new Set(w);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });
  };

  const addToCart = (p: Product) => {
    setCart((c) => [...c, p]);
    setCartOpen(true);
  };

  const total = cart.reduce((s, p) => s + p.price, 0);

  return (
    <div className="pt-28 pb-24">
      {/* Header */}
      <section className="max-w-7xl mx-auto px-6 lg:px-10 text-center mb-12">
        <span className="divider-gold text-[10px] tracking-luxury uppercase">The Boutique</span>
        <h1 className="mt-4 font-display text-5xl md:text-6xl">Shop</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          Pan-India shipping · Secure checkout · COD available
        </p>
      </section>

      {/* Controls */}
      <section className="max-w-7xl mx-auto px-6 lg:px-10 mb-10 flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
        <div className="relative w-full lg:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search the boutique..."
            className="w-full bg-card border border-border pl-10 pr-4 py-3 text-sm outline-none focus:border-gold"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {(["All", ...categories.map((c) => c.name)] as const).map((c) => (
            <button
              key={c}
              onClick={() => setCat(c)}
              className={`px-4 py-2 text-[10px] tracking-luxury uppercase border transition-colors ${
                cat === c
                  ? "bg-gold border-gold text-onyx"
                  : "border-border text-foreground/70 hover:border-gold hover:text-gold"
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as Sort)}
          className="bg-card border border-border px-3 py-3 text-xs tracking-wide-luxury uppercase outline-none focus:border-gold"
        >
          <option value="featured">Featured</option>
          <option value="low">Price: Low to High</option>
          <option value="high">Price: High to Low</option>
        </select>

        <button
          onClick={() => setCartOpen(true)}
          className="relative flex items-center gap-2 px-5 py-3 border border-gold text-gold text-[10px] tracking-luxury uppercase"
        >
          <ShoppingBag className="w-4 h-4" /> Bag
          {cart.length > 0 && (
            <span className="absolute -top-2 -right-2 bg-gold text-onyx text-[10px] w-5 h-5 rounded-full flex items-center justify-center">
              {cart.length}
            </span>
          )}
        </button>
      </section>

      {/* Grid */}
      <section className="max-w-7xl mx-auto px-6 lg:px-10">
        {list.length === 0 ? (
          <p className="text-center text-muted-foreground py-20">
            No pieces match — try another search.
          </p>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {list.map((p) => (
              <article key={p.id} className="group">
                <div className="relative aspect-[3/4] overflow-hidden bg-card">
                  <img
                    src={p.image}
                    alt={p.name}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                  />
                  {p.tag && (
                    <span className="absolute top-3 left-3 text-[10px] tracking-luxury uppercase bg-gold/95 text-onyx px-3 py-1">
                      {p.tag}
                    </span>
                  )}
                  <button
                    onClick={() => toggleWish(p.id)}
                    aria-label="Wishlist"
                    className="absolute top-3 right-3 w-9 h-9 flex items-center justify-center bg-background/70 backdrop-blur border border-border hover:border-gold"
                  >
                    <Heart
                      className={`w-4 h-4 ${wishlist.has(p.id) ? "fill-gold text-gold" : "text-foreground"}`}
                    />
                  </button>
                  <button
                    onClick={() => addToCart(p)}
                    className="absolute inset-x-3 bottom-3 py-3 bg-gradient-gold text-onyx text-[10px] tracking-luxury uppercase opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    Add to Bag
                  </button>
                </div>
                <div className="mt-4">
                  <div className="text-[10px] tracking-luxury uppercase text-muted-foreground">
                    {p.category}
                  </div>
                  <h3 className="mt-1 font-serif text-lg group-hover:text-gold transition-colors">
                    {p.name}
                  </h3>
                  <p className="mt-1 text-sm text-foreground/80">{inr(p.price)}</p>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* CART DRAWER */}
      {cartOpen && (
        <div className="fixed inset-0 z-[60] flex" onClick={() => setCartOpen(false)}>
          <div className="flex-1 bg-black/70 backdrop-blur-sm" />
          <aside
            className="w-full sm:w-[440px] bg-background border-l border-border h-full flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h2 className="font-display text-2xl text-gold">Your Bag</h2>
              <button onClick={() => setCartOpen(false)} aria-label="Close">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {cart.length === 0 ? (
                <p className="text-center text-muted-foreground py-12 font-serif italic">
                  Your bag awaits its first treasure.
                </p>
              ) : (
                cart.map((p, i) => (
                  <div key={i} className="flex gap-4 pb-4 border-b border-border">
                    <img src={p.image} alt={p.name} className="w-20 h-24 object-cover" />
                    <div className="flex-1">
                      <h4 className="font-serif">{p.name}</h4>
                      <p className="text-xs text-muted-foreground mt-1">{p.category}</p>
                      <p className="mt-2 text-sm text-gold">{inr(p.price)}</p>
                    </div>
                    <button
                      onClick={() => setCart((c) => c.filter((_, idx) => idx !== i))}
                      className="text-muted-foreground hover:text-gold text-xs"
                    >
                      Remove
                    </button>
                  </div>
                ))
              )}
            </div>
            {cart.length > 0 && (
              <div className="p-6 border-t border-border space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="tracking-wide-luxury uppercase">Subtotal</span>
                  <span className="text-gold">{inr(total)}</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Shipping & taxes calculated at checkout.
                </p>
                <button className="btn-gold w-full">Proceed to Checkout</button>
                <p className="text-[10px] text-center text-muted-foreground tracking-wide-luxury uppercase">
                  Razorpay · UPI · Card · COD ready
                </p>
              </div>
            )}
          </aside>
        </div>
      )}
    </div>
  );
}
