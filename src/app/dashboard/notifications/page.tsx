import { requireUser } from "@/lib/auth";
import { col } from "@/lib/db";
import type { NotificationDoc } from "@/lib/models";

export const dynamic = "force-dynamic";

export default async function Page() {
  const user = (await requireUser())!;
  const rows = await col<NotificationDoc>("notifications")
    .find({ userId: user._id })
    .sort({ createdAt: -1 })
    .toArray();

  return (
    <div className="space-y-4 fade-up">
      <h1 className="text-2xl font-bold">Notifications</h1>
      {rows.length === 0 ? (
        <div className="glass card text-sm text-slate-400">You&apos;re all caught up ✨</div>
      ) : (
        <div className="space-y-2">
          {rows.map((n) => (
            <div key={n._id} className="glass card">
              <div className="font-semibold">{n.title}</div>
              <div className="text-sm text-slate-300">{n.body}</div>
              <div className="text-[10px] text-slate-500 mt-1">{n.createdAt}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
