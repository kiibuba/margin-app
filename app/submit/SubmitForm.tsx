"use client";

import { useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

const TIERS = [
  { id: "quick", label: "Quick", price: "€9 · within 24h", desc: "A few sentences plus a rating." },
  { id: "advance", label: "Advance", price: "€29 · 2–3 days", desc: "One to two paragraphs, a proper reaction." },
  { id: "custom", label: "Custom", price: "on request", desc: "We'll follow up to scope it with you." },
];

const MAX_FILE_BYTES = 15 * 1024 * 1024; // 15MB

export default function SubmitForm() {
  const searchParams = useSearchParams();
  const initialTier = searchParams.get("tier") || "quick";

  const [tier, setTier] = useState(initialTier);
  const [subject, setSubject] = useState("");
  const [details, setDetails] = useState("");
  const [link, setLink] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [quoteSent, setQuoteSent] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = e.target.files?.[0] ?? null;
    if (selected && selected.size > MAX_FILE_BYTES) {
      setError("That file is over 15MB — try a smaller one, or use the link field instead.");
      if (fileInputRef.current) fileInputRef.current.value = "";
      setFile(null);
      return;
    }
    setError(null);
    setFile(selected);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      let attachmentPath: string | undefined;
      let attachmentName: string | undefined;

      if (file) {
        const supabase = createClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          setError("Your session expired — please sign in again.");
          return;
        }

        const safeName = file.name.replace(/[^a-zA-Z0-9.\-_]/g, "_");
        const path = `${user.id}/${Date.now()}-${safeName}`;

        const { data: uploadData, error: uploadError } = await supabase.storage
          .from("attachments")
          .upload(path, file);

        if (uploadError) {
          setError(`Couldn't upload the file: ${uploadError.message}`);
          return;
        }

        attachmentPath = uploadData.path;
        attachmentName = file.name;
      }

      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tier, subject, details, link, attachmentPath, attachmentName }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong.");
        return;
      }

      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      } else {
        // custom tier — no payment yet, just a stored request
        setQuoteSent(true);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-[640px] mx-auto px-6 pt-[calc(73px+4rem)] pb-16">
      <h1 className="font-serif font-bold text-3xl mb-2">Submit your thing</h1>
      <p className="text-inksoft text-[15px] mb-9">Tell us what it is and pick a tier.</p>

      {quoteSent ? (
        <div className="card p-7 bg-accenttint border-none">
          <p className="text-[15px] leading-relaxed text-accenttinttext">
            Got it — that&rsquo;s saved as a custom request. Check your dashboard once we&rsquo;ve
            followed up with a scope and price.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-7">
          <div>
            <label className="label mb-3">Tier</label>
            <div className="grid sm:grid-cols-3 gap-3">
              {TIERS.map((t) => {
                const selected = tier === t.id;
                return (
                  <label
                    key={t.id}
                    className={`card p-4 cursor-pointer transition-all ${selected ? "border-2 border-accent bg-accenttint/40" : "hover:border-ink/30"}`}
                  >
                    <input
                      type="radio"
                      name="tier"
                      value={t.id}
                      checked={selected}
                      onChange={() => setTier(t.id)}
                      className="sr-only"
                    />
                    <span className="block font-serif font-bold text-lg">{t.label}</span>
                    <span className="block text-xs text-inksoft mb-2">{t.price}</span>
                    <span className="block text-[13px] text-inksoft leading-snug">{t.desc}</span>
                  </label>
                );
              })}
            </div>
          </div>

          <div>
            <label className="label">What is it?</label>
            <input className="input" required placeholder="e.g. My new logo" value={subject} onChange={(e) => setSubject(e.target.value)} />
          </div>

          <div>
            <label className="label">Link (optional)</label>
            <input className="input" type="url" placeholder="https://…" value={link} onChange={(e) => setLink(e.target.value)} />
          </div>

          <div>
            <label className="label">Attach a file (optional)</label>
            <input
              ref={fileInputRef}
              type="file"
              onChange={handleFileChange}
              className="block w-full text-sm text-inksoft file:mr-4 file:py-2.5 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-accent file:text-ink hover:file:bg-accenthover file:cursor-pointer cursor-pointer border border-rule rounded-[8px] bg-white"
            />
            {file && (
              <p className="text-xs text-inksoft mt-2">
                {file.name} · {(file.size / 1024 / 1024).toFixed(1)}MB
              </p>
            )}
            <p className="text-xs text-muted2 mt-1.5">Up to 15MB — images, PDFs, docs, whatever&rsquo;s relevant.</p>
          </div>

          <div>
            <label className="label">Anything we should know?</label>
            <textarea className="input" rows={4} value={details} onChange={(e) => setDetails(e.target.value)} />
          </div>

          {error && <p className="text-[13px] font-medium text-[#B23B3B]">{error}</p>}

          <button className="btn btn-primary w-full py-3.5 text-base" disabled={loading} type="submit">
            {loading ? "Redirecting…" : tier === "custom" ? "Send request" : "Continue to payment"}
          </button>
        </form>
      )}
    </div>
  );
}
