"use client";

// ─────────────────────────────────────────────────────────────────────────────
// Events page — /dashboard/events
// Lists all upcoming events for members.
// ─────────────────────────────────────────────────────────────────────────────
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Event } from "@/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AsyncBoundary } from "@/components/async/async-boundary";
import { formatDate } from "@/lib/utils";
import { Calendar, MapPin } from "lucide-react";

export default function EventsPage() {
  const query = useQuery({
    queryKey: ["events"],
    queryFn: () => api.get<Event[]>("/api/v1/events"),
  });

  return (
    <div className="space-y-6 max-w-4xl mx-auto p-4 md:p-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Events</h1>
        <p className="text-muted-foreground mt-2">
          Upcoming Tech Club sessions and workshops.
        </p>
      </div>

      <AsyncBoundary
        isLoading={query.isLoading}
        error={query.error}
        isEmpty={!query.data || query.data.length === 0}
        emptyMessage="No upcoming events right now. Check back soon!"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {query.data?.map((event) => (
            <Card key={event.id}>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">{event.title}</CardTitle>
                <CardDescription className="flex flex-col gap-1 mt-1">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5 shrink-0" />
                    {formatDate(event.event_date)}
                  </span>
                  {event.location && (
                    <span className="flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5 shrink-0" />
                      {event.location}
                    </span>
                  )}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground line-clamp-3">
                  {event.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </AsyncBoundary>
    </div>
  );
}
