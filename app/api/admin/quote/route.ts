import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { isAdminEmail } from "@/lib/admin";
import { stripe } from "@/lib/stripe";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!isAdminEmail(user?.email)) {
      return NextResponse.json({ error: "Not authorized." }, { status: 403 });
    }

    const { orderId, amountEuros } = await request.json();
    const amountCents = Math.round(Number(amountEuros) * 100);

    if (!orderId || !amountCents || amountCents < 50) {
      return NextResponse.json({ error: "Missing or invalid amount." }, { status: 400 });
    }

    const admin = createAdminClient();
    const { data: order } = await admin.from("orders").select("*").eq("id", orderId).single();

    if (!order) return NextResponse.json({ error: "Order not found." }, { status: 404 });

    let siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").trim().replace(/\/+$/, "");
    if (!/^https?:\/\//i.test(siteUrl)) siteUrl = `https://${siteUrl}`;

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "eur",
            unit_amount: amountCents,
            product_data: { name: "Second Opinion — Custom critique", description: order.subject },
          },
          quantity: 1,
        },
      ],
      metadata: { order_id: order.id },
      success_url: `${siteUrl}/order/${order.id}?success=true`,
      cancel_url: `${siteUrl}/order/${order.id}`,
    });

    const { error } = await admin
      .from("orders")
      .update({
        status: "quoted",
        quote_amount_cents: amountCents,
        quote_checkout_url: session.url,
        stripe_session_id: session.id,
      })
      .eq("id", orderId);

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ ok: true, checkoutUrl: session.url });
  } catch (err) {
    console.error("admin quote error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Something went wrong creating the quote." },
      { status: 500 }
    );
  }
}
