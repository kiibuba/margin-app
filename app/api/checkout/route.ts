import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { stripe, TIER_PRICING } from "@/lib/stripe";
import { sendEmail, adminEmails, siteUrl, newRequestEmailHtml } from "@/lib/email";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Sign in first." }, { status: 401 });
    }

    const body = await request.json();
    const { tier, subject, details, link, attachmentPath, attachmentName } = body as {
      tier: string;
      subject: string;
      details?: string;
      link?: string;
      attachmentPath?: string;
      attachmentName?: string;
    };

    if (!subject || !["quick", "advance", "custom"].includes(tier)) {
      return NextResponse.json({ error: "Missing or invalid fields." }, { status: 400 });
    }

    // Custom tier: just store the request as a quote, no payment yet.
    if (tier === "custom") {
      const { data: customOrder, error } = await supabase
        .from("orders")
        .insert({
          user_id: user.id,
          tier,
          subject,
          details,
          link,
          attachment_path: attachmentPath,
          attachment_name: attachmentName,
          status: "quote_requested",
        })
        .select()
        .single();
      if (error) return NextResponse.json({ error: error.message }, { status: 500 });

      if (customOrder) {
        await sendEmail({
          to: adminEmails(),
          subject: `New custom request: ${subject}`,
          html: newRequestEmailHtml({
            subject,
            tier: "custom",
            details,
            link,
            orderUrl: `${siteUrl()}/admin`,
          }),
        });
      }

      return NextResponse.json({ ok: true });
    }

    // Quick / advance: fixed, server-trusted pricing — never trust an amount from the client.
    const pricing = TIER_PRICING[tier];
    const { data: order, error: insertError } = await supabase
      .from("orders")
      .insert({
        user_id: user.id,
        tier,
        subject,
        details,
        link,
        attachment_path: attachmentPath,
        attachment_name: attachmentName,
        status: "pending_payment",
        amount_cents: pricing.amountCents,
      })
      .select()
      .single();

    if (insertError || !order) {
      return NextResponse.json({ error: insertError?.message || "Could not create order." }, { status: 500 });
    }

    const resolvedSiteUrl = siteUrl();

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "eur",
            unit_amount: pricing.amountCents,
            product_data: { name: `Second Opinion — ${pricing.label}`, description: subject },
          },
          quantity: 1,
        },
      ],
      metadata: { order_id: order.id },
      success_url: `${resolvedSiteUrl}/order/${order.id}?success=true`,
      cancel_url: `${resolvedSiteUrl}/submit?tier=${tier}`,
    });

    await supabase.from("orders").update({ stripe_session_id: session.id }).eq("id", order.id);

    return NextResponse.json({ checkoutUrl: session.url });
  } catch (err) {
    console.error("checkout error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Something went wrong creating checkout." },
      { status: 500 }
    );
  }
}
