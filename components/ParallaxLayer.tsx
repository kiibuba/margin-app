"use client";

import { useEffect, useRef, type ReactNode } from "react";

// Moves its children at `factor` × scroll speed — factor < 1 feels slower
// than the page (background depth), negative factor moves opposite to
// scroll (floats up as you scroll down).
export default function ParallaxLayer({
  factor,
  className,
  children,
}: {
  factor: number;
  className?: string;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onScroll() {
      if (ref.current) {
        ref.current.style.transform = `translateY(${window.scrollY * factor}px)`;
      }
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [factor]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
