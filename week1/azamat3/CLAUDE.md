# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

UIGen is an AI-powered React component generator with live preview. Users describe components in a chat interface, Claude generates the code, and a virtual file system stores the results with real-time preview in an iframe.

## Development Commands

```bash
npm run dev          # Development server with Turbopack (localhost:3000)
npm run build        # Production build
npm run lint         # ESLint check
npm run test         # Run all Vitest tests
npm run setup        # Install deps, generate Prisma client, run migrations
npm run db:reset     # Reset database (destructive)
```

To run a single test file:
```bash
npx vitest run src/components/chat/__tests__/MessageList.test.tsx
```

## Architecture

### Tech Stack
- Next.js 15 (App Router) with React 19 and TypeScript
- Tailwind CSS v4 with Shadcn/ui components
- Anthropic Claude via Vercel AI SDK (`@ai-sdk/anthropic`)
- SQLite with Prisma ORM (output to `src/generated/prisma`)
- Monaco Editor for code editing
- Babel standalone for browser-side JSX transpilation

### Key Directories
- `src/actions/` - Server actions for auth (signUp, signIn, signOut) and project CRUD
- `src/app/api/chat/route.ts` - AI chat endpoint with streaming and tool calling
- `src/lib/file-system.ts` - Virtual in-memory file system class
- `src/lib/contexts/` - React contexts for chat state and file system
- `src/lib/tools/` - AI tools (str_replace_editor, file_manager) for file manipulation
- `src/lib/transform/jsx-transformer.ts` - Babel JSX-to-JS transpilation for preview
- `src/lib/prompts/generation.tsx` - System prompt for Claude component generation

### AI Integration
The chat endpoint (`/api/chat`) uses `streamText()` with tool calling. Two tools are exposed:
- `str_replace_editor`: Create/modify file contents
- `file_manager`: Manage file structure (create, delete, rename)

Provider selection in `src/lib/provider.ts`:
- Uses Claude (claude-haiku-4-5) when ANTHROPIC_API_KEY is set
- Falls back to MockLanguageModel for testing without API key

### UI Layout
Three-panel resizable layout in `src/app/main-content.tsx`:
- Left panel: Chat interface
- Right panel: Tabbed Code/Preview views (Monaco editor + live iframe preview)

### Database
SQLite database at `prisma/dev.db` with two models:
- **User**: email, hashed password, projects relation
- **Project**: name, messages (JSON), data (serialized file system), optional user relation

### Authentication
JWT-based sessions (7-day expiration) stored in HTTP-only cookies. Middleware protects `/api/projects` and `/api/filesystem` routes.

## Environment Variables

- `ANTHROPIC_API_KEY` - Required for real AI generation; without it, mock provider is used
- `JWT_SECRET` - Optional (defaults to development secret)

## Component Generation Flow

1. User describes component in chat
2. Request sent to `/api/chat` with streaming response
3. Claude generates code using file tools
4. Virtual file system updated in real-time via context
5. Babel transforms JSX to JS in browser
6. Preview iframe reloads with blob URL of transpiled code
7. Project state saved to database on completion (authenticated users only)


## Implementation Notes

### Context Patterns
- FileSystemProvider must wrap components using useFileSystem()
- reset() clears files + selectedFile + triggers refresh

### UI Components
- Dialog uses Radix UI, import from @/components/ui/dialog
- DialogContent contains all modal content

### File System API
- getAllFiles() returns Map<string, string>
- Paths have leading slash, remove with path.slice(1)

### Keyboard Events
- Always cleanup listeners in useEffect return
- Check e.metaKey (Mac) OR e.ctrlKey (Windows) for cross-platform shortcuts

# Project Instructions for Claude Code

## Core Principles
1. **Memory-Driven:** You must read this file at the start of every session.
2. **Self-Correction:** When you fix a bug or learn a project pattern, you MUST update the "Learned Patterns" section below using your file editing tools.
3. **No Repeats:** Before writing code, check the "Learned Patterns" to ensure you aren't repeating a past mistake.

## Learned Patterns

