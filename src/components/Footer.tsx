import { Link } from "@tanstack/react-router";
import { MapPin, Phone, Instagram, MessageCircle } from "lucide-react";
import logo from "@/assets/rassa-logo-custom.png";
import { useCMS } from "@/lib/cms";

const shopLinks = [
  { to: "/shop", label: "All Products" },
  { to: "/shop", label: "New Arrivals" },
  { to: "/shop", label: "Kasavu Sarees" },
  { to: "/shop", label: "Silk Sarees" },
  { to: "/shop", label: "Bridal Wear" },
  { to: "/shop", label: "Churidar Sets" },
  { to: "/shop", label: "Kurtis" },
];

const helpLinks = [
  { to: "/faq", label: "FAQ" },
  { to: "/faq", label: "Shipping & Delivery" },
  { to: "/faq", label: "Returns & Exchanges" },
  { to: "/track-order", label: "Track Order" },
  { to: "/custom-stitching", label: "Custom Stitching" },
  { to: "/contact", label: "Contact Us" },
];

const aboutLinks = [
  { to: "/about", label: "About Rassa" },
  { to: "/visit-store", label: "Visit Store" },
  { to: "/custom-stitching", label: "Book a Consultation" },
];

export function Footer() {
  const { cms } = useCMS();
  const store = cms.store;
  return (
    <footer className="border-t border-border bg-background pb-16 lg:pb-0">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 pt-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 pb-12 border-b border-border">
          {/* Brand column */}
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <img src={logo} alt="Rassa Boutique" className="h-9 w-9 object-contain" />
              <span className="font-display text-lg tracking-wide-luxury text-gold">RASSA</span>
            </Link>
            <p className="text-xs text-muted-foreground leading-relaxed mb-4">
              Kerala's premium women's boutique — silk sarees, kasavu, bridal wear, and custom
              stitching. Based in Kozhikode since our founding.
            </p>
            <div className="flex items-center gap-3 mb-2 text-xs text-muted-foreground">
              <MapPin className="w-3.5 h-3.5 text-gold shrink-0" />
              <span>{store.address}, {store.city} {store.pincode}</span>
            </div>
            <div className="flex items-center gap-3 mb-3 text-xs text-muted-foreground">
              <Phone className="w-3.5 h-3.5 text-gold shrink-0" />
              <a href={`tel:${store.phone.replace(/[^0-9+]/g, "")}`} className="hover:text-gold transition-colors">
                {store.phone}
              </a>
            </div>
            <div className="text-xs text-muted-foreground mb-5">
              <div className="font-medium text-foreground/70 mb-1">Store Hours</div>
              <div>Mon–Sat: 10am – 9pm</div>
              <div>Sunday: 11am – 8pm</div>
            </div>
            <div className="flex items-center gap-4 mt-6">
              <a href={store.instagram || "https://instagram.com/rassa_boutique"} target="_blank" rel="noreferrer" className="w-8 h-8 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:border-gold hover:text-gold transition-all">
                <Instagram className="w-3.5 h-3.5" />
              </a>
              <a href={`https://wa.me/${store.whatsapp.replace(/[^0-9]/g, "")}`} target="_blank" rel="noreferrer" className="w-8 h-8 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:border-gold hover:text-gold transition-all">
                <MessageCircle className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Shop */}
          <div>
            <div className="text-[10px] tracking-luxury uppercase text-gold mb-4">Shop</div>
            <ul className="space-y-2.5">
              {shopLinks.map((link) => (
                <li key={link.label}>
                  <Link to={link.to} className="text-xs text-muted-foreground hover:text-gold transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Help */}
          <div>
            <div className="text-[10px] tracking-luxury uppercase text-gold mb-4">Help & Support</div>
            <ul className="space-y-2.5">
              {helpLinks.map((link) => (
                <li key={link.label}>
                  <Link to={link.to} className="text-xs text-muted-foreground hover:text-gold transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* About */}
          <div>
            <div className="text-[10px] tracking-luxury uppercase text-gold mb-4">Our Boutique</div>
            <ul className="space-y-2.5 mb-6">
              {aboutLinks.map((link) => (
                <li key={link.label}>
                  <Link to={link.to} className="text-xs text-muted-foreground hover:text-gold transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Payments */}
            <div className="text-[10px] tracking-luxury uppercase text-gold mb-3">We Accept</div>
            <div className="flex flex-wrap gap-2 text-[9px] text-muted-foreground">
              {["COD", "UPI", "Bank Transfer", "Razorpay (Soon)"].map((p) => (
                <span key={p} className="border border-border px-2 py-1 bg-card">{p}</span>
              ))}
            </div>
          </div>
        </div>

        <div className="py-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
          <span>© 2026 Rassa Boutique · Kozhikode, Kerala. All rights reserved.</span>
          <div className="flex gap-4">
            <Link to="/faq" className="hover:text-gold transition-colors">Return Policy</Link>
            <Link to="/faq" className="hover:text-gold transition-colors">Privacy Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
