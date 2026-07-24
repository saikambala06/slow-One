import { NextRequest } from "next/server";
import { requireUser } from "@/lib/auth";
import { col } from "@/lib/db";
import type { ResumeDoc } from "@/lib/models";
import { atsScore } from "@/lib/ai";

export const dynamic = "force-dynamic";

export async function GET() {
  const user = await requireUser();
  if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });
  const rows = await col<ResumeDoc>("resumes")
    .find({ userId: user._id })
    .sort({ createdAt: -1 })
    .toArray();
  return Response.json({ resumes: rows });
}

export async function POST(req: NextRequest) {
  const user = await requireUser();
  if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  const name = String(body.name || "Untitled resume").slice(0, 200);
  const content = String(body.content || "");
  if (!content.trim()) return Response.json({ error: "Content required" }, { status: 400 });
  const score = atsScore(content);
  const doc: ResumeDoc = {
    userId: user._id!,
    name,
    content,
    atsScore: score.score,
    keywords: score.matched,
    isDefault: false,
    createdAt: new Date().toISOString(),
  };
  const r = await col<ResumeDoc>("resumes").insertOne(doc);
  return Response.json({ resume: { ...doc, _id: r.insertedId } });
}

export async function DELETE(req: NextRequest) {
  const user = await requireUser();
  if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await req.json();
  await col<ResumeDoc>("resumes").deleteOne({ _id: String(id), userId: user._id });
  return Response.json({ ok: true });
}
