import { useState } from "react";
import { MessageCircle, X, Scissors, ShoppingBag, Phone, MapPin, Package } from "lucide-react";
import { Link } from "@tanstack/react-router";

const options = [
  { icon: ShoppingBag, label: "Shop Assistance", href: "/shop", desc: "Browse our collections" },
  { icon: Scissors, label: "Custom Stitching", href: "/custom-stitching", desc: "Book a stitching appointment" },
  { icon: MessageCircle, label: "Bridal Consultation", href: "https://wa.me/919633419902?text=Hello%20Rassa%20Boutique%2C%20I'd%20like%20to%20book%20a%20bridal%20consultation.", desc: "WhatsApp us to book", external: true },
  { icon: Package, label: "Track My Order", href: "/track-order", desc: "Check your order status" },
  { icon: MapPin, label: "Visit Our Store", href: "/visit-store", desc: "Chathamangalam, Kozhikode" },
  { icon: Phone, label: "Call Us", href: "tel:+919633419902", desc: "+91 96334 19902", external: true },
];

export function AtelierConcierge() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label="Chat with Us"
        className={`fixed bottom-20 right-5 lg:bottom-6 lg:right-6 z-40 w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 ${
          open
            ? "bg-background border border-gold text-gold rotate-90"
            : "bg-gradient-gold text-onyx hover:scale-105"
        }`}
      >
        {open ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
      </button>

      {/* Panel */}
      {open && (
        <div className="fixed bottom-36 right-5 lg:bottom-24 lg:right-6 z-40 w-72 border border-border bg-background shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="p-4 border-b border-border">
            <p className="font-display text-lg text-ivory">Chat with Us</p>
            <p className="text-xs text-muted-foreground mt-0.5">How can we help you today?</p>
          </div>
          <div className="p-3 space-y-1">
            {options.map((opt) => {
              const content = (
                <div className="flex items-center gap-3 px-3 py-3 hover:bg-gold/10 transition-colors rounded-sm cursor-pointer group">
                  <div className="w-8 h-8 rounded-full border border-gold/50 flex items-center justify-center text-gold group-hover:bg-gold group-hover:text-onyx transition-colors shrink-0">
                    <opt.icon className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-ivory">{opt.label}</div>
                    <div className="text-xs text-muted-foreground">{opt.desc}</div>
                  </div>
                </div>
              );

              return opt.external ? (
                <a key={opt.label} href={opt.href} target="_blank" rel="noreferrer" onClick={() => setOpen(false)}>
                  {content}
                </a>
              ) : (
                <Link key={opt.label} to={opt.href as "/"} onClick={() => setOpen(false)}>
                  {content}
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </>
  );
}
