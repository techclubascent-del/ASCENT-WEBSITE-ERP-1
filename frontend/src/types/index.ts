// ─────────────────────────────────────────────────────────────────────────────
// Shared TypeScript types for ASCENT
//
// These types mirror the backend Pydantic schemas. Keep them in sync with the
// backend response contracts. When the backend adds a field, add it here too.
// ─────────────────────────────────────────────────────────────────────────────

// ── Enums ────────────────────────────────────────────────────────────────────

export type UserRole = "user" | "organizer" | "admin";

export type OpportunityStatus = "draft" | "published" | "closed" | "archived";

export type ApplicationStatus =
  | "submitted"
  | "under_review"
  | "accepted"
  | "rejected"
  | "withdrawn";

// ── Core domain types ─────────────────────────────────────────────────────────

export interface User {
  id: string;
  email: string;
  role: UserRole;
  created_at: string;
}

export interface Profile {
  id: string;
  user_id: string;
  full_name: string | null;
  bio: string | null;
  avatar_url: string | null;
}

export interface Opportunity {
  id: string;
  created_by: string;
  title: string;
  description: string | null;
  status: OpportunityStatus;
  deadline: string | null;
  created_at: string;
}

export interface Application {
  id: string;
  user_id: string;
  opportunity_id: string;
  status: ApplicationStatus;
  answers: Record<string, string>;
  submitted_at: string | null;
  created_at: string;
}

export interface Event {
  id: string;
  title: string;
  description: string | null;
  event_date: string;
  created_at: string;
}

// ── API response wrappers ─────────────────────────────────────────────────────

export interface ApiError {
  detail: string;
  code?: string;
}

// ── Utility types ──────────────────────────────────────────────────────────────

/** Makes specified keys of T required and non-nullable. */
export type WithRequired<T, K extends keyof T> = T & { [P in K]-?: NonNullable<T[P]> };
