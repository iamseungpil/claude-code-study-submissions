"use client";

import { useEffect, useState } from "react";
import { Download, Trash2 } from "lucide-react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandShortcut,
} from "@/components/ui/command";
import { useFileSystem } from "@/lib/contexts/file-system-context";
import { downloadFilesAsZip } from "@/lib/utils/download-zip";

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const { reset, getAllFiles } = useFileSystem();

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

  const handleClearAll = () => {
    reset();
    setOpen(false);
  };

  const handleDownload = async () => {
    const files = getAllFiles();
    await downloadFilesAsZip(files);
    setOpen(false);
  };

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Actions">
          <CommandItem onSelect={handleDownload}>
            <Download className="h-4 w-4" />
            <span>Download ZIP</span>
            <CommandShortcut>Export files</CommandShortcut>
          </CommandItem>
          <CommandItem onSelect={handleClearAll}>
            <Trash2 className="h-4 w-4" />
            <span>Clear All</span>
            <CommandShortcut>Delete files</CommandShortcut>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
