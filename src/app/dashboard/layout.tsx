import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { requireUser } from "@/lib/auth";
import DashSidebar from "@/components/DashSidebar";

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const user = await requireUser();
  if (!user) redirect("/login");

  return (
    <div className="mx-auto max-w-7xl px-5 py-6 grid gap-6 md:grid-cols-[240px_1fr]">
      <DashSidebar role={user.role} />
      <main className="min-h-[80vh]">{children}</main>
    </div>
  );
}
