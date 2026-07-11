"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

// Simplified version of the spec's FLIP-morph CTA: rather than animating
// the exact position/size of the hero button, this pinned button fades +
// scales in once the hero's own CTA scrolls past the nav, and fades out
// again once Pricing comes into view (since there's already a CTA there).
export default function StickyCTA() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    function onScroll() {
      const heroCta = document.getElementById("hero-cta");
      const pricing = document.getElementById("pricing");
      if (!heroCta || !pricing) return;

      const pastHero = heroCta.getBoundingClientRect().bottom < 73;
      const nearPricing = pricing.getBoundingClientRect().top < window.innerHeight * 0.55;

      setVisible(pastHero && !nearPricing);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className="fixed z-40 hidden md:block right-5 top-1/2"
      style={{
        transform: `translateY(-50%) scale(${visible ? 1 : 0.85})`,
        opacity: visible ? 1 : 0,
        pointerEvents: visible ? "auto" : "none",
        transition: "opacity 0.3s ease, transform 0.4s cubic-bezier(.2,.8,.2,1)",
      }}
    >
      <Link href="/submit" className="btn btn-primary px-6 py-3 shadow-lg">
        Get a quick take
      </Link>
    </div>
  );
}
