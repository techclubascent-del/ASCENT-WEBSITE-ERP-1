// ─────────────────────────────────────────────────────────────────────────────
// Public landing page — ASCENT home
//
// This is a Server Component. No 3D yet (Phase 3 concern).
// Framer Motion animations are lazily added in feature work.
// ─────────────────────────────────────────────────────────────────────────────
import { Button } from "@/components/ui/button";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "ASCENT — Discover Your Next Opportunity",
  description:
    "ASCENT helps you discover opportunities, apply to programs, and track your journey.",
};

export default function LandingPage() {
  return (
    <>
      {/* ── Hero ── */}
      <section className="relative flex flex-col items-center justify-center px-4 py-32 text-center sm:py-48">
        <div className="mx-auto max-w-3xl">
          <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-primary">
            Ascent Tech Club
          </p>
          <h1 className="mb-6 text-4xl font-extrabold tracking-tight text-foreground sm:text-6xl">
            Discover your next{" "}
            <span className="text-primary">opportunity</span>
          </h1>
          <p className="mb-10 text-lg text-muted-foreground sm:text-xl">
            Browse curated programs, apply in minutes, and track every step of
            your journey — all in one place.
          </p>
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Button size="lg" asChild>
              <Link href="/auth/signup">Get started — it&apos;s free</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/opportunities">Browse opportunities</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* ── Feature highlights ── */}
      <section className="border-t bg-muted/40 px-4 py-20">
        <div className="mx-auto grid max-w-5xl gap-8 sm:grid-cols-3">
          {FEATURES.map(({ title, description }) => (
            <div key={title} className="rounded-xl border bg-card p-6 shadow-sm">
              <h2 className="mb-2 text-base font-semibold text-foreground">
                {title}
              </h2>
              <p className="text-sm text-muted-foreground">{description}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}

const FEATURES = [
  {
    title: "Discover opportunities",
    description:
      "Browse a curated feed of programs, competitions, and initiatives tailored for you.",
  },
  {
    title: "Apply with confidence",
    description:
      "Submit applications through a guided flow with clear requirements and deadlines.",
  },
  {
    title: "Track your journey",
    description:
      "Follow your application status in real time, from submission to decision.",
  },
];
