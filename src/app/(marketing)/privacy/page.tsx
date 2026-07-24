export default function Privacy() {
  return (
    <div className="fade-up prose prose-invert max-w-none">
      <h1 className="text-3xl font-bold">Privacy Policy</h1>
      <p className="text-slate-400">Last updated: 2026</p>

      <h2 className="text-xl font-semibold mt-8">Data we collect</h2>
      <p className="text-slate-300">Account details you provide (name, email), the resumes and profile data you upload, and application activity from the browser extension. We do not sell personal data to third parties.</p>

      <h2 className="text-xl font-semibold mt-6">How we use it</h2>
      <p className="text-slate-300">To power the autofill engine, resume analytics, and job tracker. Aggregated non-personal metrics may inform product improvements.</p>

      <h2 className="text-xl font-semibold mt-6">Storage & security</h2>
      <p className="text-slate-300">All data is encrypted in transit (TLS) and at rest in MongoDB Atlas. Passwords are hashed with bcrypt. JWTs are stored in HTTP-only cookies.</p>

      <h2 className="text-xl font-semibold mt-6">Your rights</h2>
      <p className="text-slate-300">You may request data export or account deletion at any time via <a href="/contact" className="text-violet-300">contact</a>.</p>
    </div>
  );
}
