"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function RegisterPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErr(null);
    const r = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ fullName, email, password }),
    });
    const data = await r.json();
    setLoading(false);
    if (!r.ok) return setErr(data.error || "Signup failed");
    router.push("/dashboard");
    router.refresh();
  }

  return (
    <div className="glass-strong rounded-2xl p-8 fade-up">
      <h1 className="text-2xl font-bold">Create your account</h1>
      <p className="text-slate-400 text-sm mt-1">Free forever. No credit card required.</p>
      <form onSubmit={submit} className="mt-6 space-y-4">
        <div>
          <label className="label">Full name</label>
          <input className="input" required value={fullName} onChange={(e) => setFullName(e.target.value)} />
        </div>
        <div>
          <label className="label">Email</label>
          <input className="input" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div>
          <label className="label">Password (min 8)</label>
          <input className="input" type="password" required minLength={8} value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        {err && <div className="text-sm text-red-400">{err}</div>}
        <button disabled={loading} className="btn-primary w-full">
          {loading ? "Creating account…" : "Create account"}
        </button>
      </form>
      <div className="text-sm text-slate-400 mt-6 text-center">
        Already a user? <Link href="/login" className="text-violet-300">Sign in</Link>
      </div>
    </div>
  );
}
