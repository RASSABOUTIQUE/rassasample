import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Menu, X, ShoppingBag, Search, Heart, User } from "lucide-react";
import logo from "@/assets/rassa-logo-custom.png";
import { useCart } from "@/lib/cart";
import { useWishlist } from "@/lib/wishlist";
import { useAuth } from "@/lib/auth";
import { useProducts } from "@/lib/productStore";
import { useCMS } from "@/lib/cms";
import { inr } from "@/lib/products";
import { useNavigate } from "@tanstack/react-router";

const nav = [
  { to: "/", label: "Home" },
  { to: "/shop", label: "Shop" },
  { to: "/custom-stitching", label: "Custom Stitching" },
  { to: "/about", label: "About" },
  { to: "/visit-store", label: "Visit Store" },
] as const;

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { itemCount } = useCart();
  const { count: wishlistCount } = useWishlist();
  const { user, isLoggedIn } = useAuth();
  const { cms } = useCMS();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => { setOpen(false); }, []);

  const { getVisible } = useProducts();
  const searchResults =
    searchQuery.length >= 2
      ? getVisible()
          .filter(
            (p) =>
              p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
              p.category.toLowerCase().includes(searchQuery.toLowerCase()),
          )
          .slice(0, 5)
      : [];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate({ to: "/shop" });
      setShowSearch(false);
      setSearchQuery("");
    }
  };

  return (
    <>
      <header
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 flex flex-col ${
          scrolled
            ? "bg-background/90 backdrop-blur-xl border-b border-border"
            : "bg-transparent"
        }`}
      >
        {cms.announcement?.enabled && (
          <div className={`px-4 py-2 text-center text-[10px] tracking-widest uppercase flex items-center justify-center gap-2 ${
            cms.announcement.color === "gold" ? "bg-gold/10 text-gold border-b border-gold/20" :
            cms.announcement.color === "red" ? "bg-red-500/10 text-red-400 border-b border-red-500/20" :
            cms.announcement.color === "green" ? "bg-green-500/10 text-green-400 border-b border-green-500/20" :
            "bg-blue-500/10 text-blue-400 border-b border-blue-500/20"
          }`}>
            {cms.announcement.link ? (
              <Link to={cms.announcement.link} className="hover:opacity-80 transition-opacity">
                {cms.announcement.text}
              </Link>
            ) : (
              <span>{cms.announcement.text}</span>
            )}
          </div>
        )}
        <div className="max-w-7xl mx-auto px-6 lg:px-10 flex items-center justify-between h-18 md:h-20 w-full">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group shrink-0">
            <img src={logo} alt="Rassa Boutique" width={44} height={44} className="h-10 w-10 object-contain" />
            <span className="hidden sm:block font-display text-xl tracking-wide-luxury text-gold">RASSA</span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-8 xl:gap-10">
            {nav.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                activeOptions={{ exact: n.to === "/" }}
                activeProps={{ className: "text-gold" }}
                className="text-[11px] tracking-luxury uppercase hover-gold text-foreground/80 transition-colors"
              >
                {n.label}
              </Link>
            ))}
          </nav>

          {/* Right icons */}
          <div className="flex items-center gap-3 md:gap-4">
            {/* Search */}
            <button
              onClick={() => setShowSearch((v) => !v)}
              className="text-foreground/70 hover:text-gold transition-colors"
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Wishlist */}
            <Link
              to="/wishlist"
              className="relative hidden sm:flex text-foreground/70 hover:text-gold transition-colors"
              aria-label="Wishlist"
            >
              <Heart className="w-5 h-5" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-red-500 text-white text-[9px] rounded-full flex items-center justify-center font-bold">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Cart */}
            <Link
              to="/cart"
              className="relative flex items-center gap-1.5 text-[11px] tracking-luxury uppercase text-foreground/80 hover:text-gold transition-colors"
              aria-label="Cart"
            >
              <div className="relative">
                <ShoppingBag className="w-5 h-5" />
                {itemCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-gold text-onyx text-[9px] rounded-full flex items-center justify-center font-bold">
                    {itemCount}
                  </span>
                )}
              </div>
              <span className="hidden md:inline">Cart</span>
            </Link>

            {/* Account */}
            {isLoggedIn ? (
              <div className="relative group hidden sm:flex items-center gap-1.5 text-[11px] tracking-luxury uppercase text-foreground/80 cursor-pointer h-full py-6">
                <div className="relative flex items-center gap-1.5 hover:text-gold transition-colors">
                  <User className="w-5 h-5" />
                  <span className="absolute -top-1 -right-1 w-2 h-2 bg-gold rounded-full" />
                  <span className="hidden md:inline">Hi, {user?.name?.split(" ")[0] || "Account"}</span>
                </div>
                {/* Dropdown */}
                <div className="absolute top-full right-0 w-48 bg-background border border-border opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 shadow-2xl">
                  <div className="p-2 flex flex-col">
                    <Link to="/account" className="px-4 py-2 hover:bg-gold/5 hover:text-gold transition-colors text-left">
                      My Orders
                    </Link>
                    <Link to="/account" className="px-4 py-2 hover:bg-gold/5 hover:text-gold transition-colors text-left">
                      Profile
                    </Link>
                    <button onClick={() => authActions.logout()} className="px-4 py-2 hover:bg-gold/5 hover:text-gold transition-colors text-left w-full">
                      Logout
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <Link
                to="/login"
                className="hidden sm:flex items-center gap-1.5 text-[11px] tracking-luxury uppercase text-foreground/80 hover:text-gold transition-colors"
                aria-label="Account"
              >
                <User className="w-5 h-5" />
                <span className="hidden md:inline">Sign In</span>
              </Link>
            )}

            {/* Hamburger */}
            <button
              className="lg:hidden text-foreground/80 hover:text-gold transition-colors"
              onClick={() => setOpen((o) => !o)}
              aria-label="Menu"
            >
              {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile dropdown menu */}
        {open && (
          <div className="lg:hidden border-t border-border bg-background/98 backdrop-blur-xl">
            <nav className="flex flex-col px-6 py-6 gap-5">
              {nav.map((n) => (
                <Link
                  key={n.to}
                  to={n.to}
                  onClick={() => setOpen(false)}
                  className="text-sm tracking-wide-luxury uppercase hover-gold"
                  activeProps={{ className: "text-gold" }}
                  activeOptions={{ exact: n.to === "/" }}
                >
                  {n.label}
                </Link>
              ))}
              <Link to="/faq" onClick={() => setOpen(false)} className="text-sm tracking-wide-luxury uppercase text-muted-foreground hover-gold">FAQ</Link>
              <Link to="/contact" onClick={() => setOpen(false)} className="text-sm tracking-wide-luxury uppercase text-muted-foreground hover-gold">Contact</Link>
              <div className="pt-4 border-t border-border flex flex-col gap-3">
                <Link to="/cart" onClick={() => setOpen(false)} className="btn-gold text-center flex items-center justify-center gap-2">
                  <ShoppingBag className="w-4 h-4" />
                  Cart{itemCount > 0 && ` (${itemCount})`}
                </Link>
                <div className="grid grid-cols-2 gap-3">
                  <Link to={isLoggedIn ? "/account" : "/login"} onClick={() => setOpen(false)} className="btn-ghost-gold text-center flex items-center justify-center gap-2">
                    <User className="w-4 h-4" />
                    {isLoggedIn ? (user?.name?.split(" ")[0] || "Account") : "Sign In"}
                  </Link>
                  {isLoggedIn && (
                    <button onClick={() => { authActions.logout(); setOpen(false); }} className="btn-ghost-gold text-center flex items-center justify-center gap-2">
                      Logout
                    </button>
                  )}
                </div>
              </div>

            </nav>
          </div>
        )}
      </header>

      {/* Full-page Search Overlay */}
      {showSearch && (
        <div className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm" onClick={() => setShowSearch(false)}>
          <div className="absolute top-0 inset-x-0 bg-background border-b border-border p-6" onClick={(e) => e.stopPropagation()}>
            <form onSubmit={handleSearchSubmit} className="max-w-2xl mx-auto flex gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  autoFocus
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search sarees, churidars, bridal wear..."
                  className="w-full bg-card border border-border pl-11 pr-4 py-3.5 text-sm outline-none focus:border-gold transition-colors"
                />
              </div>
              <button type="submit" className="btn-gold px-5">Search</button>
              <button type="button" onClick={() => setShowSearch(false)} className="text-muted-foreground hover:text-gold transition-colors">
                <X className="w-6 h-6" />
              </button>
            </form>
            {searchResults.length > 0 && (
              <div className="max-w-2xl mx-auto mt-3 border border-border bg-card divide-y divide-border">
                {searchResults.map((p) => (
                  <Link
                    key={p.id}
                    to="/product/$id"
                    params={{ id: p.id }}
                    onClick={() => { setShowSearch(false); setSearchQuery(""); }}
                    className="flex items-center gap-4 px-4 py-3 hover:bg-gold/5 transition-colors"
                  >
                    <img src={p.images[0]} alt={p.name} className="w-10 aspect-[3/4] object-cover border border-border" />
                    <div>
                      <div className="text-sm font-serif">{p.name}</div>
                      <div className="text-xs text-muted-foreground">{p.category}</div>
                    </div>
                    <div className="ml-auto text-sm text-gold">{inr(p.price)}</div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Mobile bottom navigation */}
      <nav className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-background/95 backdrop-blur-xl border-t border-border flex items-center justify-around h-16 px-2">
        <Link to="/" activeOptions={{ exact: true }} activeProps={{ className: "text-gold" }}
          className="flex flex-col items-center gap-0.5 text-[9px] tracking-luxury uppercase text-muted-foreground hover:text-gold transition-colors px-3">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
          </svg>
          Home
        </Link>
        <Link to="/shop" activeProps={{ className: "text-gold" }}
          className="flex flex-col items-center gap-0.5 text-[9px] tracking-luxury uppercase text-muted-foreground hover:text-gold transition-colors px-3">
          <ShoppingBag className="w-5 h-5" />
          Shop
        </Link>
        <button onClick={() => setShowSearch(true)}
          className="flex flex-col items-center gap-0.5 text-[9px] tracking-luxury uppercase text-muted-foreground hover:text-gold transition-colors px-3">
          <Search className="w-5 h-5" />
          Search
        </button>
        <Link to="/cart" activeProps={{ className: "text-gold" }}
          className="relative flex flex-col items-center gap-0.5 text-[9px] tracking-luxury uppercase text-muted-foreground hover:text-gold transition-colors px-3">
          <div className="relative">
            <ShoppingBag className="w-5 h-5" />
            {itemCount > 0 && (
              <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-gold text-onyx text-[8px] rounded-full flex items-center justify-center font-bold">
                {itemCount}
              </span>
            )}
          </div>
          Cart
        </Link>
        <Link to={isLoggedIn ? "/account" : "/login"} activeProps={{ className: "text-gold" }}
          className="relative flex flex-col items-center gap-0.5 text-[9px] tracking-luxury uppercase text-muted-foreground hover:text-gold transition-colors px-3">
          <div className="relative">
            <User className="w-5 h-5" />
            {isLoggedIn && <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-gold rounded-full" />}
          </div>
          {isLoggedIn ? "Me" : "Login"}
        </Link>
      </nav>
    </>
  );
}
