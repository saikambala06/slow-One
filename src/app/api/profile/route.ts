import { NextRequest } from "next/server";
import { requireUser } from "@/lib/auth";
import { col } from "@/lib/db";
import type { ProfileDoc } from "@/lib/models";

export const dynamic = "force-dynamic";

export async function GET() {
  const user = await requireUser();
  if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });
  const rows = await col<ProfileDoc>("profiles").find({ userId: user._id }).toArray();
  return Response.json({ profiles: rows });
}

export async function PUT(req: NextRequest) {
  const user = await requireUser();
  if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();

  const existing = await col<ProfileDoc>("profiles").findOne({ userId: user._id, isDefault: true });

  const $set: Partial<ProfileDoc> = {
    headline: body.headline ?? null,
    phone: body.phone ?? null,
    location: body.location ?? null,
    linkedin: body.linkedin ?? null,
    github: body.github ?? null,
    website: body.website ?? null,
    summary: body.summary ?? null,
    workAuth: body.workAuth ?? null,
    requiresSponsorship: !!body.requiresSponsorship,
    noticePeriod: body.noticePeriod ?? null,
    salaryExpectation: body.salaryExpectation ?? null,
    willingToRelocate: !!body.willingToRelocate,
    securityClearance: body.securityClearance ?? null,
    veteranStatus: body.veteranStatus ?? null,
    disabilityStatus: body.disabilityStatus ?? null,
    gender: body.gender ?? null,
    ethnicity: body.ethnicity ?? null,
    experience: Array.isArray(body.experience) ? body.experience : [],
    education: Array.isArray(body.education) ? body.education : [],
    skills: Array.isArray(body.skills) ? body.skills : [],
    certifications: Array.isArray(body.certifications) ? body.certifications : [],
    languages: Array.isArray(body.languages) ? body.languages : [],
    customAnswers: Array.isArray(body.customAnswers) ? body.customAnswers : [],
  };

  if (existing) {
    await col<ProfileDoc>("profiles").updateOne({ _id: existing._id }, { $set });
  } else {
    await col<ProfileDoc>("profiles").insertOne({
      userId: user._id!,
      label: "Default",
      isDefault: true,
      createdAt: new Date().toISOString(),
      ...$set,
    } as ProfileDoc);
  }
  return Response.json({ ok: true });
}
