import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Menu, X, ShoppingBag } from "lucide-react";
import logo from "@/assets/rassa-logo-custom.png";

const nav = [
  { to: "/", label: "Home" },
  { to: "/collections", label: "Collections" },
  { to: "/lookbook", label: "Lookbook" },
  { to: "/custom-stitching", label: "Custom Stitching" },
  { to: "/shop", label: "Shop" },
  { to: "/visit-store", label: "Visit Store" },
  { to: "/contact", label: "Contact" },
] as const;

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
        scrolled ? "bg-background/85 backdrop-blur-xl border-b border-border" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-10 flex items-center justify-between h-20">
        <Link to="/" className="flex items-center gap-3 group">
          <img
            src={logo}
            alt="Rassa Boutique"
            width={44}
            height={44}
            className="h-11 w-11 object-contain"
          />
          <span className="hidden sm:block font-display text-xl tracking-wide-luxury text-gold">
            RASSA
          </span>
        </Link>

        <nav className="hidden lg:flex items-center gap-10">
          {nav.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              activeOptions={{ exact: n.to === "/" }}
              activeProps={{ className: "text-gold" }}
              className="text-[11px] tracking-luxury uppercase hover-gold text-foreground/80"
            >
              {n.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <Link
            to="/shop"
            className="hidden sm:flex items-center gap-2 text-[11px] tracking-luxury uppercase hover-gold"
          >
            <ShoppingBag className="w-4 h-4" /> <span className="hidden md:inline">Bag</span>
          </Link>
          <button
            className="lg:hidden text-foreground"
            onClick={() => setOpen((o) => !o)}
            aria-label="Menu"
          >
            {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="lg:hidden border-t border-border bg-background/95 backdrop-blur-xl">
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
          </nav>
        </div>
      )}
    </header>
  );
}
