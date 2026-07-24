"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErr(null);
    const r = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await r.json();
    setLoading(false);
    if (!r.ok) return setErr(data.error || "Login failed");
    router.push("/dashboard");
    router.refresh();
  }

  return (
    <div className="glass-strong rounded-2xl p-8 fade-up">
      <h1 className="text-2xl font-bold">Welcome back</h1>
      <p className="text-slate-400 text-sm mt-1">Sign in to continue autofilling jobs.</p>
      <form onSubmit={submit} className="mt-6 space-y-4">
        <div>
          <label className="label">Email</label>
          <input className="input" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div>
          <label className="label">Password</label>
          <input className="input" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        {err && <div className="text-sm text-red-400">{err}</div>}
        <button disabled={loading} className="btn-primary w-full">
          {loading ? "Signing in…" : "Sign in"}
        </button>
      </form>
      <div className="text-sm text-slate-400 mt-6 text-center">
        No account? <Link href="/register" className="text-violet-300">Create one</Link>
      </div>
    </div>
  );
}
