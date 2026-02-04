"use server";

import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export interface DeleteProjectResult {
  success: boolean;
  error?: string;
}

export async function deleteProject(projectId: string): Promise<DeleteProjectResult> {
  if (!projectId) {
    return { success: false, error: "Project ID is required" };
  }

  const session = await getSession();

  if (!session) {
    return { success: false, error: "Unauthorized" };
  }

  const project = await prisma.project.findUnique({
    where: { id: projectId },
    select: { userId: true },
  });

  if (!project) {
    return { success: false, error: "Project not found" };
  }

  if (project.userId !== session.userId) {
    return { success: false, error: "Not authorized to delete this project" };
  }

  await prisma.project.delete({
    where: { id: projectId },
  });

  revalidatePath("/");
  return { success: true };
}
