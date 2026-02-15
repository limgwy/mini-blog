import { db } from "@/db";
import { posts } from "@/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import Link from "next/link";
import { updatePost } from "../actions";

type Props = {
  params: Promise<{ slug: string }>;
};

export default async function EditPostPage({ params }: Props) {
  const { slug } = await params;

  const { userId } = await auth();
  if (!userId) notFound();

  const [post] = await db.select().from(posts).where(eq(posts.slug, slug));
  if (!post) notFound();
  if (post.authorId !== userId) notFound();

  return (
    <main className="mx-auto max-w-2xl px-6 py-10 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Edit post</h1>
        <Link href={`/blogs/${slug}`} className="text-sm underline">
          Back
        </Link>
      </div>

      <form action={updatePost} className="space-y-4 rounded-xl border p-5">
        <input type="hidden" name="postId" value={post.id} />
        <input type="hidden" name="slug" value={slug} />

        <div className="space-y-1">
          <label className="text-sm font-medium">Title</label>
          <input
            name="title"
            defaultValue={post.title}
            className="w-full rounded-lg border px-3 py-2"
            required
          />
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium">Location (optional)</label>
          <input
            name="location"
            defaultValue={post.location ?? ""}
            className="w-full rounded-lg border px-3 py-2"
          />
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium">Photo URL (optional)</label>
          <input
            name="photoUrl"
            defaultValue={post.photoUrl ?? ""}
            className="w-full rounded-lg border px-3 py-2"
            placeholder="https://..."
          />
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium">Content</label>
          <textarea
            name="content"
            defaultValue={post.content}
            className="w-full rounded-lg border px-3 py-2"
            rows={10}
            required
          />
        </div>

        <button className="rounded-lg bg-black px-4 py-2 text-white">
          Save changes
        </button>
      </form>
    </main>
  );
}
