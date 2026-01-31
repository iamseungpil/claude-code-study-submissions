# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

E-commerce data utilities project providing query functions for a SQLite database. Uses TypeScript with ES modules (`"type": "module"` in package.json). The entry point `src/main.ts` runs as a daily cron job.

## Development Commands

```bash
npm run setup          # Install dependencies and initialize Claude Code hooks
npx tsc --noEmit       # Type-check without emitting (strict mode enabled)
npm run sdk            # Run the Claude Agent SDK entry point (tsx sdk.ts)
```

No test or lint commands are currently configured.

## Architecture

- `src/main.ts` — Application entry point (daily cron job)
- `src/schema.ts` — SQLite schema definitions for 12 tables (customers, products, orders, inventory, reviews, promotions, etc.)
- `src/queries/` — All database query modules, organized by domain (customer, product, order, analytics, inventory, promotion, review, shipping)

Query functions take a `Database` instance as the first argument, return Promises, and use `db.get()` for single records or `db.all()` for multiple records. Each file defines TypeScript interfaces for its return types.

## Claude Code Hooks

Hooks are configured in `.claude/settings.json` (generated from `.claude/settings.example.json` by `npm run setup`):

- **PreToolUse (Read):** `hooks/read_hook.js` — blocks access to `.env` files (exit 2)
- **PreToolUse (Write/Edit/MultiEdit):** `hooks/query_hook.js` — validates new query functions don't duplicate existing ones (uses Claude Agent SDK)
- **PostToolUse (Write/Edit/MultiEdit):** Auto-formats with Prettier, runs `hooks/tsc.js` for TypeScript type checking (type errors block the change), and runs `hooks/log_hook.js` to log all changes to `changes.log`

## Critical Guidance

- All database queries must be written in `./src/queries/`
- Use parameterized queries (`?` placeholders) — never interpolate values into SQL strings
- Do not duplicate existing query functionality; the query hook will reject duplicates
