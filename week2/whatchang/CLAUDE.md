# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

This is an e-commerce data utilities project that provides query functions for a SQLite database. The project uses TypeScript with ES2022 modules.

## Development Commands

```bash
# Install dependencies and initialize Claude Code hooks
npm run setup
```

There is no build step for development; use `tsx` to run TypeScript files directly.

## Database Schema

The SQLite database (`ecommerce.db`) contains tables for a complete e-commerce system including:

- customers, addresses, customer_segments, customer_activity_log
- products, categories, inventory, warehouses
- orders, order_items
- reviews
- promotions

See `src/schema.ts` for the complete schema. The `createSchema()` function is called from `src/main.ts`.

## Architecture

- `src/main.ts` - Entry point. Opens the SQLite database and creates the schema.
- `src/schema.ts` - Database schema creation (all `CREATE TABLE IF NOT EXISTS` statements).
- `src/queries/` - All database query modules, organized by domain (customers, products, orders, analytics, inventory, promotions, reviews, shipping).

## Query Conventions

All query functions use the `sqlite` wrapper library (promise-based), not raw `sqlite3` callbacks. Functions are `async` and use `db.get()` for single records or `db.all()` for multiple records with parameterized queries (`?` placeholders).

```typescript
import { Database } from "sqlite";

export async function getCustomerByEmail(
  db: Database,
  email: string,
): Promise<any> {
  const query = `SELECT * FROM customers WHERE email = ?`;
  return await db.get(query, [email]);
}
```

## Hooks

Claude Code hooks are configured in `.claude/settings.json` and run automatically:

- **PreToolUse** (Write/Edit): `hooks/query_hook.js` - Uses the Claude Agent SDK to detect duplicate query functionality across `src/queries/`. Will block edits that duplicate existing queries (currently disabled via early exit).
- **PostToolUse** (Write/Edit): Prettier auto-formatting, then `hooks/tsc.js` - Runs the TypeScript compiler in type-check-only mode. Blocks on type errors (exit code 2).

## Critical Guidance

- All database queries must be written in `./src/queries/` directory
- Avoid adding query functions that duplicate existing functionality in the query modules
