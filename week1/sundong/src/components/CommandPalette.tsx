"use client";

import { useEffect, useState } from "react";
import { Trash2, Download } from "lucide-react";
import {
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command";

interface CommandPaletteProps {
  onClearAll: () => void;
  onDownload: () => void;
}

export function CommandPalette({ onClearAll, onDownload }: CommandPaletteProps) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Type a command..." />
      <CommandList>
        <CommandEmpty>No commands found.</CommandEmpty>
        <CommandGroup heading="Actions">
          <CommandItem
            onSelect={() => {
              setOpen(false);
              onClearAll();
            }}
          >
            <Trash2 className="h-4 w-4" />
            Clear All Files
          </CommandItem>
          <CommandItem
            onSelect={() => {
              setOpen(false);
              onDownload();
            }}
          >
            <Download className="h-4 w-4" />
            Download as ZIP
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
