"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

type Resume = { id: string; name: string; content: string; atsScore: number; keywords: string[] };

export default function ResumesClient({ initial }: { initial: Resume[] }) {
  const [items, setItems] = useState<Resume[]>(initial);
  const [name, setName] = useState("");
  const [content, setContent] = useState("");
  const [jd, setJd] = useState("");
  const [analysis, setAnalysis] = useState<{ score: number; matched: string[]; missing: string[] } | null>(null);
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  async function upload() {
    if (!content.trim()) return;
    setSaving(true);
    const r = await fetch("/api/resumes", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ name: name || "My Resume", content }),
    });
    const d = await r.json();
    setSaving(false);
    if (r.ok) {
      setItems((p) => [d.resume, ...p]);
      setName("");
      setContent("");
      router.refresh();
    }
  }
  async function remove(id: string) {
    if (!confirm("Delete this resume?")) return;
    await fetch("/api/resumes", { method: "DELETE", headers: { "content-type": "application/json" }, body: JSON.stringify({ id }) });
    setItems((p) => p.filter((r) => r.id !== id));
  }
  async function analyze() {
    if (!content.trim()) return;
    const r = await fetch("/api/ai/ats", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ resume: content, jd }),
    });
    const d = await r.json();
    setAnalysis(d);
  }

  async function readFile(f: File) {
    const text = await f.text();
    setContent(text);
    if (!name) setName(f.name.replace(/\.[^.]+$/, ""));
  }

  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_1fr]">
      <div className="glass card">
        <div className="font-semibold mb-3">Upload / paste resume</div>
        <label className="label">Name</label>
        <input className="input" value={name} onChange={(e) => setName(e.target.value)} placeholder="Frontend Resume v3" />
        <label className="label mt-3">Paste text or drop a .txt / .md file</label>
        <input
          type="file"
          accept=".txt,.md,.pdf"
          className="text-sm text-slate-400 mb-2"
          onChange={(e) => e.target.files?.[0] && readFile(e.target.files[0])}
        />
        <textarea rows={12} className="input font-mono text-xs" value={content} onChange={(e) => setContent(e.target.value)} placeholder="Paste your resume text here…" />
        <label className="label mt-3">Optional: paste a job description to analyze against</label>
        <textarea rows={4} className="input text-xs" value={jd} onChange={(e) => setJd(e.target.value)} placeholder="Paste JD to get keyword gap…" />
        <div className="flex gap-2 mt-3">
          <button onClick={upload} disabled={saving} className="btn-primary">
            {saving ? "Saving…" : "Save resume"}
          </button>
          <button onClick={analyze} className="btn-ghost">Analyze ATS</button>
        </div>
        {analysis && (
          <div className="mt-4 glass rounded-xl p-3">
            <div className="flex items-center justify-between">
              <div className="text-sm text-slate-400">ATS score</div>
              <div className="text-3xl font-black grad-text">{analysis.score}</div>
            </div>
            <div className="mt-2">
              <div className="text-xs text-slate-400">Matched keywords</div>
              <div className="mt-1 flex flex-wrap gap-1">
                {analysis.matched.map((k) => (
                  <span key={k} className="text-xs px-2 py-1 rounded bg-emerald-500/15 border border-emerald-400/30 text-emerald-300">{k}</span>
                ))}
              </div>
            </div>
            <div className="mt-2">
              <div className="text-xs text-slate-400">Missing keywords</div>
              <div className="mt-1 flex flex-wrap gap-1">
                {analysis.missing.map((k) => (
                  <span key={k} className="text-xs px-2 py-1 rounded bg-rose-500/15 border border-rose-400/30 text-rose-300">{k}</span>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="space-y-3">
        {items.length === 0 && <div className="glass card text-sm text-slate-400">No resumes yet.</div>}
        {items.map((r) => (
          <div key={r.id} className="glass card">
            <div className="flex items-start justify-between">
              <div>
                <div className="font-semibold">{r.name}</div>
                <div className="text-xs text-slate-400">{r.content.length} chars</div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-black grad-text">{r.atsScore}</div>
                <div className="text-[10px] text-slate-400 uppercase">ATS</div>
              </div>
            </div>
            <div className="mt-2 flex flex-wrap gap-1">
              {(r.keywords ?? []).slice(0, 8).map((k) => (
                <span key={k} className="chip">{k}</span>
              ))}
            </div>
            <div className="mt-3 flex justify-end">
              <button onClick={() => remove(r.id)} className="btn-ghost text-xs">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
