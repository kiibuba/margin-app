"use client";

import { useEffect, useRef } from "react";

// Horizontal, directional, cumulative drift — distinct from ParallaxLayer's
// vertical position-based parallax. Tracks scroll delta over the session
// (not just current position), so scrolling down drifts right, scrolling
// up drifts back left, at `factor` × the accumulated delta.
export default function DriftLayer({
  factor,
  className,
  style,
  children,
}: {
  factor: number;
  className?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const offset = useRef(0);
  const lastY = useRef(0);

  useEffect(() => {
    lastY.current = window.scrollY;

    function onScroll() {
      const y = window.scrollY;
      const delta = y - lastY.current;
      lastY.current = y;
      offset.current += delta * factor;
      if (ref.current) {
        ref.current.style.transform = `translateX(${offset.current}px)`;
      }
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [factor]);

  return (
    <div ref={ref} className={className} style={style}>
      {children}
    </div>
  );
}
