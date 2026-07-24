import { NextRequest } from "next/server";
import { requireUser } from "@/lib/auth";
import { col } from "@/lib/db";
import type { CoverLetterDoc, ProfileDoc } from "@/lib/models";
import { generateCoverLetter } from "@/lib/ai";

export async function POST(req: NextRequest) {
  const user = await requireUser();
  if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });
  const { company, position, save } = await req.json();
  if (!company || !position) return Response.json({ error: "company and position required" }, { status: 400 });

  const p = await col<ProfileDoc>("profiles").findOne({ userId: user._id, isDefault: true });

  const body = generateCoverLetter({
    fullName: user.fullName,
    company: String(company),
    position: String(position),
    summary: p?.summary ?? undefined,
    skills: p?.skills ?? [],
  });

  if (save) {
    const doc: CoverLetterDoc = {
      userId: user._id!,
      title: `${position} @ ${company}`,
      body,
      createdAt: new Date().toISOString(),
    };
    await col<CoverLetterDoc>("cover_letters").insertOne(doc);
  }
  return Response.json({ body });
}
