# Agent Guidance — Expense Tracker

This document defines how AI agents (Claude, Copilot, etc.) should behave when working in this repository.

---

## Before Making Any Change

1. **Read `claude.md`** — understand layer rules, domain invariants, and style constraints.
2. **Identify the layer** — is this a route, service, model, or schema change?
3. **Check existing tests** — understand expected behavior before changing behavior.
4. **Think about what can break** — a change to `ExpenseService.create` affects every route that calls it.

---

## Task Checklist

When implementing a feature or fix:

- [ ] Does the change respect layer boundaries? (no DB queries in routes)
- [ ] Are domain invariants still enforced? (amount > 0, category exists, etc.)
- [ ] Does the schema validate the input before it reaches the service?
- [ ] Does the service raise a typed exception for resource-not-found cases?
- [ ] Does the route return the correct HTTP status for each error case?
- [ ] Are tests updated or added for the new behavior?
- [ ] Does the README need updating?

---

## What Agents Should Assume

- SQLite is the database — do not assume transactions, triggers, or advanced SQL features
- Flask runs in debug mode locally — errors are visible in terminal
- Frontend communicates with backend via `/api/*` routes only
- No authentication exists — assume single user

---

## Naming Conventions

| Concept           | Python                  | JavaScript              |
|------------------|-------------------------|-------------------------|
| Service method    | `snake_case`            | `camelCase`             |
| Exception class   | `EntityNameNotFound`    | n/a                     |
| Schema            | `entity_action_schema`  | n/a                     |
| API hook          | n/a                     | `useEntityName`         |
| API service fn    | n/a                     | `verbEntityName`        |

---

## Constraints on AI-Generated Code

- Generated code must be **reviewed line by line** — do not ship it without reading it
- Do not accept generated code that skips validation
- Do not accept generated code that catches broad exceptions (`except Exception`)
- If generated code introduces a new dependency, evaluate it — is it necessary?
- Generated tests must actually assert behavior, not just call functions and ignore results

---

## Common Pitfalls to Avoid

- **Circular imports**: Don't import `db` in routes directly — use services
- **Missing rollback**: If a DB operation fails mid-service, SQLAlchemy session may be dirty — use `db.session.rollback()` in error handlers if needed
- **Date string vs date object**: Backend stores `date` as a Python `date` object; marshmallow handles the conversion from ISO string
- **Amount precision**: Always use `Decimal`, never `float`, for money amounts in Python
