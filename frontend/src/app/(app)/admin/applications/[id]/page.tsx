"use client";

// ─────────────────────────────────────────────────────────────────────────────
// Admin — Application Detail — /admin/applications/[id]
// Full view of one application with status update actions.
// ─────────────────────────────────────────────────────────────────────────────
import { useParams, useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Application, ApplicationStatus } from "@/types";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AsyncBoundary } from "@/components/async/async-boundary";
import { formatDate } from "@/lib/utils";
import { ArrowLeft, CheckCircle, Clock, XCircle } from "lucide-react";

const STATUS_COLORS: Record<ApplicationStatus, string> = {
  draft: "bg-gray-500/10 text-gray-700",
  submitted: "bg-blue-500/10 text-blue-700",
  under_review: "bg-yellow-500/10 text-yellow-700",
  accepted: "bg-green-500/10 text-green-700",
  rejected: "bg-red-500/10 text-red-700",
};

export default function AdminApplicationDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["admin", "applications", params.id],
    queryFn: () => api.get<Application>(`/api/v1/applications/${params.id}`),
    enabled: !!params.id,
  });

  const mutation = useMutation({
    mutationFn: (status: ApplicationStatus) =>
      api.patch<Application>(`/api/v1/applications/${params.id}`, { status }),
    onSuccess: (updated) => {
      queryClient.setQueryData(["admin", "applications", params.id], updated);
      queryClient.invalidateQueries({ queryKey: ["admin", "applications"] });
    },
  });

  const app = query.data;

  return (
    <div className="space-y-6 max-w-3xl mx-auto p-4 md:p-8">
      <Button variant="ghost" size="sm" onClick={() => router.back()} className="gap-2">
        <ArrowLeft className="h-4 w-4" />
        Back to Applications
      </Button>

      <AsyncBoundary
        isLoading={query.isLoading}
        error={query.error}
        isEmpty={!app}
        emptyMessage="Application not found."
      >
        {app && (
          <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-2xl font-bold tracking-tight font-mono">
                  {app.id}
                </h1>
                <p className="text-sm text-muted-foreground mt-1">
                  Submitted {app.submitted_at ? formatDate(app.submitted_at) : "—"}
                </p>
              </div>
              <Badge
                variant="outline"
                className={`uppercase text-xs font-semibold self-start px-3 py-1 ${STATUS_COLORS[app.status]}`}
              >
                {app.status.replace("_", " ")}
              </Badge>
            </div>

            {/* Metadata */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm text-muted-foreground uppercase tracking-wide">
                  Application Info
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="font-medium">Applicant ID</p>
                  <p className="text-muted-foreground font-mono mt-0.5">{app.user_id}</p>
                </div>
                <div>
                  <p className="font-medium">Opportunity ID</p>
                  <p className="text-muted-foreground font-mono mt-0.5">{app.opportunity_id}</p>
                </div>
              </CardContent>
            </Card>

            {/* Answers */}
            {Object.keys(app.answers).length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm text-muted-foreground uppercase tracking-wide">
                    Applicant&apos;s Answers
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {Object.entries(app.answers).map(([question, answer]) => (
                    <div key={question}>
                      <p className="text-sm font-medium capitalize">
                        {question.replace(/_/g, " ")}
                      </p>
                      <p className="mt-1 text-sm text-muted-foreground whitespace-pre-line">
                        {answer}
                      </p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Action buttons */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm text-muted-foreground uppercase tracking-wide">
                  Update Status
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-3">
                <Button
                  variant="outline"
                  className="gap-2 border-yellow-500/50 text-yellow-700 hover:bg-yellow-50"
                  disabled={mutation.isPending || app.status === "under_review"}
                  onClick={() => mutation.mutate("under_review")}
                >
                  <Clock className="h-4 w-4" />
                  Move to Review
                </Button>
                <Button
                  variant="outline"
                  className="gap-2 border-green-500/50 text-green-700 hover:bg-green-50"
                  disabled={mutation.isPending || app.status === "accepted"}
                  onClick={() => mutation.mutate("accepted")}
                >
                  <CheckCircle className="h-4 w-4" />
                  Accept
                </Button>
                <Button
                  variant="outline"
                  className="gap-2 border-red-500/50 text-red-700 hover:bg-red-50"
                  disabled={mutation.isPending || app.status === "rejected"}
                  onClick={() => mutation.mutate("rejected")}
                >
                  <XCircle className="h-4 w-4" />
                  Reject
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </AsyncBoundary>
    </div>
  );
}
