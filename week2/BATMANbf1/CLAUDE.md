# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

E-commerce data utilities project providing query functions for a SQLite database. TypeScript with ES modules (`"type": "module"`).

## Development Commands

```bash
# Install dependencies and initialize Claude settings
npm run setup

# Run the main entry point
npx tsx src/main.ts

# Type-check without emitting
npx tsc --noEmit
```

No test framework is configured.

## Architecture

- `src/main.ts` - Entry point: opens SQLite DB (`ecommerce.db`) and initializes schema via `createSchema(db)`. Runs as a daily cron job.
- `src/schema.ts` - Creates all 12 tables (customers, addresses, customer_segments, customer_activity_log, products, categories, inventory, warehouses, orders, order_items, reviews, promotions)
- `src/queries/` - All query modules organized by domain (customer, product, order, analytics, inventory, promotion, review, shipping)

## Query Patterns

All query functions take `db: Database` (from the `sqlite` package) as the first parameter and return Promises. Use `db.get()` for single records and `db.all()` for multiple records. Always use parameterized queries (`?` placeholders).

```typescript
export async function getCustomerByEmail(db: Database, email: string): Promise<any> {
  return await db.get(`SELECT * FROM customers WHERE email = ?`, [email]);
}
```

Complex queries use CTEs, window functions (`ROW_NUMBER`, `PARTITION BY`), `CASE` statements, and date functions (`julianday`, `datetime`).

## Hooks

Claude hooks are configured in `.claude/settings.json`:

- **PreToolUse (Write/Edit)**: `hooks/query_hook.js` detects duplicate query functions using Claude agent SDK. `hooks/log_hook.js` logs changes.
- **PreToolUse (Read)**: `hooks/read_hook.js` blocks reading `.env` files.
- **PostToolUse (Write/Edit)**: Prettier formatting and TypeScript type checking (`hooks/tsc.js`) run after file modifications.

## Critical Guidance

- All database queries must be written in `./src/queries/` directory
- Do not read or expose the `.env` file — it contains secrets and the read hook will block access
