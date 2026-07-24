"use client";

import { useState } from "react";

type CustomAnswer = { q: string; a: string };

type Initial = {
  fullName: string;
  email: string;
  headline: string;
  phone: string;
  location: string;
  linkedin: string;
  github: string;
  website: string;
  summary: string;
  workAuth: string;
  requiresSponsorship: boolean;
  noticePeriod: string;
  salaryExpectation: string;
  willingToRelocate: boolean;
  securityClearance: string;
  veteranStatus: string;
  disabilityStatus: string;
  gender: string;
  ethnicity: string;
  skills: string[];
  certifications: string[];
  languages: string[];
  customAnswers: CustomAnswer[];
};

export default function ProfileForm({ initial }: { initial: Initial }) {
  const [f, setF] = useState<Initial>(initial);
  const [status, setStatus] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  function set<K extends keyof Initial>(key: K, v: Initial[K]) {
    setF((p) => ({ ...p, [key]: v }));
  }
  function csv(arr: string[]) {
    return arr.join(", ");
  }
  function parseCsv(v: string) {
    return v
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
  }

  async function save() {
    setSaving(true);
    setStatus(null);
    const r = await fetch("/api/profile", {
      method: "PUT",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(f),
    });
    setSaving(false);
    setStatus(r.ok ? "Saved!" : "Save failed");
    setTimeout(() => setStatus(null), 2200);
  }

  function updateAnswer(i: number, patch: Partial<CustomAnswer>) {
    setF((p) => ({
      ...p,
      customAnswers: p.customAnswers.map((a, idx) => (idx === i ? { ...a, ...patch } : a)),
    }));
  }
  function addAnswer() {
    setF((p) => ({ ...p, customAnswers: [...p.customAnswers, { q: "", a: "" }] }));
  }
  function removeAnswer(i: number) {
    setF((p) => ({ ...p, customAnswers: p.customAnswers.filter((_, idx) => idx !== i) }));
  }

  return (
    <div className="space-y-4">
      <div className="glass card">
        <div className="font-semibold mb-3">Basics</div>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="label">Full name</label>
            <input className="input" value={f.fullName} disabled />
          </div>
          <div>
            <label className="label">Email</label>
            <input className="input" value={f.email} disabled />
          </div>
          <div>
            <label className="label">Headline</label>
            <input className="input" value={f.headline} onChange={(e) => set("headline", e.target.value)} placeholder="Senior Full-Stack Engineer" />
          </div>
          <div>
            <label className="label">Phone</label>
            <input className="input" value={f.phone} onChange={(e) => set("phone", e.target.value)} />
          </div>
          <div>
            <label className="label">Location</label>
            <input className="input" value={f.location} onChange={(e) => set("location", e.target.value)} placeholder="San Francisco, CA" />
          </div>
          <div>
            <label className="label">LinkedIn</label>
            <input className="input" value={f.linkedin} onChange={(e) => set("linkedin", e.target.value)} />
          </div>
          <div>
            <label className="label">GitHub</label>
            <input className="input" value={f.github} onChange={(e) => set("github", e.target.value)} />
          </div>
          <div>
            <label className="label">Website</label>
            <input className="input" value={f.website} onChange={(e) => set("website", e.target.value)} />
          </div>
        </div>
        <div className="mt-4">
          <label className="label">Summary</label>
          <textarea rows={4} className="input" value={f.summary} onChange={(e) => set("summary", e.target.value)} />
        </div>
      </div>

      <div className="glass card">
        <div className="font-semibold mb-3">Work eligibility & preferences</div>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="label">Work authorization</label>
            <input className="input" value={f.workAuth} onChange={(e) => set("workAuth", e.target.value)} placeholder="US Citizen / H1B / EU Blue Card" />
          </div>
          <div>
            <label className="label">Notice period</label>
            <input className="input" value={f.noticePeriod} onChange={(e) => set("noticePeriod", e.target.value)} placeholder="2 weeks" />
          </div>
          <div>
            <label className="label">Salary expectation</label>
            <input className="input" value={f.salaryExpectation} onChange={(e) => set("salaryExpectation", e.target.value)} placeholder="$150k" />
          </div>
          <div>
            <label className="label">Security clearance</label>
            <input className="input" value={f.securityClearance} onChange={(e) => set("securityClearance", e.target.value)} />
          </div>
          <div className="flex items-center gap-2">
            <input id="sp" type="checkbox" checked={f.requiresSponsorship} onChange={(e) => set("requiresSponsorship", e.target.checked)} />
            <label htmlFor="sp" className="text-sm">Requires visa sponsorship</label>
          </div>
          <div className="flex items-center gap-2">
            <input id="rl" type="checkbox" checked={f.willingToRelocate} onChange={(e) => set("willingToRelocate", e.target.checked)} />
            <label htmlFor="rl" className="text-sm">Willing to relocate</label>
          </div>
        </div>
      </div>

      <div className="glass card">
        <div className="font-semibold mb-3">Skills, certifications, languages</div>
        <div className="space-y-3">
          <div>
            <label className="label">Skills (comma-separated)</label>
            <input className="input" value={csv(f.skills)} onChange={(e) => set("skills", parseCsv(e.target.value))} placeholder="React, Node.js, PostgreSQL" />
          </div>
          <div>
            <label className="label">Certifications</label>
            <input className="input" value={csv(f.certifications)} onChange={(e) => set("certifications", parseCsv(e.target.value))} placeholder="AWS SAA, PMP" />
          </div>
          <div>
            <label className="label">Languages</label>
            <input className="input" value={csv(f.languages)} onChange={(e) => set("languages", parseCsv(e.target.value))} placeholder="English, Spanish" />
          </div>
        </div>
      </div>

      <div className="glass card">
        <div className="font-semibold mb-3">Diversity (optional, private)</div>
        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <label className="label">Gender</label>
            <input className="input" value={f.gender} onChange={(e) => set("gender", e.target.value)} />
          </div>
          <div>
            <label className="label">Ethnicity</label>
            <input className="input" value={f.ethnicity} onChange={(e) => set("ethnicity", e.target.value)} />
          </div>
          <div>
            <label className="label">Veteran status</label>
            <input className="input" value={f.veteranStatus} onChange={(e) => set("veteranStatus", e.target.value)} />
          </div>
          <div>
            <label className="label">Disability status</label>
            <input className="input" value={f.disabilityStatus} onChange={(e) => set("disabilityStatus", e.target.value)} />
          </div>
        </div>
      </div>

      <div className="glass card">
        <div className="flex items-center justify-between mb-3">
          <div className="font-semibold">Custom answers</div>
          <button onClick={addAnswer} className="btn-ghost text-xs">+ Add answer</button>
        </div>
        <p className="text-xs text-slate-400 mb-3">
          The AI matcher will pick these first when the question is similar.
        </p>
        <div className="space-y-3">
          {f.customAnswers.length === 0 && (
            <div className="text-sm text-slate-500">No custom answers yet.</div>
          )}
          {f.customAnswers.map((a, i) => (
            <div key={i} className="grid md:grid-cols-[1fr_2fr_auto] gap-3 items-start">
              <input className="input" placeholder="Question" value={a.q} onChange={(e) => updateAnswer(i, { q: e.target.value })} />
              <input className="input" placeholder="Answer" value={a.a} onChange={(e) => updateAnswer(i, { a: e.target.value })} />
              <button onClick={() => removeAnswer(i)} className="btn-ghost text-xs">Remove</button>
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button onClick={save} disabled={saving} className="btn-primary">
          {saving ? "Saving…" : "Save profile"}
        </button>
        {status && <div className="text-sm text-emerald-300">{status}</div>}
      </div>
    </div>
  );
}
