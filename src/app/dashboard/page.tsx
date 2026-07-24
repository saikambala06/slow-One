import Link from "next/link";
import { requireUser } from "@/lib/auth";
import { col } from "@/lib/db";
import type { ApplicationDoc, ResumeDoc, SavedAnswerDoc } from "@/lib/models";

export const dynamic = "force-dynamic";

export default async function DashboardHome() {
  const user = (await requireUser())!;
  const uid = user._id;

  const [appCount, resumeCount, answerCount, interviewCount, recent] = await Promise.all([
    col<ApplicationDoc>("applications").countDocuments({ userId: uid }),
    col<ResumeDoc>("resumes").countDocuments({ userId: uid }),
    col<SavedAnswerDoc>("saved_answers").countDocuments({ userId: uid }),
    col<ApplicationDoc>("applications").countDocuments({ userId: uid, status: "interview" }),
    col<ApplicationDoc>("applications")
      .find({ userId: uid })
      .sort({ createdAt: -1 })
      .limit(6)
      .toArray(),
  ]);

  const stats = [
    { label: "Applications", value: appCount, icon: "📌", href: "/dashboard/tracker" },
    { label: "Interviews", value: interviewCount, icon: "🎯", href: "/dashboard/tracker" },
    { label: "Resumes", value: resumeCount, icon: "📄", href: "/dashboard/resumes" },
    { label: "Saved answers", value: answerCount, icon: "💾", href: "/dashboard/answers" },
  ];

  return (
    <div className="space-y-6 fade-up">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Welcome back, {user.fullName.split(" ")[0]} 👋</h1>
          <p className="text-slate-400 text-sm">Here&apos;s your career command center.</p>
        </div>
        <Link href="/dashboard/tracker" className="btn-primary text-sm">+ New application</Link>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        {stats.map((s) => (
          <Link key={s.label} href={s.href} className="glass card hover:-translate-y-0.5 transition">
            <div className="text-2xl">{s.icon}</div>
            <div className="mt-2 text-3xl font-black">{s.value}</div>
            <div className="text-xs text-slate-400">{s.label}</div>
          </Link>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="glass card md:col-span-2">
          <div className="flex items-center justify-between mb-3">
            <div className="font-semibold">Recent applications</div>
            <Link href="/dashboard/tracker" className="text-xs text-violet-300">View all →</Link>
          </div>
          {recent.length === 0 ? (
            <div className="text-sm text-slate-400 py-8 text-center">
              No applications yet. Head to the tracker to add one, or install the extension to autofill your first job.
            </div>
          ) : (
            <div className="divide-y divide-white/5">
              {recent.map((a) => (
                <div key={a._id} className="flex items-center justify-between py-3">
                  <div>
                    <div className="font-medium">{a.position}</div>
                    <div className="text-xs text-slate-400">{a.company} • {a.location ?? "—"}</div>
                  </div>
                  <span className="chip capitalize">{a.status}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="glass card">
          <div className="font-semibold mb-2">Quick actions</div>
          <div className="space-y-2 text-sm">
            <Link href="/dashboard/profile" className="btn-ghost block text-center">📝 Complete profile</Link>
            <Link href="/dashboard/resumes" className="btn-ghost block text-center">📄 Upload resume</Link>
            <Link href="/dashboard/autofill" className="btn-ghost block text-center">⚡ Try AI autofill</Link>
            <Link href="/#extension" className="btn-primary block text-center">🧩 Install extension</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
