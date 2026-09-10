"use client";

// ─────────────────────────────────────────────────────────────────────────────
// Public Navbar
// ─────────────────────────────────────────────────────────────────────────────
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-sm">
      <nav
        className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8"
        aria-label="Main navigation"
      >
        {/* Logo / Brand */}
        <Link
          href="/"
          className="text-lg font-bold tracking-tight text-foreground hover:text-primary transition-colors"
          aria-label="ASCENT home"
        >
          ASCENT
        </Link>

        {/* Nav links */}
        <div className="hidden items-center gap-6 sm:flex">
          <Link
            href="/opportunities"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Opportunities
          </Link>
          <Link
            href="/events"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Events
          </Link>
        </div>

        {/* Auth actions */}
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/auth/login">Sign in</Link>
          </Button>
          <Button size="sm" asChild>
            <Link href="/auth/signup">Get started</Link>
          </Button>
        </div>
      </nav>
    </header>
  );
}
