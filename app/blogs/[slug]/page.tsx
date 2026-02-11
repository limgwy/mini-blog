import { db } from "@/db";
import { posts, comments } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { notFound } from "next/navigation";
import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import { createComment } from "./actions";

type Props = {
  params: Promise<{ slug: string }>;
};

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;

  const [post] = await db.select().from(posts).where(eq(posts.slug, slug));
  if (!post) notFound();

  const postComments = await db
    .select()
    .from(comments)
    .where(eq(comments.postId, post.id))
    .orderBy(desc(comments.createdAt));

  return (
    <main className="mx-auto max-w-3xl px-6 py-10">
      <h1 className="text-3xl font-bold">{post.title}</h1>

      <p className="mt-2 text-sm text-gray-500">
        {post.location} • {new Date(post.createdAt).toLocaleDateString()}
      </p>

      <article className="prose prose-neutral mt-8 max-w-none">
        {post.content}
      </article>

      {/* COMMENTS */}
      <section className="mt-12 space-y-6">
        <h2 className="text-xl font-bold">Comments</h2>

        <SignedOut>
          <div className="rounded-xl border p-4">
            <p className="text-sm text-gray-700">
              Please sign in to leave a comment.
            </p>
            <div className="mt-3">
              <SignInButton>
                <button className="rounded-lg bg-black px-4 py-2 text-white">
                  Sign in
                </button>
              </SignInButton>
            </div>
          </div>
        </SignedOut>

        <SignedIn>
          <form
            action={createComment}
            className="space-y-3 rounded-xl border p-4"
          >
            <input type="hidden" name="postId" value={post.id} />
            <input type="hidden" name="slug" value={slug} />

            <div className="space-y-1">
              <label className="text-sm font-medium">Comment</label>
              <textarea
                name="body"
                placeholder="Write your comment..."
                className="w-full rounded-lg border px-3 py-2"
                rows={4}
                required
              />
            </div>

            <button className="rounded-lg bg-black px-4 py-2 text-white">
              Post comment
            </button>
          </form>
        </SignedIn>

        {/* LIST */}
        {postComments.length === 0 ? (
          <p className="text-sm text-gray-600">No comments yet.</p>
        ) : (
          <div className="space-y-3">
            {postComments.map((c) => (
              <div key={c.id} className="rounded-xl border p-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-semibold text-gray-900">
                    {c.authorName ?? "Anonymous"}
                  </p>
                  <p className="text-xs text-gray-500">
                    {new Date(c.createdAt).toLocaleString()}
                  </p>
                </div>

                <p className="mt-2 text-sm text-gray-800 whitespace-pre-wrap">
                  {c.body}
                </p>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
