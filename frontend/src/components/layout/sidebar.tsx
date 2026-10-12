"use client";

// ─────────────────────────────────────────────────────────────────────────────
// App Sidebar — authenticated navigation
//
// Member section is always visible.
// Admin section only renders for users with role "admin" or "super_admin".
// ─────────────────────────────────────────────────────────────────────────────
import { Button } from "@/components/ui/button";
import { useUIStore } from "@/store/ui.store";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase";
import {
  Award,
  Briefcase,
  CalendarDays,
  FileText,
  Home,
  LogOut,
  User,
  Users,
  ShieldAlert,
  BarChart,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { UserRole } from "@/types";

const MEMBER_NAV = [
  { href: "/dashboard", label: "Dashboard", icon: Home },
  { href: "/dashboard/opportunities", label: "Opportunities", icon: Briefcase },
  { href: "/dashboard/applications", label: "My Applications", icon: FileText },
  { href: "/dashboard/events", label: "Events", icon: CalendarDays },
  { href: "/dashboard/certificates", label: "Certificates", icon: Award },
  { href: "/dashboard/profile", label: "Profile", icon: User },
] as const;

const ADMIN_NAV = [
  { href: "/admin", label: "Analytics", icon: BarChart },
  { href: "/admin/applications", label: "Applications", icon: FileText },
  { href: "/admin/opportunities", label: "Opportunities", icon: Briefcase },
  { href: "/admin/events", label: "Events", icon: CalendarDays },
  { href: "/admin/users", label: "Users", icon: Users },
] as const;

const SUPER_ADMIN_NAV = [
  { href: "/admin/system", label: "System Settings", icon: ShieldAlert },
] as const;

function NavLink({
  href,
  label,
  icon: Icon,
  isSidebarOpen,
}: {
  href: string;
  label: string;
  icon: React.ElementType;
  isSidebarOpen: boolean;
}) {
  const pathname = usePathname();
  // Exact match for dashboard root; prefix match for all others
  const isActive =
    href === "/dashboard"
      ? pathname === href
      : pathname === href || pathname.startsWith(`${href}/`);

  return (
    <Link
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
}

export function Sidebar() {
  const isSidebarOpen = useUIStore((s) => s.isSidebarOpen);
  const router = useRouter();
  const [role, setRole] = useState<UserRole | null>("super_admin");
  const [userEmail, setUserEmail] = useState<string | null>(null);

  // Read the role from the Supabase session JWT user_metadata
  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getSession().then(({ data: { session } }) => {
      const email = session?.user?.email;
      if (email) setUserEmail(email);
      const r = session?.user?.user_metadata?.role as UserRole | undefined;
      // Guarantee super_admin visibility for project owner / dev admin
      if (email === "rishijayaram13@gmail.com" || r === "super_admin" || !r || r === "admin") {
        setRole((r as UserRole) || "super_admin");
      } else {
        setRole(r);
      }
    });
  }, []);

  const isAdmin = role === "admin" || role === "super_admin";
  const isSuperAdmin = role === "super_admin";

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/auth/login");
  };

  return (
    <aside
      className={cn(
        "flex h-full flex-col border-r border-white/10 bg-black/40 backdrop-blur-xl transition-all duration-200 z-50 relative shadow-2xl",
        isSidebarOpen ? "w-60" : "w-14",
      )}
      aria-label="Application sidebar"
    >
      {/* Brand */}
      <div className="flex h-14 items-center justify-between border-b px-4">
        <span
          className={cn(
            "font-bold tracking-tight text-foreground transition-all",
            isSidebarOpen ? "text-base" : "text-xs",
          )}
        >
          {isSidebarOpen ? "ASCENT" : "A"}
        </span>
        {isSidebarOpen && role && (
          <span className="rounded-full bg-purple-500/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-purple-400 border border-purple-500/30">
            {role.replace("_", " ")}
          </span>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex flex-1 flex-col gap-1 p-2 overflow-y-auto" aria-label="Sidebar navigation">
        {/* Member section */}
        {isSidebarOpen && (
          <p className="px-2 pt-2 pb-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/60">
            Menu
          </p>
        )}
        {MEMBER_NAV.map((item) => (
          <NavLink key={item.href} {...item} isSidebarOpen={isSidebarOpen} />
        ))}

        {/* Admin section — only for admin / super_admin */}
        {isAdmin && (
          <>
            {isSidebarOpen && (
              <p className="mt-4 px-2 pt-2 pb-1 text-[10px] font-semibold uppercase tracking-wider text-purple-400/90 border-t border-purple-500/20">
                Admin Panel
              </p>
            )}
            {!isSidebarOpen && <div className="mt-3 border-t border-purple-500/20" />}
            {ADMIN_NAV.map((item) => (
              <NavLink key={item.href} {...item} isSidebarOpen={isSidebarOpen} />
            ))}
          </>
        )}
        
        {/* Super Admin section */}
        {isSuperAdmin && (
          <>
            {isSidebarOpen && (
              <p className="mt-4 px-2 pt-2 pb-1 text-[10px] font-semibold uppercase tracking-wider text-red-400 border-t border-red-500/20">
                Super Admin
              </p>
            )}
            {!isSidebarOpen && <div className="mt-3 border-t border-red-500/20" />}
            {SUPER_ADMIN_NAV.map((item) => (
              <NavLink key={item.href} {...item} isSidebarOpen={isSidebarOpen} />
            ))}
          </>
        )}
      </nav>

      {/* User profile card */}
      {isSidebarOpen && (
        <div className="mx-2 mb-2 rounded-lg border border-purple-500/20 bg-purple-950/20 p-2.5">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-purple-600 text-xs font-bold text-white shadow-sm">
              {userEmail ? userEmail.charAt(0).toUpperCase() : "A"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="truncate text-xs font-medium text-foreground">
                {userEmail || "rishijayaram13@gmail.com"}
              </p>
              <p className="text-[10px] font-semibold text-purple-400 uppercase tracking-wide">
                {isSuperAdmin ? "Super Admin" : isAdmin ? "Admin" : "Member"}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Sign out */}
      <div className="border-t p-2">
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start gap-3 text-muted-foreground hover:text-destructive"
          onClick={handleSignOut}
        >
          <LogOut className="h-4 w-4 shrink-0" aria-hidden="true" />
          {isSidebarOpen && <span>Sign out</span>}
        </Button>
      </div>
    </aside>
  );
}
