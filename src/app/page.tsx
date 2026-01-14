import Image from "next/image";
import { createClient } from "@/utils/supabase/client";
import { Separator } from "@/components/ui/separator";
import { Card, CardHeader, CardContent, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import NewPostDialog from "@/components/features/posts/create-posts-modal";

type Post = {
  id: string;
  title: string;
  content: string | null;
  created_at: string | null;
  image_url: string | null;
  author: string | null;
};

export default async function Home() {
  const supabase = createClient();
  const { data: posts = [], error } = await supabase
    .from("posts")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-5xl px-6 py-10">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight">Posts</h1>
            <p className="text-sm text-muted-foreground">
              A simple feed UI using ShadCN + Tailwind.
            </p>
          </div>

          {/* ✅ Add Post UI */}
          <NewPostDialog />
        </div>

        <Separator className="my-6" />

        {posts.length === 0 ? (
          <Card>
            <CardHeader>
              <CardTitle>No posts yet</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Add your first post and it will show up here.
            </CardContent>
          </Card>
        ) : (
          <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post: Post) => (
              <Card key={post.id} className="overflow-hidden">
                {post.image_url ? (
                  <div className="relative aspect-[16/9] w-full">
                    <Image
                      src={post.image_url}
                      alt={post.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 1024px) 100vw, 33vw"
                    />
                  </div>
                ) : (
                  <div className="aspect-[16/9] w-full bg-muted" />
                )}

                <CardHeader className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <Badge variant="secondary" className="truncate">
                      {post.author ?? "Anonymous"}
                    </Badge>

                    {post.created_at ? (
                      <span className="text-xs text-muted-foreground">
                        {new Date(post.created_at).toLocaleDateString()}
                      </span>
                    ) : null}
                  </div>

                  <CardTitle className="line-clamp-2">{post.title}</CardTitle>
                </CardHeader>

                <CardContent>
                  <p className="line-clamp-3 text-sm text-muted-foreground">
                    {post.content ?? "No content."}
                  </p>
                </CardContent>

                <CardFooter className="flex items-center justify-between">
                  <Button variant="ghost" className="px-0">
                    Read more →
                  </Button>
                  <span className="text-xs text-muted-foreground">#{post.id}</span>
                </CardFooter>
              </Card>
            ))}
          </section>
        )}
      </div>
    </main>
  );
}