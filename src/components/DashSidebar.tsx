"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const links = [
  { href: "/dashboard", label: "Overview", icon: "🏠" },
  { href: "/dashboard/profile", label: "Profile", icon: "👤" },
  { href: "/dashboard/resumes", label: "Resumes", icon: "📄" },
  { href: "/dashboard/cover-letters", label: "Cover Letters", icon: "✉️" },
  { href: "/dashboard/tracker", label: "Job Tracker", icon: "📌" },
  { href: "/dashboard/autofill", label: "Autofill Studio", icon: "⚡" },
  { href: "/dashboard/answers", label: "Saved Answers", icon: "💾" },
  { href: "/dashboard/api-keys", label: "API Keys", icon: "🔑" },
  { href: "/dashboard/notifications", label: "Notifications", icon: "🔔" },
  { href: "/dashboard/billing", label: "Billing", icon: "💳" },
  { href: "/dashboard/settings", label: "Settings", icon: "⚙️" },
];

export default function DashSidebar({ role }: { role: "user" | "recruiter" | "admin" }) {
  const path = usePathname();
  const router = useRouter();

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
    router.refresh();
  }

  return (
    <aside className="glass rounded-2xl p-3 sticky top-24 h-[calc(100vh-7rem)] flex flex-col">
      <Link href="/" className="flex items-center gap-2 px-2 py-2">
        <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-violet-500 to-cyan-400 grid place-items-center text-black font-black">J</div>
        <span className="font-bold">JobTrail<span className="grad-text">AI</span></span>
      </Link>
      <nav className="mt-3 flex-1 space-y-1 overflow-y-auto scrollbar-hide">
        {links.map((l) => {
          const active = path === l.href;
          return (
            <Link
              key={l.href}
              href={l.href}
              className={`flex items-center gap-2 rounded-xl px-3 py-2 text-sm ${
                active ? "bg-white/10 text-white" : "text-slate-300 hover:bg-white/5"
              }`}
            >
              <span>{l.icon}</span>
              <span>{l.label}</span>
            </Link>
          );
        })}
        {role === "admin" && (
          <Link
            href="/admin"
            className={`flex items-center gap-2 rounded-xl px-3 py-2 text-sm ${
              path.startsWith("/admin") ? "bg-white/10 text-white" : "text-slate-300 hover:bg-white/5"
            }`}
          >
            <span>🛡️</span>
            <span>Admin</span>
          </Link>
        )}
      </nav>
      <button onClick={logout} className="mt-2 btn-ghost text-sm">Sign out</button>
    </aside>
  );
}
