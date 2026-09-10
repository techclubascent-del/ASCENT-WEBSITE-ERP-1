import { cn } from "@/lib/utils";

// ─────────────────────────────────────────────────────────────────────────────
// Spinner — loading indicator
// ─────────────────────────────────────────────────────────────────────────────

interface SpinnerProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  label?: string;
}

const sizeMap = {
  sm: "h-4 w-4 border-2",
  md: "h-6 w-6 border-2",
  lg: "h-10 w-10 border-4",
};

export function Spinner({ className, size = "md", label = "Loading..." }: SpinnerProps) {
  return (
    <span role="status" aria-label={label} className="inline-flex">
      <span
        className={cn(
          "animate-spin rounded-full border-current border-t-transparent text-primary",
          sizeMap[size],
          className,
        )}
      />
      <span className="sr-only">{label}</span>
    </span>
  );
}
