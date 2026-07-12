import Link from "next/link";
import Nav from "@/components/Nav";
import ReviewWheel from "@/components/ReviewWheel";
import HowItWorksScroll from "@/components/HowItWorksScroll";
import DriftLayer from "@/components/DriftLayer";
import HeroReviewDeck from "@/components/HeroReviewDeck";
import RevealOnScroll from "@/components/RevealOnScroll";
import StickyCTA from "@/components/StickyCTA";

export default function Home() {
  return (
    <main className="font-sans">
      <Nav />
      <StickyCTA />

      {/* HERO — dark, overlaid by the fixed nav */}
      <section className="grain bg-darkbg relative overflow-hidden">
        {/* soft top-left spotlight for depth */}
        <div
          className="pointer-events-none absolute inset-0 z-0"
          style={{ background: "radial-gradient(ellipse 900px 600px at 15% -10%, rgba(212,255,63,0.09), transparent 60%)" }}
        />

        {/* decorative background texture — 3 lines, mixed fonts/sizes, drifts horizontally with scroll */}
        <div className="pointer-events-none absolute inset-0 flex flex-col justify-center gap-3 overflow-hidden select-none z-0">
          <DriftLayer factor={0.0375} className="whitespace-nowrap" style={{ lineHeight: 0.85, letterSpacing: "-0.02em" }}>
            <span className="font-serif font-bold" style={{ fontSize: "16vw", color: "#121210" }}>SECOND OPINION</span>
            <span className="font-serif font-bold" style={{ fontSize: "6vw", color: "#121210" }}>SECOND OPINION</span>
            <span className="font-serif font-bold" style={{ fontSize: "21vw", color: "#121210" }}>SECOND OPINION</span>
          </DriftLayer>
          <DriftLayer factor={0.075} className="whitespace-nowrap" style={{ lineHeight: 0.85, letterSpacing: "-0.02em" }}>
            <span className="font-sans font-semibold" style={{ fontSize: "8vw", color: "#121210" }}>SECOND OPINION</span>
            <span className="font-hand font-semibold" style={{ fontSize: "12vw", color: "#121210" }}>SECOND OPINION</span>
            <span className="font-sans font-medium" style={{ fontSize: "5vw", color: "#121210" }}>SECOND OPINION</span>
          </DriftLayer>
          <DriftLayer factor={0.05625} className="whitespace-nowrap" style={{ lineHeight: 0.85, letterSpacing: "-0.02em" }}>
            <span className="font-serif font-bold" style={{ fontSize: "9vw", color: "#121210" }}>SECOND OPINION</span>
            <span className="font-sans font-semibold" style={{ fontSize: "17vw", color: "#121210" }}>SECOND OPINION</span>
            <span className="font-hand font-semibold" style={{ fontSize: "7vw", color: "#121210" }}>SECOND OPINION</span>
          </DriftLayer>
        </div>

        <div className="max-w-[1180px] mx-auto px-6 pt-[calc(73px+3rem)] pb-20 md:pt-[calc(73px+5rem)] md:pb-28 grid md:grid-cols-[1.15fr_1fr] gap-14 items-center relative z-10">
          <div>
            <span
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-accent/15 border border-accent/40 text-accent text-[13px] font-semibold mb-7"
              style={{ animation: "fadeUp 0.7s ease 0ms both" }}
            >
              Reviewed by an actual human
            </span>
            <h1
              className="font-serif font-bold text-cream text-[40px] md:text-[64px] leading-[0.97] tracking-tight mb-7"
              style={{ animation: "fadeUp 0.8s ease 80ms both" }}
            >
              Get an <span className="text-accent">honest</span> opinion. Not an answer.
            </h1>
            <p
              className="text-[17px] md:text-[19px] leading-relaxed text-mutedlight max-w-[440px] mb-9"
              style={{ animation: "fadeUp 0.8s ease 160ms both" }}
            >
              AI can describe, summarize, and analyze almost anything. What it can&rsquo;t do is
              actually think something. We put a real person on your thing and get you their
              honest, unfiltered take.
            </p>
            <div className="flex gap-3.5 flex-wrap" style={{ animation: "fadeUp 0.9s ease 240ms both" }}>
              <Link id="hero-cta" href="/submit" className="btn btn-primary px-8 py-4 text-base">Get a quick take</Link>
              <Link href="#pricing" className="btn btn-outline-light px-8 py-4 text-base">See pricing</Link>
            </div>
          </div>

          <div className="hidden md:flex justify-center">
            <HeroReviewDeck />
          </div>
        </div>
      </section>

      {/* WHY NOT AI — light */}
      <section className="bg-paper py-20">
        <div className="max-w-[1180px] mx-auto px-6">
          <RevealOnScroll>
            <h2 className="font-serif font-bold text-[32px] md:text-[42px] tracking-tight mb-3.5">
              What AI can tell you. What a person will.
            </h2>
            <p className="text-inksoft text-[17px] max-w-[540px] mb-12 leading-relaxed">
              Ask a model and it&rsquo;ll hedge, average, and cover every angle. Ask a person and
              you get one clear, biased, genuinely felt opinion &mdash; the kind you actually act on.
            </p>
          </RevealOnScroll>
          <div className="grid md:grid-cols-2 gap-6">
            <RevealOnScroll delayMs={80}>
              <div className="card p-8 h-full">
                <h3 className="text-sm uppercase tracking-wide font-bold text-muted2 mb-5">Ask an AI</h3>
                <ul className="text-[15px] leading-relaxed">
                  {[
                    "Summarizes what's already known",
                    "Plays it safe and hedges everything",
                    "Has no taste, no stakes, nothing to lose",
                    "Same answer, roughly, for everyone",
                  ].map((t, i) => (
                    <li key={i} className="py-2.5 flex gap-2.5">
                      <span className="text-muted2">—</span> {t}
                    </li>
                  ))}
                </ul>
              </div>
            </RevealOnScroll>
            <RevealOnScroll delayMs={160}>
              <div
                className="rounded-2xl bg-darkcard p-8 h-full"
                style={{ boxShadow: "inset 0 1px 0 rgba(255,255,255,0.06), 0 20px 40px -24px rgba(0,0,0,0.5)" }}
              >
                <h3 className="text-sm uppercase tracking-wide font-bold text-accent mb-5">Ask a person</h3>
                <ul className="text-[15px] leading-relaxed text-cream">
                  {[
                    "Tells you what they actually think",
                    "Has taste — and isn't afraid to use it",
                    "Notices the thing you were quietly worried about",
                    "An opinion that's really theirs, and really yours to use",
                  ].map((t, i) => (
                    <li key={i} className="py-2.5 flex gap-2.5">
                      <span className="text-accent">+</span> {t}
                    </li>
                  ))}
                </ul>
              </div>
            </RevealOnScroll>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS — pinned scroll, dark */}
      <HowItWorksScroll />

      {/* PRICING — light */}
      <section id="pricing" className="bg-paper py-20">
        <div className="max-w-[1180px] mx-auto px-6">
          <RevealOnScroll>
            <h2 className="font-serif font-bold text-[32px] md:text-[42px] tracking-tight mb-3.5">Pricing</h2>
            <p className="text-inksoft text-[17px] max-w-[540px] mb-12 leading-relaxed">
              Three ways to get a real opinion.
            </p>
          </RevealOnScroll>
          <div className="grid md:grid-cols-3 gap-6">
            <RevealOnScroll delayMs={0}>
              <div className="card p-8 flex flex-col h-full group transition-all duration-[250ms] ease-out hover:-translate-y-2 hover:shadow-[0_30px_50px_-20px_rgba(20,20,15,0.25)] hover:border-accent">
                <span className="inline-block text-xs font-bold px-3 py-1 rounded-full bg-accenttint text-accenttinttext w-fit mb-4">Quick</span>
                <h3 className="font-serif font-bold text-2xl mb-1.5">The quick take</h3>
                <div className="text-[15px] text-inksoft mb-5">From <b className="text-ink text-[17px]">€9</b> · within 24h</div>
                <p className="text-[15px] text-inksoft leading-relaxed mb-6 flex-grow">
                  A few sentences, straight up. What we see, said plainly, plus a rating. No essay, no advice.
                </p>
                <Link
                  href="/submit?tier=quick"
                  className="btn bg-darkcard text-accent w-full transition-all duration-150 group-hover:bg-accent group-hover:text-ink"
                >
                  Get a quick take
                </Link>
              </div>
            </RevealOnScroll>

            <RevealOnScroll delayMs={80}>
              <div className="card p-8 flex flex-col h-full group border-2 border-accent shadow-[0_20px_40px_-28px_rgba(212,255,63,0.35)] transition-all duration-[250ms] ease-out hover:-translate-y-2 hover:shadow-[0_30px_60px_-24px_rgba(212,255,63,0.45)]">
                <span className="inline-block text-xs font-bold px-3 py-1 rounded-full bg-accent text-ink w-fit mb-4">Advance</span>
                <h3 className="font-serif font-bold text-2xl mb-1.5">The full critique</h3>
                <div className="text-[15px] text-inksoft mb-5">From <b className="text-ink text-[17px]">€29</b> · 2–3 days</div>
                <p className="text-[15px] text-inksoft leading-relaxed mb-6 flex-grow">
                  One to two paragraphs, written like a real reaction — not a lecture. We say what&rsquo;s
                  actually there and land on a verdict. That&rsquo;s it.
                </p>
                <Link
                  href="/submit?tier=advance"
                  className="btn bg-darkcard text-accent w-full transition-all duration-150 group-hover:bg-accent group-hover:text-ink"
                >
                  Get a full critique
                </Link>
              </div>
            </RevealOnScroll>

            <RevealOnScroll delayMs={160}>
              <div className="card p-8 flex flex-col h-full group transition-all duration-[250ms] ease-out hover:-translate-y-2 hover:shadow-[0_30px_50px_-20px_rgba(20,20,15,0.25)] hover:border-accent">
                <span className="inline-block text-xs font-bold px-3 py-1 rounded-full bg-accenttint text-accenttinttext w-fit mb-4">Custom</span>
                <h3 className="font-serif font-bold text-2xl mb-1.5">Whatever you need</h3>
                <div className="text-[15px] text-inksoft mb-5">On request · agreed upfront</div>
                <p className="text-[15px] text-inksoft leading-relaxed mb-6 flex-grow">
                  Bigger projects, multiple reviewers, or an unusual format — scoped with you before we start.
                </p>
                <Link
                  href="/submit?tier=custom"
                  className="btn bg-darkcard text-accent w-full transition-all duration-150 group-hover:bg-accent group-hover:text-ink"
                >
                  Start a conversation
                </Link>
              </div>
            </RevealOnScroll>
          </div>
        </div>
      </section>

      {/* SAMPLE TAKES — dark, interactive wheel — now sits right before the footer */}
      <section className="grain bg-darkbg py-20 relative overflow-hidden">
        <div className="max-w-[1180px] mx-auto px-6">
          <h2 className="font-serif font-bold text-cream text-[32px] md:text-[42px] tracking-tight mb-3.5">
            What a take actually looks like
          </h2>
          <p className="text-mutedlight text-[17px] max-w-[540px] mb-10 leading-relaxed">
            No advice, no ten-step plan. Just what we saw, and what we thought of it.
          </p>
          <ReviewWheel />
        </div>
      </section>

      {/* FOOTER — dark */}
      <footer className="grain bg-darkbg py-20 text-center relative">
        <div className="max-w-[1180px] mx-auto px-6">
          <RevealOnScroll>
            <h2 className="font-serif font-bold text-cream text-[32px] md:text-[48px] tracking-tight mb-8">
              Real opinions. From real people.
            </h2>
          </RevealOnScroll>
          <div className="flex justify-center gap-8 text-sm text-mutedlight">
            <Link href="/#how" className="hover:text-accent transition-colors">How it works</Link>
            <Link href="/#pricing" className="hover:text-accent transition-colors">Pricing</Link>
            <span>© 2026 Second Opinion</span>
          </div>
        </div>
      </footer>
    </main>
  );
}
