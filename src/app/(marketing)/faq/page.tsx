const faqs = [
  { q: "How does JobTrail autofill know my answers?", a: "The extension detects fields, sends anonymized questions to our AI backend and matches them against your profile, resumes, and custom answers using semantic similarity + confidence scoring." },
  { q: "Which browsers are supported?", a: "Chrome, Edge, Brave and Opera via the Chromium build. A Firefox build ships alongside using Manifest V3." },
  { q: "Which job portals work?", a: "LinkedIn, Indeed, Greenhouse, Lever, Workday, Ashby, SmartRecruiters, BambooHR, Oracle, SAP SuccessFactors, iCIMS, Taleo, Jobvite and 500+ custom career sites." },
  { q: "Is my data private?", a: "Yes. All data is encrypted at rest, transmitted over TLS, and never shared with third parties. Delete your account at any time." },
  { q: "Do you support recruiters?", a: "Yes — recruiter accounts get candidate-profile management and team seats." },
];

export default function FAQ() {
  return (
    <div className="fade-up">
      <h1 className="text-3xl font-bold">Frequently asked questions</h1>
      <div className="mt-8 space-y-3">
        {faqs.map((f) => (
          <details key={f.q} className="glass card">
            <summary className="font-semibold cursor-pointer">{f.q}</summary>
            <p className="text-slate-300 mt-2 text-sm">{f.a}</p>
          </details>
        ))}
      </div>
    </div>
  );
}
