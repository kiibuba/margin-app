"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminReviewForm({ orderId }: { orderId: string }) {
  const router = useRouter();
  const [reviewText, setReviewText] = useState("");
  const [rating, setRating] = useState("8");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const res = await fetch("/api/admin/deliver", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderId, reviewText, rating: Number(rating) }),
    });
    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.error || "Something went wrong.");
      return;
    }
    router.refresh();
  }

  return (
    <form onSubmit={submit} className="mt-3 space-y-2.5">
      <textarea
        className="input"
        rows={3}
        placeholder="A few sentences or a couple of paragraphs — no advice, just the take."
        required
        value={reviewText}
        onChange={(e) => setReviewText(e.target.value)}
      />
      <div className="flex gap-2 items-center">
        <select className="input max-w-[110px]" value={rating} onChange={(e) => setRating(e.target.value)}>
          {[10, 9, 8, 7, 6, 5, 4, 3, 2, 1].map((n) => (
            <option key={n} value={n}>{n}/10</option>
          ))}
        </select>
        <button className="btn btn-primary" disabled={loading} type="submit">
          {loading ? "Delivering…" : "Deliver review"}
        </button>
      </div>
      {error && <p className="text-accent text-sm">{error}</p>}
    </form>
  );
}
