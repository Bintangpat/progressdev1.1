"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import type { TaskStatus } from "@/lib/types/database";

export async function createTask(projectId: string, formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Unauthorized" };

  // Get current max order_index
  const { data: tasks } = await supabase
    .from("tasks")
    .select("order_index")
    .eq("project_id", projectId)
    .order("order_index", { ascending: false })
    .limit(1);

  const nextOrder = tasks && tasks.length > 0 ? tasks[0].order_index + 1 : 0;

  const { data, error } = await supabase
    .from("tasks")
    .insert({
      project_id: projectId,
      title: formData.get("title") as string,
      description: (formData.get("description") as string) || null,
      order_index: nextOrder,
      status: "direncanakan" as TaskStatus,
    })
    .select()
    .single();

  if (error) return { error: error.message };

  // Create checklist items if provided
  const checklistLabels = formData.getAll("checklist");
  if (checklistLabels.length > 0) {
    const items = checklistLabels
      .filter((label) => (label as string).trim() !== "")
      .map((label) => ({
        task_id: data.id,
        label: label as string,
      }));

    if (items.length > 0) {
      await supabase.from("checklist_items").insert(items);
    }
  }

  revalidatePath(`/dashboard/project/${projectId}`);
  return { success: true };
}

export async function updateTask(
  taskId: string,
  projectId: string,
  formData: FormData,
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Unauthorized" };

  const { error } = await supabase
    .from("tasks")
    .update({
      title: formData.get("title") as string,
      description: (formData.get("description") as string) || null,
    })
    .eq("id", taskId);

  if (error) return { error: error.message };

  revalidatePath(`/dashboard/project/${projectId}`);
  return { success: true };
}

export async function deleteTask(taskId: string, projectId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Unauthorized" };

  const { error } = await supabase.from("tasks").delete().eq("id", taskId);

  if (error) return { error: error.message };

  revalidatePath(`/dashboard/project/${projectId}`);
  return { success: true };
}

export async function updateTaskStatus(
  taskId: string,
  status: TaskStatus,
  projectId: string,
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Unauthorized" };

  const isCompleted = status === "selesai";

  const { error } = await supabase
    .from("tasks")
    .update({ status, is_completed: isCompleted })
    .eq("id", taskId);

  if (error) return { error: error.message };

  // Auto-compute project completion
  const { data: allTasks } = await supabase
    .from("tasks")
    .select("is_completed")
    .eq("project_id", projectId);

  if (allTasks) {
    const allTasksCompleted = allTasks.every((t) => t.is_completed);
    await supabase
      .from("projects")
      .update({
        status: allTasksCompleted ? "completed" : "active",
      })
      .eq("id", projectId);
  }

  revalidatePath(`/dashboard/project/${projectId}`);
  return { success: true };
}

export async function toggleChecklistItem(
  itemId: string,
  isChecked: boolean,
  projectId: string,
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Unauthorized" };

  // Update checklist item status dengan isChecked sebagai variabel boleean di kode ini untuk ref ke is_checked di database
  const { error } = await supabase
    .from("checklist_items")
    .update({ is_checked: isChecked })
    .eq("id", itemId);

  if (error) return { error: error.message };

  const { data: item } = await supabase
    .from("checklist_items")
    .select("task_id")
    .eq("id", itemId)
    .single();

  if (item) {
    const { data: allItems } = await supabase
      .from("checklist_items")
      .select("is_checked")
      .eq("task_id", item.task_id);

    if (allItems) {
      const allChecked = allItems.every((i) => i.is_checked);

      if (allChecked) {
        // All checklist items done → mark task as completed
        await supabase
          .from("tasks")
          .update({ is_completed: true, status: "selesai" })
          .eq("id", item.task_id);
      } else {
        // Not all done → only revert if task was previously "selesai"
        const { data: currentTask } = await supabase
          .from("tasks")
          .select("status")
          .eq("id", item.task_id)
          .single();

        if (currentTask?.status === "selesai") {
          await supabase
            .from("tasks")
            .update({ is_completed: false, status: "dalam_pengerjaan" })
            .eq("id", item.task_id);
        }
      }

      // Auto-compute project completion
      const { data: task } = await supabase
        .from("tasks")
        .select("project_id")
        .eq("id", item.task_id)
        .single();

      if (task) {
        const { data: allTasks } = await supabase
          .from("tasks")
          .select("is_completed")
          .eq("project_id", task.project_id);

        if (allTasks) {
          const allTasksCompleted = allTasks.every((t) => t.is_completed);
          await supabase
            .from("projects")
            .update({
              status: allTasksCompleted ? "completed" : "active",
            })
            .eq("id", task.project_id);
        }
      }
    }
  }

  revalidatePath(`/dashboard/project/${projectId}`);
  return { success: true };
}

export async function addChecklistItem(
  taskId: string,
  label: string,
  projectId: string,
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Unauthorized" };

  const { error } = await supabase.from("checklist_items").insert({
    task_id: taskId,
    label,
  });

  if (error) return { error: error.message };

  // Mark task as not completed since new unchecked item added
  await supabase.from("tasks").update({ is_completed: false }).eq("id", taskId);

  revalidatePath(`/dashboard/project/${projectId}`);
  return { success: true };
}

export async function deleteChecklistItem(itemId: string, projectId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Unauthorized" };

  const { error } = await supabase
    .from("checklist_items")
    .delete()
    .eq("id", itemId);

  if (error) return { error: error.message };

  revalidatePath(`/dashboard/project/${projectId}`);
  return { success: true };
}

export async function uploadScreenshot(
  taskId: string,
  projectId: string,
  formData: FormData,
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Unauthorized" };

  const file = formData.get("file") as File;
  if (!file) return { error: "No file provided" };

  const fileExt = file.name.split(".").pop();
  const fileName = `${user.id}/${projectId}/${taskId}/${Date.now()}.${fileExt}`;

  const { error: uploadError } = await supabase.storage
    .from("screenshots")
    .upload(fileName, file);

  if (uploadError) return { error: uploadError.message };

  const {
    data: { publicUrl },
  } = supabase.storage.from("screenshots").getPublicUrl(fileName);

  const { error: insertError } = await supabase
    .from("task_screenshots")
    .insert({
      task_id: taskId,
      image_url: publicUrl,
    });

  if (insertError) return { error: insertError.message };

  revalidatePath(`/dashboard/project/${projectId}`);
  return { success: true };
}

export async function deleteScreenshot(
  screenshotId: string,
  imageUrl: string,
  projectId: string,
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Unauthorized" };

  // Extract file path from URL
  const urlParts = imageUrl.split("/storage/v1/object/public/screenshots/");
  if (urlParts[1]) {
    await supabase.storage.from("screenshots").remove([urlParts[1]]);
  }

  const { error } = await supabase
    .from("task_screenshots")
    .delete()
    .eq("id", screenshotId);

  if (error) return { error: error.message };

  revalidatePath(`/dashboard/project/${projectId}`);
  return { success: true };
}
