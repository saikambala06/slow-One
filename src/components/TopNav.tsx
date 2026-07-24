import Link from "next/link";
import { getSession } from "@/lib/auth";

export default async function TopNav() {
  const session = await getSession();
  return (
    <header className="sticky top-0 z-40">
      <div className="mx-auto max-w-7xl px-5 py-4">
        <nav className="glass rounded-2xl px-4 py-2.5 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-violet-500 to-cyan-400 grid place-items-center text-black font-black">
              J
            </div>
            <span className="font-bold tracking-tight text-lg">JobTrail<span className="grad-text">AI</span></span>
          </Link>
          <div className="hidden md:flex items-center gap-6 text-sm text-slate-300">
            <Link href="/#features" className="hover:text-white">Features</Link>
            <Link href="/#extension" className="hover:text-white">Extension</Link>
            <Link href="/#pricing" className="hover:text-white">Pricing</Link>
            <Link href="/blog" className="hover:text-white">Blog</Link>
            <Link href="/faq" className="hover:text-white">FAQ</Link>
          </div>
          <div className="flex items-center gap-2">
            {session ? (
              <Link href="/dashboard" className="btn-primary text-sm">Dashboard</Link>
            ) : (
              <>
                <Link href="/login" className="btn-ghost text-sm">Sign in</Link>
                <Link href="/register" className="btn-primary text-sm">Get started</Link>
              </>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}
