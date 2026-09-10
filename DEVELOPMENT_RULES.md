# ASCENT — Development Rules

## 1. General Rules
- Read all relevant project documentation before implementing a feature.
- Do not invent requirements.
- Prefer existing patterns over introducing new patterns.
- Keep commits focused.
- Do not modify unrelated files.
- Never expose secrets or API keys.

## 2. AI Agent Workflow
Before coding:
1. Read README.md.
2. Read ARCHITECTURE.md.
3. Read TECH_STACK.md.
4. Read DEVELOPMENT_RULES.md.
5. Identify the relevant feature scope.
6. Inspect existing implementation patterns.
7. Create a plan before large changes.

After coding:
1. Run type checks.
2. Run linting.
3. Run relevant tests.
4. Verify loading/error/empty states.
5. Check authorization boundaries.
6. Review changed files for unrelated modifications.

## 3. Frontend Rules
- Use TypeScript strict mode.
- Prefer Server Components.
- Do not fetch server data directly inside random presentational components.
- Server state belongs in TanStack Query.
- Global UI state belongs in Zustand only when truly global.
- Forms use React Hook Form + Zod where complexity warrants it.
- Shareable filters belong in URL state.
- Every async screen needs loading, empty and error handling.
- 3D is restricted to approved public experiences.

## 4. Backend Rules
- Routes are thin.
- Business logic belongs in services.
- Validate API input and output.
- Authorization is enforced server-side.
- Avoid leaking database models directly as API contracts.
- Database access must be isolated from route handlers.
- Use consistent error responses.

## 5. Git Workflow
- Never work directly on `main`.
- Create a branch for each logical task.
- Suggested naming:
  - `feat/...`
  - `fix/...`
  - `docs/...`
  - `refactor/...`
- Keep pull requests focused.
- Do not merge broken builds.

## 6. Definition of Done
A task is complete only when:
- Requirements are implemented.
- Types pass.
- Lint passes.
- Relevant tests pass.
- Error states exist.
- Empty states exist where relevant.
- Authorization is considered.
- Documentation is updated if architecture changed.
