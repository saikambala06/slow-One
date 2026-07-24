"use client";
import { useMemo, useState } from "react";

type Status = "saved" | "applied" | "interview" | "assessment" | "offer" | "rejected";
type App = {
  id: string;
  company: string;
  position: string;
  location: string | null;
  status: Status;
  notes: string | null;
  url: string | null;
};

const COLUMNS: { key: Status; label: string; color: string }[] = [
  { key: "saved", label: "Saved", color: "text-slate-300" },
  { key: "applied", label: "Applied", color: "text-blue-300" },
  { key: "interview", label: "Interview", color: "text-violet-300" },
  { key: "assessment", label: "Assessment", color: "text-amber-300" },
  { key: "offer", label: "Offer", color: "text-emerald-300" },
  { key: "rejected", label: "Rejected", color: "text-rose-300" },
];

export default function TrackerClient({ initial }: { initial: App[] }) {
  const [items, setItems] = useState<App[]>(initial);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ company: "", position: "", location: "", url: "", status: "saved" as Status, notes: "" });

  const grouped = useMemo(() => {
    const g: Record<Status, App[]> = {
      saved: [], applied: [], interview: [], assessment: [], offer: [], rejected: [],
    };
    items.forEach((i) => g[i.status].push(i));
    return g;
  }, [items]);

  async function create() {
    if (!form.company || !form.position) return;
    const r = await fetch("/api/applications", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(form),
    });
    const d = await r.json();
    if (r.ok) {
      setItems((p) => [d.application, ...p]);
      setOpen(false);
      setForm({ company: "", position: "", location: "", url: "", status: "saved", notes: "" });
    }
  }
  async function move(id: string, status: Status) {
    setItems((p) => p.map((a) => (a.id === id ? { ...a, status } : a)));
    await fetch("/api/applications", {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
  }
  async function remove(id: string) {
    if (!confirm("Delete this application?")) return;
    setItems((p) => p.filter((a) => a.id !== id));
    await fetch("/api/applications", {
      method: "DELETE",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ id }),
    });
  }

  return (
    <div>
      <div className="flex justify-end mb-4">
        <button onClick={() => setOpen((v) => !v)} className="btn-primary text-sm">+ Add application</button>
      </div>

      {open && (
        <div className="glass card mb-4 grid md:grid-cols-2 gap-3 fade-up">
          <input className="input" placeholder="Company" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} />
          <input className="input" placeholder="Position" value={form.position} onChange={(e) => setForm({ ...form, position: e.target.value })} />
          <input className="input" placeholder="Location" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
          <input className="input" placeholder="Job URL" value={form.url} onChange={(e) => setForm({ ...form, url: e.target.value })} />
          <select className="input" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as Status })}>
            {COLUMNS.map((c) => <option key={c.key} value={c.key}>{c.label}</option>)}
          </select>
          <input className="input" placeholder="Notes" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
          <div className="md:col-span-2 flex justify-end gap-2">
            <button onClick={() => setOpen(false)} className="btn-ghost text-sm">Cancel</button>
            <button onClick={create} className="btn-primary text-sm">Save</button>
          </div>
        </div>
      )}

      <div className="grid gap-3 md:grid-cols-3 lg:grid-cols-6">
        {COLUMNS.map((col) => (
          <div key={col.key} className="glass rounded-2xl p-3 min-h-[300px]">
            <div className={`text-xs font-semibold uppercase tracking-wider mb-2 ${col.color}`}>
              {col.label} <span className="opacity-60">({grouped[col.key].length})</span>
            </div>
            <div className="space-y-2">
              {grouped[col.key].map((a) => (
                <div key={a.id} className="glass rounded-xl p-2.5">
                  <div className="text-sm font-semibold">{a.position}</div>
                  <div className="text-[11px] text-slate-400">{a.company}{a.location ? ` • ${a.location}` : ""}</div>
                  <select
                    value={a.status}
                    onChange={(e) => move(a.id, e.target.value as Status)}
                    className="mt-2 w-full text-[11px] bg-white/5 border border-white/10 rounded-md px-1.5 py-1"
                  >
                    {COLUMNS.map((c) => <option key={c.key} value={c.key}>{c.label}</option>)}
                  </select>
                  <div className="flex justify-between mt-2">
                    {a.url ? (
                      <a href={a.url} target="_blank" rel="noreferrer" className="text-[11px] text-violet-300">Open ↗</a>
                    ) : <span />}
                    <button onClick={() => remove(a.id)} className="text-[11px] text-rose-300">✕</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
