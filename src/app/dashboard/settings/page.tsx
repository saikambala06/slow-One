import { requireUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const user = (await requireUser())!;
  return (
    <div className="space-y-4 fade-up">
      <h1 className="text-2xl font-bold">Settings</h1>
      <div className="glass card">
        <div className="font-semibold">Account</div>
        <div className="text-sm text-slate-300 mt-2">Signed in as <strong>{user.email}</strong></div>
        <div className="text-sm text-slate-400">Role: <span className="chip">{user.role}</span> • Plan: <span className="chip">{user.plan}</span></div>
      </div>
      <div className="glass card">
        <div className="font-semibold">Security</div>
        <ul className="text-sm text-slate-300 mt-2 space-y-1">
          <li>✓ Password hashed with bcrypt</li>
          <li>✓ Session via HTTP-only signed JWT cookie</li>
          <li>✓ Rate limiting & Helmet in production</li>
          <li>◻︎ MFA (coming soon)</li>
        </ul>
      </div>
      <div className="glass card">
        <div className="font-semibold">Data</div>
        <p className="text-sm text-slate-400 mt-1">Export or delete your data on request via <a href="/contact" className="text-violet-300">support</a>.</p>
      </div>
    </div>
  );
}
