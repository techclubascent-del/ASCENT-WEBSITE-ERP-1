# Contributing to ASCENT

Welcome! This guide is for every member of the Ascent tech club contributing to this project.

## Before You Write Any Code

Read these documents **in order**:

1. `README.md` — project overview and quick-start
2. `ARCHITECTURE.md` — system design and boundaries
3. `TECH_STACK.md` — approved technologies
4. `DEVELOPMENT_RULES.md` — rules for humans and AI agents
5. `DESIGN_SYSTEM.md` — UI principles
6. `FEATURES.md` — what we are and are not building
7. `ROADMAP.md` — phased plan

Do not start coding until you understand the scope of your task.

---

## Branching Strategy

Never commit directly to `main`. Every piece of work lives on its own branch.

```
feat/short-description       # new features
fix/short-description        # bug fixes
docs/short-description       # documentation only
refactor/short-description   # code restructuring, no behaviour change
chore/short-description      # tooling, dependencies, config
```

### Example

```bash
git checkout -b feat/opportunity-listing
```

---

## Commit Messages

Use clear, present-tense messages:

```
feat: add opportunity listing page
fix: correct auth redirect on session expiry
docs: update architecture diagram for admin routes
refactor: extract api client fetch wrapper
```

---

## Pull Requests

- Keep PRs **focused** — one logical change per PR
- Fill in the PR description: what changed, why, and how to test it
- Do not merge broken builds
- Request at least one review before merging

---

## Definition of Done

A task is complete only when **all** of the following are true:

- [ ] Requirements are implemented as specified
- [ ] TypeScript type-check passes (`npm run type-check`)
- [ ] Lint passes (`npm run lint`)
- [ ] Relevant tests pass
- [ ] Loading state is handled
- [ ] Empty state is handled (where relevant)
- [ ] Error state is handled
- [ ] Authorization boundary is considered (back-end enforces, front-end guards UX)
- [ ] Architecture documentation is updated if the architecture changed

---

## Project Structure

```
ascent/
├── frontend/        # Next.js application
├── backend/         # FastAPI application
├── README.md
├── ARCHITECTURE.md
├── TECH_STACK.md
├── DEVELOPMENT_RULES.md
├── DESIGN_SYSTEM.md
├── FEATURES.md
├── ROADMAP.md
└── CONTRIBUTING.md
```

---

## Local Development

See `README.md` for full setup instructions.

**Frontend** runs at `http://localhost:3000`  
**Backend** runs at `http://localhost:8000`  
**API docs** at `http://localhost:8000/docs` (Swagger UI, development only)

---

## Questions

If something is unclear, raise it in the team channel before making architectural decisions on your own.
