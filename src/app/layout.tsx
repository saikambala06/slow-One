import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "JobTrail AI — Autofill Job Applications with AI",
  description:
    "JobTrail AI is a secure browser extension + AI backend that autofills job applications across LinkedIn, Greenhouse, Lever, Workday, Ashby and 100+ portals.",
  keywords: [
    "job autofill",
    "AI job application",
    "resume optimizer",
    "ATS score",
    "cover letter generator",
    "browser extension",
    "career",
  ],
  openGraph: {
    title: "JobTrail AI",
    description:
      "Apply to jobs in one click. AI-powered autofill for every job portal.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen">{children}</body>
    </html>
  );
}
