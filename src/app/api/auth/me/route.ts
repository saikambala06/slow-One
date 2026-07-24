import { requireUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  const u = await requireUser();
  if (!u) return Response.json({ user: null });
  return Response.json({
    user: {
      id: u._id,
      email: u.email,
      fullName: u.fullName,
      role: u.role,
      plan: u.plan,
      apiKey: u.apiKey,
    },
  });
}
