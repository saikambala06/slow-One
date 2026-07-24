"use client";
import { useState } from "react";

type S = { question: string; answer: string; confidence: number; source: string };

const SAMPLE = `Full name
Email address
Phone
Current city
LinkedIn profile URL
Are you authorized to work in the country?
Do you require visa sponsorship?
Notice period
Expected salary
Why do you want to join us?`;

export default function AutofillStudio() {
  const [text, setText] = useState(SAMPLE);
  const [rows, setRows] = useState<S[]>([]);
  const [loading, setLoading] = useState(false);

  async function run() {
    setLoading(true);
    const questions = text.split("\n").map((s) => s.trim()).filter(Boolean);
    const r = await fetch("/api/ai/autofill", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ questions }),
    });
    const d = await r.json();
    setRows(d.suggestions || []);
    setLoading(false);
  }

  const avg = rows.length ? Math.round(rows.reduce((a, b) => a + b.confidence, 0) / rows.length) : 0;

  return (
    <div className="space-y-4 fade-up">
      <div>
        <h1 className="text-2xl font-bold">Autofill Studio</h1>
        <p className="text-slate-400 text-sm">Test how JobTrail answers questions from your profile. The same engine powers the browser extension.</p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="glass card">
          <label className="label">Paste form questions (one per line)</label>
          <textarea rows={16} className="input text-sm" value={text} onChange={(e) => setText(e.target.value)} />
          <button onClick={run} disabled={loading} className="btn-primary mt-3">
            {loading ? "Thinking…" : "⚡ Run autofill"}
          </button>
        </div>

        <div className="glass card">
          <div className="flex items-center justify-between mb-3">
            <div className="font-semibold">Suggestions</div>
            {rows.length > 0 && (
              <div className="text-xs text-slate-400">avg confidence <span className="grad-text font-bold">{avg}%</span></div>
            )}
          </div>
          <div className="space-y-2 max-h-[520px] overflow-y-auto">
            {rows.length === 0 && <div className="text-sm text-slate-400">Run autofill to see suggestions.</div>}
            {rows.map((r, i) => {
              const color =
                r.confidence >= 85
                  ? "bg-emerald-500/15 border-emerald-400/30 text-emerald-300"
                  : r.confidence >= 50
                  ? "bg-amber-500/15 border-amber-400/30 text-amber-300"
                  : "bg-rose-500/15 border-rose-400/30 text-rose-300";
              return (
                <div key={i} className="glass rounded-xl p-3">
                  <div className="text-xs text-slate-400">{r.question}</div>
                  <div className="flex items-start justify-between gap-3">
                    <div className="text-sm text-white">
                      {r.answer || <span className="text-slate-500 italic">— (needs confirmation)</span>}
                    </div>
                    <span className={`text-[10px] px-2 py-1 rounded border ${color} whitespace-nowrap`}>
                      {r.confidence}% • {r.source}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
