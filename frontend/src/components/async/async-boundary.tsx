// ─────────────────────────────────────────────────────────────────────────────
// AsyncBoundary — reusable loading / error / empty state wrapper
//
// Every async screen MUST handle all four states: loading, error, empty, success.
// This component enforces that pattern at the point of use.
//
// Usage:
//   <AsyncBoundary isLoading={isLoading} error={error} isEmpty={!data?.length}
//     loadingFallback={<Skeleton className="h-32" />}
//     emptyMessage="No opportunities found."
//   >
//     {data.map(item => <OpportunityCard key={item.id} {...item} />)}
//   </AsyncBoundary>
// ─────────────────────────────────────────────────────────────────────────────
import { Spinner } from "@/components/ui/spinner";
import { AlertCircle, Inbox } from "lucide-react";
import type { ReactNode } from "react";

interface AsyncBoundaryProps {
  isLoading: boolean;
  error: Error | null;
  isEmpty?: boolean;
  /** Override the default loading spinner */
  loadingFallback?: ReactNode;
  /** Message shown when the result set is empty */
  emptyMessage?: string;
  /** Icon shown in the empty state */
  emptyIcon?: ReactNode;
  children: ReactNode;
}

export function AsyncBoundary({
  isLoading,
  error,
  isEmpty = false,
  loadingFallback,
  emptyMessage = "Nothing here yet.",
  emptyIcon,
  children,
}: AsyncBoundaryProps) {
  if (isLoading) {
    return (
      <div className="flex min-h-[200px] items-center justify-center">
        {loadingFallback ?? <Spinner size="lg" />}
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-[200px] flex-col items-center justify-center gap-3 text-destructive">
        <AlertCircle className="h-8 w-8" aria-hidden="true" />
        <p className="text-sm font-medium">{error.message}</p>
      </div>
    );
  }

  if (isEmpty) {
    return (
      <div className="flex min-h-[200px] flex-col items-center justify-center gap-3 text-muted-foreground">
        {emptyIcon ?? <Inbox className="h-8 w-8" aria-hidden="true" />}
        <p className="text-sm">{emptyMessage}</p>
      </div>
    );
  }

  return <>{children}</>;
}
