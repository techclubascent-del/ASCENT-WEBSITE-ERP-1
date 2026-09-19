"use client";

// ─────────────────────────────────────────────────────────────────────────────
// Protected app layout
//
// Wraps all authenticated routes (/dashboard, /opportunities, etc.).
// The middleware handles the actual redirect; this layout assumes the user
// is authenticated. The sidebar collapse state lives in Zustand.
// ─────────────────────────────────────────────────────────────────────────────
import { Sidebar } from "@/components/layout/sidebar";
import { Button } from "@/components/ui/button";
import { useUIStore } from "@/store/ui.store";
import { PanelLeftClose, PanelLeftOpen } from "lucide-react";
import type { ReactNode } from "react";

interface AppLayoutProps {
  children: ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  const { isSidebarOpen, toggleSidebar } = useUIStore();

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <Sidebar />

      {/* Main content area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top bar */}
        <header className="flex h-14 shrink-0 items-center justify-between border-b px-4 bg-background/50 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleSidebar}
              aria-label={isSidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
            >
              {isSidebarOpen ? (
                <PanelLeftClose className="h-4 w-4" />
              ) : (
                <PanelLeftOpen className="h-4 w-4" />
              )}
            </Button>
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground hidden sm:inline-block">
              ASCENT Platform
            </span>
          </div>

          <div className="flex items-center gap-2">
            <a
              href="/admin"
              className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/30 hover:bg-purple-500/20 transition-colors"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-purple-500 animate-pulse"></span>
              Admin Panel
            </a>
            <a
              href="/admin/system"
              className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-full bg-red-500/10 text-red-400 border border-red-500/30 hover:bg-red-500/20 transition-colors"
            >
              System & Kill Switch
            </a>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}
