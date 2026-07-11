import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
});

// Server-trusted pricing. Never trust a price sent from the client.
export const TIER_PRICING: Record<string, { label: string; amountCents: number }> = {
  quick: { label: "Quick take", amountCents: 900 },
  advance: { label: "Full critique", amountCents: 2900 },
};
