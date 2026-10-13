# ASCENT — Architecture

## 1. Architecture Goals

ASCENT follows a modular web architecture designed for:
- Clear separation of frontend, backend and data responsibilities
- AI-assisted development without architectural drift
- Secure authentication and authorization
- Independent feature development
- Progressive enhancement for public experiences
- Maintainability over unnecessary complexity

## 2. High-Level System Architecture

```mermaid
flowchart TB
    U[Users]

    subgraph FE["Frontend — Next.js"]
        PUB[Public Pages]
        APP[Protected Application]
        ADM[Admin Interface]
        UI[UI / Feature Components]
        STATE[State & Data Layer]
        THREE[3D Experience Layer<br/>Public Pages Only]
    end

    subgraph BE["Backend — FastAPI"]
        API[API Routes]
        AUTHZ[Authorization]
        SERVICES[Business Services]
        REPOS[Data Access Layer]
    end

    subgraph DATA["Supabase"]
        SAUTH[Authentication]
        DB[(PostgreSQL)]
        STORE[File Storage]
    end

    subgraph EXT["External Services"]
        AI[AI Providers]
        EMAIL[Email / Notifications]
    end

    U --> PUB
    U --> APP
    U --> ADM

    PUB --> UI
    PUB --> THREE
    APP --> UI
    ADM --> UI

    UI --> STATE
    STATE --> API

    API --> AUTHZ
    AUTHZ --> SERVICES
    SERVICES --> REPOS

    REPOS --> DB
    APP --> SAUTH
    API --> SAUTH
    SERVICES --> STORE
    SERVICES --> AI
    SERVICES --> EMAIL
```

## 3. Frontend Architecture

### Responsibilities
The frontend is responsible for:
- User interface and interaction
- Route rendering and navigation
- Client-side form validation
- Server-state caching
- User experience feedback
- Public-page motion and optional 3D experiences

The frontend is **not** responsible for:
- Business authorization decisions
- Direct database access
- Sensitive business logic
- Final validation of protected operations

```mermaid
flowchart TB
    subgraph NEXT["Next.js Application"]
        ROUTES[App Router]
        PUBLIC[Public Routes]
        PROTECTED[Protected Routes]
        ADMIN[Admin Routes]

        UI[Reusable UI + Feature Components]

        subgraph LOGIC["Application Logic"]
            HOOKS[Custom Hooks]
            FORMS[Forms + Validation]
            GUARDS[UX Route Guards]
        end

        subgraph STATE["State Ownership"]
            SERVERSTATE[TanStack Query<br/>Server State]
            GLOBALSTATE[Zustand<br/>Global UI State]
            FORMSTATE[React Hook Form]
            URLSTATE[URL Parameters]
            LOCALSTATE[useState]
        end

        API[Central API Client]

        subgraph EXPERIENCE["Experience Layer"]
            MOTION[Framer Motion]
            THREE[Three.js + React Three Fiber]
        end
    end

    ROUTES --> PUBLIC
    ROUTES --> PROTECTED
    ROUTES --> ADMIN
    PUBLIC --> UI
    PROTECTED --> UI
    ADMIN --> UI

    UI --> LOGIC
    LOGIC --> STATE
    STATE --> API

    PUBLIC --> EXPERIENCE
```

### 3D Boundary

3D/WebGL is restricted to selected public-facing experiences such as:
- Home / landing page
- Brand storytelling sections
- Selected public showcase pages

3D must not be required for:
- Authentication
- Dashboards
- Forms
- Applications
- Admin interfaces
- Core user workflows

All 3D experiences must:
- Be lazy loaded
- Have a meaningful 2D fallback
- Avoid blocking initial content
- Degrade gracefully on lower-powered devices

## 4. Backend Architecture

```mermaid
flowchart LR
    CLIENT[Frontend]

    subgraph API["FastAPI Backend"]
        ROUTER[API Routes]
        DEP[Dependencies / Auth]
        SERVICE[Service Layer]
        REPO[Repository / Data Layer]
        SCHEMA[Pydantic Schemas]
    end

    subgraph DATA["Data Infrastructure"]
        DB[(PostgreSQL)]
        STORAGE[Supabase Storage]
        AUTH[Supabase Auth]
    end

    CLIENT --> ROUTER
    ROUTER --> DEP
    DEP --> SERVICE
    SERVICE --> REPO
    ROUTER --> SCHEMA
    SERVICE --> SCHEMA
    REPO --> DB
    SERVICE --> STORAGE
    DEP --> AUTH
```

