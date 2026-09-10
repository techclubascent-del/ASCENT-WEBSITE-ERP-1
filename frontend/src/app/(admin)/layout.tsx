// ─────────────────────────────────────────────────────────────────────────────
// Admin route group layout
//
// Adds an admin-specific visual treatment on top of the app layout.
// Role enforcement happens server-side (backend). This guard provides UX only.
// ─────────────────────────────────────────────────────────────────────────────
import { createClient } from "@/lib/supabase-server";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";

interface AdminLayoutProps {
  children: ReactNode;
}

export default async function AdminLayout({ children }: AdminLayoutProps) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // If not authenticated at all, the middleware already handled this.
  // This is a belt-and-suspenders UX check only — NOT a security boundary.
  if (!user) {
    redirect("/auth/login");
  }

  // TODO (Phase 1): Fetch user role from your DB and check for "admin".
  // For Phase 0 the admin section is accessible to any authenticated user.
  // Real role check: if (profile.role !== "admin") redirect("/dashboard");

  return (
    <div>
      <div className="mb-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-2 text-xs font-medium text-amber-800 dark:border-amber-800 dark:bg-amber-950/30 dark:text-amber-400">
        Admin area — changes here affect all users.
      </div>
      {children}
    </div>
  );
}
