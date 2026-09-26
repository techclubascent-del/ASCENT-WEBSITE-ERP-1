"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";

export function Analytics() {
  const pathname = usePathname();
  const { session } = useAuth();

  useEffect(() => {
    if (!pathname) return;

    // We don't want to block rendering, so we just fire and forget
    fetch("http://localhost:8000/api/v1/audit/log", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(session?.access_token ? { Authorization: `Bearer ${session.access_token}` } : {}),
      },
      body: JSON.stringify({
        action: "PAGE_VIEW",
        resource: pathname,
        metadata: {
          timestamp: new Date().toISOString(),
        }
      })
    }).catch((err) => {
      console.error("Failed to log analytics", err);
    });

  }, [pathname, session?.access_token]);

  return null;
}
