// Sends email via Resend's REST API directly — no extra npm package needed.
// Never throws: a failed email should never break checkout or delivery.
export async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string | string[];
  subject: string;
  html: string;
}) {
  if (!process.env.RESEND_API_KEY) {
    console.error("RESEND_API_KEY not set — skipping email:", subject);
    return;
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: process.env.EMAIL_FROM || "Second Opinion <onboarding@resend.dev>",
        to: Array.isArray(to) ? to : [to],
        subject,
        html,
      }),
    });

    if (!res.ok) {
      console.error("Resend error:", res.status, await res.text());
    }
  } catch (err) {
    console.error("Email send failed:", err);
  }
}

export function adminEmails(): string[] {
  return (process.env.ADMIN_EMAILS || "")
    .split(",")
    .map((e) => e.trim())
    .filter(Boolean);
}

export function siteUrl(): string {
  let url = (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").trim().replace(/\/+$/, "");
  if (!/^https?:\/\//i.test(url)) url = `https://${url}`;
  return url;
}

const wrapper = (body: string) => `
  <div style="font-family: -apple-system, Helvetica, Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px 24px; color: #14140F;">
    <div style="font-weight: 700; font-size: 18px; margin-bottom: 24px;">
      <span style="background: #D4FF3F; padding: 2px 8px; border-radius: 6px; margin-right: 6px;">2</span>
      Second Opinion
    </div>
    ${body}
  </div>
`;

export function newRequestEmailHtml(opts: { subject: string; tier: string; details?: string | null; link?: string | null; orderUrl: string }) {
  return wrapper(`
    <h2 style="margin: 0 0 8px;">New ${opts.tier} request</h2>
    <p style="margin: 0 0 16px; color: #6B655C;"><strong>${opts.subject}</strong></p>
    ${opts.details ? `<p style="margin: 0 0 16px; line-height: 1.6;">${opts.details}</p>` : ""}
    ${opts.link ? `<p style="margin: 0 0 16px;"><a href="${opts.link}">${opts.link}</a></p>` : ""}
    <a href="${opts.orderUrl}" style="display: inline-block; background: #14140F; color: #D4FF3F; padding: 12px 24px; border-radius: 999px; text-decoration: none; font-weight: 600;">Open reviewer dashboard</a>
  `);
}

export function reviewDeliveredEmailHtml(opts: { subject: string; rating: number; reviewText: string; orderUrl: string }) {
  return wrapper(`
    <h2 style="margin: 0 0 8px;">Your take on &ldquo;${opts.subject}&rdquo; is ready</h2>
    <div style="display: inline-block; background: #EAFAC0; color: #3C4A17; font-weight: 700; padding: 4px 12px; border-radius: 999px; margin: 8px 0 16px; font-size: 14px;">
      ${opts.rating}/10
    </div>
    <p style="margin: 0 0 20px; line-height: 1.6; font-style: italic;">&ldquo;${opts.reviewText}&rdquo;</p>
    <a href="${opts.orderUrl}" style="display: inline-block; background: #14140F; color: #D4FF3F; padding: 12px 24px; border-radius: 999px; text-decoration: none; font-weight: 600;">View on Second Opinion</a>
  `);
}
