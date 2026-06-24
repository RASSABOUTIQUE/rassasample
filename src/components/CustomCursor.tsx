import { useEffect, useRef, useState } from "react";

export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  const [isVisible, setIsVisible] = useState(false);
  const [cursorText, setCursorText] = useState("");
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    // Disable on mobile/touch screens
    const isTouchDevice = window.matchMedia("(pointer: coarse)").matches;
    if (isTouchDevice) return;

    let mouseX = 0;
    let mouseY = 0;
    let ringX = 0;
    let ringY = 0;
    let isMoving = false;

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      setIsVisible(true);

      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
      }
    };

    const onMouseLeaveWindow = () => {
      setIsVisible(false);
    };

    // Smooth lerp (linear interpolation) animation loop for the outer ring
    const render = () => {
      // Ease factor: 0.15 for smooth drag
      const ease = 0.15;
      ringX += (mouseX - ringX) * ease;
      ringY += (mouseY - ringY) * ease;

      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ringX}px, ${ringY}px, 0)`;
      }

      requestAnimationFrame(render);
    };

    const animId = requestAnimationFrame(render);

    // Event listeners to detect hovers on interactive elements
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target) return;

      // Find if the hovered element or its parent is interactive
      const interactiveEl = target.closest("a, button, [role='button'], .interactive-hover");

      if (interactiveEl) {
        setIsHovered(true);

        // Determine cursor text based on element attributes or contents
        const hoverText = interactiveEl.getAttribute("data-cursor");
        if (hoverText) {
          setCursorText(hoverText);
        } else if (interactiveEl.tagName === "A" && interactiveEl.classList.contains("group")) {
          setCursorText("VIEW");
        } else if (
          interactiveEl.classList.contains("btn-gold") ||
          interactiveEl.classList.contains("btn-ghost-gold")
        ) {
          setCursorText("BOOK");
        } else if (interactiveEl.getAttribute("href")?.includes("wa.me")) {
          setCursorText("CHAT");
        } else {
          setCursorText("");
        }
      } else {
        setIsHovered(false);
        setCursorText("");
      }
    };

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    document.addEventListener("mouseleave", onMouseLeaveWindow);
    window.addEventListener("mouseover", handleMouseOver, { passive: true });

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseleave", onMouseLeaveWindow);
      window.removeEventListener("mouseover", handleMouseOver);
      cancelAnimationFrame(animId);
    };
  }, []);

  // Return nothing on server-side or if touch device (we verify in useEffect)
  if (typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches) {
    return null;
  }

  return (
    <>
      {/* Small Gold Center Dot */}
      <div
        ref={dotRef}
        className={`fixed top-0 left-0 w-1 h-1 bg-gold rounded-full pointer-events-none z-[999] -translate-x-1/2 -translate-y-1/2 transition-opacity duration-300 ${
          isVisible ? "opacity-100" : "opacity-0"
        }`}
      />

      {/* Smooth Spring Outer Ring / Hover Circle */}
      <div
        ref={ringRef}
        className={`fixed top-0 left-0 rounded-full pointer-events-none z-[998] -translate-x-1/2 -translate-y-1/2 flex items-center justify-center transition-all duration-300 ease-out ${
          isVisible ? "opacity-100" : "opacity-0"
        } ${
          isHovered
            ? "w-11 h-11 bg-gold/5 border border-gold/45 scale-105"
            : "w-6 h-6 bg-transparent border border-gold/15"
        }`}
      >
        {/* Animated text inside the circle when hovered */}
        <span
          ref={textRef}
          className={`text-[7px] tracking-[0.25em] font-sans font-medium text-gold select-none transition-all duration-300 ${
            isHovered && cursorText
              ? "opacity-100 scale-100"
              : "opacity-0 scale-50 w-0 h-0 overflow-hidden"
          }`}
        >
          {cursorText}
        </span>
      </div>
    </>
  );
}
