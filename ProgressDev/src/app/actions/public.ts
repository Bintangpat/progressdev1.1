"use server";

import { createClient } from "@/lib/supabase/server";

export async function getPublicProject(slug: string) {
  const supabase = await createClient();

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
    .eq("public_slug", slug)
    .order("order_index", { referencedTable: "tasks", ascending: true })
    .single();

  if (error) return { error: error.message };
  return { data };
}
