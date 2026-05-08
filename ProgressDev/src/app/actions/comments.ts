"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function getComments(projectId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("comments")
    .select("*")
    .eq("project_id", projectId)
    .is("parent_id", null)
    .order("created_at", { ascending: false });

  if (error) return { error: error.message };

  // Fetch replies for each comment
  const commentsWithReplies = await Promise.all(
    (data || []).map(async (comment) => {
      const { data: replies } = await supabase
        .from("comments")
        .select("*")
        .eq("parent_id", comment.id)
        .order("created_at", { ascending: true });

      return { ...comment, replies: replies || [] };
    }),
  );

  return { data: commentsWithReplies };
}

export async function addComment(
  projectId: string,
  authorName: string,
  message: string,
  parentId?: string,
) {
  const supabase = await createClient();

  const { error } = await supabase.from("comments").insert({
    project_id: projectId,
    author_name: authorName,
    message,
    parent_id: parentId || null,
  });

  if (error) return { error: error.message };

  revalidatePath(`/project`);
  return { success: true };
}
