import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-24 border-t border-white/5">
      <div className="mx-auto max-w-7xl px-5 py-10 grid gap-8 md:grid-cols-4 text-sm text-slate-400">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="h-7 w-7 rounded-md bg-gradient-to-br from-violet-500 to-cyan-400 grid place-items-center text-black font-black">J</div>
            <span className="font-bold text-white">JobTrail<span className="grad-text">AI</span></span>
          </div>
          <p>Autofill job applications with AI across every portal. Land interviews faster.</p>
        </div>
        <div>
          <div className="text-white font-semibold mb-3">Product</div>
          <ul className="space-y-2">
            <li><Link href="/#features">Features</Link></li>
            <li><Link href="/#extension">Browser Extension</Link></li>
            <li><Link href="/#pricing">Pricing</Link></li>
            <li><Link href="/dashboard">Dashboard</Link></li>
          </ul>
        </div>
        <div>
          <div className="text-white font-semibold mb-3">Company</div>
          <ul className="space-y-2">
            <li><Link href="/blog">Blog</Link></li>
            <li><Link href="/contact">Contact</Link></li>
            <li><Link href="/faq">FAQ</Link></li>
          </ul>
        </div>
        <div>
          <div className="text-white font-semibold mb-3">Legal</div>
          <ul className="space-y-2">
            <li><Link href="/privacy">Privacy</Link></li>
            <li><Link href="/terms">Terms</Link></li>
          </ul>
        </div>
      </div>
      <div className="text-center text-xs text-slate-500 pb-8">© {new Date().getFullYear()} JobTrail AI — All rights reserved.</div>
    </footer>
  );
}
