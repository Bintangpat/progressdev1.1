"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import type { ProjectStatus } from "@/lib/types/database";

export async function getProjects() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "Unauthorized" };

  const { data, error } = await supabase
    .from("projects")
    .select(
      `
      *,
      tasks (
        id,
        is_completed,
        checklist_items (
          id,
          is_checked
        )
      )
    `,
    )
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) return { error: error.message };
  return { data };
}

export async function getProject(id: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "Unauthorized" };

  const { data, error } = await supabase
    .from("projects")
    .select(
      `
      *,
      tasks (
        *,
        checklist_items (*),
        task_screenshots (*)
      )
    `,
    )
    .eq("id", id)
    .eq("user_id", user.id)
    .order("order_index", { referencedTable: "tasks", ascending: true })
    .single();

  if (error) return { error: error.message };
  return { data };
}

export async function createProject(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "Unauthorized" };

  // Ensure profile exists (handles users created before DB trigger was installed)
  await supabase
    .from("profiles")
    .upsert({ id: user.id, email: user.email! }, { onConflict: "id" });

  const { error } = await supabase.from("projects").insert({
    user_id: user.id,
    stakeholder_name: formData.get("stakeholder_name") as string,
    platform_name: formData.get("platform_name") as string,
    duration_start: formData.get("duration_start") as string,
    duration_end: formData.get("duration_end") as string,
    developer_whatsapp: formData.get("developer_whatsapp") as string,
    status: "active" as ProjectStatus,
  });

  if (error) return { error: error.message };

  revalidatePath("/dashboard");
  return { success: true };
}

export async function updateProject(id: string, formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "Unauthorized" };

  const { error } = await supabase
    .from("projects")
    .update({
      stakeholder_name: formData.get("stakeholder_name") as string,
      platform_name: formData.get("platform_name") as string,
      duration_start: formData.get("duration_start") as string,
      duration_end: formData.get("duration_end") as string,
      developer_whatsapp: formData.get("developer_whatsapp") as string,
      status: formData.get("status") as ProjectStatus,
    })
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) return { error: error.message };

  revalidatePath("/dashboard");
  return { success: true };
}

export async function deleteProject(id: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "Unauthorized" };

  const { error } = await supabase
    .from("projects")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) return { error: error.message };

  revalidatePath("/dashboard");
  return { success: true };
}
