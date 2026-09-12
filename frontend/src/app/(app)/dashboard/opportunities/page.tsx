"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Opportunity } from "@/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";
import { AsyncBoundary } from "@/components/async/async-boundary";
import Link from "next/link";

export default function OpportunitiesPage() {
  const query = useQuery({
    queryKey: ["opportunities"],
    queryFn: () => api.get<Opportunity[]>("/api/v1/opportunities"),
  });

  return (
    <div className="space-y-6 max-w-6xl mx-auto p-4 md:p-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Opportunities</h1>
        <p className="text-muted-foreground mt-2">
          Discover and apply for new programs and events.
        </p>
      </div>

      <AsyncBoundary
        isLoading={query.isLoading}
        error={query.error}
        isEmpty={!query.data || query.data.length === 0}
        emptyMessage="No opportunities available right now."
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {query.data?.map((opp) => (
            <Card key={opp.id} className="flex flex-col">
              <CardHeader>
                <div className="flex justify-between items-start gap-4">
                  <CardTitle className="text-xl">{opp.title}</CardTitle>
                  <Badge variant="secondary" className="uppercase text-xs">
                    {opp.status}
                  </Badge>
                </div>
                {opp.deadline && (
                  <CardDescription>
                    Deadline: {formatDate(opp.deadline)}
                  </CardDescription>
                )}
              </CardHeader>
              <CardContent className="flex-1">
                <p className="text-sm text-muted-foreground line-clamp-3">
                  {opp.description || "No description provided."}
                </p>
              </CardContent>
              <CardFooter>
                <Link href={`/dashboard/opportunities/${opp.id}`} className="w-full">
                  <Button className="w-full">View Details</Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      </AsyncBoundary>
    </div>
  );
}
