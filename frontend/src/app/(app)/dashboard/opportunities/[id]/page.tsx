"use client";

// ─────────────────────────────────────────────────────────────────────────────
// Opportunity detail page — /dashboard/opportunities/[id]
// Shows full details and an "Apply Now" button.
// ─────────────────────────────────────────────────────────────────────────────
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Opportunity } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AsyncBoundary } from "@/components/async/async-boundary";
import { formatDate, isExpired } from "@/lib/utils";
import { ArrowLeft, CalendarClock } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

export default function OpportunityDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();

  const query = useQuery({
    queryKey: ["opportunities", params.id],
    queryFn: () => api.get<Opportunity>(`/api/v1/opportunities/${params.id}`),
    enabled: !!params.id,
  });

  const opp = query.data;
  const expired = opp?.deadline ? isExpired(opp.deadline) : false;

  return (
    <div className="space-y-6 max-w-3xl mx-auto p-4 md:p-8">
      <Button variant="ghost" size="sm" onClick={() => router.back()} className="gap-2">
        <ArrowLeft className="h-4 w-4" />
        Back
      </Button>

      <AsyncBoundary
        isLoading={query.isLoading}
        error={query.error}
        isEmpty={!query.data}
        emptyMessage="Opportunity not found."
      >
        {opp && (
          <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h1 className="text-3xl font-bold tracking-tight">{opp.title}</h1>
                {opp.deadline && (
                  <p className={`mt-2 flex items-center gap-1.5 text-sm ${expired ? "text-destructive" : "text-muted-foreground"}`}>
                    <CalendarClock className="h-4 w-4" />
                    {expired ? "Deadline passed: " : "Deadline: "}
                    {formatDate(opp.deadline)}
                  </p>
                )}
              </div>
              <Badge
                variant={opp.status === "published" ? "default" : "secondary"}
                className="uppercase text-xs self-start shrink-0"
              >
                {opp.status}
              </Badge>
            </div>

            {/* Description */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">About this opportunity</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-relaxed whitespace-pre-line">
                  {opp.description}
                </p>
              </CardContent>
            </Card>

            {/* Apply CTA */}
            <div className="flex gap-3">
              {!expired && opp.status === "published" ? (
                <Link href={`/dashboard/opportunities/${opp.id}/apply`} className="w-full sm:w-auto">
                  <Button size="lg" className="w-full sm:w-auto">
                    Apply Now
                  </Button>
                </Link>
              ) : (
                <Button size="lg" disabled>
                  {expired ? "Deadline Passed" : "Not Open"}
                </Button>
              )}
            </div>
          </div>
        )}
      </AsyncBoundary>
    </div>
  );
}
