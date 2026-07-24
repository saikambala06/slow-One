import { NextRequest } from "next/server";
import { atsScore } from "@/lib/ai";

export async function POST(req: NextRequest) {
  const { resume, jd } = await req.json();
  const r = atsScore(String(resume ?? ""), String(jd ?? ""));
  return Response.json(r);
}
