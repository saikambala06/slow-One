import { requireUser } from "@/lib/auth";
import { col } from "@/lib/db";
import type { SavedAnswerDoc } from "@/lib/models";

export const dynamic = "force-dynamic";

export default async function AnswersPage() {
  const user = (await requireUser())!;
  const rows = await col<SavedAnswerDoc>("saved_answers")
    .find({ userId: user._id })
    .sort({ createdAt: -1 })
    .limit(200)
    .toArray();

  return (
    <div className="space-y-4 fade-up">
      <div>
        <h1 className="text-2xl font-bold">Saved answers</h1>
        <p className="text-slate-400 text-sm">Everything the AI has confidently filled for you — reusable across portals.</p>
      </div>
      {rows.length === 0 ? (
        <div className="glass card text-sm text-slate-400">
          No saved answers yet. Run the autofill studio or use the extension on a real application.
        </div>
      ) : (
        <div className="glass card overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-slate-400 text-xs uppercase">
              <tr>
                <th className="text-left py-2 pr-4">Question</th>
                <th className="text-left py-2 pr-4">Answer</th>
                <th className="text-left py-2 pr-4">Domain</th>
                <th className="text-left py-2 pr-4">Confidence</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {rows.map((r) => (
                <tr key={r._id}>
                  <td className="py-2 pr-4 max-w-xs truncate">{r.question}</td>
                  <td className="py-2 pr-4">{r.answer}</td>
                  <td className="py-2 pr-4 text-slate-400">{r.domain ?? "—"}</td>
                  <td className="py-2 pr-4"><span className="chip">{r.confidence}%</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
