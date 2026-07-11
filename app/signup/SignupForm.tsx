"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function SignupForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
    });

    setLoading(false);
    if (error) {
      setError(error.message);
      return;
    }
    setDone(true);
  }

  return (
    <div className="card bg-white p-9 w-full max-w-[420px]">
      <h1 className="font-serif font-bold text-3xl mb-2">Create an account</h1>
      <p className="text-inksoft text-[15px] mb-8">
        Already have one? <Link href="/login" className="text-accenthover font-semibold underline">Sign in</Link>
      </p>

      {done ? (
        <p className="text-[15px] leading-relaxed">
          Check <b>{email}</b> for a confirmation link, then sign in.
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="label">Email</label>
            <input className="input" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div>
            <label className="label">Password</label>
            <input className="input" type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          {error && <p className="text-[13px] font-medium text-[#B23B3B]">{error}</p>}
          <button className="btn btn-primary w-full py-3" disabled={loading} type="submit">
            {loading ? "Creating account…" : "Create account"}
          </button>
        </form>
      )}
    </div>
  );
}
