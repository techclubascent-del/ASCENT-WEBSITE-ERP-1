"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export default function ProfilePage() {
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  
  const query = useQuery({
    queryKey: ["profile", "me"],
    queryFn: () => api.get<Profile>("/api/v1/users/me/profile"),
  });

  const mutation = useMutation({
    mutationFn: (data: Partial<Profile>) => api.patch<Profile>("/api/v1/users/me/profile", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile", "me"] });
      setIsEditing(false);
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    mutation.mutate({
      full_name: fd.get("full_name") as string,
      bio: fd.get("bio") as string,
      avatar_url: fd.get("avatar_url") as string,
    });
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto p-4 md:p-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">My Profile</h1>
        <p className="text-muted-foreground mt-2">
          Manage your personal information and preferences.
        </p>
      </div>

      <AsyncBoundary
        isLoading={query.isLoading}
        error={query.error}
        isEmpty={!query.data}
        emptyMessage="Failed to load profile."
      >
        {query.data && (
          <Card>
            {isEditing ? (
              <form onSubmit={handleSubmit}>
                <CardHeader>
                  <CardTitle>Edit Profile</CardTitle>
                  <CardDescription>Update your personal information below.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="full_name">Full Name</Label>
                    <Input id="full_name" name="full_name" defaultValue={query.data.full_name || ""} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="avatar_url">Avatar URL</Label>
                    <Input id="avatar_url" name="avatar_url" defaultValue={query.data.avatar_url || ""} placeholder="https://example.com/avatar.png" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea id="bio" name="bio" defaultValue={query.data.bio || ""} rows={4} />
                  </div>
                  <div className="pt-4 flex gap-3">
                    <Button type="button" variant="outline" onClick={() => setIsEditing(false)} disabled={mutation.isPending}>
                      Cancel
                    </Button>
                    <Button type="submit" disabled={mutation.isPending}>
                      {mutation.isPending ? "Saving..." : "Save Changes"}
                    </Button>
                  </div>
                </CardContent>
              </form>
            ) : (
              <>
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
                    <Button variant="outline" onClick={() => setIsEditing(true)}>Edit Profile</Button>
                  </div>
                </CardContent>
              </>
            )}
          </Card>
        )}
      </AsyncBoundary>
    </div>
  );
}
