# CLAUDE.md - Project Intelligence

## Architecture
- Next.js app with FileSystemProvider context for in-memory file management
- `useFileSystem()` hook provides: `getAllFiles()`, `reset()`, `selectedFile`, `setSelectedFile`, etc.
- `getAllFiles()` returns `Map<string, string>` where keys are paths with leading `/` (e.g., `/App.jsx`)
- `reset()` clears all files, selectedFile, and triggers a refresh

## UI Patterns
- Dialog components use Radix UI (`Dialog`, `DialogContent`, `DialogHeader`, etc.)
- CommandDialog from cmdk library wraps Radix Dialog with command palette functionality
- Buttons follow `h-8` height pattern with `gap-2` for icon+text layout
- Icons from lucide-react, typically `h-4 w-4`

## Keyboard Shortcuts
- `Cmd/Ctrl+K` opens the command palette
- Use `e.metaKey` for Mac, `e.ctrlKey` for Windows/Linux

## Key Files
- `src/lib/contexts/file-system-context.tsx` — FileSystem context provider and hook
- `src/components/HeaderActions.tsx` — Header buttons (Clear All, Download ZIP, New Design, etc.)
- `src/components/CommandPalette.tsx` — Command palette with keyboard shortcut support
- `src/components/ui/command.tsx` — Command UI primitives (from cmdk)
