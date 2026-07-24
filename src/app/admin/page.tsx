import { redirect } from "next/navigation";
import { requireUser } from "@/lib/auth";
import { col } from "@/lib/db";
import type { ApplicationDoc, ResumeDoc, UserDoc } from "@/lib/models";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const user = await requireUser();
  if (!user) redirect("/login");
  if (user!.role !== "admin") {
    return (
      <div className="mx-auto max-w-lg px-5 py-24">
        <div className="glass card text-center">
          <div className="text-4xl">🛡️</div>
          <h1 className="text-xl font-bold mt-2">Admin only</h1>
          <p className="text-slate-400 text-sm mt-1">
            Your account isn&apos;t an admin. To promote your user (with MongoDB Atlas):
          </p>
          <pre className="mt-3 text-xs text-slate-300 glass rounded-xl p-2">{`db.users.updateOne({email:"${user!.email}"},{$set:{role:"admin"}})`}</pre>
          <Link href="/dashboard" className="btn-ghost text-sm inline-block mt-4">Back to dashboard</Link>
        </div>
      </div>
    );
  }

  const [userCount, appCount, resumeCount, latest] = await Promise.all([
    col<UserDoc>("users").countDocuments(),
    col<ApplicationDoc>("applications").countDocuments(),
    col<ResumeDoc>("resumes").countDocuments(),
    col<UserDoc>("users").find().sort({ createdAt: -1 }).limit(20).toArray(),
  ]);

  return (
    <div className="mx-auto max-w-7xl px-5 py-8 space-y-6 fade-up">
      <div>
        <h1 className="text-2xl font-bold">Admin Console</h1>
        <p className="text-slate-400 text-sm">System-wide stats and moderation.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {[
          { label: "Users", value: userCount, icon: "👥" },
          { label: "Applications", value: appCount, icon: "📌" },
          { label: "Resumes", value: resumeCount, icon: "📄" },
        ].map((s) => (
          <div key={s.label} className="glass card">
            <div className="text-2xl">{s.icon}</div>
            <div className="text-3xl font-black mt-1">{s.value}</div>
            <div className="text-xs text-slate-400">{s.label}</div>
          </div>
        ))}
      </div>
      <div className="glass card overflow-x-auto">
        <div className="font-semibold mb-3">Recent users</div>
        <table className="w-full text-sm">
          <thead className="text-xs uppercase text-slate-400">
            <tr>
              <th className="text-left py-2 pr-4">Name</th>
              <th className="text-left py-2 pr-4">Email</th>
              <th className="text-left py-2 pr-4">Role</th>
              <th className="text-left py-2 pr-4">Plan</th>
              <th className="text-left py-2 pr-4">Joined</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {latest.map((u) => (
              <tr key={u._id}>
                <td className="py-2 pr-4">{u.fullName}</td>
                <td className="py-2 pr-4 text-slate-300">{u.email}</td>
                <td className="py-2 pr-4"><span className="chip">{u.role}</span></td>
                <td className="py-2 pr-4"><span className="chip">{u.plan}</span></td>
                <td className="py-2 pr-4 text-slate-400">{u.createdAt.slice(0, 10)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
