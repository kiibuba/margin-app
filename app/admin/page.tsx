import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { isAdminEmail } from "@/lib/admin";
import Nav from "@/components/Nav";
import AdminQuoteForm from "@/components/AdminQuoteForm";
import AdminReviewForm from "@/components/AdminReviewForm";

export default async function AdminPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!isAdminEmail(user?.email)) {
    return (
      <main>
        <Nav />
        <div className="max-w-[560px] mx-auto px-6 pt-[calc(73px+5rem)] pb-20 text-center">
          <h1 className="font-serif font-bold text-2xl mb-2">Not authorized</h1>
          <p className="text-inksoft text-[15px]">
            This account isn&rsquo;t in <code>ADMIN_EMAILS</code>. Ask whoever set up the site to add you.
          </p>
        </div>
      </main>
    );
  }

  // Reviewer view needs every order, not just this user's own — service-role
  // client bypasses Row Level Security, which is exactly why the email check
  // above runs first.
  const admin = createAdminClient();
  const { data: orders } = await admin.from("orders").select("*").order("created_at", { ascending: false });

  const needsQuote = orders?.filter((o) => o.status === "quote_requested") || [];
  const needsReview = orders?.filter((o) => o.status === "paid") || [];
  const waiting = orders?.filter((o) => ["pending_payment", "quoted"].includes(o.status)) || [];
  const delivered = orders?.filter((o) => o.status === "delivered") || [];

  async function withAttachmentUrl<T extends { attachment_path: string | null }>(list: T[]) {
    return Promise.all(
      list.map(async (o) => {
        if (!o.attachment_path) return { ...o, attachmentUrl: null as string | null };
        const { data } = await admin.storage.from("attachments").createSignedUrl(o.attachment_path, 3600);
        return { ...o, attachmentUrl: data?.signedUrl ?? null };
      })
    );
  }

  const needsQuoteWithFiles = await withAttachmentUrl(needsQuote);
  const needsReviewWithFiles = await withAttachmentUrl(needsReview);

  return (
    <main>
      <Nav />
      <div className="max-w-[760px] mx-auto px-6 pt-[calc(73px+4rem)] pb-16 space-y-14">
        <div>
          <h1 className="font-serif font-bold text-3xl mb-1">Reviewer dashboard</h1>
          <p className="text-inksoft text-[15px]">Signed in as {user?.email}</p>
        </div>

        <section>
          <h2 className="text-sm uppercase tracking-wide font-bold text-accenthover mb-4">
            Needs a quote ({needsQuote.length})
          </h2>
          {needsQuote.length === 0 ? (
            <p className="text-inksoft text-sm">Nothing waiting.</p>
          ) : (
            <div className="space-y-4">
              {needsQuoteWithFiles.map((o) => (
                <div key={o.id} className="card p-5">
                  <div className="font-medium">{o.subject}</div>
                  {o.details && <p className="text-sm text-inksoft mt-1">{o.details}</p>}
                  {o.link && <a href={o.link} target="_blank" className="text-sm text-accent underline break-all">{o.link}</a>}
                  {o.attachmentUrl && (
                    <a href={o.attachmentUrl} target="_blank" className="block text-sm text-accent underline break-all">
                      📎 {o.attachment_name || "Attached file"}
                    </a>
                  )}
                  <AdminQuoteForm orderId={o.id} />
                </div>
              ))}
            </div>
          )}
        </section>

        <section>
          <h2 className="text-sm uppercase tracking-wide font-bold text-accenthover mb-4">
            Needs a review — paid ({needsReview.length})
          </h2>
          {needsReview.length === 0 ? (
            <p className="text-inksoft text-sm">Nothing waiting.</p>
          ) : (
            <div className="space-y-4">
              {needsReviewWithFiles.map((o) => (
                <div key={o.id} className="card p-5">
                  <div className="flex items-baseline justify-between gap-3 flex-wrap">
                    <div className="font-medium">{o.subject}</div>
                    <span className="text-xs uppercase tracking-wide text-inksoft">{o.tier}</span>
                  </div>
                  {o.details && <p className="text-sm text-inksoft mt-1">{o.details}</p>}
                  {o.link && <a href={o.link} target="_blank" className="text-sm text-accent underline break-all">{o.link}</a>}
                  {o.attachmentUrl && (
                    <a href={o.attachmentUrl} target="_blank" className="block text-sm text-accent underline break-all">
                      📎 {o.attachment_name || "Attached file"}
                    </a>
                  )}
                  <AdminReviewForm orderId={o.id} />
                </div>
              ))}
            </div>
          )}
        </section>

        <section>
          <h2 className="text-sm uppercase tracking-wide font-bold text-muted2 mb-4">
            Awaiting payment ({waiting.length})
          </h2>
          {waiting.length === 0 ? (
            <p className="text-inksoft text-sm">Nothing waiting.</p>
          ) : (
            <div className="space-y-2">
              {waiting.map((o) => (
                <div key={o.id} className="card p-4 flex justify-between text-sm">
                  <span>{o.subject}</span>
                  <span className="text-inksoft capitalize">{o.status.replace("_", " ")}</span>
                </div>
              ))}
            </div>
          )}
        </section>

        <section>
          <h2 className="text-sm uppercase tracking-wide font-bold text-muted2 mb-4">
            Delivered ({delivered.length})
          </h2>
          {delivered.length === 0 ? (
            <p className="text-inksoft text-sm">Nothing yet.</p>
          ) : (
            <div className="space-y-2">
              {delivered.map((o) => (
                <div key={o.id} className="card p-4 text-sm">
                  <div className="flex justify-between">
                    <span className="font-medium">{o.subject}</span>
                    <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-accenttint text-accenttinttext">{o.rating}/10</span>
                  </div>
                  <p className="text-inksoft mt-1">{o.review_text}</p>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
