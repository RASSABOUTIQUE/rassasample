import { useState, useEffect } from "react";
import {
  MessageCircle,
  X,
  Sparkles,
  Scissors,
  MapPin,
  Compass,
  Phone,
  Instagram,
} from "lucide-react";

interface ConciergeOption {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  whatsappMessage: string;
}

export function AtelierConcierge() {
  const [isOpen, setIsOpen] = useState(false);
  const [shouldPulse, setShouldPulse] = useState(true);

  useEffect(() => {
    // Pulse animation stops after user first interacts
    if (isOpen) {
      setShouldPulse(false);
    }
  }, [isOpen]);

  const conciergeNumber = "919633419902";

  const options: ConciergeOption[] = [
    {
      icon: Sparkles,
      title: "Bridal Trousseau Styling",
      description:
        "Book a private design suite session with our lead couturiers in Chathamangalam.",
      whatsappMessage:
        "Hello Rassa Boutique, I would like to book a private Bridal Trousseau Styling consultation. Please share available dates and designers.",
    },
    {
      icon: Scissors,
      title: "Bespoke Custom Stitching",
      description: "Schedule a measurement session and discuss necklines, linings, and embroidery.",
      whatsappMessage:
        "Hello Rassa Boutique, I'm interested in your Bespoke Custom Stitching services. I'd like to schedule an atelier measurement and styling session.",
    },
    {
      icon: Compass,
      title: "Signature Design Inquiry",
      description:
        "Check pricing, textile availability, or request custom colorways for Lookbook designs.",
      whatsappMessage:
        "Hello Rassa Boutique, I am interested in a custom design from your Luxury Lookbook and would like to inquire about fabric options and pricing.",
    },
    {
      icon: MapPin,
      title: "Atelier Store Visit",
      description:
        "Coordinate timing for a private viewing of our Kozhikode boutique and collections.",
      whatsappMessage:
        "Hello Rassa Boutique, I am planning to visit your Chathamangalam, Kozhikode boutique. I'd like to coordinate timing for a private viewing of the heritage sarees.",
    },
  ];

  const handleOptionClick = (option: ConciergeOption) => {
    const encodedText = encodeURIComponent(option.whatsappMessage);
    window.open(
      `https://wa.me/${conciergeNumber}?text=${encodedText}`,
      "_blank",
      "noopener,noreferrer",
    );
    setIsOpen(false);
  };

  return (
    <>
      {/* Floating Concierge Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-45 flex items-center justify-center gap-2 px-4 h-14 rounded-full bg-gradient-gold shadow-gold hover:scale-105 transition-transform duration-300 group"
        aria-label="Atelier Concierge"
      >
        <MessageCircle className="w-5 h-5 text-onyx animate-pulse" />
        <span className="font-sans text-[10px] tracking-wide-luxury uppercase text-onyx font-medium">
          Atelier Concierge
        </span>
        {shouldPulse && (
          <span className="absolute inset-0 rounded-full bg-gold opacity-30 animate-ping" />
        )}
      </button>

      {/* Slide-out VIP Drawer */}
      <div
        className={`fixed inset-y-0 right-0 z-50 w-full sm:w-[420px] bg-card/95 border-l border-border backdrop-blur-xl shadow-deep p-8 flex flex-col justify-between transition-all duration-500 cubic-bezier(0.16, 1, 0.3, 1) ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Top Header */}
        <div>
          <div className="flex items-center justify-between border-b border-border pb-6 mb-8">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-gold" />
              <span className="font-display text-xs tracking-luxury text-gold uppercase">
                Rassa Concierge
              </span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-foreground/60 hover:text-gold transition-colors"
              aria-label="Close Concierge"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Welcome Greeting */}
          <div className="mb-8">
            <h3 className="font-display text-3xl text-gradient-gold">
              Welcome to the <br />
              <span className="italic">Rassa Atelier</span>
            </h3>
            <p className="mt-4 font-serif italic text-sm text-foreground/80 leading-relaxed">
              "Every couture garment we draft, weave, and stitch is an act of identity. We invite
              you to experience our personalized atelier services."
            </p>
          </div>

          {/* Luxury Menu Options */}
          <div className="space-y-4">
            {options.map((opt, idx) => {
              const Icon = opt.icon;
              return (
                <button
                  key={idx}
                  onClick={() => handleOptionClick(opt)}
                  className="w-full text-left p-4 border border-border/60 hover:border-gold/60 bg-background/30 hover:bg-gold/5 transition-all duration-300 flex gap-4 items-start rounded-sm group/item"
                >
                  <div className="p-2 border border-gold/20 bg-background rounded-sm text-gold group-hover/item:bg-gradient-gold group-hover/item:text-onyx transition-all duration-300">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-display text-md text-foreground group-hover/item:text-gold transition-colors">
                      {opt.title}
                    </h4>
                    <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                      {opt.description}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Footer Contact Info */}
        <div className="mt-8 border-t border-border pt-6 flex flex-col gap-4">
          <div className="flex items-center justify-between text-xs text-muted-foreground uppercase tracking-wider">
            <span>Kozhikode, Kerala</span>
            <div className="flex gap-4">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="hover-gold transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="tel:+919633419902"
                className="hover-gold transition-colors"
                aria-label="Call Atelier"
              >
                <Phone className="w-4 h-4" />
              </a>
            </div>
          </div>
          <div className="text-center">
            <span className="text-[10px] tracking-luxury text-gold uppercase opacity-60">
              Bespoke Luxury Experience
            </span>
          </div>
        </div>
      </div>

      {/* Overlay Backdrop */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity duration-500"
        />
      )}
    </>
  );
}
