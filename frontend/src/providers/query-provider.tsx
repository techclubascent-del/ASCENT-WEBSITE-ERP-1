"use client";

// ─────────────────────────────────────────────────────────────────────────────
// TanStack Query provider
//
// Wraps the entire app to make useQuery / useMutation available.
// Configured with sensible defaults for the ASCENT use case.
// ─────────────────────────────────────────────────────────────────────────────
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useState, type ReactNode } from "react";

interface QueryProviderProps {
  children: ReactNode;
}

export function QueryProvider({ children }: QueryProviderProps) {
  // Create one QueryClient per component mount (not per render)
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // Data is considered fresh for 60 seconds before re-fetching
            staleTime: 60 * 1000,
            // Retry failed requests up to 2 times
            retry: 2,
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {/* Devtools only renders in development */}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
