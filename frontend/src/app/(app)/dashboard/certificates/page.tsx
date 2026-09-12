"use client";

// ─────────────────────────────────────────────────────────────────────────────
// Certificates page — /dashboard/certificates
// Displays all certificates earned by the logged-in member.
// ─────────────────────────────────────────────────────────────────────────────
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Certificate } from "@/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AsyncBoundary } from "@/components/async/async-boundary";
import { formatDate } from "@/lib/utils";
import { Award, ExternalLink } from "lucide-react";

export default function CertificatesPage() {
  const query = useQuery({
    queryKey: ["certificates", "me"],
    queryFn: () => api.get<Certificate[]>("/api/v1/certificates/me"),
  });

  return (
    <div className="space-y-6 max-w-4xl mx-auto p-4 md:p-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">My Certificates</h1>
        <p className="text-muted-foreground mt-2">
          Certificates and credentials you have earned.
        </p>
      </div>

      <AsyncBoundary
        isLoading={query.isLoading}
        error={query.error}
        isEmpty={!query.data || query.data.length === 0}
        emptyMessage="No certificates yet. Complete a programme to earn one!"
        emptyIcon={<Award className="h-10 w-10 text-muted-foreground/50" />}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {query.data?.map((cert) => (
            <Card key={cert.id}>
              <CardHeader className="pb-2">
                <div className="flex items-start gap-3">
                  <Award className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                  <div>
                    <CardTitle className="text-base">{cert.title}</CardTitle>
                    {cert.issued_by && (
                      <CardDescription className="mt-0.5">
                        Issued by {cert.issued_by}
                      </CardDescription>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">
                  {formatDate(cert.issued_at)}
                </span>
                {cert.url && (
                  <Button asChild variant="outline" size="sm">
                    <a href={cert.url} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-3.5 w-3.5 mr-1.5" />
                      View
                    </a>
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </AsyncBoundary>
    </div>
  );
}
