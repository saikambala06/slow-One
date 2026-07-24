import { requireUser } from "@/lib/auth";
import { col } from "@/lib/db";
import type { ApplicationDoc } from "@/lib/models";
import TrackerClient from "./TrackerClient";

export const dynamic = "force-dynamic";

export default async function TrackerPage() {
  const user = (await requireUser())!;
  const rows = await col<ApplicationDoc>("applications")
    .find({ userId: user._id })
    .sort({ createdAt: -1 })
    .toArray();
  return (
    <div className="space-y-6 fade-up">
      <div>
        <h1 className="text-2xl font-bold">Job Tracker</h1>
        <p className="text-slate-400 text-sm">Move applications through your funnel — reflects instantly in analytics.</p>
      </div>
      <TrackerClient
        initial={rows.map((r) => ({
          id: r._id!,
          company: r.company,
          position: r.position,
          location: r.location ?? null,
          status: r.status,
          notes: r.notes ?? null,
          url: r.url ?? null,
        }))}
      />
    </div>
  );
}
