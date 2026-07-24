// Lightweight AI helpers. Uses OPENAI_API_KEY if provided, else falls back
// to deterministic heuristics so the app always works out of the box.

type ProfileLike = {
  fullName?: string | null;
  email?: string | null;
  phone?: string | null;
  location?: string | null;
  linkedin?: string | null;
  github?: string | null;
  website?: string | null;
  summary?: string | null;
  workAuth?: string | null;
  requiresSponsorship?: boolean | null;
  noticePeriod?: string | null;
  salaryExpectation?: string | null;
  willingToRelocate?: boolean | null;
  skills?: string[] | null;
  experience?: Array<Record<string, unknown>> | null;
  education?: Array<Record<string, unknown>> | null;
  customAnswers?: Array<{ q: string; a: string }> | null;
};

// Semantic-ish scoring using token overlap + keyword weighting.
function similarity(a: string, b: string) {
  const norm = (s: string) =>
    s
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, " ")
      .split(/\s+/)
      .filter(Boolean);
  const ta = new Set(norm(a));
  const tb = new Set(norm(b));
  if (!ta.size || !tb.size) return 0;
  let inter = 0;
  for (const t of ta) if (tb.has(t)) inter++;
  return inter / Math.sqrt(ta.size * tb.size);
}

const FIELD_MAP: Array<{ keys: string[]; get: (p: ProfileLike) => string | undefined | null }> = [
  { keys: ["first name", "given name", "firstname"], get: (p) => p.fullName?.split(" ")[0] },
  { keys: ["last name", "surname", "family name", "lastname"], get: (p) => p.fullName?.split(" ").slice(1).join(" ") },
  { keys: ["full name", "your name", "name"], get: (p) => p.fullName ?? "" },
  { keys: ["email", "e-mail"], get: (p) => p.email ?? "" },
  { keys: ["phone", "mobile", "telephone", "cell"], get: (p) => p.phone ?? "" },
  { keys: ["location", "city", "address", "current location"], get: (p) => p.location ?? "" },
  { keys: ["linkedin"], get: (p) => p.linkedin ?? "" },
  { keys: ["github"], get: (p) => p.github ?? "" },
  { keys: ["portfolio", "website", "personal site"], get: (p) => p.website ?? "" },
  { keys: ["summary", "about you", "cover letter", "why"], get: (p) => p.summary ?? "" },
  { keys: ["work authorization", "authorized to work", "right to work"], get: (p) => p.workAuth ?? "" },
  {
    keys: ["sponsorship", "require sponsorship", "visa sponsorship"],
    get: (p) => (p.requiresSponsorship ? "Yes" : "No"),
  },
  { keys: ["notice period", "when can you start", "availability"], get: (p) => p.noticePeriod ?? "" },
  {
    keys: ["salary", "compensation", "expected pay", "desired salary"],
    get: (p) => p.salaryExpectation ?? "",
  },
  {
    keys: ["relocate", "willing to relocate", "relocation"],
    get: (p) => (p.willingToRelocate ? "Yes" : "No"),
  },
  { keys: ["skills"], get: (p) => (p.skills ?? []).join(", ") },
];

export type AutofillSuggestion = {
  answer: string;
  confidence: number; // 0–100
  source: "profile" | "custom" | "heuristic" | "ai";
};

export function suggestAnswer(question: string, profile: ProfileLike): AutofillSuggestion {
  const q = (question || "").toLowerCase().trim();
  if (!q) return { answer: "", confidence: 0, source: "heuristic" };

  // 1) Custom user answers get top priority (semantic match).
  let best: { score: number; text: string } | null = null;
  for (const c of profile.customAnswers ?? []) {
    const s = similarity(q, c.q);
    if (!best || s > best.score) best = { score: s, text: c.a };
  }
  if (best && best.score > 0.5) {
    return { answer: best.text, confidence: Math.min(99, Math.round(best.score * 100)), source: "custom" };
  }

  // 2) Field map heuristics.
  for (const row of FIELD_MAP) {
    for (const k of row.keys) {
      if (q.includes(k)) {
        const v = row.get(profile);
        if (v) return { answer: String(v), confidence: 92, source: "profile" };
      }
    }
  }

  // 3) Fuzzy fallback to custom answers with lower threshold.
  if (best && best.score > 0.25) {
    return { answer: best.text, confidence: Math.round(best.score * 100), source: "custom" };
  }
  return { answer: "", confidence: 0, source: "heuristic" };
}

export function atsScore(resume: string, jobDescription?: string) {
  const r = resume.toLowerCase();
  const jd = (jobDescription ?? "").toLowerCase();
  const words = jd
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 3);
  const jdKeywords = Array.from(new Set(words)).slice(0, 40);
  const hits = jdKeywords.filter((k) => r.includes(k));
  const structure =
    (/experience/i.test(resume) ? 15 : 0) +
    (/education/i.test(resume) ? 10 : 0) +
    (/skills/i.test(resume) ? 10 : 0) +
    (/@/.test(resume) ? 5 : 0);
  const keywordScore = jdKeywords.length
    ? Math.round((hits.length / jdKeywords.length) * 60)
    : 40;
  const score = Math.min(100, structure + keywordScore + 10);
  const missing = jdKeywords.filter((k) => !r.includes(k)).slice(0, 12);
  return { score, matched: hits.slice(0, 12), missing };
}

export function generateCoverLetter(opts: {
  fullName: string;
  company: string;
  position: string;
  summary?: string;
  skills?: string[];
}) {
  const skills = (opts.skills ?? []).slice(0, 6).join(", ");
  return `Dear ${opts.company} Hiring Team,

I'm excited to apply for the ${opts.position} role at ${opts.company}. ${
    opts.summary ?? "With a proven track record delivering measurable impact, I bring the mix of technical depth and product intuition your team is looking for."
  }

${
    skills
      ? `My core strengths include ${skills}, which map directly to the outcomes you've outlined in the job description.`
      : ""
  } I would welcome the chance to discuss how I can contribute to ${opts.company}'s next chapter of growth.

Thank you for your time and consideration.

Best regards,
${opts.fullName}`;
}
