export function GoldParticles({ count = 18 }: { count?: number }) {
  const items = Array.from({ length: count });
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {items.map((_, i) => {
        const size = 2 + Math.random() * 4;
        const left = Math.random() * 100;
        const top = Math.random() * 100;
        const delay = Math.random() * 4;
        const dur = 3 + Math.random() * 4;
        return (
          <span
            key={i}
            className="absolute rounded-full bg-gold animate-shimmer"
            style={{
              width: size,
              height: size,
              left: `${left}%`,
              top: `${top}%`,
              animationDelay: `${delay}s`,
              animationDuration: `${dur}s`,
              boxShadow: "0 0 8px var(--gold)",
            }}
          />
        );
      })}
    </div>
  );
}
