// ─────────────────────────────────────────────────────────────────────────────
// Public route group layout
// Applies the public navbar. No auth required for routes in this group.
// ─────────────────────────────────────────────────────────────────────────────
import { Navbar } from "@/components/layout/navbar";
import type { ReactNode } from "react";

interface PublicLayoutProps {
  children: ReactNode;
}

export default function PublicLayout({ children }: PublicLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">{children}</main>
      <footer className="border-t py-6 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} ASCENT. All rights reserved.
      </footer>
    </div>
  );
}
