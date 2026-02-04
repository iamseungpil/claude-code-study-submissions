# AGENTS.md

This file contains instructions for AI agents (like Claude, Cursor, Windsurf, etc.) operating in this repository.
Follow these guidelines strictly to maintain codebase consistency and quality.

## 1. Project Overview

This is a TypeScript-based e-commerce data utility project using SQLite.
The core functionality resides in `src/queries/`, providing raw SQL access to the database.
There is NO ORM; we write raw, parameterized SQL queries using the `sqlite` driver.

## 2. Environment & Commands

### Setup
```bash
npm run setup
```
This installs dependencies and runs the initialization script.

### Running Code
The project uses `tsx` for execution.
```bash
# Run the entry point (SDK usage example)
npm run sdk
# OR directly
npx tsx src/main.ts
```

### Building
```bash
# Type-check and compile to dist/
npx tsc
```

### Testing
**Current State**: There is no automated test runner (Jest/Mocha) configured.
- **Action for Agents**: When asked to "test" functionality, create a standalone script in a temporary file (e.g., `test_query.ts`) that imports the function and logs the output.
- **Execution**: Run your test script using `npx tsx test_query.ts`.
- **Do NOT** try to run `npm test` as it will fail.

### Linting & Formatting
- **Indent**: 2 spaces.
- **Quotes**: Double quotes `"` for strings/imports, Backticks `` ` `` for SQL.
- **Semicolons**: Always use semicolons.
- **Strict Mode**: `strict: true` is enabled in `tsconfig.json`.

## 3. Code Style Guidelines

### A. TypeScript & Types
- **Explicit Returns**: Always define return types for functions.
  ```typescript
  // GOOD
  export async function getUser(id: number): Promise<User | null> { ... }
  ```
- **Interfaces**: Define interfaces for DB row results when possible (e.g., `Address`). Use `any` only for complex joins where strict typing is excessive overhead.
- **No `ts-ignore`**: Fix the types; do not suppress them.

### B. Naming Conventions
- **Files**: `snake_case` (e.g., `customer_queries.ts`).
- **Functions**: `camelCase` (e.g., `getCustomerOrderHistory`).
- **Variables**: `camelCase`.
- **Database Columns**: `snake_case` (matches DB schema).

### C. Database Interactions (CRITICAL)
- **Library**: Uses `sqlite` (wrapper) and `sqlite3`.
- **Pattern**:
  - `db.get(sql, params)` for single rows.
  - `db.all(sql, params)` for lists.
  - `db.run(sql, params)` for inserts/updates.
- **Security**: **ALWAYS** use parameterized queries (`?`). NEVER concatenate strings.
  ```typescript
  // CORRECT
  const query = "SELECT * FROM users WHERE id = ?";
  await db.get(query, [userId]);

  // INCORRECT - SECURITY RISK
  const query = `SELECT * FROM users WHERE id = ${userId}`;
  ```
- **SQL Formatting**: Use multi-line backticks for readability.
  ```typescript
  const query = `
    SELECT *
    FROM table
    WHERE condition = ?
  `;
  ```

### D. Imports
- Use named imports.
- `import { Database } from "sqlite";` is the standard DB type import.

### E. Error Handling
- Queries return Promises.
- Allow errors to propagate (reject) unless specific handling is requested.
- `db.get` returning `undefined` should be handled (return `null` or throw depending on logic).

## 4. Architecture & Structure

### Directory Map
- `src/queries/`: **ALL** database query logic goes here. Group by domain (e.g., `product_queries.ts`, `order_queries.ts`).
- `src/schema.ts`: Database schema definitions.
- `src/main.ts`: Application entry point.

### Adding New Features
1. **Analyze**: Check `src/schema.ts` to understand tables and relationships.
2. **Locate**: Find the appropriate `*_queries.ts` file or create a new one if the domain is new.
3. **Implement**: Write the async function exporting the query.
4. **Verify**: Create a small manual test script to verify the SQL syntax and result shape.

## 5. Common Patterns

### Joining Tables
Prefer explicit `INNER JOIN` or `LEFT JOIN`.
Always alias tables for clarity (e.g., `FROM customers c`).

```typescript
export async function getOrderDetails(db: Database, orderId: number): Promise<any> {
  const query = `
    SELECT o.*, c.email
    FROM orders o
    JOIN customers c ON o.customer_id = c.customer_id
    WHERE o.order_id = ?
  `;
  return await db.get(query, [orderId]);
}
```

### Dynamic Queries
If you need optional filters, build the `WHERE` clause dynamically but keep using parameters.
Start with `1=1` to make appending conditions easier.

```typescript
const params: any[] = [];
let sql = `
  SELECT * FROM items 
  WHERE 1=1
`;

if (filter) {
  sql += " AND type = ?";
  params.push(filter);
}

return await db.all(sql, params);
```

## 6. AI Agent Behavior Rules

- **Context First**: Before writing a query, read `src/schema.ts` to ensure column names are correct.
- **Proactive Fixes**: If you see a raw string interpolation in SQL, fix it to use parameters immediately.
- **Output**: When asked to generate code, provide the full function including imports.
- **Verification**: Since there are no CI tests, double-check your SQL syntax.
