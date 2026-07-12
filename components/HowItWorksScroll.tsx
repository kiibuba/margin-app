"use client";

import { useEffect, useRef, useState } from "react";

const STEPS = [
  { t: "Tell us what it is", d: "A logo, a business plan, a menu, a first date outfit, a demo — almost anything you want a real reaction to." },
  { t: "We match you with the right person", d: "Someone suited to your subject reviews it directly — no panel, no committee, one honest reviewer." },
  { t: "You get their real take", d: "Delivered as agreed — a quick rating, a full critique, or whatever your custom brief called for." },
];

export default function HowItWorksScroll() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const activeRef = useRef(0);
  const lastChangeRef = useRef(0);
  const pendingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pendingTargetRef = useRef<number | null>(null);
  const MIN_STEP_DELAY = 200; // ms — each step stays visible at least this long

  // Captured once on mount rather than tracked live — mobile browsers fire
  // resize events as the address bar collapses/expands during scroll, and
  // reacting to those would make the pinned section's own height shift
  // under the user mid-scroll. Using one fixed value keeps the CSS height
  // and the JS scroll math always in agreement.
  const [vh, setVh] = useState(800);

  useEffect(() => {
    setVh(window.innerHeight);
  }, []);

  function commitStep(target: number) {
    if (target === activeRef.current) return;
    activeRef.current = target;
    lastChangeRef.current = performance.now();
    setActive(target);
  }

  useEffect(() => {
    function onScroll() {
      const el = sectionRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const total = rect.height - vh;
      if (total <= 0) return;
      const progress = Math.min(Math.max(-rect.top / total, 0), 0.999);
      const target = Math.floor(progress * STEPS.length);

      if (target === activeRef.current) return;

      const elapsed = performance.now() - lastChangeRef.current;
      if (elapsed >= MIN_STEP_DELAY) {
        commitStep(target);
      } else {
        // Remember the freshest target, but don't visually jump to it
        // until the current step has had its minimum time on screen.
        pendingTargetRef.current = target;
        if (!pendingTimeoutRef.current) {
          pendingTimeoutRef.current = setTimeout(() => {
            pendingTimeoutRef.current = null;
            if (pendingTargetRef.current !== null) {
              commitStep(pendingTargetRef.current);
              pendingTargetRef.current = null;
            }
          }, MIN_STEP_DELAY - elapsed);
        }
      }
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (pendingTimeoutRef.current) clearTimeout(pendingTimeoutRef.current);
    };
  }, [vh]);

  return (
    <section
      ref={sectionRef}
      id="how"
      className="grain relative bg-darkcard"
      style={{ height: `${STEPS.length * vh}px` }}
    >
      <div className="sticky top-0 overflow-hidden flex items-center" style={{ height: `${vh}px` }}>
        <div className="max-w-[1180px] mx-auto px-6 w-full grid md:grid-cols-[minmax(160px,240px)_1fr] gap-10 md:gap-16 items-center">
          <div>
            <div
              className="font-serif font-bold leading-none text-accent"
              style={{
                fontSize: "clamp(110px, 11vw, 190px)",
                letterSpacing: "-0.05em",
                WebkitTextStroke: "2px #D4FF3F",
                textShadow: "0 6px 30px rgba(212,255,63,0.35)",
              }}
            >
              0{active + 1}
            </div>
            <div className="w-[140px] h-[6px] bg-white/10 rounded-full relative overflow-hidden mt-4">
              <div
                className="absolute top-0 left-0 h-full bg-accent rounded-full transition-[width] duration-300 ease-out"
                style={{ width: `${((active + 1) / STEPS.length) * 100}%`, boxShadow: "0 0 16px 2px rgba(212,255,63,0.6)" }}
              />
            </div>
          </div>

          <div className="relative h-64 md:h-56">
            {STEPS.map((s, i) => (
              <div
                key={i}
                className={`absolute inset-0 transition-all duration-500 ease-out ${
                  i === active ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 translate-y-6 pointer-events-none"
                }`}
              >
                <h3 className="font-serif font-bold text-cream text-[34px] md:text-[48px] leading-[1.05] mb-5 max-w-xl">{s.t}</h3>
                <p className="text-mutedlight text-lg leading-relaxed max-w-md">{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
