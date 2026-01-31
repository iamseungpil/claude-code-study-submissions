# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

E-commerce data utilities project providing query functions for a SQLite database. TypeScript with ES modules (`"type": "module"`).

## Development Commands

```bash
# Install dependencies and initialize Claude hooks
npm run setup

# Run TypeScript files directly
npx tsx <file.ts>

# Type-check
npx tsc --noEmit
```

No test framework is configured.

## Architecture

- `src/main.ts` - Entry point, initializes DB and schema
- `src/schema.ts` - Creates 12 SQLite tables (customers, products, orders, reviews, promotions, inventory, etc.)
- `src/queries/` - All query modules (customer, product, order, analytics, inventory, promotion, review, shipping)

### Query Pattern

All queries use the `sqlite` package's async API with parameterized statements:

```typescript
export async function getCustomerByEmail(db: Database, email: string): Promise<any> {
  return await db.get(`SELECT * FROM customers WHERE email = ?`, [email]);
}
```

- Single record: `db.get()` | Multiple records: `db.all()`
- Always use `?` parameterized queries

## Active Hooks

The project has Claude Code hooks configured in `.claude/settings.json`:

- **Pre-tool (Read):** `hooks/read_hook.js` blocks attempts to read `.env` files (exits with code 2 if file path contains `.env`)
- **Pre-tool (Write/Edit):** `hooks/query_hook.js` (enabled) validates new query functions don't duplicate existing ones by analyzing changes against existing `src/queries/` files using the Claude Agent SDK. Blocks with exit code 2 and feedback if duplication is detected.
- **Post-tool (Write/Edit):** Auto-formats with Prettier, then `hooks/tsc.js` runs TypeScript type checking and blocks on errors, then `hooks/log_hook.js` appends a timestamped entry to `changes.log`

## Critical Guidance

- **All database queries must be written in `./src/queries/`** - never place query logic elsewhere
