import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { stripe } from "@/lib/stripe";
import { createAdminClient } from "@/lib/supabase/admin";
import { sendEmail, adminEmails, siteUrl, newRequestEmailHtml } from "@/lib/email";
import type Stripe from "stripe";

// Stripe calls this endpoint directly (not the browser), so it uses the
// service-role Supabase client and verifies the signature instead of relying
// on a logged-in session.
export async function POST(request: Request) {
  const body = await request.text();
  const signature = (await headers()).get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err) {
    return NextResponse.json({ error: `Invalid signature: ${(err as Error).message}` }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const orderId = session.metadata?.order_id;

    if (orderId) {
      const supabase = createAdminClient();
      const { data: order } = await supabase
        .from("orders")
        .update({ status: "paid" })
        .eq("id", orderId)
        .select()
        .single();

      if (order) {
        await sendEmail({
          to: adminEmails(),
          subject: `New paid request: ${order.subject}`,
          html: newRequestEmailHtml({
            subject: order.subject,
            tier: order.tier,
            details: order.details,
            link: order.link,
            orderUrl: `${siteUrl()}/admin`,
          }),
        });
      }
    }
  }

  return NextResponse.json({ received: true });
}
