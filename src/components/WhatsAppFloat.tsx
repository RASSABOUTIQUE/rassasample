import { MessageCircle } from "lucide-react";

export function WhatsAppFloat() {
  return (
    <a
      href="https://wa.me/919633419902?text=Hello%20Rassa%20Boutique%2C%20I%27d%20like%20to%20enquire."
      target="_blank"
      rel="noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-6 right-6 z-40 flex items-center justify-center w-14 h-14 rounded-full bg-gradient-gold shadow-gold hover:scale-110 transition-transform"
    >
      <MessageCircle className="w-6 h-6 text-onyx" />
      <span className="absolute inset-0 rounded-full bg-gold opacity-40 animate-ping" />
    </a>
  );
}
