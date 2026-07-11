import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { isAdminEmail } from "@/lib/admin";
import { sendEmail, siteUrl, reviewDeliveredEmailHtml } from "@/lib/email";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!isAdminEmail(user?.email)) {
      return NextResponse.json({ error: "Not authorized." }, { status: 403 });
    }

    const { orderId, reviewText, rating } = await request.json();

    if (!orderId || !reviewText || !rating || rating < 1 || rating > 10) {
      return NextResponse.json({ error: "Missing fields or rating out of 1-10 range." }, { status: 400 });
    }

    const admin = createAdminClient();
    const { data: order, error } = await admin
      .from("orders")
      .update({ review_text: reviewText, rating, status: "delivered" })
      .eq("id", orderId)
      .select()
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    if (order) {
      const { data: customer } = await admin.auth.admin.getUserById(order.user_id);
      if (customer?.user?.email) {
        await sendEmail({
          to: customer.user.email,
          subject: `Your take on "${order.subject}" is ready`,
          html: reviewDeliveredEmailHtml({
            subject: order.subject,
            rating,
            reviewText,
            orderUrl: `${siteUrl()}/order/${order.id}`,
          }),
        });
      }
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("admin deliver error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Something went wrong delivering the review." },
      { status: 500 }
    );
  }
}
