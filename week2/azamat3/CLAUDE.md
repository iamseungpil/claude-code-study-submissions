# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

This is an e-commerce data utilities project that provides query functions for a SQLite database. The project uses TypeScript.

## Database Schema

The SQLite database contains tables for a complete e-commerce system including:

- customers, addresses, customer_segments, customer_activity_log
- products, categories, inventory, warehouses
- orders, order_items
- reviews
- promotions

See `schema.ts` for the complete database schema definition.

## Project Structure

- `src/main.ts` - Entry point (currently minimal implementation)
- `src/schema.ts` - Database schema creation functions
- `src/queries/` - Directory containing all query modules:
  - `customer_queries.ts` - Customer-related queries
  - `product_queries.ts` - Product catalog queries
  - `order_queries.ts` - Order management queries
  - `analytics_queries.ts` - Analytics and reporting queries
  - `inventory_queries.ts` - Inventory management queries
  - `promotion_queries.ts` - Promotion queries
  - `review_queries.ts` - Product review queries
  - `shipping_queries.ts` - Shipping queries

## Development Commands

```bash
# Install dependencies
npm run setup
```

## Working with Queries

All query functions return Promises and follow these patterns:

- Single record queries use `db.get()`
- Multiple record queries use `db.all()`
- Use parameterized queries to prevent SQL injection
- Handle errors by rejecting the Promise

Example query pattern:

```typescript
export function getCustomerByEmail(db: Database, email: string): Promise<any> {
  const query = `SELECT * FROM customers WHERE email = ?`;
  return new Promise((resolve, reject) => {
    db.get(query, [email], (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
}
```

## Critical Guidance

- Critical: All database queries must be written in the ./src/queries dir

## Hook System Configuration

This repository uses Claude Code hooks to enforce quality, security, and logging. 

### Active Hooks

| Hook | Type | Trigger | Purpose |
|------|------|---------|---------|
| `hooks/query_hook.js` | **Pre** | Write/Edit | **Duplicate Prevention**: Analyzes new queries in `src/queries` using Claude SDK. Blocks duplication with exit code 2. |
| `hooks/tsc.js` | **Post** | Write/Edit | **Type Checking**: Runs `tsc` after changes. Fails the tool if compilation errors occur. |
| `hooks/log_hook.js` | **Post** | Write/Edit | **Audit Logging**: Appends timestamped entries to `changes.log` for every modification. |
| `prettier` (cmd) | **Post** | Write/Edit | **Formatting**: Auto-formats modified files using Prettier. |
| `jq` (logging) | **Pre/Post**| * (All) | **Debug Logging**: Dumps raw tool input/output to `pre-log.json` and `post-log.json`. |

### Hook Development Standards

When modifying hooks in `hooks/`:

1.  **Input Handling**:
    -   Read full JSON from `stdin` (buffered).
    -   Parse `tool_input` carefully (check `filePath`, `file_path`, `path`).

2.  **Exit Codes**:
    -   `exit(0)`: **Allow** / Success.
    -   `exit(1)`: **Error** (Hook failed to run).
    -   `exit(2)`: **Block** (Policy violation, e.g., "Cannot read .env").

3.  **Output**:
    -   `stdout` is ignored unless blocking.
    -   `stderr` is shown to the user on block/failure.

### Example: Blocking Hook

```javascript
// hooks/block_env.js
async function main() {
  // ... read input ...
  if (input.file_path.includes('.env')) {
    console.error("Blocked: Access to .env is forbidden");
    process.exit(2); // BLOCK
  }
  process.exit(0); // ALLOW
}
```
