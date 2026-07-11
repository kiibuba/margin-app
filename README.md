# Margin

Full app: marketing site, email/password login, order submission, and real
Stripe payments, built with Next.js (App Router) + Supabase (auth + database)
+ Stripe (payments).

## What's actually in here

- `/` — marketing/landing page
- `/signup`, `/login` — Supabase email/password auth
- `/submit` — logged-in users submit something + pick a tier
- Quick / Advance → real Stripe Checkout (fixed server-side pricing, so
  nobody can tamper with the amount from the browser)
- Custom → saved as a "quote requested" row, no payment yet
- `/dashboard` — a user's own requests and their status
- `/order/[id]` — one request's status, and the finished review once
  delivered; for custom requests, this is also where the customer pays
  once you've sent a quote
- `/admin` — the reviewer screen (see below)
- A Stripe webhook that marks an order "paid" the moment payment succeeds

## Reviewer screen (`/admin`)

Only accounts listed in `ADMIN_EMAILS` can see this page — sign up for a
normal account with that email first, then visit `/admin`. From there you
can:

- **Send a quote** for custom requests — enter an amount, and it creates
  a real Stripe Checkout link for that customer and moves the order to
  "quoted." They'll see a Pay button on their `/order/[id]` page.
- **Deliver a review** for anything that's been paid — write the take,
  pick a star rating, and it's saved and shown to the customer
  immediately.

There's no way for a non-admin to reach this data — the page checks the
signed-in email server-side before it ever queries the database, and it
only uses the service-role key after that check passes.

## 1. Install

```bash
npm install
```

## 2. Set up Supabase

1. Create a free project at supabase.com.
2. In the SQL editor, run everything in `supabase/schema.sql`.
3. In Project Settings → API, copy the **Project URL**, **anon public key**,
   and **service_role key**.
4. In Authentication → URL configuration, add
   `http://localhost:3000/auth/callback` (and your production URL once
   deployed) as a redirect URL.
5. In the left sidebar, go to **Storage** → **New bucket** → name it
   exactly `attachments` → leave **Public bucket** switched OFF. The
   read/write policies for it are already included in
   `supabase/schema.sql` from step 2.

## 3. Set up Stripe

1. Create a free Stripe account (test mode is fine to start).
2. Developers → API keys → copy the **secret key**.
3. Once deployed, Developers → Webhooks → add an endpoint pointing at
   `https://yourdomain.com/api/webhook`, listening for
   `checkout.session.completed`. Copy its **signing secret**.
   (For local testing, use the Stripe CLI: `stripe listen --forward-to
   localhost:3000/api/webhook`.)
4. Prices for the Quick and Advance tiers are set in `lib/stripe.ts`
   (`TIER_PRICING`) — change the numbers there, not in Stripe itself.

## 4. Set up email (Resend)

You (the reviewer) get an email the moment a new request comes in —
either a paid Quick/Advance order or a custom request. Customers get an
email with their rating, the written take, and a link back to the site
the moment you deliver a review.

1. Create a free account at [resend.com](https://resend.com) (100
   emails/day free, no card required).
2. **API Keys** → create one → copy it into `RESEND_API_KEY`.
3. To send from your own address (e.g.
   `notifications@2opinion.cc`) instead of Resend's shared test address:
   **Domains** → **Add Domain** → enter your domain → add the DNS
   records it shows you at your registrar (same idea as pointing your
   domain at Vercel, just different records — a few `TXT`/`MX`/`CNAME`
   entries). Takes a few minutes to verify.
4. Until you verify a domain, Resend only lets you send to **your own
   account email** — fine for testing the reviewer notification, but
   customer emails won't arrive until a domain is verified.
5. Set `EMAIL_FROM` to something like `Second Opinion
   <notifications@2opinion.cc>` (must match your verified domain).

## 5. Environment variables

Copy `.env.local.example` to `.env.local` and fill in the values from
steps 2–4. Set `ADMIN_EMAILS` to your own email (comma-separate for
more than one reviewer) — that's what gates access to `/admin` and
who gets new-request notifications.

## 6. Run it

```bash
npm run dev
```

## 7. Deploy

Push this to a GitHub repo and import it into Vercel (free tier is
enough to start). Add the same environment variables there, and update
`NEXT_PUBLIC_SITE_URL` to your real domain once you have one — Stripe's
redirect URLs depend on it.

## Notes on the parts that matter for real money and real accounts

- Row Level Security is on for the `orders` table — a user can only ever
  see their own orders, enforced by the database itself, not just the UI.
- The Stripe webhook verifies Stripe's signature before trusting anything
  it receives — copy `STRIPE_WEBHOOK_SECRET` exactly from the endpoint
  you create, test and live mode have different ones.
- Never expose `SUPABASE_SERVICE_ROLE_KEY` or `STRIPE_SECRET_KEY` to the
  browser — they're only read in server-side files (`app/api/**`,
  `lib/supabase/admin.ts`), which is intentional. Don't import
  `lib/supabase/admin.ts` from a `"use client"` file.
