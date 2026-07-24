import { NextRequest } from "next/server";
import { z } from "zod";
import { col } from "@/lib/db";
import type { ProfileDoc, UserDoc } from "@/lib/models";
import { hashPassword, setSessionCookie } from "@/lib/auth";
import crypto from "crypto";

const schema = z.object({
  fullName: z.string().min(2).max(200),
  email: z.string().email().max(320),
  password: z.string().min(8).max(200),
});

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) return Response.json({ error: "Invalid input" }, { status: 400 });

  const email = parsed.data.email.toLowerCase();
  const existing = await col<UserDoc>("users").findOne({ email });
  if (existing) return Response.json({ error: "Email already registered" }, { status: 409 });

  const passwordHash = await hashPassword(parsed.data.password);
  const apiKey = "jt_" + crypto.randomBytes(24).toString("hex");
  const now = new Date().toISOString();
  const userDoc: UserDoc = {
    email,
    passwordHash,
    fullName: parsed.data.fullName,
    role: "user",
    plan: "free",
    emailVerified: false,
    mfaEnabled: false,
    apiKey,
    createdAt: now,
  };
  const ins = await col<UserDoc>("users").insertOne(userDoc);

  const profileDoc: ProfileDoc = {
    userId: ins.insertedId,
    label: "Default",
    isDefault: true,
    createdAt: now,
    skills: [],
    experience: [],
    education: [],
    certifications: [],
    languages: [],
    customAnswers: [],
  };
  await col<ProfileDoc>("profiles").insertOne(profileDoc);

  await setSessionCookie({ uid: ins.insertedId, role: "user", email });
  return Response.json({ ok: true, user: { id: ins.insertedId, email, fullName: parsed.data.fullName } });
}
