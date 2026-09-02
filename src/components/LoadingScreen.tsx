import { useEffect, useState } from "react";
import logo from "@/assets/rassa-logo-custom.png";

export function LoadingScreen() {
  const [mounted, setMounted] = useState(true);
  const [fade, setFade] = useState(false);

  useEffect(() => {
    // Block scroll when loading
    document.body.style.overflow = "hidden";

    // Trigger fade animation
    const fadeTimeout = setTimeout(() => {
      setFade(true);
    }, 400);

    // Unmount component and restore scroll
    const unmountTimeout = setTimeout(() => {
      setMounted(false);
      document.body.style.overflow = "";
    }, 800);

    return () => {
      clearTimeout(fadeTimeout);
      clearTimeout(unmountTimeout);
      document.body.style.overflow = "";
    };
  }, []);

  if (!mounted) return null;

  return (
    <div
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-onyx transition-all duration-[800ms] ease-in-out ${
        fade ? "opacity-0 pointer-events-none scale-105" : "opacity-100 scale-100"
      }`}
    >
      {/* Background radial gold glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.05)_0%,transparent_70%)] pointer-events-none" />

      <div className="relative flex flex-col items-center gap-6 z-10">
        {/* Animated logo wrapper */}
        <div className="relative w-24 h-24 sm:w-28 sm:h-28 flex items-center justify-center">
          {/* Outer glowing rings */}
          <div
            className={`absolute inset-[-12px] border border-gold/15 rounded-full transition-transform duration-1000 ${fade ? "scale-150 opacity-0" : "scale-100 animate-[spin_15s_linear_infinite]"}`}
          />
          <div
            className={`absolute inset-[-20px] border border-dashed border-gold/10 rounded-full transition-transform duration-1000 ${fade ? "scale-150 opacity-0" : "scale-100 animate-[spin_25s_linear_infinite_reverse]"}`}
          />

          {/* Logo Image */}
          <img
            src={logo}
            alt="Rassa Boutique"
            className={`w-20 h-20 sm:w-24 sm:h-24 object-contain transition-all duration-700 select-none ${fade ? "scale-90 opacity-0" : "scale-100 animate-pulse [animation-duration:2.5s]"}`}
          />
        </div>

        {/* Text logo */}
        <div
          className={`text-center mt-4 transition-all duration-700 delay-150 ${fade ? "opacity-0 translate-y-4" : "opacity-100 translate-y-0"}`}
        >
          <h2 className="font-display text-2xl sm:text-3xl tracking-luxury text-gradient-gold uppercase">
            RASSA
          </h2>
          <p className="font-serif italic text-xs sm:text-sm text-gold-soft/65 tracking-wide-luxury mt-2">
            Where Elegance Becomes Identity
          </p>
        </div>

        {/* Shimmer progress line */}
        <div
          className={`w-32 h-[1px] bg-gold/10 overflow-hidden mt-6 relative transition-all duration-500 ${fade ? "w-0 opacity-0" : "w-32 opacity-100"}`}
        >
          <div
            className="absolute inset-y-0 left-0 w-full bg-gradient-to-r from-transparent via-gold to-transparent animate-[shimmer-loader_1.5s_infinite]"
            style={{ backgroundSize: "200% 100%" }}
          />
        </div>
      </div>
    </div>
  );
}
