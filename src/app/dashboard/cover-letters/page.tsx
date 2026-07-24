import { requireUser } from "@/lib/auth";
import { col } from "@/lib/db";
import type { CoverLetterDoc } from "@/lib/models";
import CoverLettersClient from "./CoverLettersClient";

export const dynamic = "force-dynamic";

export default async function Page() {
  const user = (await requireUser())!;
  const rows = await col<CoverLetterDoc>("cover_letters")
    .find({ userId: user._id })
    .sort({ createdAt: -1 })
    .toArray();
  return (
    <div className="space-y-4 fade-up">
      <div>
        <h1 className="text-2xl font-bold">Cover letters</h1>
        <p className="text-slate-400 text-sm">AI-generated, company-specific letters — customizable and reusable.</p>
      </div>
      <CoverLettersClient initial={rows.map((r) => ({ id: r._id!, title: r.title, body: r.body }))} />
    </div>
  );
}
