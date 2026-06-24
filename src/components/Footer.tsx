import { Link } from "@tanstack/react-router";
import { Instagram, MessageCircle, MapPin, Phone, Mail } from "lucide-react";
import logo from "@/assets/rassa-logo-custom.png";

export function Footer() {
  return (
    <footer className="relative border-t border-border bg-background pt-20 pb-10 overflow-hidden">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold to-transparent opacity-60" />
      <div className="max-w-7xl mx-auto px-6 lg:px-10 grid lg:grid-cols-4 gap-12">
        <div className="lg:col-span-1">
          <img
            src={logo}
            alt="Rassa Boutique"
            width={64}
            height={64}
            className="h-16 w-16 object-contain mb-4"
          />
          <p className="font-serif italic text-gold text-lg">Where Elegance Becomes Identity</p>
          <p className="text-sm text-muted-foreground mt-4 leading-relaxed">
            A women's luxury boutique crafted in the spirit of timeless Indian elegance.
          </p>
        </div>

        <div>
          <h4 className="text-xs tracking-luxury uppercase text-gold mb-5">Explore</h4>
          <ul className="space-y-3 text-sm text-foreground/80">
            <li>
              <Link to="/collections" className="hover-gold">
                Collections
              </Link>
            </li>
            <li>
              <Link to="/lookbook" className="hover-gold">
                Lookbook
              </Link>
            </li>
            <li>
              <Link to="/shop" className="hover-gold">
                Shop
              </Link>
            </li>
            <li>
              <Link to="/custom-stitching" className="hover-gold">
                Custom Stitching
              </Link>
            </li>
            <li>
              <Link to="/visit-store" className="hover-gold">
                Visit Store
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-xs tracking-luxury uppercase text-gold mb-5">Atelier</h4>
          <ul className="space-y-3 text-sm text-foreground/80">
            <li className="flex gap-3">
              <MapPin className="w-4 h-4 text-gold shrink-0 mt-0.5" />
              <span>
                Poolacode, Chathamangalam, Kattangal–Koduvally Rd, Kozhikode, Kerala 673601
              </span>
            </li>
            <li className="flex gap-3">
              <Phone className="w-4 h-4 text-gold shrink-0 mt-0.5" />
              <a href="tel:+919633419902" className="hover-gold">
                +91 96334 19902
              </a>
            </li>
            <li className="flex gap-3">
              <Mail className="w-4 h-4 text-gold shrink-0 mt-0.5" />
              <a href="mailto:rassaboutique@gmail.com" className="hover-gold">
                rassaboutique@gmail.com
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-xs tracking-luxury uppercase text-gold mb-5">Newsletter</h4>
          <p className="text-sm text-muted-foreground mb-4">
            Receive private previews of new collections.
          </p>
          <form
            className="flex border border-border"
            onSubmit={(e) => {
              e.preventDefault();
            }}
          >
            <input
              type="email"
              required
              placeholder="Your email"
              className="bg-transparent px-4 py-3 text-sm flex-1 outline-none placeholder:text-muted-foreground"
            />
            <button className="bg-gradient-gold px-5 text-xs tracking-luxury uppercase text-onyx font-medium">
              Join
            </button>
          </form>
          <div className="flex items-center gap-4 mt-6">
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
              className="hover-gold"
            >
              <Instagram className="w-5 h-5" />
            </a>
            <a
              href="https://wa.me/919633419902"
              target="_blank"
              rel="noreferrer"
              aria-label="WhatsApp"
              className="hover-gold"
            >
              <MessageCircle className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-10 mt-14 pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-3 text-xs tracking-wide-luxury uppercase text-muted-foreground">
        <span>© {new Date().getFullYear()} Rassa Boutique</span>
        <span>Crafted with reverence in Kerala</span>
      </div>
    </footer>
  );
}
