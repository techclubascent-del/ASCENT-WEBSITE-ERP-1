"use client";

// ─────────────────────────────────────────────────────────────────────────────
// App Sidebar — authenticated navigation
// ─────────────────────────────────────────────────────────────────────────────
import { Button } from "@/components/ui/button";
import { useUIStore } from "@/store/ui.store";
import { cn } from "@/lib/utils";
import {
  Briefcase,
  FileText,
  Home,
  LogOut,
  User,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard", icon: Home },
  { href: "/dashboard/opportunities", label: "Opportunities", icon: Briefcase },
  { href: "/dashboard/applications", label: "My Applications", icon: FileText },
  { href: "/dashboard/profile", label: "Profile", icon: User },
] as const;

export function Sidebar() {
  const isSidebarOpen = useUIStore((s) => s.isSidebarOpen);
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        "flex h-full flex-col border-r bg-background transition-all duration-200",
        isSidebarOpen ? "w-56" : "w-14",
      )}
      aria-label="Application sidebar"
    >
      {/* Brand */}
      <div className="flex h-14 items-center border-b px-4">
        <span
          className={cn(
            "font-bold tracking-tight text-foreground transition-all",
            isSidebarOpen ? "text-base" : "text-xs",
          )}
        >
          {isSidebarOpen ? "ASCENT" : "A"}
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex flex-1 flex-col gap-1 p-2" aria-label="Sidebar navigation">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href || pathname.startsWith(`${href}/`);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 rounded-md px-2 py-2 text-sm transition-colors",
                isActive
                  ? "bg-primary/10 text-primary font-medium"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
              )}
              aria-current={isActive ? "page" : undefined}
            >
              <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
              {isSidebarOpen && <span>{label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Sign out */}
      <div className="border-t p-2">
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start gap-3 text-muted-foreground"
        >
          <LogOut className="h-4 w-4 shrink-0" aria-hidden="true" />
          {isSidebarOpen && <span>Sign out</span>}
        </Button>
      </div>
    </aside>
  );
}
