"use client";

// ─────────────────────────────────────────────────────────────────────────────
// Apply page — /dashboard/opportunities/[id]/apply
// Lets a member submit an application for the opportunity.
// ─────────────────────────────────────────────────────────────────────────────
import { useParams, useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Application, Opportunity } from "@/types";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { AsyncBoundary } from "@/components/async/async-boundary";
import { ArrowLeft } from "lucide-react";
import { useState } from "react";

export default function ApplyPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Fetch the opportunity so we can show its name
  const oppQuery = useQuery({
    queryKey: ["opportunities", params.id],
    queryFn: () => api.get<Opportunity>(`/api/v1/opportunities/${params.id}`),
    enabled: !!params.id,
  });

  const mutation = useMutation({
    mutationFn: (body: { opportunity_id: string; answers: Record<string, string> }) =>
      api.post<Application>("/api/v1/applications", body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["applications", "me"] });
      router.push("/dashboard/applications");
    },
    onError: (err: Error) => {
      setSubmitError(err.message ?? "Failed to submit application.");
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitError(null);
    const formData = new FormData(e.currentTarget);
    const motivation = (formData.get("motivation") as string).trim();

    mutation.mutate({
      opportunity_id: params.id,
      answers: { motivation },
    });
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto p-4 md:p-8">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => router.back()}
        className="gap-2"
      >
        <ArrowLeft className="h-4 w-4" />
        Back
      </Button>

      <AsyncBoundary
        isLoading={oppQuery.isLoading}
        error={oppQuery.error}
        isEmpty={!oppQuery.data}
        emptyMessage="Opportunity not found."
      >
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Apply</h1>
          <p className="text-muted-foreground">
            You are applying for:{" "}
            <span className="font-medium text-foreground">
              {oppQuery.data?.title}
            </span>
          </p>
        </div>

        <Card>
          <form onSubmit={handleSubmit}>
            <CardHeader>
              <CardTitle>Your Application</CardTitle>
              <CardDescription>
                Tell us why you are a great fit for this opportunity.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {submitError && (
                <div
                  role="alert"
                  className="rounded-md bg-destructive/10 p-3 text-sm text-destructive"
                >
                  {submitError}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="motivation">
                  Why do you want to join this opportunity?
                </Label>
                <Textarea
                  id="motivation"
                  name="motivation"
                  placeholder="Share your motivation, relevant experience, and what you hope to gain..."
                  rows={8}
                  required
                  minLength={20}
                />
                <p className="text-xs text-muted-foreground">Minimum 20 characters.</p>
              </div>

              <div className="flex justify-end gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                  disabled={mutation.isPending}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={mutation.isPending}>
                  {mutation.isPending ? "Submitting..." : "Submit Application"}
                </Button>
              </div>
            </CardContent>
          </form>
        </Card>
      </AsyncBoundary>
    </div>
  );
}
