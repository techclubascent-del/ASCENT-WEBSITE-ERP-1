// ─────────────────────────────────────────────────────────────────────────────
// Shared TypeScript types for ASCENT
//
// These types mirror the backend Pydantic schemas. Keep them in sync with the
// backend response contracts. When the backend adds a field, add it here too.
// ─────────────────────────────────────────────────────────────────────────────

// ── Enums ────────────────────────────────────────────────────────────────────

/**
 * User roles in ASCENT.
 * - member:      Default. Browse/apply for opportunities, view own progress.
 * - admin:       Core team. Manage content, members, assign roles (up to admin).
 * - super_admin: Platform owner. Full access including security & role promotion.
 */
export type UserRole = "member" | "admin" | "super_admin";

export type OpportunityStatus = "draft" | "published" | "closed" | "archived";

export type ApplicationStatus =
  | "draft"
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
  /** When set, the opportunity auto-publishes at this UTC timestamp. */
  published_at: string | null;
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
  location: string | null;
  created_at: string;
}

export interface Certificate {
  id: string;
  user_id: string;
  title: string;
  issued_by: string | null;
  issued_at: string;
  url: string | null;
}

export interface Attendance {
  id: string;
  user_id: string;
  event_id: string;
  attended: boolean;
  marked_at: string;
}

// ── API response wrappers ─────────────────────────────────────────────────────

export interface ApiError {
  detail: string;
  code?: string;
}

// ── Utility types ──────────────────────────────────────────────────────────────

/** Makes specified keys of T required and non-nullable. */
export type WithRequired<T, K extends keyof T> = T & { [P in K]-?: NonNullable<T[P]> };



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
