"use client";

import { useEffect, useRef, useState } from "react";
import { ratingColor } from "@/lib/ratingColor";

type Card = { tag: string; rating: number };

const CARDS: Card[] = [
  { tag: "LOGO", rating: 8.7 },
  { tag: "PITCH", rating: 6.5 },
  { tag: "DEMO", rating: 9.2 },
  { tag: "MENU", rating: 5.5 },
  { tag: "FIT CHECK", rating: 7.8 },
];

const ROTATIONS = [-9, 4, -3, 7, -5];
const RADIUS = 27;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

function easeOutCubic(t: number) {
  return 1 - Math.pow(1 - t, 3);
}

export default function HeroReviewDeck() {
  const [progress, setProgress] = useState<number[]>(CARDS.map(() => 0));
  const cancelled = useRef(false);

  useEffect(() => {
    cancelled.current = false;

    async function runSequence() {
      await new Promise((r) => setTimeout(r, 350));

      for (let i = 0; i < CARDS.length; i++) {
        if (cancelled.current) return;
        await new Promise<void>((resolve) => {
          const start = performance.now();
          const duration = 750;

          function tick(now: number) {
            if (cancelled.current) return resolve();
            const t = Math.min((now - start) / duration, 1);
            const eased = easeOutCubic(t);
            setProgress((prev) => {
              const next = [...prev];
              next[i] = eased;
              return next;
            });
            if (t < 1) requestAnimationFrame(tick);
            else resolve();
          }
          requestAnimationFrame(tick);
        });
        await new Promise((r) => setTimeout(r, 150));
      }
    }

    runSequence();
    return () => {
      cancelled.current = true;
    };
  }, []);

  return (
    <div className="flex items-end gap-3">
      {CARDS.map((card, i) => {
        const p = progress[i];
        const color = ratingColor(card.rating);
        const displayRating = (card.rating * p).toFixed(1);
        const dashOffset = CIRCUMFERENCE * (1 - (p * card.rating) / 10);

        return (
          <div
            key={card.tag}
            className="w-[102px] h-[172px] rounded-2xl p-3 flex flex-col items-center justify-between"
            style={{
              transform: `rotate(${ROTATIONS[i]}deg)`,
              backgroundImage: "linear-gradient(150deg, rgba(255,255,255,0.16), rgba(255,255,255,0.03) 60%)",
              backgroundColor: "rgba(255,255,255,0.05)",
              backdropFilter: "blur(14px) saturate(160%)",
              WebkitBackdropFilter: "blur(14px) saturate(160%)",
              border: "1px solid rgba(255,255,255,0.24)",
              boxShadow: "inset 0 1px 0 rgba(255,255,255,0.15), 0 20px 40px -20px rgba(0,0,0,0.5)",
            }}
          >
            <span
              className="font-mono text-[9px] tracking-wide text-cream self-start"
              style={{ textShadow: "0 1px 2px rgba(0,0,0,0.6)" }}
            >
              {card.tag}
            </span>
            <div className="relative w-[62px] h-[62px] flex items-center justify-center">
              <svg width="62" height="62" viewBox="0 0 62 62" className="absolute inset-0 -rotate-90">
                <circle cx="31" cy="31" r={RADIUS} fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="3.5" />
                <circle
                  cx="31"
                  cy="31"
                  r={RADIUS}
                  fill="none"
                  stroke={color}
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  strokeDasharray={CIRCUMFERENCE}
                  strokeDashoffset={dashOffset}
                />
              </svg>
              <span
                className="font-serif font-bold text-[18px] relative"
                style={{ color, WebkitTextStroke: "0.5px rgba(0,0,0,0.4)", textShadow: "0 2px 6px rgba(0,0,0,0.5)" }}
              >
                {displayRating}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
