"use client";

// ─────────────────────────────────────────────────────────────────────────────
// Admin — Users — /admin/users
// Lists all platform users. Admins can change roles.
// ─────────────────────────────────────────────────────────────────────────────
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { User, UserRole } from "@/types";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AsyncBoundary } from "@/components/async/async-boundary";

const ROLE_COLORS: Record<UserRole, string> = {
  member: "bg-white/10 text-white/70 border border-white/20",
  admin: "bg-blue-500/20 text-blue-300 border border-blue-500/30",
  super_admin: "bg-purple-500/20 text-purple-300 border border-purple-500/30",
};

// Admins can only promote to/from "member" or "admin" — super_admin is immutable
const ASSIGNABLE_ROLES: UserRole[] = ["member", "admin"];

export default function AdminUsersPage() {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["admin", "users"],
    queryFn: () => api.get<User[]>("/api/v1/users"),
  });

  const roleMutation = useMutation({
    mutationFn: ({ userId, role }: { userId: string; role: UserRole }) =>
      api.patch(`/api/v1/users/${userId}/role`, { role }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
    },
  });

  return (
    <div className="space-y-6 max-w-5xl mx-auto p-4 md:p-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white">Users</h1>
        <p className="text-white/60 mt-2">
          Manage platform members and their roles.
        </p>
      </div>

      <AsyncBoundary
        isLoading={query.isLoading}
        error={query.error}
        isEmpty={!query.data || query.data.length === 0}
        emptyMessage="No users found."
      >
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-white/50 uppercase tracking-wide">
              {query.data?.length ?? 0} Users
            </CardTitle>
          </CardHeader>
          <CardContent className="divide-y divide-white/10">
            {query.data?.map((user) => (
              <div
                key={user.id}
                className="flex flex-col gap-2 py-3 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="min-w-0">
                  <p className="text-sm font-medium text-white truncate">{user.email}</p>
                  <p className="text-xs text-white/50 font-mono mt-0.5 truncate">
                    {user.id}
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Badge
                    variant="outline"
                    className={`uppercase text-[10px] font-semibold px-2 ${ROLE_COLORS[user.role]}`}
                  >
                    {user.role.replace("_", " ")}
                  </Badge>
                  {/* Role selector — disabled for super_admins (backend will reject anyway) */}
                  {user.role !== "super_admin" && (
                    <select
                      className="text-xs border rounded-md px-2 py-1 bg-white/5 border-white/10 text-white focus:ring-purple-500 focus:border-purple-500"
                      value={user.role}
                      disabled={roleMutation.isPending}
                      onChange={(e) =>
                        roleMutation.mutate({
                          userId: user.id,
                          role: e.target.value as UserRole,
                        })
                      }
                      aria-label={`Change role for ${user.email}`}
                    >
                      {ASSIGNABLE_ROLES.map((r) => (
                        <option key={r} value={r} className="bg-[#1a1a1a] text-white">
                          {r.replace("_", " ")}
                        </option>
                      ))}
                    </select>
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </AsyncBoundary>
    </div>
  );
}
