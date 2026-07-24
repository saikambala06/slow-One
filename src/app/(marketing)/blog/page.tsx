const posts = [
  { slug: "how-ai-autofill-works", title: "How AI autofill works under the hood", excerpt: "A tour of RAG, embeddings and confidence scoring for job forms." },
  { slug: "ats-tips-2026", title: "10 ATS tips that actually move the needle in 2026", excerpt: "Modern ATS parsers still choke on fancy templates. Here's what actually works." },
  { slug: "custom-answers-power-users", title: "Custom answers: the secret weapon of power users", excerpt: "Why the most senior candidates always keep a personal answer library." },
];

export default function BlogIndex() {
  return (
    <div className="fade-up">
      <h1 className="text-3xl font-bold">The JobTrail blog</h1>
      <p className="text-slate-400 mt-1">Career tactics, product deep-dives and remote-work philosophy.</p>
      <div className="mt-8 grid md:grid-cols-2 gap-4">
        {posts.map((p) => (
          <a key={p.slug} href={`/blog/${p.slug}`} className="glass card block hover:-translate-y-0.5 transition">
            <div className="text-xs text-slate-400 uppercase tracking-widest">Article</div>
            <div className="mt-1 font-semibold text-lg">{p.title}</div>
            <div className="text-sm text-slate-300 mt-1">{p.excerpt}</div>
            <div className="mt-3 text-violet-300 text-sm">Read →</div>
          </a>
        ))}
      </div>
    </div>
  );
}
