import Link from "next/link";
import TopNav from "@/components/TopNav";
import Footer from "@/components/Footer";

const portals = [
  "LinkedIn", "Greenhouse", "Lever", "Workday", "Ashby", "SmartRecruiters",
  "BambooHR", "Indeed", "iCIMS", "Taleo", "Jobvite", "SAP SuccessFactors",
];

const features = [
  {
    title: "One-click autofill",
    body: "Fills text fields, dropdowns, radios, date pickers and file uploads on any career portal.",
    icon: "⚡",
  },
  {
    title: "AI answer engine",
    body: "RAG + semantic matching over your profile, resume and custom answers with confidence scores.",
    icon: "🧠",
  },
  {
    title: "ATS resume optimizer",
    body: "Live ATS score, keyword gap analysis and rewrite suggestions per job description.",
    icon: "📄",
  },
  {
    title: "Cover letter generator",
    body: "Company-specific cover letters in seconds, tuned to the JD and your best achievements.",
    icon: "✉️",
  },
  {
    title: "Job tracker",
    body: "Kanban of Saved → Applied → Interview → Offer with reminders and email parsing.",
    icon: "📌",
  },
  {
    title: "Multiple personas",
    body: "Different profiles, resumes and answers per career track — switch on the fly.",
    icon: "🎭",
  },
  {
    title: "Cross-device sync",
    body: "Your answers, resumes and preferences sync instantly between the extension and web app.",
    icon: "🔄",
  },
  {
    title: "Enterprise security",
    body: "JWT auth, RBAC, rate limiting, encrypted storage, audit logs and SSO-ready.",
    icon: "🔐",
  },
];

const pricing = [
  { name: "Free", price: "$0", tag: "Try it", perks: ["25 autofills / mo", "1 profile", "1 resume", "Job tracker"] },
  { name: "Pro", price: "$14", tag: "Most popular", perks: ["Unlimited autofills", "5 profiles", "AI cover letters", "ATS optimizer", "Priority AI"] },
  { name: "Team", price: "$29", tag: "For power users", perks: ["Everything in Pro", "Recruiter tools", "API keys", "Advanced analytics"] },
];

