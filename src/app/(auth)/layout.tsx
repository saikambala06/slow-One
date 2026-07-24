import type { ReactNode } from "react";
import TopNav from "@/components/TopNav";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen">
      <TopNav />
      <main className="mx-auto max-w-md px-5 py-16">{children}</main>
    </div>
  );
}
