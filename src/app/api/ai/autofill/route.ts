import { NextRequest } from "next/server";
import { requireUser, getUserByApiKey } from "@/lib/auth";
import { col } from "@/lib/db";
import type { ProfileDoc, SavedAnswerDoc } from "@/lib/models";
import { suggestAnswer } from "@/lib/ai";

export const dynamic = "force-dynamic";

async function resolveUser(req: NextRequest) {
  const key = req.headers.get("x-api-key");
  if (key) {
    const u = await getUserByApiKey(key);
    if (u) return u;
  }
  return requireUser();
}

export async function POST(req: NextRequest) {
  const user = await resolveUser(req);
  if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const questions: string[] = Array.isArray(body.questions) ? body.questions : [];
  if (!questions.length) return Response.json({ error: "questions required" }, { status: 400 });

  const profile = await col<ProfileDoc>("profiles").findOne({ userId: user._id, isDefault: true });

  const p = {
    fullName: user.fullName,
    email: user.email,
    phone: profile?.phone,
    location: profile?.location,
    linkedin: profile?.linkedin,
    github: profile?.github,
    website: profile?.website,
    summary: profile?.summary,
    workAuth: profile?.workAuth,
    requiresSponsorship: profile?.requiresSponsorship,
    noticePeriod: profile?.noticePeriod,
    salaryExpectation: profile?.salaryExpectation,
    willingToRelocate: profile?.willingToRelocate,
    skills: profile?.skills ?? [],
    experience: profile?.experience ?? [],
    education: profile?.education ?? [],
    customAnswers: profile?.customAnswers ?? [],
  };

  const suggestions = questions.map((q) => ({ question: q, ...suggestAnswer(q, p) }));

  const now = new Date().toISOString();
  const rowsToSave: SavedAnswerDoc[] = suggestions
    .filter((s) => s.answer && s.confidence >= 80)
    .map((s) => ({
      userId: user._id!,
      question: s.question,
      answer: s.answer,
      confidence: s.confidence,
      domain: body.domain ?? null,
      createdAt: now,
    }));
  if (rowsToSave.length) {
    await col<SavedAnswerDoc>("saved_answers").insertMany(rowsToSave);
  }

  return Response.json({ suggestions });
}
