"use client";

// ─────────────────────────────────────────────────────────────────────────────
// Admin — Events list — /admin/events
// Shows all events with a link to create a new one.
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
import { Button } from "@/components/ui/button";
import { AsyncBoundary } from "@/components/async/async-boundary";
import { formatDate } from "@/lib/utils";
import { Calendar, MapPin, Plus } from "lucide-react";
import Link from "next/link";

export default function AdminEventsPage() {
  const query = useQuery({
    queryKey: ["events"],
    queryFn: () => api.get<Event[]>("/api/v1/events"),
  });

  return (
    <div className="space-y-6 max-w-5xl mx-auto p-4 md:p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Events</h1>
          <p className="text-muted-foreground mt-2">Manage Tech Club sessions.</p>
        </div>
        <Link href="/admin/events/new">
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Create Event
          </Button>
        </Link>
      </div>

      <AsyncBoundary
        isLoading={query.isLoading}
        error={query.error}
        isEmpty={!query.data || query.data.length === 0}
        emptyMessage="No events yet. Create your first one!"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {query.data?.map((event) => (
            <Card key={event.id}>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">{event.title}</CardTitle>
                <CardDescription className="flex flex-col gap-1 mt-1">
                  <span className="flex items-center gap-1.5 text-xs">
                    <Calendar className="h-3 w-3" />
                    {formatDate(event.event_date)}
                  </span>
                  {event.location && (
                    <span className="flex items-center gap-1.5 text-xs">
                      <MapPin className="h-3 w-3" />
                      {event.location}
                    </span>
                  )}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground line-clamp-2">
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
