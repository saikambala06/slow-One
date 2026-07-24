import { NextRequest } from "next/server";
import { z } from "zod";
import { col } from "@/lib/db";
import type { UserDoc } from "@/lib/models";
import { setSessionCookie, verifyPassword } from "@/lib/auth";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) return Response.json({ error: "Invalid input" }, { status: 400 });

  const email = parsed.data.email.toLowerCase();
  const u = await col<UserDoc>("users").findOne({ email });
  if (!u) return Response.json({ error: "Invalid credentials" }, { status: 401 });
  const ok = await verifyPassword(parsed.data.password, u.passwordHash);
  if (!ok) return Response.json({ error: "Invalid credentials" }, { status: 401 });

  await setSessionCookie({ uid: u._id!, role: u.role, email: u.email });
  return Response.json({ ok: true });
}
