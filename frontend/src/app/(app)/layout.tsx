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
        <header className="flex h-14 shrink-0 items-center gap-3 border-b px-4">
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
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}
