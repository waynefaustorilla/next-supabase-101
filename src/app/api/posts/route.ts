import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export const GET = async () => {
  const client = await createClient();

  const posts = await client.from("posts").select();

  return NextResponse.json(posts);
};