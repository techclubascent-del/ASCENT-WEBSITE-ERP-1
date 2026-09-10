"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Profile } from "@/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AsyncBoundary } from "@/components/async/async-boundary";
import { Button } from "@/components/ui/button";

export default function ProfilePage() {
  const query = useQuery({
    queryKey: ["profile", "me"],
    queryFn: () => api.get<Profile>("/api/v1/users/me/profile"),
  });

  return (
    <div className="space-y-6 max-w-3xl mx-auto p-4 md:p-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">My Profile</h1>
        <p className="text-muted-foreground mt-2">
          Manage your personal information and preferences.
        </p>
      </div>

      <AsyncBoundary
        query={query}
        loadingMessage="Loading profile..."
        emptyMessage="Failed to load profile."
      >
        {query.data && (
          <Card>
            <CardHeader className="flex flex-row items-center gap-4">
              <Avatar className="h-20 w-20">
                <AvatarImage src={query.data.avatar_url || ""} />
                <AvatarFallback>
                  {query.data.full_name?.charAt(0) || "U"}
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle>{query.data.full_name || "Anonymous User"}</CardTitle>
                <CardDescription>User ID: {query.data.user_id}</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-medium text-sm text-muted-foreground mb-1">
                  Bio
                </h3>
                <p className="text-sm">
                  {query.data.bio || "No bio provided yet."}
                </p>
              </div>
              <div className="pt-4 flex gap-4">
                <Button variant="outline">Edit Profile</Button>
              </div>
            </CardContent>
          </Card>
        )}
      </AsyncBoundary>
    </div>
  );
}
