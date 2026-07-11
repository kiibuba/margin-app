"use client";

import { useEffect, useRef, useState } from "react";
import { ratingColor } from "@/lib/ratingColor";

type Review = { tag: string; rating: number; quote: string };

const REVIEWS: Review[] = [
  { tag: "LOGO REVIEW", rating: 6, quote: "Logo's fine. Font choice is doing a lot of heavy lifting it can't actually carry. Would not stop me from buying the product." },
  { tag: "COMEDY SET", rating: 9, quote: "Genuinely funny, which I wasn't expecting. Second half loses the plot but nobody sober will notice." },
  { tag: "PRODUCT DEMO", rating: 3, quote: "It works. That's the whole review. It works and nothing about it will make anyone feel anything." },
  { tag: "FIRST DATE FIT", rating: 7.5, quote: "The jacket is doing the actual work here. Trust the jacket. Lose the shoes." },
  { tag: "PITCH DECK", rating: 8, quote: "Slide 4 is where you actually convince me. Slides 1 through 3 are you convincing yourself." },
  { tag: "APARTMENT TOUR", rating: 4.5, quote: "Good light, bad energy. Something about that hallway is not it." },
];

export default function ReviewWheel() {
  const n = REVIEWS.length;
  const [active, setActive] = useState(0);
  const [hover, setHover] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const wheelLock = useRef(false);

  useEffect(() => {
    if (hover) return;
    const t = setInterval(() => setActive((a) => (a + 1) % n), 4200);
    return () => clearInterval(t);
  }, [hover, n]);

  function go(delta: number) {
    setActive((a) => (a + delta + n) % n);
  }

  function onWheel(e: React.WheelEvent) {
    if (wheelLock.current || Math.abs(e.deltaY) < 12) return;
    wheelLock.current = true;
    go(e.deltaY > 0 ? 1 : -1);
    setTimeout(() => (wheelLock.current = false), 350);
  }

  function onTouchStart(e: React.TouchEvent) {
    touchStartX.current = e.touches[0].clientX;
  }
  function onTouchEnd(e: React.TouchEvent) {
    if (touchStartX.current == null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1);
    touchStartX.current = null;
  }

  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onWheel={onWheel}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      className="select-none"
    >
      <div className="relative h-[360px] flex items-center justify-center">
        {REVIEWS.map((r, i) => {
          let offset = i - active;
          if (offset > n / 2) offset -= n;
          if (offset < -n / 2) offset += n;
          const dist = Math.abs(offset);
          const isActive = offset === 0;
          if (dist > 2) return null;
          const color = ratingColor(r.rating);

          return (
            <div
              key={r.tag}
              onClick={() => setActive(i)}
              className="absolute w-[240px] md:w-[280px] rounded-2xl p-6 cursor-pointer border transition-all duration-500 ease-out"
              style={{
                transform: `translateX(${offset * 130}px) translateY(${dist * 16}px) rotate(${offset * 9}deg) scale(${isActive ? 1.08 : 1 - dist * 0.12})`,
                zIndex: 10 - dist,
                backgroundImage: "linear-gradient(150deg, rgba(255,255,255,0.12), rgba(255,255,255,0.02) 55%)",
                backgroundColor: "rgba(20,20,18,0.35)",
                backdropFilter: "blur(18px) saturate(140%)",
                WebkitBackdropFilter: "blur(18px) saturate(140%)",
                borderColor: isActive ? color : "rgba(255,255,255,0.16)",
                boxShadow: isActive
                  ? `inset 0 1px 0 rgba(255,255,255,0.18), 0 30px 60px -20px ${color}70, 0 4px 12px rgba(0,0,0,0.5)`
                  : "inset 0 1px 0 rgba(255,255,255,0.1), 0 14px 28px -16px rgba(0,0,0,0.55)",
              }}
            >
              <div className="flex items-center justify-between mb-4">
                <span className="font-mono text-[11px] tracking-wide text-mutedlight">{r.tag}</span>
                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-black/30" style={{ color }}>
                  {r.rating.toFixed(1)}/10
                </span>
              </div>
              <p className="italic text-[15px] leading-relaxed text-cream">&ldquo;{r.quote}&rdquo;</p>
            </div>
          );
        })}
      </div>

      <div className="flex items-center justify-center gap-5 mt-8">
        <button
          onClick={() => go(-1)}
          aria-label="Previous review"
          className="w-10 h-10 rounded-full border border-white/25 text-cream flex items-center justify-center hover:border-accent hover:text-accent transition-colors"
        >
          ‹
        </button>
        <div className="flex gap-1.5">
          {REVIEWS.map((_, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              aria-label={`Go to review ${i + 1}`}
              className={`h-1.5 rounded-full transition-all ${i === active ? "bg-accent w-5" : "bg-white/20 w-1.5"}`}
            />
          ))}
        </div>
        <button
          onClick={() => go(1)}
          aria-label="Next review"
          className="w-10 h-10 rounded-full border border-white/25 text-cream flex items-center justify-center hover:border-accent hover:text-accent transition-colors"
        >
          ›
        </button>
      </div>
    </div>
  );
}
