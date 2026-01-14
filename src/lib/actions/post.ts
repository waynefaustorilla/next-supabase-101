"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/utils/supabase/client";

export type CreatePostState = {
  ok: boolean;
  error?: string;
  ts?: number; // used to detect a completed submit
};

export async function createPost(
  _prev: CreatePostState,
  formData: FormData
): Promise<CreatePostState> {
  const title = String(formData.get("title") ?? "").trim();
  const content = String(formData.get("content") ?? "").trim();
  const image_url = String(formData.get("image_url") ?? "").trim();
  const authorInput = String(formData.get("author") ?? "").trim();

  if (!title) return { ok: false, error: "Title is required.", ts: Date.now() };
  if (title.length > 120)
    return { ok: false, error: "Title is too long (max 120 chars).", ts: Date.now() };

  const supabase = createClient();

  // Optional: if user is logged in, you can auto-fill author (email) unless user typed one
  let inferredAuthor: string | null = null;
  try {
    const { data } = await supabase.auth.getUser();
    inferredAuthor = data.user?.email ?? null;
  } catch {
    // ignore if auth not available
  }

  const { error } = await supabase.from("posts").insert({
    title,
    content: content || null
  });

  if (error) return { ok: false, error: error.message, ts: Date.now() };

  revalidatePath("/");
  return { ok: true, ts: Date.now() };
}