const CONTENT: Record<string, { title: string; body: string }> = {
  "how-ai-autofill-works": {
    title: "How AI autofill works under the hood",
    body: `JobTrail combines a browser-side field detector with a server-side RAG pipeline.

1) The extension scans the DOM for labels, aria-labels, placeholders, and nearby text nodes.
2) Each detected question is sent to /api/ai/autofill with your session or API key.
3) The backend loads your profile + custom answers, runs semantic matching, and returns an answer with a confidence score.
4) High-confidence answers (85%+) are auto-filled; low-confidence questions prompt for confirmation and are cached for next time.`,
  },
  "ats-tips-2026": {
    title: "10 ATS tips that actually move the needle in 2026",
    body: `Modern ATS parsers still get tripped up on multi-column layouts, embedded icons, and non-standard section names.

Use standard headings (Experience, Education, Skills), keep it single column, avoid text-in-image, and use the exact JD keywords where truthful. Aim for an 80+ ATS score in JobTrail before you apply.`,
  },
  "custom-answers-power-users": {
    title: "Custom answers: the secret weapon of power users",
    body: `Power users build a library of 50+ nuanced answers to the "Why us?" questions asked by top companies. JobTrail semantically matches new questions to your library so you never re-write the same paragraph twice.`,
  },
};

export default async function Post({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = CONTENT[slug];
  if (!post) return <div className="text-slate-400">Post not found.</div>;
  return (
    <article className="fade-up">
      <h1 className="text-3xl font-bold">{post.title}</h1>
      <div className="prose prose-invert mt-6 whitespace-pre-wrap text-slate-300 leading-relaxed">{post.body}</div>
    </article>
  );
}
