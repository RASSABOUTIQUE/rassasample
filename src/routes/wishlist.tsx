import { createFileRoute, Link } from "@tanstack/react-router";
import { useReveal } from "@/lib/use-reveal";
import { Heart, ShoppingBag, Trash2, ArrowRight } from "lucide-react";
import { useWishlist } from "@/lib/wishlist";
import { useCart } from "@/lib/cart";
import { inr } from "@/lib/products";
import { useProducts } from "@/lib/productStore";

export const Route = createFileRoute("/wishlist")({
  head: () => ({
    meta: [
      { title: "Wishlist — Rassa Boutique" },
      { name: "description", content: "Your saved items from Rassa Boutique — view and add to cart any time." },
    ],
  }),
  component: WishlistPage,
});

function WishlistPage() {
  useReveal();
  const { wishlistedIds, toggleWishlist } = useWishlist();
  const { addToCart } = useCart();
  const { getById } = useProducts();

  const wishlistProducts = wishlistedIds
    .map((id) => getById(id))
    .filter(Boolean) as ReturnType<typeof getById>[];

  return (
    <div className="pt-28 pb-24">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="mb-8">
          <span className="divider-gold text-[10px] tracking-luxury uppercase">Your Saved Items</span>
          <h1 className="mt-3 font-display text-4xl md:text-5xl">
            My <span className="italic text-gradient-gold">Wishlist</span>
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {wishlistProducts.length} saved item{wishlistProducts.length !== 1 ? "s" : ""}
          </p>
        </div>

        {wishlistProducts.length === 0 ? (
          <div className="min-h-[50vh] flex flex-col items-center justify-center text-center py-20">
            <div className="w-20 h-20 rounded-full bg-gold/10 border border-gold/30 flex items-center justify-center mx-auto mb-6">
              <Heart className="w-9 h-9 text-gold/50" />
            </div>
            <h2 className="font-display text-3xl text-ivory">Nothing saved yet</h2>
            <p className="mt-3 max-w-sm text-sm text-muted-foreground leading-relaxed">
              Browse our collections and tap the ❤️ on any product to save it here for later.
            </p>
            <Link to="/shop" className="btn-gold mt-8 flex items-center gap-2 inline-flex">
              <ShoppingBag className="w-4 h-4" />
              Browse Collections
            </Link>
          </div>
        ) : (
          <>
            {/* Bulk actions */}
            <div className="flex items-center gap-4 mb-6 flex-wrap">
              <button
                onClick={() => {
                  wishlistProducts.forEach((p) => {
                    addToCart({
                      productId: p.id,
                      name: p.name,
                      price: p.price,
                      image: p.images[0],
                      size: p.sizes[0] ?? "Free Size",
                      color: p.colors[0]?.name ?? "Default",
                      quantity: 1,
                    });
                  });
                }}
                className="btn-gold flex items-center gap-2 text-sm"
              >
                <ShoppingBag className="w-4 h-4" />
                Add All to Cart
              </button>
              <Link to="/shop" className="btn-ghost-gold text-sm">Continue Shopping</Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {wishlistProducts.map((p) => (
                <div key={p.id} className="reveal group">
                  <div className="relative aspect-[3/4] overflow-hidden mb-3">
                    <Link to="/product/$id" params={{ id: p.id }}>
                      <img
                        src={p.images[0]}
                        alt={p.name}
                        loading="lazy"
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    </Link>
                    {p.tag && (
                      <span className="absolute top-2 left-2 text-[10px] tracking-luxury uppercase bg-gold/90 text-onyx px-2 py-0.5">
                        {p.tag}
                      </span>
                    )}
                    {/* Remove from wishlist */}
                    <button
                      onClick={() => toggleWishlist(p.id)}
                      className="absolute top-2 right-2 w-8 h-8 bg-red-500/80 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                      title="Remove from wishlist"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                    {/* Add to cart hover */}
                    <div className="absolute inset-x-2 bottom-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <button
                        onClick={() =>
                          addToCart({
                            productId: p.id,
                            name: p.name,
                            price: p.price,
                            image: p.images[0],
                            size: p.sizes[0] ?? "Free Size",
                            color: p.colors[0]?.name ?? "Default",
                            quantity: 1,
                          })
                        }
                        className="w-full py-2.5 bg-gradient-gold text-onyx text-[10px] tracking-luxury uppercase font-medium flex items-center justify-center gap-1.5"
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
                  <Link
                    to="/product/$id"
                    params={{ id: p.id }}
                    className="mt-2 flex items-center gap-1.5 text-[10px] tracking-luxury uppercase text-gold hover:text-ivory transition-colors"
                  >
                    View Product <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
