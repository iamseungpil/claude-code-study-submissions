"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Plus, LogOut, FolderOpen, ChevronDown, Trash2, Download } from "lucide-react";
import JSZip from "jszip";
import { AuthDialog } from "@/components/auth/AuthDialog";
import { signOut } from "@/actions";
import { useFileSystem } from "@/lib/contexts/file-system-context";
import { CommandPalette } from "@/components/CommandPalette";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { getProjects } from "@/actions/get-projects";
import { createProject } from "@/actions/create-project";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

interface HeaderActionsProps {
  user?: {
    id: string;
    email: string;
  } | null;
  projectId?: string;
}

interface Project {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

export function HeaderActions({ user, projectId }: HeaderActionsProps) {
  const router = useRouter();
  const { reset, getAllFiles } = useFileSystem();
  const [authDialogOpen, setAuthDialogOpen] = useState(false);
  const [showClearDialog, setShowClearDialog] = useState(false);
  const [authMode, setAuthMode] = useState<"signin" | "signup">("signin");
  const [projectsOpen, setProjectsOpen] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [initialLoading, setInitialLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // Load projects initially
  useEffect(() => {
    if (user && projectId) {
      getProjects()
        .then(setProjects)
        .catch(console.error)
        .finally(() => setInitialLoading(false));
    }
  }, [user, projectId]);

  // Refresh projects when popover opens
  useEffect(() => {
    if (user && projectsOpen) {
      getProjects().then(setProjects).catch(console.error);
    }
  }, [projectsOpen, user]);

  const filteredProjects = projects.filter((project) =>
    project.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const currentProject = projects.find((p) => p.id === projectId);

  const handleSignInClick = () => {
    setAuthMode("signin");
    setAuthDialogOpen(true);
  };

  const handleSignUpClick = () => {
    setAuthMode("signup");
    setAuthDialogOpen(true);
  };

  const handleSignOut = async () => {
    await signOut();
  };

  const handleClear = () => {
    reset();
    setShowClearDialog(false);
  };

  const handleDownload = async () => {
    const files = getAllFiles();
    if (files.size === 0) return;
    const zip = new JSZip();
    files.forEach((content, path) => {
      zip.file(path.slice(1), content);
    });
    const blob = await zip.generateAsync({ type: "blob" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "uigen-export.zip";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleNewDesign = async () => {
    const project = await createProject({
      name: `Design #${~~(Math.random() * 100000)}`,
      messages: [],
      data: {},
    });
    router.push(`/${project.id}`);
  };

  if (!user) {
    return (
      <>
        <div className="flex gap-2">
          <Button variant="outline" className="h-8" onClick={handleSignInClick}>
            Sign In
          </Button>
          <Button className="h-8" onClick={handleSignUpClick}>
            Sign Up
          </Button>
        </div>
        <AuthDialog
          open={authDialogOpen}
          onOpenChange={setAuthDialogOpen}
          defaultMode={authMode}
        />
      </>
    );
  }

  return (
    <>
      <div className="flex items-center gap-2">
        {!initialLoading && (
          <Popover open={projectsOpen} onOpenChange={setProjectsOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline" className="h-8 gap-2" role="combobox">
                <FolderOpen className="h-4 w-4" />
                {currentProject ? currentProject.name : "Select Project"}
                <ChevronDown className="h-3 w-3 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[300px] p-0" align="end">
              <Command>
                <CommandInput
                  placeholder="Search projects..."
                  value={searchQuery}
                  onValueChange={setSearchQuery}
                />
                <CommandList>
                  <CommandEmpty>No projects found.</CommandEmpty>
                  <CommandGroup>
                    {filteredProjects.map((project) => (
                      <CommandItem
                        key={project.id}
                        value={project.name}
                        onSelect={() => {
                          router.push(`/${project.id}`);
                          setProjectsOpen(false);
                          setSearchQuery("");
                        }}
                      >
                        <div className="flex flex-col">
                          <span className="font-medium">{project.name}</span>
                        </div>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        )}

        <Button
          variant="outline"
          className="flex items-center gap-2 h-8"
          onClick={handleDownload}
        >
          <Download className="h-4 w-4" />
          Download ZIP
        </Button>

        <Button
          variant="outline"
          className="flex items-center gap-2 h-8"
          onClick={() => setShowClearDialog(true)}
        >
          <Trash2 className="h-4 w-4" />
          Clear All
        </Button>

        <Button className="flex items-center gap-2 h-8" onClick={handleNewDesign}>
          <Plus className="h-4 w-4" />
          New Design
        </Button>

        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={handleSignOut}
          title="Sign out"
        >
          <LogOut className="h-4 w-4" />
        </Button>
      </div>

      <CommandPalette
        onClearAll={() => setShowClearDialog(true)}
        onDownload={handleDownload}
      />

      <Dialog open={showClearDialog} onOpenChange={setShowClearDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Clear All Files</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete all generated files? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowClearDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleClear}>
              Delete All
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
