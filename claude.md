# Claude Guidance — Expense Tracker

This file defines the constraints and standards Claude must follow when working on this codebase.

## Project Overview
A personal expense tracker built with Flask + React + SQLite.
**Domain rules are simple and must stay simple.**

---

## Architecture Rules (Do Not Violate)

### Layer Boundaries
- **Routes** → only parse HTTP request/response, call a Service, return JSON.
- **Services** → all business logic lives here. Never import Flask into services.
- **Models** → SQLAlchemy ORM only. No business logic in models.
- **Schemas** → Marshmallow only. Used at the route boundary to validate input and serialize output.

**Never skip layers.** A route must not directly query the DB. A model must not call a service.

### Domain Invariants
- `amount` must always be > 0 and ≤ 9,999,999.99
- `category_id` must reference an existing Category — enforce at service level
- `date` must be a valid ISO date string (YYYY-MM-DD)
- `title` must be non-empty string ≤ 200 chars

### Error Handling
- Services raise typed exceptions (`ExpenseNotFound`, `CategoryNotFound`)
- Routes catch those specific exceptions and return appropriate HTTP status codes (404, 422)
- Never return 500 for expected domain errors
- All error responses must follow: `{"error": "message"}`

---

## Frontend Rules

### State
- Each page fetches its own data via custom hooks (`useExpenses`, `useCategories`)
- No global state store — keep state local to the component that owns it
- Reload data after any mutation (create/update/delete)

### API calls
- All API calls go through `src/services/api.js` — never use `fetch` or `axios` directly in components
- The API service normalizes errors into `Error` objects with `.message`

### Component Rules
- Components receive data as props, they don't fetch directly (hooks do)
- `ExpenseForm` handles both create and edit — differentiated by whether `expense` prop is provided

---

## Testing Rules

### Backend Tests
- Every route must have at least one test for: happy path, invalid input (422), missing resource (404)
- Use pytest fixtures from `conftest.py` — never create a real DB in tests (use SQLite in-memory)
- Tests must NOT depend on execution order

### What to Test
- Input validation (zero/negative amounts, missing fields, invalid category ID)
- CRUD operations round-trip correctly
- Summary endpoint returns correct shape

---

## Code Style

### Python
- Use type hints for service method signatures
- Keep functions small — single responsibility
- Use f-strings, not `.format()`
- No bare `except:` clauses

### JavaScript/React
- Functional components only — no class components
- Custom hooks for data fetching
- Inline styles with CSS variables (no CSS-in-JS libraries, no Tailwind)
- No `console.log` in production code

---

## What Claude Should NOT Do
- Do not add authentication — out of scope for this assessment
- Do not add pagination — keep it simple
- Do not change the database from SQLite without explicit instruction
- Do not introduce new dependencies without explaining the tradeoff
- Do not use `any` types, skip validations, or bypass schemas
- Do not add features not requested — small and correct beats large and messy

---

## When Adding a New Feature
1. Define the domain rule first — what invariants must hold?
2. Add model changes (if needed)
3. Add/update schema validation
4. Add service method with typed exceptions
5. Add route that delegates to service
6. Add tests before calling it done
7. Update README if the API surface changes
