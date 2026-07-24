import { pingDb, usingMongo } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  const ok = await pingDb();
  return Response.json({ ok, driver: usingMongo ? "mongodb" : "fallback" }, { status: ok ? 200 : 500 });
}
