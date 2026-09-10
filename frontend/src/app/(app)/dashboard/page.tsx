// ─────────────────────────────────────────────────────────────────────────────
// Dashboard page — authenticated home
// ─────────────────────────────────────────────────────────────────────────────
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard",
};

export default function DashboardPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Dashboard
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Welcome back. Here&apos;s what&apos;s happening.
        </p>
      </div>

      {/* Phase 1 will populate these sections */}
      <div className="grid gap-4 sm:grid-cols-3">
        <PlaceholderCard
          title="Open Opportunities"
          description="Opportunities available for you to apply."
        />
        <PlaceholderCard
          title="My Applications"
          description="Track the status of your submissions."
        />
        <PlaceholderCard
          title="Upcoming Events"
          description="Events happening soon."
        />
      </div>
    </div>
  );
}

function PlaceholderCard({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-xl border bg-card p-6 shadow-sm">
      <p className="mb-1 text-sm font-semibold text-foreground">{title}</p>
      <p className="text-xs text-muted-foreground">{description}</p>
      <div className="mt-4 h-8 w-16 animate-pulse rounded-md bg-muted" />
    </div>
  );
}
