"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

type CL = { id: string; title: string; body: string };

export default function CoverLettersClient({ initial }: { initial: CL[] }) {
  const [items, setItems] = useState<CL[]>(initial);
  const [company, setCompany] = useState("");
  const [position, setPosition] = useState("");
  const [draft, setDraft] = useState("");
  const [busy, setBusy] = useState(false);
  const router = useRouter();

  async function gen(save: boolean) {
    if (!company || !position) return;
    setBusy(true);
    const r = await fetch("/api/ai/cover-letter", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ company, position, save }),
    });
    const d = await r.json();
    setBusy(false);
    if (r.ok) {
      setDraft(d.body);
      if (save) {
        setItems((p) => [{ id: String(Date.now()), title: `${position} @ ${company}`, body: d.body }, ...p]);
        router.refresh();
      }
    }
  }

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <div className="glass card">
        <div className="font-semibold mb-3">Generate</div>
        <label className="label">Company</label>
        <input className="input" value={company} onChange={(e) => setCompany(e.target.value)} placeholder="Stripe" />
        <label className="label mt-3">Position</label>
        <input className="input" value={position} onChange={(e) => setPosition(e.target.value)} placeholder="Senior Software Engineer" />
        <div className="mt-3 flex gap-2">
          <button onClick={() => gen(false)} disabled={busy} className="btn-ghost">Preview</button>
          <button onClick={() => gen(true)} disabled={busy} className="btn-primary">Generate & save</button>
        </div>
        {draft && (
          <pre className="mt-4 glass rounded-xl p-3 text-xs whitespace-pre-wrap leading-relaxed">{draft}</pre>
        )}
      </div>
      <div className="space-y-3">
        {items.length === 0 && <div className="glass card text-sm text-slate-400">No cover letters yet.</div>}
        {items.map((c) => (
          <div key={c.id} className="glass card">
            <div className="font-semibold">{c.title}</div>
            <pre className="mt-2 text-xs whitespace-pre-wrap leading-relaxed text-slate-300">{c.body}</pre>
          </div>
        ))}
      </div>
    </div>
  );
}
