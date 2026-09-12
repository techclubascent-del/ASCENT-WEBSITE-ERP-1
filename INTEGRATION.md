# ASCENT — Frontend Integration Guide

> **For the frontend team.** Everything you need to connect your UI to the ASCENT backend API.
> The backend is feature-complete. This document is your single source of truth.

---

## Table of Contents

1. [Stack Overview](#1-stack-overview)
2. [Environment Setup](#2-environment-setup)
3. [Authentication Flow](#3-authentication-flow)
4. [API Client](#4-api-client)
5. [TypeScript Types](#5-typescript-types)
6. [Full API Reference](#6-full-api-reference)
7. [Error Handling](#7-error-handling)
8. [RBAC — Who Can Call What](#8-rbac--who-can-call-what)
9. [Running Locally](#9-running-locally)

---

## 1. Stack Overview

| Layer | Technology |
|---|---|
| Frontend framework | Next.js 14 (App Router) |
| Backend API | FastAPI — runs on `http://localhost:8000` |
| Auth & Database | Supabase |
| Data fetching | TanStack React Query v5 |
| State management | Zustand |
| UI components | Radix UI + Tailwind CSS |
| Forms | React Hook Form + Zod |

---

## 2. Environment Setup

Create a file called **`.env.local`** in the `frontend/` directory.  
Copy from `.env.example` and fill in your values:

```env
# Supabase project URL — Settings → API → Project URL
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co

# Supabase anon key — Settings → API → anon public
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIs...

# FastAPI backend base URL
NEXT_PUBLIC_API_URL=http://localhost:8000
```

> **Never commit `.env.local`** — it is already in `.gitignore`.

---

## 3. Authentication Flow

Authentication is handled entirely by **Supabase Auth**. The backend validates the Supabase-issued JWT on every protected request.

### Login / Signup

Use the Supabase browser client (`@/lib/supabase`):

```typescript
import { createClient } from "@/lib/supabase";

const supabase = createClient();

// Sign up
await supabase.auth.signUp({ email, password });

// Sign in
await supabase.auth.signInWithPassword({ email, password });

// Sign out
await supabase.auth.signOut();
```

### Getting the session / token

```typescript
const { data: { session } } = await supabase.auth.getSession();
const token = session?.access_token; // send this as Bearer token
```

### User role

The role is stored in the JWT's `user_metadata`:

```typescript
const role = session?.user?.user_metadata?.role as "member" | "admin" | "super_admin";
// Defaults to "member" if not set
```

To promote a user to admin, an admin must call `PATCH /api/v1/users/{id}/role`  
(or a super_admin can set it directly in Supabase → Authentication → Users).

### Middleware

Route protection is handled by `src/middleware.ts`:
- `/dashboard/*`, `/admin/*` → redirect to `/auth/login` if unauthenticated
- `/auth/*` → redirect to `/dashboard` if already logged in

---

## 4. API Client

A typed fetch wrapper already exists at **`src/lib/api.ts`**.  
**Always use this — never call `fetch()` directly.**

```typescript
import { api } from "@/lib/api";

// GET
const opps = await api.get<Opportunity[]>("/api/v1/opportunities");

// POST
const app = await api.post<Application>("/api/v1/applications", {
  opportunity_id: "uuid",
  answers: { motivation: "..." }
});

// PATCH
const updated = await api.patch<Application>(`/api/v1/applications/${id}`, {
  status: "accepted"
});

// DELETE (returns void)
await api.delete(`/api/v1/certificates/${id}`);
```

The client automatically:
- Attaches `Authorization: Bearer <token>` from the active Supabase session
- Throws `ApiClientError` on non-2xx responses with `.status`, `.message`, `.code`
- Handles `204 No Content` responses

---

## 5. TypeScript Types

All types live in **`src/types/index.ts`**. Import from there — do not redeclare.

```typescript
import type {
  User, Profile, UserRole,
  Opportunity, OpportunityStatus,
  Application, ApplicationStatus,
  Event,
  Certificate,
  Attendance,
  ApiError
} from "@/types";
```

### Type Definitions

```typescript
type UserRole = "member" | "admin" | "super_admin";
type OpportunityStatus = "draft" | "published" | "closed";
type ApplicationStatus = "draft" | "submitted" | "under_review" | "accepted" | "rejected";

interface User {
  id: string;           // UUID
  email: string;
  role: UserRole;
}

interface Profile {
  id: string;
  user_id: string;
  full_name: string | null;
  bio: string | null;
  avatar_url: string | null;
}

interface Opportunity {
  id: string;
  created_by: string;   // user UUID
  title: string;
  description: string;
  status: OpportunityStatus;
  deadline: string | null;     // ISO 8601 datetime
  published_at: string | null; // ISO 8601 datetime
  created_at: string;          // ISO 8601 datetime
}

interface Application {
  id: string;
  user_id: string;
  opportunity_id: string;
  status: ApplicationStatus;
  answers: Record<string, string>;   // { motivation: "...", ... }
  submitted_at: string | null;
  created_at: string;
}

interface Event {
  id: string;
  title: string;
  description: string;
  event_date: string;       // ISO 8601 datetime
  location: string | null;
  created_by: string;
  created_at: string;
}

interface Certificate {
  id: string;
  user_id: string;
  title: string;
  issued_by: string | null;
  issued_at: string;         // ISO 8601 datetime
  url: string | null;        // link to certificate file
}

interface Attendance {
  id: string;
  user_id: string;
  event_id: string;
  status: "present" | "absent" | "excused";
  marked_at: string;
}

interface ApiError {
  detail: string;   // human-readable message
  code?: string;    // e.g. "NOT_FOUND", "FORBIDDEN"
}
```

---

## 6. Full API Reference

**Base URL:** `http://localhost:8000`  
**Prefix:** All endpoints start with `/api/v1/`

### Auth notation
- 🔓 — Public (no token needed)
- 🔐 — Any authenticated user (member, admin, super_admin)
- 🛡️ — Admin or Super Admin only

---

### Health

| Method | Path | Auth | Description |
|---|---|---|---|
| `GET` | `/api/v1/health` | 🔓 | Health check — returns `{ status: "ok" }` |

---

### Users

| Method | Path | Auth | Description |
|---|---|---|---|
| `GET` | `/api/v1/users/me` | 🔐 | Get current user (from JWT) |
| `GET` | `/api/v1/users/me/profile` | 🔐 | Get current user's profile row |
| `GET` | `/api/v1/users` | 🛡️ | List all users |
| `PATCH` | `/api/v1/users/{id}/role` | 🛡️ | Change a user's role |
| `PATCH` | `/api/v1/users/{id}/profile` | 🛡️ | Update a user's profile |

**`GET /users/me`** → `User`
```json
{ "id": "uuid", "email": "user@example.com", "role": "member" }
```

**`GET /users/me/profile`** → `Profile`
```json
{ "id": "uuid", "user_id": "uuid", "full_name": "Rishi", "bio": null, "avatar_url": null }
```

**`PATCH /users/{id}/role`** body:
```json
{ "role": "admin" }
```

**`PATCH /users/{id}/profile`** body (all optional):
```json
{ "full_name": "Rishi Jayaram", "bio": "Tech Club member", "avatar_url": "https://..." }
```

---

### Opportunities

| Method | Path | Auth | Description |
|---|---|---|---|
| `GET` | `/api/v1/opportunities` | 🔓 | List **published** opportunities only |
| `GET` | `/api/v1/opportunities/admin/all` | 🛡️ | List **all** opportunities including drafts |
| `GET` | `/api/v1/opportunities/{id}` | 🔓 | Get one opportunity |
| `POST` | `/api/v1/opportunities` | 🛡️ | Create a new opportunity |
| `PATCH` | `/api/v1/opportunities/{id}` | 🛡️ | Update an opportunity |

**`POST /opportunities`** body:
```json
{
  "title": "Fall Bootcamp 2026",
  "description": "...",
  "status": "draft",           // "draft" | "published" | "closed"
  "deadline": "2026-10-01T00:00:00Z"   // optional, ISO 8601
}
```

**`PATCH /opportunities/{id}`** body (all fields optional):
```json
{ "title": "Updated title", "status": "published" }
```

---

### Applications

| Method | Path | Auth | Description |
|---|---|---|---|
| `GET` | `/api/v1/applications/me` | 🔐 | Current user's own applications |
| `GET` | `/api/v1/applications/{id}` | 🔐 | Get one application (members: own only) |
| `GET` | `/api/v1/applications/opportunity/{opp_id}` | 🛡️ | All apps for one opportunity |
| `GET` | `/api/v1/applications` | 🛡️ | All applications platform-wide |
| `POST` | `/api/v1/applications` | 🔐 | Submit an application |
| `PATCH` | `/api/v1/applications/{id}` | 🛡️ | Update application status |

**`POST /applications`** body:
```json
{
  "opportunity_id": "uuid",
  "answers": {
    "motivation": "I want to learn...",
    "experience": "I have worked on..."
  }
}
```

**`PATCH /applications/{id}`** body:
```json
{ "status": "accepted" }   // "submitted"|"under_review"|"accepted"|"rejected"
```

---

### Events

| Method | Path | Auth | Description |
|---|---|---|---|
| `GET` | `/api/v1/events` | 🔓 | List all events |
| `GET` | `/api/v1/events/{id}` | 🔓 | Get one event |
| `POST` | `/api/v1/events` | 🛡️ | Create a new event |
| `PATCH` | `/api/v1/events/{id}` | 🛡️ | Update an event |

**`POST /events`** body:
```json
{
  "title": "Web Dev Workshop #3",
  "description": "We will build a REST API...",
  "event_date": "2026-10-15T18:00:00Z",
  "location": "Room 204"   // optional
}
```

---

### Certificates

| Method | Path | Auth | Description |
|---|---|---|---|
| `GET` | `/api/v1/certificates/me` | 🔐 | Current user's certificates |
| `GET` | `/api/v1/certificates/user/{id}` | 🛡️ | Any user's certificates |
| `POST` | `/api/v1/certificates` | 🛡️ | Issue a certificate |
| `PATCH` | `/api/v1/certificates/{id}` | 🛡️ | Update a certificate |
| `DELETE` | `/api/v1/certificates/{id}` | 🛡️ | Delete a certificate (204) |

**`POST /certificates`** body:
```json
{
  "user_id": "uuid",
  "title": "Full Stack Development Certificate",
  "issued_by": "Ascent Tech Club",
  "issued_at": "2026-09-01T00:00:00Z",
  "url": "https://..."   // optional
}
```

---

### Attendance

| Method | Path | Auth | Description |
|---|---|---|---|
| `GET` | `/api/v1/attendance/me` | 🔐 | Current user's attendance |
| `GET` | `/api/v1/attendance/user/{id}` | 🛡️ | Any user's attendance |
| `GET` | `/api/v1/attendance/event/{id}` | 🛡️ | All attendance for one event |
| `POST` | `/api/v1/attendance` | 🛡️ | Record attendance |
| `PATCH` | `/api/v1/attendance/{id}` | 🛡️ | Update attendance record |
| `DELETE` | `/api/v1/attendance/{id}` | 🛡️ | Delete attendance record (204) |

**`POST /attendance`** body:
```json
{
  "user_id": "uuid",
  "event_id": "uuid",
  "status": "present"   // "present" | "absent" | "excused"
}
```

---

## 7. Error Handling

All errors follow this shape:
```json
{
  "detail": "Human-readable message",
  "code": "MACHINE_READABLE_CODE"
}
```

| HTTP Status | Code | Meaning |
|---|---|---|
| `401` | `UNAUTHORIZED` | Missing or invalid/expired JWT |
| `403` | `FORBIDDEN` | Authenticated but insufficient role |
| `404` | `NOT_FOUND` | Resource doesn't exist |
| `409` | `CONFLICT` | Duplicate resource |
| `422` | — | Validation error (bad request body) |
| `500` | `INTERNAL_ERROR` | Server error |

**Catching errors in React Query:**
```typescript
import { ApiClientError } from "@/lib/api";

const mutation = useMutation({
  mutationFn: (body) => api.post("/api/v1/applications", body),
  onError: (err) => {
    if (err instanceof ApiClientError) {
      if (err.status === 401) // redirect to login
      if (err.status === 403) // show "Access denied"
      if (err.status === 409) // show "Already applied"
      console.log(err.detail); // human message
      console.log(err.code);   // machine code
    }
  }
});
```

---

## 8. RBAC — Who Can Call What

| Action | member | admin | super_admin |
|---|---|---|---|
| View published opportunities | ✅ | ✅ | ✅ |
| View draft opportunities | ❌ | ✅ | ✅ |
| Apply for opportunity | ✅ | ✅ | ✅ |
| View own applications | ✅ | ✅ | ✅ |
| View any application | ❌ | ✅ | ✅ |
| Change application status | ❌ | ✅ | ✅ |
| Create / update opportunities | ❌ | ✅ | ✅ |
| Create / update events | ❌ | ✅ | ✅ |
| Issue certificates | ❌ | ✅ | ✅ |
| Record attendance | ❌ | ✅ | ✅ |
| List all users | ❌ | ✅ | ✅ |
| Change user roles | ❌ | ✅ (up to admin) | ✅ (all) |
| Modify super_admin accounts | ❌ | ❌ | ✅ |

> **Note:** Admins cannot promote users to `super_admin` and cannot modify existing `super_admin` accounts. This is enforced on the backend regardless of what the frontend sends.

---

## 9. Running Locally

### Backend
```bash
cd backend
python -m venv venv
venv\Scripts\activate          # Windows
pip install -r requirements.txt
# Fill in backend/.env
uvicorn app.main:app --reload
# → http://localhost:8000
# → http://localhost:8000/docs  (interactive API explorer)
```

### Frontend
```bash
cd frontend
npm install
# Create frontend/.env.local and fill in values
npm run dev
# → http://localhost:3000
```

### Useful commands
```bash
# Type check frontend
npm run type-check

# Lint frontend  
npm run lint

# Run backend tests
cd backend
venv\Scripts\pytest tests -v
```

---

## Quick Reference — React Query Patterns

```typescript
// ── Fetching data ─────────────────────────────────────────────
const { data, isLoading, error } = useQuery({
  queryKey: ["opportunities"],
  queryFn: () => api.get<Opportunity[]>("/api/v1/opportunities"),
});

// ── Posting data ──────────────────────────────────────────────
const mutation = useMutation({
  mutationFn: (body: ApplicationCreate) =>
    api.post<Application>("/api/v1/applications", body),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ["applications", "me"] });
    router.push("/dashboard/applications");
  },
  onError: (err: Error) => setError(err.message),
});

// ── Updating data ─────────────────────────────────────────────
const statusMutation = useMutation({
  mutationFn: (status: ApplicationStatus) =>
    api.patch<Application>(`/api/v1/applications/${id}`, { status }),
  onSuccess: (updated) => {
    // Optimistically update cache
    queryClient.setQueryData(["applications", id], updated);
  },
});
```

---

*Last updated: Phase 3 complete — all backend endpoints implemented and tested. 23/23 tests passing.*
