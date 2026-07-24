import { requireUser } from "@/lib/auth";
import { col } from "@/lib/db";
import type { ResumeDoc } from "@/lib/models";
import ResumesClient from "./ResumesClient";

export const dynamic = "force-dynamic";

export default async function ResumesPage() {
  const user = (await requireUser())!;
  const rows = await col<ResumeDoc>("resumes")
    .find({ userId: user._id })
    .sort({ createdAt: -1 })
    .toArray();
  return (
    <div className="space-y-6 fade-up">
      <div>
        <h1 className="text-2xl font-bold">Resumes</h1>
        <p className="text-slate-400 text-sm">Upload multiple resumes and JobTrail scores each one against ATS.</p>
      </div>
      <ResumesClient
        initial={rows.map((r) => ({
          id: r._id!,
          name: r.name,
          content: r.content,
          atsScore: r.atsScore ?? 0,
          keywords: r.keywords ?? [],
        }))}
      />
    </div>
  );
}