### ZIP Export Feature
- Use `jszip` package for creating ZIP archives in browser
- Get files from FileSystem context: `const { getAllFiles } = useFileSystem()`
- `getAllFiles()` returns `Map<string, string>` where keys are paths like `/src/App.tsx`
- Remove leading slash with `path.slice(1)` when adding to ZIP
- Download pattern:
  ```typescript
  const blob = await zip.generateAsync({ type: "blob" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "filename.zip";
  a.click();
  ```

### Command Palette (Cmd/Ctrl+K)
- Use existing `CommandDialog` from `@/components/ui/command` (based on cmdk library)
- Keyboard shortcut pattern:
  ```typescript
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);
  ```
- CommandDialog handles ESC to close automatically (built into cmdk)
- Place CommandPalette inside FileSystemProvider to access context
- Use `CommandItem onSelect={handler}` for command actions
- Close palette after action: `setOpen(false)` in handler

### Context Menu (Right-Click)
- Use `@radix-ui/react-context-menu` package
- Shadcn/ui component at `@/components/ui/context-menu`
- Pattern for wrapping items:
  ```tsx
  <ContextMenu>
    <ContextMenuTrigger asChild>
      <div onClick={handleClick}>...</div>
    </ContextMenuTrigger>
    <ContextMenuContent>
      <ContextMenuItem onClick={handler}>
        <Icon className="mr-2 h-4 w-4" />
        Action Label
      </ContextMenuItem>
    </ContextMenuContent>
  </ContextMenu>
  ```
- Use `asChild` on ContextMenuTrigger to avoid extra DOM wrapper
- Destructive actions: add `className="text-red-600 focus:text-red-600 focus:bg-red-50"`
- Menu closes automatically after item click

### Server Actions (Delete Pattern)
- Create server actions in `src/actions/` with `"use server"` directive
- Return `{ success: boolean; error?: string }` for consistent error handling
- Always validate: check session, verify ownership before mutations
- Use `revalidatePath("/")` after data mutations
- Pattern for delete:
  ```typescript
  export async function deleteProject(projectId: string): Promise<DeleteResult> {
    if (!projectId) return { success: false, error: "ID required" };
    const session = await getSession();
    if (!session) return { success: false, error: "Unauthorized" };
    // Verify ownership before delete
    const item = await prisma.project.findUnique({ where: { id: projectId } });
    if (item?.userId !== session.userId) return { success: false, error: "Forbidden" };
    await prisma.project.delete({ where: { id: projectId } });
    revalidatePath("/");
    return { success: true };
  }
  ```

### Context Menu with Command Items
- Context menus work with cmdk CommandItem using `asChild` on trigger
- Use `e.stopPropagation()` in onClick to prevent CommandItem selection
- Update local state after successful delete: `setItems(prev => prev.filter(...))`
- Navigate away if deleting currently viewed item: `router.push("/")`

---

# Production-Ready Coding Standards

## 1. The "Definition of Done" Protocol
A task is NOT complete until it passes the **2-Step Verification**:
1.  **Code Quality:** Implementation is clean, modular, and strictly typed
3.  **Documentation:** Docstrings updated. README updated if architecture changes

## 2. AI & Memory Behavior (Self-Correction)
* **Context First:** Before writing code, READ the "Learned Patterns" section to avoid repeating past mistakes
* **Memory Updates:** When solving a difficult error or making an architectural decision, append a summary to "Learned Patterns"
    * *Format:* `[Category] Description of what was learned/fixed.`
* **Stop & Ask:** If a request is ambiguous, do NOT guess. Ask for error logs, file paths, or reproduction steps

## 3. Architecture & Style Guidelines
* **Guard Clauses:** Avoid deep nesting. Use "Early Returns" to keep logic flat
    * *Bad:* `if (valid) { ... }`
    * *Good:* `if (!valid) return; ...`
* **Error Handling:** Never use bare `try/catch`. Always catch specific exceptions and log with context
* **Dependencies:** If you add a library, immediately update the lock file

---

# Additional Learned Patterns

- [Initial] Project enforces "Production-Ready" standards
- [Testing] Tests are optional but runnable via `npm run test`
- [Delete] Always verify ownership before delete operations
- [Context Menu] Works inside Command components with `asChild` and `stopPropagation`