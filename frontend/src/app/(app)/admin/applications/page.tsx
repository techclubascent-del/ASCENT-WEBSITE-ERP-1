"use client";

// ─────────────────────────────────────────────────────────────────────────────
// Admin — All Applications — /admin/applications
// Shows every application across the platform. Admin-only.
// ─────────────────────────────────────────────────────────────────────────────
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Application, ApplicationStatus } from "@/types";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AsyncBoundary } from "@/components/async/async-boundary";
import { formatDate } from "@/lib/utils";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

const STATUS_OPTIONS: { value: ApplicationStatus | "all"; label: string }[] = [
  { value: "all", label: "All" },
  { value: "submitted", label: "Submitted" },
  { value: "under_review", label: "Under Review" },
  { value: "accepted", label: "Accepted" },
  { value: "rejected", label: "Rejected" },
];

const STATUS_COLORS: Record<ApplicationStatus, string> = {
  draft: "bg-gray-500/10 text-gray-700",
  submitted: "bg-blue-500/10 text-blue-700",
  under_review: "bg-yellow-500/10 text-yellow-700",
  accepted: "bg-green-500/10 text-green-700",
  rejected: "bg-red-500/10 text-red-700",
};

export default function AdminApplicationsPage() {
  const [statusFilter, setStatusFilter] = useState<ApplicationStatus | "all">("all");

  const query = useQuery({
    queryKey: ["admin", "applications"],
    queryFn: () => api.get<Application[]>("/api/v1/applications"),
  });

  const filtered =
    statusFilter === "all"
      ? query.data
      : query.data?.filter((a) => a.status === statusFilter);

  return (
    <div className="space-y-6 max-w-5xl mx-auto p-4 md:p-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Applications</h1>
        <p className="text-muted-foreground mt-2">
          Review and manage all member applications.
        </p>
      </div>

      {/* Status filter pills */}
      <div className="flex flex-wrap gap-2">
        {STATUS_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            onClick={() => setStatusFilter(opt.value)}
            className={`rounded-full px-3 py-1 text-xs font-medium border transition-colors ${
              statusFilter === opt.value
                ? "bg-primary text-primary-foreground border-primary"
                : "border-border text-muted-foreground hover:bg-accent"
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      <AsyncBoundary
        isLoading={query.isLoading}
        error={query.error}
        isEmpty={!filtered || filtered.length === 0}
        emptyMessage="No applications match this filter."
      >
        <div className="space-y-3">
          {filtered?.map((app) => (
            <Card key={app.id}>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <CardTitle className="text-sm font-mono truncate">
                      {app.id}
                    </CardTitle>
                    <CardDescription className="mt-1 text-xs">
                      Submitted {app.submitted_at ? formatDate(app.submitted_at) : "—"}
                    </CardDescription>
                  </div>
                  <Badge
                    variant="outline"
                    className={`shrink-0 uppercase text-[10px] font-semibold ${STATUS_COLORS[app.status]}`}
                  >
                    {app.status.replace("_", " ")}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="flex items-center justify-between pt-0">
                <p className="text-xs text-muted-foreground truncate">
                  Opp: {app.opportunity_id}
                </p>
                <Link href={`/admin/applications/${app.id}`}>
                  <Button variant="ghost" size="sm" className="gap-1 shrink-0">
                    Review
                    <ChevronRight className="h-3.5 w-3.5" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </AsyncBoundary>
    </div>
  );
}
