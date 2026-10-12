// ─────────────────────────────────────────────────────────────────────────────
// Admin route group layout
//
// Adds an admin-specific visual treatment on top of the app layout.
// Role enforcement happens server-side (backend). This guard provides UX only.
// ─────────────────────────────────────────────────────────────────────────────
import { createClient } from "@/lib/supabase-server";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import MinimalBackground from "@/components/MinimalBackground";

interface AdminLayoutProps {
  children: ReactNode;
}

export default async function AdminLayout({ children }: AdminLayoutProps) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  return (
    <div className="relative min-h-screen">
      <div className="absolute inset-0 z-0">
        <MinimalBackground />
      </div>
      
      <div className="relative z-10 p-6 flex flex-col h-full">
        <div className="mb-6 rounded-xl border border-white/10 bg-black/40 backdrop-blur-xl px-6 py-3 flex items-center justify-between shadow-2xl">
          <div className="flex items-center gap-3">
            <span className="h-2 w-2 rounded-full bg-purple-500 animate-pulse"></span>
            <span className="text-sm font-semibold uppercase tracking-wider text-purple-200">
              Admin & Super Admin Portal
            </span>
          </div>
          <div className="text-xs text-muted-foreground bg-black/30 px-3 py-1 rounded-full border border-white/5">
            Changes here affect the entire platform
          </div>
        </div>
        
        <div className="flex-1 rounded-2xl border border-white/10 bg-black/40 backdrop-blur-md overflow-hidden shadow-2xl flex flex-col">
          {children}
        </div>
      </div>
    </div>
  );
}
