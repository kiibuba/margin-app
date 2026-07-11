"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminQuoteForm({ orderId }: { orderId: string }) {
  const router = useRouter();
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const res = await fetch("/api/admin/quote", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderId, amountEuros: amount }),
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
    <form onSubmit={submit} className="flex gap-2 items-start mt-3">
      <input
        className="input max-w-[140px]"
        type="number"
        min="0.5"
        step="0.5"
        placeholder="€ amount"
        required
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
      <button className="btn btn-primary" disabled={loading} type="submit">
        {loading ? "Sending…" : "Send quote"}
      </button>
      {error && <p className="text-accent text-sm self-center">{error}</p>}
    </form>
  );
}
