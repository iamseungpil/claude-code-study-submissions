import JSZip from "jszip";
import { toast } from "sonner";

/**
 * Downloads files as a ZIP archive.
 * @param files - Map of file paths to contents
 * @param filename - Name for the downloaded ZIP file (default: "uigen-export.zip")
 * @returns true if download succeeded, false otherwise
 */
export async function downloadFilesAsZip(
  files: Map<string, string>,
  filename: string = "uigen-export.zip"
): Promise<boolean> {
  if (files.size === 0) {
    toast.error("No files to download");
    return false;
  }

  try {
    const zip = new JSZip();

    files.forEach((content, path) => {
      // Remove leading slash from path
      zip.file(path.slice(1), content);
    });

    const blob = await zip.generateAsync({ type: "blob" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);

    toast.success("Files downloaded successfully");
    return true;
  } catch (error) {
    toast.error("Failed to download files");
    return false;
  }
}
