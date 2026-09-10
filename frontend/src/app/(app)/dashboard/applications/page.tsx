"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Application } from "@/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import { AsyncBoundary } from "@/components/async/async-boundary";

export default function ApplicationsPage() {
  const query = useQuery({
    queryKey: ["applications", "me"],
    queryFn: () => api.get<Application[]>("/api/v1/applications/me"),
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "accepted":
        return "bg-green-500/10 text-green-700 hover:bg-green-500/20";
      case "rejected":
        return "bg-red-500/10 text-red-700 hover:bg-red-500/20";
      case "under_review":
        return "bg-yellow-500/10 text-yellow-700 hover:bg-yellow-500/20";
      case "submitted":
        return "bg-blue-500/10 text-blue-700 hover:bg-blue-500/20";
      default:
        return "bg-gray-500/10 text-gray-700 hover:bg-gray-500/20";
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto p-4 md:p-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">My Applications</h1>
        <p className="text-muted-foreground mt-2">
          Track the status of your opportunity applications.
        </p>
      </div>

      <AsyncBoundary
        query={query}
        loadingMessage="Loading applications..."
        isEmpty={query.data?.length === 0}
        emptyMessage="You haven't submitted any applications yet."
      >
        <div className="space-y-4">
          {query.data?.map((app) => (
            <Card key={app.id}>
              <CardHeader className="pb-3">
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="text-lg">
                      Application ID: {app.id.slice(0, 8)}
                    </CardTitle>
                    <CardDescription className="mt-1">
                      Submitted on: {app.submitted_at ? formatDate(app.submitted_at) : "N/A"}
                    </CardDescription>
                  </div>
                  <Badge
                    variant="outline"
                    className={`uppercase text-xs font-semibold px-2 py-1 ${getStatusColor(
                      app.status,
                    )}`}
                  >
                    {app.status.replace("_", " ")}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Opportunity ID: {app.opportunity_id}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </AsyncBoundary>
    </div>
  );
}
