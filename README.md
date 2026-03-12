# Expense Tracker

A personal expense tracking application built with Flask, React, and SQLite.

Submitted by **Dharmendra Kumar** for the Associate Software Engineer assessment at **Better Software**.

---

## Quick Start

### Backend

```bash
cd backend
pip install -r requirements.txt
python run.py
# Runs on http://localhost:5000
```

### Frontend

```bash
cd frontend
npm install
npm start
# Runs on http://localhost:3000
```

### Run Tests

```bash
cd backend
pytest tests/ -v
```

---

## What It Does

- Add, edit, and delete expenses with title, amount, date, category, and optional note
- Filter expenses by month, year, and category
- Dashboard with monthly totals, category breakdown (bar + donut chart)
- 8 default categories seeded on first run (Food, Transport, Housing, etc.)
- Input validation on both frontend and backend

---

## Architecture

```
expense-tracker/
├── backend/
│   ├── app/
│   │   ├── __init__.py        # Application factory (create_app)
│   │   ├── database.py        # SQLAlchemy instance
│   │   ├── models/            # ORM models (Expense, Category)
│   │   ├── schemas/           # Marshmallow validation + serialization
│   │   ├── services/          # Business logic (ExpenseService, CategoryService)
│   │   └── routes/            # HTTP layer (Flask Blueprints)
│   ├── tests/                 # pytest test suite
│   └── run.py                 # Entry point
├── frontend/
│   └── src/
│       ├── services/api.js    # Centralized API calls (axios)
│       ├── hooks/             # Data-fetching React hooks
│       ├── components/        # Reusable UI components
│       └── pages/             # Page-level components
├── claude.md                  # AI behavior constraints
└── agents.md                  # AI agent workflow guide
```

---

## Key Technical Decisions

### 1. Layered Architecture (Routes → Services → Models)

Each layer has a single responsibility:
- **Routes** parse HTTP input and return JSON — no business logic
- **Services** enforce domain rules — no Flask imports
- **Models** define the schema — no business logic

**Why:** Changes to business rules (e.g., max expense amount) only touch the service layer. Routes and models don't need to change. This makes the system resilient to change.

### 2. Marshmallow for Input Validation

All incoming data is validated through Marshmallow schemas at the route boundary before reaching the service layer.

**Why:** Prevents invalid data from ever reaching business logic. Validation errors return structured 422 responses. The service layer can trust its inputs.

**Tradeoff:** Adds a schema definition per resource, but this cost pays off immediately when debugging bad requests.

### 3. Typed Exceptions from Services

Services raise `ExpenseNotFound` and `CategoryNotFound` — not generic `Exception`. Routes catch specific types.

**Why:** Makes error handling explicit and predictable. A 404 is always intentional. A 500 always means something unexpected happened.

### 4. Application Factory Pattern (`create_app`)

The Flask app is created via a factory function, not at module level.

**Why:** Enables test isolation — tests can create an app with an in-memory SQLite database without affecting the production database. This is the standard Flask pattern for testable applications.

### 5. SQLite

SQLite was chosen for simplicity — no setup, no server, no credentials.

**Tradeoff:** Not suitable for concurrent multi-user production use. For this assessment scope (single user, local), it's the right call. Migrating to PostgreSQL later requires only changing `SQLALCHEMY_DATABASE_URI`.

### 6. Custom React Hooks

Data fetching is encapsulated in `useExpenses` and `useCategories`. Components don't call the API directly.

**Why:** Separates concerns, makes components easier to test, and avoids duplicated loading/error state logic.

### 7. Centralized API Service (`services/api.js`)

All `axios` calls go through a single module. Errors are normalized to `Error` objects.

**Why:** If the API base URL changes, or error format changes, one file changes — not every component.

---

## API Reference

### Expenses

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/expenses` | List all (supports `?month=`, `?year=`, `?category_id=`) |
| GET | `/api/expenses/:id` | Get single expense |
| POST | `/api/expenses` | Create expense |
| PUT | `/api/expenses/:id` | Update expense |
| DELETE | `/api/expenses/:id` | Delete expense |
| GET | `/api/expenses/summary` | Monthly totals + category breakdown |

### Categories

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/categories` | List all categories |
| POST | `/api/categories` | Create a category |

### Example: Create Expense

```json
POST /api/expenses
{
  "title": "Lunch at office",
  "amount": 180.00,
  "category_id": 1,
  "date": "2025-06-12",
  "note": "With team"
}
```

Response `201`:
```json
{
  "id": 1,
  "title": "Lunch at office",
  "amount": "180.00",
  "date": "2025-06-12",
  "note": "With team",
  "category_id": 1,
  "category": { "id": 1, "name": "Food & Dining", "color": "#ef4444" }
}
```

---

## Validation Rules

| Field | Rule |
|-------|------|
| `amount` | Required, > 0, ≤ 9,999,999.99 |
| `title` | Required, 1–200 characters |
| `category_id` | Required, must exist in DB |
| `date` | ISO date string, defaults to today |
| `note` | Optional, ≤ 1000 characters |
| `color` (category) | Must match `#RRGGBB` format |

---

## Testing

Tests cover:

- Happy path CRUD for expenses and categories
- Input validation: zero amount, negative amount, missing title, invalid category ID
- 404 for non-existent resources
- Summary endpoint shape validation
- Category field validation (color format, missing name)

All tests use an in-memory SQLite database — no test pollution, no shared state.

```bash
pytest tests/ -v
```

---

## AI Usage

AI tools (Claude) were used throughout this project. Here's how and where:

| Area | AI Contribution | Human Review |
|------|----------------|--------------|
| Layer structure | Suggested routes/services/models separation | Verified matches Flask best practices |
| Marshmallow schemas | Generated field definitions | Reviewed field types and custom validators |
| Service layer | Generated CRUD methods | Verified typed exceptions and edge cases |
| React hooks | Generated `useExpenses` pattern | Reviewed dependency array and reload logic |
| Test cases | Generated test structure | Added edge cases (zero amount, negative, invalid FK) |
| `claude.md` | Drafted constraints | Reviewed and tightened rules |

All generated code was read line-by-line before being accepted. Validation logic and exception handling were written and verified manually.

---

## Known Limitations & Tradeoffs

| Limitation | Reason | How to Fix |
|------------|--------|-----------|
| No authentication | Out of scope for assessment | Add Flask-JWT-Extended + user model |
| No pagination | Keeps code simple | Add `?page=&per_page=` query params to list endpoints |
| SQLite only | No server setup needed | Change `SQLALCHEMY_DATABASE_URI` to PostgreSQL |
| No frontend tests | Time constraint | Add React Testing Library + jest for component tests |
| No request logging | Not needed at this scale | Add Flask `before_request` / `after_request` hooks |
| Amount stored as Numeric | Avoids float precision bugs | Already done — safe for money |

---

## Extension Approach

To add a new feature (e.g., recurring expenses):

1. Add a `recurring` boolean and `recurrence_interval` field to the `Expense` model
2. Add fields to `ExpenseCreateSchema` with validation
3. Add a service method `get_recurring()` and a background job to auto-create instances
4. Add a new route `/api/expenses/recurring`
5. Add tests for the new invariants
6. Update `claude.md` with the new domain rule

The layer separation means this change is isolated — existing routes, tests, and frontend code don't break.
