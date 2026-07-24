import { NextRequest } from "next/server";
import { requireUser } from "@/lib/auth";
import { col } from "@/lib/db";
import type { ApplicationDoc, AppStatus } from "@/lib/models";

export const dynamic = "force-dynamic";

const STATUSES: AppStatus[] = ["saved", "applied", "interview", "assessment", "offer", "rejected"];

export async function GET() {
  const user = await requireUser();
  if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });
  const rows = await col<ApplicationDoc>("applications")
    .find({ userId: user._id })
    .sort({ createdAt: -1 })
    .toArray();
  return Response.json({ applications: rows });
}

export async function POST(req: NextRequest) {
  const user = await requireUser();
  if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });
  const b = await req.json();
  const doc: ApplicationDoc = {
    userId: user._id!,
    company: String(b.company || "").slice(0, 200),
    position: String(b.position || "").slice(0, 200),
    location: b.location ?? null,
    url: b.url ?? null,
    status: STATUSES.includes(b.status) ? b.status : "saved",
    notes: b.notes ?? null,
    salary: b.salary ?? null,
    matchScore: Number(b.matchScore ?? 0),
    createdAt: new Date().toISOString(),
  };
  const r = await col<ApplicationDoc>("applications").insertOne(doc);
  return Response.json({ application: { ...doc, _id: r.insertedId } });
}

export async function PATCH(req: NextRequest) {
  const user = await requireUser();
  if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });
  const { id, status, notes } = await req.json();
  const $set: Partial<ApplicationDoc> = {};
  if (status && STATUSES.includes(status)) $set.status = status;
  if (typeof notes === "string") $set.notes = notes;
  await col<ApplicationDoc>("applications").updateOne({ _id: String(id), userId: user._id }, { $set });
  return Response.json({ ok: true });
}

export async function DELETE(req: NextRequest) {
  const user = await requireUser();
  if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await req.json();
  await col<ApplicationDoc>("applications").deleteOne({ _id: String(id), userId: user._id });
  return Response.json({ ok: true });
}
