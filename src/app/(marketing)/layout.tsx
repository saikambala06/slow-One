import type { ReactNode } from "react";
import TopNav from "@/components/TopNav";
import Footer from "@/components/Footer";

export default function MarketingLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen">
      <TopNav />
      <main className="mx-auto max-w-4xl px-5 py-12">{children}</main>
      <Footer />
    </div>
  );
}