### Backend Layer Responsibilities

**API Routes**
- Receive HTTP requests
- Parse and validate input
- Apply dependencies
- Return responses
- Must remain thin

**Service Layer**
- Business logic
- Workflow orchestration
- Permission-aware operations
- Transaction boundaries where needed

**Repository/Data Layer**
- Database interaction
- Query abstraction
- No HTTP concerns

**Schemas**
- Request contracts
- Response contracts
- Validation and serialization

## 5. Core Data Architecture

```mermaid
erDiagram
    USERS {
        uuid id PK
        string email
        string role
        datetime created_at
    }

    PROFILES {
        uuid id PK
        uuid user_id FK
        string full_name
        string bio
    }

    OPPORTUNITIES {
        uuid id PK
        uuid created_by FK
        string title
        string status
        datetime deadline
    }

    APPLICATIONS {
        uuid id PK
        uuid user_id FK
        uuid opportunity_id FK
        string status
        datetime submitted_at
    }

    EVENTS {
        uuid id PK
        string title
        datetime event_date
    }

    USERS ||--|| PROFILES : owns
    USERS ||--o{ APPLICATIONS : submits
    USERS ||--o{ OPPORTUNITIES : creates
    OPPORTUNITIES ||--o{ APPLICATIONS : receives
```

Detailed schema definitions belong in implementation/database migrations. This diagram intentionally represents architectural relationships rather than every column.

## 6. Authentication and Request Flow

```mermaid
sequenceDiagram
    participant U as User
    participant FE as Next.js
    participant SA as Supabase Auth
    participant API as FastAPI
    participant DB as PostgreSQL

    U->>FE: Login / Signup
    FE->>SA: Authenticate
    SA-->>FE: Session / Token

    U->>FE: Protected Action
    FE->>API: Request + Auth Token
    API->>SA: Validate Identity
    SA-->>API: User Identity

    API->>API: Authorize Operation
    API->>DB: Execute Business Operation
    DB-->>API: Result
    API-->>FE: Typed Response
    FE-->>U: Updated Interface
```

### Security Rule
Frontend checks improve UX. Backend authorization is the source of truth.

## 7. Frontend Data Flow

```mermaid
flowchart LR
    PAGE[Page / Feature]
    HOOK[Feature Hook]
    QUERY[TanStack Query]
    CACHE{Cache Valid?}
    API[Central API Client]
    BACKEND[FastAPI]
    RESPONSE[Typed Response]
    UI[Render Loading / Empty / Error / Success]

    PAGE --> HOOK
    HOOK --> QUERY
    QUERY --> CACHE
    CACHE -->|Yes| UI
    CACHE -->|No| API
    API --> BACKEND
    BACKEND --> RESPONSE
    RESPONSE --> QUERY
    QUERY --> UI
```

## 8. Deployment Architecture

```mermaid
flowchart TB
    DEV[Developer / AI Agent]
    GH[GitHub Repository]
    CI[Checks: Lint + Typecheck + Tests + Build]

    subgraph DEPLOY["Deployment"]
        VERCEL[Vercel<br/>Next.js Frontend]
        BACKEND[Backend Hosting<br/>FastAPI]
        SUPABASE[Supabase<br/>Auth + PostgreSQL + Storage]
    end

    USER[Users]

    DEV --> GH
    GH --> CI
    CI --> VERCEL
    CI --> BACKEND

    USER --> VERCEL
    VERCEL --> BACKEND
    VERCEL --> SUPABASE
    BACKEND --> SUPABASE
```

## 9. Architectural Rules

1. Next.js App Router is mandatory.
2. TypeScript strict mode is mandatory.
3. Server Components are the default.
4. Client Components are used only when interaction requires them.
5. All API communication goes through a centralized API client.
6. TanStack Query owns server state.
7. Zustand is limited to global client UI state.
8. React Hook Form + Zod handles complex forms and client validation.
9. No direct database access from the frontend.
10. API routes remain thin.
11. Business logic belongs in backend services.
12. Database queries belong behind a data-access boundary.
13. Backend authorization is authoritative.
14. Every async UI handles loading, empty, error and success states.
15. Public 3D is progressive enhancement only.
16. Core workflows must work without WebGL.
17. Feature modules should own feature-specific logic.
18. Shared UI components must not contain domain business logic.
19. Avoid duplicate ownership of the same state.
20. Architecture changes require updating this document.