export default function Home() {
  return (
    <div className="min-h-screen">
      <TopNav />

      {/* Hero */}
      <section className="mx-auto max-w-7xl px-5 pt-16 md:pt-24 pb-16 grid md:grid-cols-2 gap-10 items-center">
        <div className="fade-up">
          <div className="chip mb-5">🚀 Now with Gemini + GPT-4o compatible RAG</div>
          <h1 className="text-4xl md:text-6xl font-black leading-[1.05] tracking-tight">
            Apply to <span className="grad-text">1,000 jobs</span><br />
            in the time it takes to make coffee.
          </h1>
          <p className="mt-5 text-slate-300 text-lg max-w-xl">
            JobTrail AI is a secure browser extension + AI backend that reads any job
            application form and fills it perfectly — from LinkedIn to Workday to
            custom career portals.
          </p>
          <div className="mt-7 flex gap-3">
            <Link href="/register" className="btn-primary">Start free — no card</Link>
            <Link href="/#extension" className="btn-ghost">Install extension</Link>
          </div>
          <div className="mt-8 flex flex-wrap gap-2">
            {portals.map((p) => (
              <span key={p} className="chip">{p}</span>
            ))}
          </div>
        </div>

        {/* Hero glass card mock */}
        <div className="fade-up">
          <div className="glass-strong rounded-3xl p-6 floaty relative overflow-hidden">
            <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-violet-600/40 blur-3xl" />
            <div className="absolute -bottom-20 -left-16 h-56 w-56 rounded-full bg-cyan-500/30 blur-3xl" />
            <div className="relative">
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
                <span className="h-2.5 w-2.5 rounded-full bg-yellow-400" />
                <span className="h-2.5 w-2.5 rounded-full bg-green-400" />
                <span className="ml-3">boards.greenhouse.io/acme/jobs/1234</span>
              </div>
              <div className="mt-4 space-y-3">
                {[
                  { q: "Full name", a: "Alex Morgan", c: 99 },
                  { q: "Are you authorized to work in the US?", a: "Yes", c: 98 },
                  { q: "Do you require sponsorship?", a: "No", c: 96 },
                  { q: "Years of experience with React?", a: "6", c: 92 },
                  { q: "Why do you want to work at Acme?", a: "I've followed Acme's platform work…", c: 88 },
                ].map((row, i) => (
                  <div key={i} className="glass rounded-xl p-3 flex items-center gap-3">
                    <div className="flex-1">
                      <div className="text-xs text-slate-400">{row.q}</div>
                      <div className="text-sm text-white">{row.a}</div>
                    </div>
                    <div className="text-xs px-2 py-1 rounded-md bg-emerald-500/15 border border-emerald-400/30 text-emerald-300">
                      {row.c}%
                    </div>
                  </div>
                ))}
              </div>
              <button className="mt-5 w-full btn-primary">⚡ Autofill all fields</button>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="mx-auto max-w-7xl px-5 py-16">
        <h2 className="text-3xl md:text-4xl font-black text-center">Everything you need to <span className="grad-text">apply smarter</span></h2>
        <p className="text-center text-slate-400 mt-3 max-w-2xl mx-auto">
          A full career OS — resume optimization, AI question answering, cover letters, and an intelligent job tracker.
        </p>
        <div className="mt-10 grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map((f) => (
            <div key={f.title} className="glass card hover:-translate-y-1 transition">
              <div className="text-2xl">{f.icon}</div>
              <div className="mt-3 font-semibold">{f.title}</div>
              <div className="text-sm text-slate-400 mt-1">{f.body}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Extension */}
      <section id="extension" className="mx-auto max-w-7xl px-5 py-16 grid md:grid-cols-2 gap-10 items-center">
        <div className="glass-strong rounded-3xl p-8">
          <div className="text-sm text-slate-400">Browser extension</div>
          <h3 className="text-2xl font-bold mt-1">Manifest V3 • Chrome, Edge, Brave, Opera, Firefox</h3>
          <p className="text-slate-300 mt-3">
            The extension detects application forms across React, Vue and Angular apps, including
            custom UI libraries, multi-step wizards, searchable selects and hidden inputs.
          </p>
          <ul className="mt-4 space-y-2 text-sm text-slate-300">
            <li>✓ Works on LinkedIn, Greenhouse, Lever, Workday, Ashby, iCIMS, Taleo…</li>
            <li>✓ Confidence scoring — asks you only when unsure</li>
            <li>✓ Encrypted sync with your JobTrail account</li>
          </ul>
          <div className="mt-6 flex gap-3">
            <a href="/extension/jobtrail-extension.zip" className="btn-primary">Download .zip</a>
            <a href="/extension/README.md" className="btn-ghost">Install guide</a>
          </div>
        </div>
        <div className="glass rounded-3xl p-6">
          <div className="text-xs text-slate-400 mb-2">jobtrail-extension / popup.html</div>
          <pre className="text-xs text-slate-300 overflow-auto scrollbar-hide leading-relaxed"><code>{`{
  "manifest_version": 3,
  "name": "JobTrail AI",
  "version": "1.0.0",
  "permissions": ["storage","scripting","activeTab","cookies"],
  "host_permissions": ["<all_urls>"],
  "action": { "default_popup": "popup.html" },
  "content_scripts": [{
    "matches": ["<all_urls>"],
    "js": ["content.js"],
    "run_at": "document_idle"
  }],
  "background": { "service_worker": "background.js" }
}`}</code></pre>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="mx-auto max-w-7xl px-5 py-16">
        <h2 className="text-3xl md:text-4xl font-black text-center">Simple, transparent pricing</h2>
        <div className="mt-10 grid md:grid-cols-3 gap-4">
          {pricing.map((p, i) => (
            <div key={p.name} className={`glass card ${i === 1 ? "ring-1 ring-violet-400/60" : ""}`}>
              <div className="flex items-center justify-between">
                <div className="text-lg font-semibold">{p.name}</div>
                <span className="chip">{p.tag}</span>
              </div>
              <div className="mt-3 text-4xl font-black">{p.price}<span className="text-base font-normal text-slate-400">/mo</span></div>
              <ul className="mt-4 space-y-2 text-sm text-slate-300">
                {p.perks.map((x) => <li key={x}>✓ {x}</li>)}
              </ul>
              <Link href="/register" className="mt-6 btn-primary block text-center">Start with {p.name}</Link>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}
