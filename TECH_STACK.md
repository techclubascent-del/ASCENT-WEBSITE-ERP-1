# ASCENT — Technology Stack

## Frontend
| Area | Technology | Responsibility |
|---|---|---|
| Framework | Next.js | Application framework and routing |
| Language | TypeScript | Type safety |
| UI | React | Component system |
| Styling | Tailwind CSS | Styling |
| UI primitives | shadcn/ui | Accessible reusable components |
| Animation | Framer Motion | Motion and transitions |
| Server state | TanStack Query | Fetching, caching and mutations |
| Global UI state | Zustand | Minimal global client state |
| Forms | React Hook Form | Form state |
| Validation | Zod | Schema validation |
| 3D | Three.js + React Three Fiber + Drei | Public-page experiences only |

## Backend
| Area | Technology | Responsibility |
|---|---|---|
| API | FastAPI | Backend HTTP API |
| Language | Python | Backend language |
| Validation | Pydantic | API schemas |
| ORM/Data access | Selected implementation ORM | Database access boundary |
| Authentication | Supabase Auth | Identity and sessions |

## Data
| Area | Technology |
|---|---|
| Database | PostgreSQL via Supabase |
| Authentication | Supabase Auth |
| File Storage | Supabase Storage |

## Infrastructure
| Area | Technology |
|---|---|
| Source Control | Git + GitHub |
| Frontend Deployment | Vercel |
| Backend Deployment | Selected cloud/container host |
| CI | GitHub Actions or platform-native checks |

## AI-Assisted Development Tools
- Cursor / Antigravity or equivalent AI-enabled IDE
- OpenCode where appropriate
- Gemini / available coding models
- GitHub for source control and review
- Figma for design collaboration

Tools may change. Architectural boundaries should not.
