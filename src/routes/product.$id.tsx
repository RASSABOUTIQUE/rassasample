import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useReveal } from "@/lib/use-reveal";
import { useState, useEffect } from "react";
import {
  Heart,
  ShoppingBag,
  ChevronRight,
  Minus,
  Plus,
  Share2,
  MessageCircle,
  Ruler,
  RotateCcw,
  Truck,
  Shield,
  ChevronDown,
  ZoomIn,
} from "lucide-react";
import { inr, type Product } from "@/lib/products";
import { getProductById, useProducts, type ManagedProduct } from "@/lib/productStore";
import { useCart } from "@/lib/cart";
import { useWishlist } from "@/lib/wishlist";
import { trackingService } from "@/services/TrackingService";

export const Route = createFileRoute("/product/$id")({
  head: ({ params }) => {
    const p = getProductById(params.id);
    return {
      meta: [
        { title: p ? `${p.name} — Rassa Boutique` : "Product — Rassa Boutique" },
        {
          name: "description",
          content: p
            ? `${p.name} — ${p.category} from Rassa Boutique, Kozhikode. ${p.description.slice(0, 120)}`
            : "Shop premium women's fashion at Rassa Boutique, Kozhikode.",
        },
      ],
    };
  },
  component: ProductPage,
});

function AccordionItem({
  title,
  children,
  defaultOpen = false,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-border">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full text-left py-4 flex items-center justify-between group"
      >
        <span className="font-sans text-sm font-medium tracking-wide text-ivory group-hover:text-gold transition-colors">
          {title}
        </span>
        <ChevronDown
          className={`w-4 h-4 text-gold transition-transform duration-300 ${open ? "rotate-180" : ""}`}
        />
      </button>
      <div
        className={`overflow-hidden transition-all duration-400 ${open ? "max-h-[500px] pb-5" : "max-h-0"}`}
      >
        <div className="text-sm text-muted-foreground leading-relaxed">{children}</div>
      </div>
    </div>
  );
}

function SizeGuideModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 bg-card border border-border p-8 max-w-lg w-full">
        <h3 className="font-display text-2xl mb-5 pb-4 border-b border-border">Size Guide</h3>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-[10px] tracking-luxury uppercase text-gold">
              <th className="text-left pb-3">Size</th>
              <th className="text-left pb-3">Chest (inches)</th>
              <th className="text-left pb-3">Waist (inches)</th>
              <th className="text-left pb-3">Hip (inches)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border text-muted-foreground">
            {[
              ["XS", "32", "26", "34"],
              ["S", "34", "28", "36"],
              ["M", "36", "30", "38"],
              ["L", "38", "32", "40"],
              ["XL", "40", "34", "42"],
              ["XXL", "42", "36", "44"],
            ].map(([size, chest, waist, hip]) => (
              <tr key={size}>
                <td className="py-2.5 font-medium text-ivory">{size}</td>
                <td className="py-2.5">{chest}"</td>
                <td className="py-2.5">{waist}"</td>
                <td className="py-2.5">{hip}"</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="mt-5 text-xs text-muted-foreground">
          If you're between sizes, go one size up. For custom measurements, WhatsApp us.
        </p>
        <button onClick={onClose} className="btn-ghost-gold mt-5 w-full">
          Close
        </button>
      </div>
    </div>
  );
}

// (Local storage tracking moved to TrackingService)

// import { products } from "@/lib/products";

function ProductPage() {
  useReveal();
  const navigate = useNavigate();
  const { id } = Route.useParams();
  const { getByCategory, getById } = useProducts();
  const product = getById(id);
  const { addToCart } = useCart();
  const { isWishlisted, toggleWishlist } = useWishlist();

  const [activeImage, setActiveImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [showSizeGuide, setShowSizeGuide] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  const [recentIds, setRecentIds] = useState<string[]>([]);

  useEffect(() => {
    if (product) {
      setSelectedColor(product.colors[0]?.name ?? "");
      setSelectedSize(product.sizes[0] ?? "");
      
      const loadTracking = async () => {
        await trackingService.addRecentlyViewed(product.id);
        const viewed = await trackingService.getRecentlyViewed();
        setRecentIds(viewed.filter((rid) => rid !== product.id));
      };
      loadTracking();
    }
  }, [id]);

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center text-center px-6 pt-32">
        <div>
          <h1 className="font-display text-4xl text-gold">Product not found</h1>
          <p className="mt-3 text-muted-foreground">This product is no longer available.</p>
          <Link to="/shop" className="btn-gold mt-6 inline-block">
            Browse Shop
          </Link>
        </div>
      </div>
    );
  }

  const related = getByCategory(product.category)
    .filter((p) => p.id !== product.id)
    .slice(0, 4);
    
  const recentProducts = recentIds
    .map((rid) => getById(rid))
    .filter(Boolean) as ManagedProduct[];

  const handleAddToCart = () => {
    const finalSize = selectedSize || "Free Size";
    const finalColor = selectedColor || "Default";
    
    addToCart({
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0],
      size: finalSize,
      color: finalColor,
      quantity,
    });
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const handleBuyNow = () => {
    handleAddToCart();
    navigate({ to: "/cart" });
  };

  const handleWhatsApp = () => {
    const msg = `Hello Rassa Boutique, I'm interested in:\n\n*${product.name}*\nSize: ${selectedSize}\nColour: ${selectedColor}\nPrice: ${inr(product.price)}\n\nCould you confirm availability?`;
    window.open(
      `https://wa.me/919633419902?text=${encodeURIComponent(msg)}`,
      "_blank",
      "noopener,noreferrer",
    );
  };

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <div className="bg-background min-h-screen pt-24">
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-4 flex items-center gap-2 text-xs text-muted-foreground">
        <Link to="/" className="hover:text-gold transition-colors">Home</Link>
        <ChevronRight className="w-3 h-3" />
        <Link to="/shop" className="hover:text-gold transition-colors">Shop</Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-gold">{product.name}</span>
      </div>

      {/* Main product grid */}
      <section className="max-w-7xl mx-auto px-6 lg:px-10 grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 py-6 pb-20">
        {/* Images */}
        <div className="space-y-3">
          {/* Main image */}
          <div className="relative aspect-[3/4] overflow-hidden bg-card border border-border group">
            <img
              src={product.images[activeImage]}
              alt={product.name}
              decoding="async"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            {product.tag && (
              <span className="absolute top-4 left-4 text-[10px] tracking-luxury uppercase bg-gold/95 text-onyx px-3 py-1">
                {product.tag}
              </span>
            )}
            {discount > 0 && (
              <span className="absolute top-4 right-4 text-[10px] tracking-luxury uppercase bg-green-600/95 text-white px-3 py-1">
                {discount}% Off
              </span>
            )}
            <button className="absolute bottom-4 right-4 w-9 h-9 bg-black/60 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity">
              <ZoomIn className="w-4 h-4" />
            </button>
          </div>
          {/* Thumbnails */}
          {product.images.length > 1 && (
            <div className="flex gap-2">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(i)}
                  className={`relative w-20 aspect-[3/4] overflow-hidden border transition-colors ${
                    activeImage === i ? "border-gold" : "border-border hover:border-gold/50"
                  }`}
                >
                  <img src={img} alt="" loading="lazy" decoding="async" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product info */}
        <div className="flex flex-col">
          <div className="text-[10px] tracking-luxury uppercase text-gold mb-2">{product.category}</div>
          <h1 className="font-display text-3xl lg:text-4xl leading-tight text-ivory">{product.name}</h1>

          {/* Price */}
          <div className="flex items-baseline gap-3 mt-4">
            <span className="font-display text-3xl text-gold">{inr(product.price)}</span>
            {product.originalPrice && (
              <span className="text-muted-foreground line-through text-lg">{inr(product.originalPrice)}</span>
            )}
            {discount > 0 && (
              <span className="text-xs text-green-500 font-medium">{discount}% off</span>
            )}
          </div>

          {/* Stock */}
          <div className="mt-3 flex items-center gap-2 text-xs">
            <div
              className={`w-2 h-2 rounded-full ${product.stockCount > 5 ? "bg-green-500" : product.stockCount > 0 ? "bg-yellow-500" : "bg-red-500"}`}
            />
            <span className={product.stockCount > 5 ? "text-green-500" : product.stockCount > 0 ? "text-yellow-500" : "text-red-500"}>
              {product.stockCount > 5 ? "In Stock" : product.stockCount > 0 ? `Only ${product.stockCount} left` : "Out of Stock"}
            </span>
          </div>

          <div className="w-full h-px bg-border my-5" />

          {/* Colour */}
          {product.colors.length > 0 && (
            <div className="mb-5">
              <div className="text-[10px] tracking-luxury uppercase text-gold mb-3">
                Colour: <span className="text-ivory">{selectedColor}</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {product.colors.map((c) => (
                  <button
                    key={c.name}
                    onClick={() => setSelectedColor(c.name)}
                    title={c.name}
                    className={`w-9 h-9 rounded-full border-2 transition-all ${
                      selectedColor === c.name ? "border-gold scale-110" : "border-transparent hover:border-gold/50"
                    }`}
                    style={{ backgroundColor: c.hex }}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Size */}
          {product.sizes.length > 0 && (
            <div className="mb-5">
              <div className="flex items-center justify-between mb-3">
                <div className="text-[10px] tracking-luxury uppercase text-gold">
                  Size: <span className="text-ivory">{selectedSize}</span>
                </div>
                {product.sizes[0] !== "Free Size" && (
                  <button
                    onClick={() => setShowSizeGuide(true)}
                    className="text-[10px] tracking-luxury uppercase text-muted-foreground hover:text-gold transition-colors flex items-center gap-1"
                  >
                    <Ruler className="w-3 h-3" />
                    Size Guide
                  </button>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSelectedSize(s)}
                    className={`px-4 py-2 text-xs border transition-all ${
                      selectedSize === s
                        ? "border-gold bg-gold/10 text-gold"
                        : "border-border text-muted-foreground hover:border-gold/50"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity */}
          <div className="mb-6">
            <div className="text-[10px] tracking-luxury uppercase text-gold mb-3">Quantity</div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-9 h-9 border border-border flex items-center justify-center hover:border-gold transition-colors"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="font-display text-xl w-8 text-center">{quantity}</span>
              <button
                onClick={() => setQuantity(Math.min(product.stockCount, quantity + 1))}
                className="w-9 h-9 border border-border flex items-center justify-center hover:border-gold transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* CTAs */}
          <div className="flex flex-col gap-3 mb-5">
            <button
              onClick={handleAddToCart}
              disabled={!product.inStock}
              className={`btn-gold flex items-center justify-center gap-2 ${!product.inStock ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              <ShoppingBag className="w-4 h-4" />
              {addedToCart ? "Added to Cart ✓" : "Add to Cart"}
            </button>
            <button
              onClick={handleBuyNow}
              disabled={!product.inStock}
              className="btn-ghost-gold flex items-center justify-center gap-2"
            >
              Buy Now
            </button>
          </div>

          {/* Wishlist + Share + WhatsApp */}
          <div className="flex items-center gap-4 mb-6">
            <button
              onClick={() => toggleWishlist(product.id)}
              className={`flex items-center gap-2 text-xs transition-colors ${
                isWishlisted(product.id) ? "text-red-400" : "text-muted-foreground hover:text-gold"
              }`}
            >
              <Heart className={`w-4 h-4 ${isWishlisted(product.id) ? "fill-red-400" : ""}`} />
              {isWishlisted(product.id) ? "Wishlisted" : "Add to Wishlist"}
            </button>
            <button
              onClick={handleWhatsApp}
              className="flex items-center gap-2 text-xs text-muted-foreground hover:text-gold transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
              Ask on WhatsApp
            </button>
            <button
              onClick={() => {
                navigator.share?.({ title: product.name, url: window.location.href });
              }}
              className="flex items-center gap-2 text-xs text-muted-foreground hover:text-gold transition-colors"
            >
              <Share2 className="w-4 h-4" />
              Share
            </button>
          </div>

          {/* Delivery + Trust */}
          <div className="grid grid-cols-3 gap-3 py-5 border-t border-border">
            <div className="text-center">
              <Truck className="w-5 h-5 text-gold mx-auto mb-1.5" />
              <div className="text-[10px] text-muted-foreground leading-tight">Ready in {product.deliveryDays}</div>
            </div>
            <div className="text-center">
              <RotateCcw className="w-5 h-5 text-gold mx-auto mb-1.5" />
              <div className="text-[10px] text-muted-foreground leading-tight">7-day easy return</div>
            </div>
            <div className="text-center">
              <Shield className="w-5 h-5 text-gold mx-auto mb-1.5" />
              <div className="text-[10px] text-muted-foreground leading-tight">Secure checkout</div>
            </div>
          </div>

          {/* Accordions */}
          <div className="border-t border-border mt-5">
            <AccordionItem title="Product Description" defaultOpen>
              <p>{product.description}</p>
            </AccordionItem>
            <AccordionItem title="Fabric & Details">
              <p>{product.fabricDetails}</p>
            </AccordionItem>
            <AccordionItem title="Care Instructions">
              <p>{product.careInstructions}</p>
            </AccordionItem>
            <AccordionItem title="Delivery & Returns">
              <p>
                Delivery: {product.deliveryDays} from order confirmation.
                Returns accepted within 7 days for non-stitched items in original condition.
                For queries, WhatsApp us at +91 96334 19902.
              </p>
            </AccordionItem>
          </div>
        </div>
      </section>

      {/* Related Products */}
      {related.length > 0 && (
        <section className="max-w-7xl mx-auto px-6 lg:px-10 py-16 border-t border-border">
          <div className="flex items-center justify-between mb-8">
            <h2 className="font-display text-3xl">You Might Also Like</h2>
            <Link to="/shop" className="text-[10px] tracking-luxury uppercase text-gold border-b border-gold/50 pb-0.5">
              View All →
            </Link>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {related.map((p) => (
              <Link key={p.id} to="/product/$id" params={{ id: p.id }} className="group block">
                <div className="relative aspect-[3/4] overflow-hidden mb-3">
                  <img src={p.images[0]} alt={p.name} loading="lazy" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  {p.tag && (
                    <span className="absolute top-2 left-2 text-[10px] tracking-luxury uppercase bg-gold/90 text-onyx px-2 py-0.5">
                      {p.tag}
                    </span>
                  )}
                </div>
                <div className="text-[10px] tracking-luxury uppercase text-muted-foreground">{p.category}</div>
                <h3 className="mt-1 font-serif text-base leading-snug group-hover:text-gold transition-colors">{p.name}</h3>
                <p className="mt-1 text-sm text-gold">{inr(p.price)}</p>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Recently Viewed */}
      {recentProducts.length > 0 && (
        <section className="max-w-7xl mx-auto px-6 lg:px-10 py-12 border-t border-border">
          <h2 className="font-display text-2xl mb-6">Recently Viewed</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {recentProducts.slice(0, 6).map((p) => (
              <Link key={p.id} to="/product/$id" params={{ id: p.id }} className="group block">
                <div className="relative aspect-[3/4] overflow-hidden mb-2">
                  <img src={p.images[0]} alt={p.name} loading="lazy" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                </div>
                <div className="text-xs font-serif group-hover:text-gold transition-colors line-clamp-2">{p.name}</div>
                <div className="text-xs text-gold mt-0.5">{inr(p.price)}</div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {showSizeGuide && <SizeGuideModal onClose={() => setShowSizeGuide(false)} />}
    </div>
  );
}
