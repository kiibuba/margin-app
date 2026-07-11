import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Nav from "@/components/Nav";
import StatusPill from "@/components/StatusPill";

export default async function OrderPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: order } = await supabase.from("orders").select("*").eq("id", id).single();

  if (!order) notFound();

  let attachmentUrl: string | null = null;
  if (order.attachment_path) {
    const { data: signed } = await supabase.storage
      .from("attachments")
      .createSignedUrl(order.attachment_path, 3600);
    attachmentUrl = signed?.signedUrl ?? null;
  }

  return (
    <main>
      <Nav />
      <div className="max-w-[600px] mx-auto px-6 pt-[calc(73px+4rem)] pb-16">
        <h1 className="font-serif font-bold text-3xl mb-1">{order.subject}</h1>
        <p className="text-inksoft text-[15px] mb-9 capitalize">{order.tier} tier</p>

        <div className="card p-7 mb-6">
          <div className="text-xs uppercase tracking-wide font-bold text-muted2 mb-3">Status</div>
          <StatusPill status={order.status} />
          {order.status === "quoted" && order.quote_checkout_url && (
            <div className="mt-5">
              <a href={order.quote_checkout_url} className="btn btn-primary px-7 py-3 inline-flex">
                Pay €{((order.quote_amount_cents || 0) / 100).toFixed(2)}
              </a>
            </div>
          )}
          {(order.link || attachmentUrl) && (
            <div className="mt-5 pt-5 border-t border-rule flex flex-col gap-2 text-sm">
              {order.link && (
                <a href={order.link} target="_blank" className="text-accenthover font-semibold underline break-all">
                  {order.link}
                </a>
              )}
              {attachmentUrl && (
                <a href={attachmentUrl} target="_blank" className="text-accenthover font-semibold underline">
                  📎 {order.attachment_name || "Attached file"}
                </a>
              )}
            </div>
          )}
        </div>

        {order.status === "delivered" && order.review_text && (
          <div className="card p-7">
            {order.rating && (
              <div className="text-xs font-bold px-2.5 py-1 rounded-full bg-accenttint text-accenttinttext w-fit mb-4">
                {order.rating}/10
              </div>
            )}
            <p className="text-[15px] leading-relaxed">{order.review_text}</p>
          </div>
        )}
      </div>
    </main>
  );
}
