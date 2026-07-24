import { NextRequest } from "next/server";
import { getUserByApiKey } from "@/lib/auth";
import { col } from "@/lib/db";
import type { ProfileDoc, SavedAnswerDoc } from "@/lib/models";

/**
 * Sync endpoint used by the browser extension.
 * Authenticates via `x-api-key` header. Returns the user's profile + saved
 * answers so the extension can autofill offline as needed.
 */
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const key = req.headers.get("x-api-key") ?? "";
  const user = await getUserByApiKey(key);
  if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const [profile, answers] = await Promise.all([
    col<ProfileDoc>("profiles").findOne({ userId: user._id, isDefault: true }),
    col<SavedAnswerDoc>("saved_answers")
      .find({ userId: user._id })
      .sort({ createdAt: -1 })
      .limit(500)
      .toArray(),
  ]);

  return Response.json({
    user: {
      id: user._id,
      email: user.email,
      fullName: user.fullName,
      plan: user.plan,
    },
    profile,
    answers,
  });
}
