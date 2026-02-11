import type { Metadata } from "next";
import { db } from "@/db";
import { posts, comments } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { notFound } from "next/navigation";
import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { createComment } from "./actions";
import CommentItem from "./CommentItem";
import Image from "next/image";

type Props = {
  params: Promise<{ slug: string }>; // ✅ your Next.js expects Promise
};

export async function generateMetadata(
  { params }: { params: { slug: string } }
): Promise<Metadata> {
  const { slug } = await params;

  const [post] = await db.select().from(posts).where(eq(posts.slug, slug));

  if (!post) {
    return {
      title: "Post not found",
      description: "This post does not exist.",
    };
  }

  const description =
    (post.content ?? "").replace(/\s+/g, " ").trim().slice(0, 160) ||
    "Blog post";

  return {
    title: post.title,
    description,
    openGraph: {
      title: post.title,
      description,
      images: post.photoUrl ? [post.photoUrl] : undefined,
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params; // ✅ no await


  const [post] = await db.select().from(posts).where(eq(posts.slug, slug));
  if (!post) notFound();

  const postComments = await db
    .select()
    .from(comments)
    .where(eq(comments.postId, post.id))
    .orderBy(desc(comments.createdAt));

  const { userId } = await auth();

  return (
    <main className="min-h-screen bg-[#fff2d1] py-10">
     <div className="mx-auto max-w-3xl px-6 space-y-8">
    
    {/* ARTICLE CARD */}
    <div className="rounded-2xl bg-white p-8 shadow-sm ">
      <h1 className="text-3xl font-bold">{post.title}</h1>

      <p className="mt-2 text-sm text-gray-500">
        {post.location} • {new Date(post.createdAt).toLocaleDateString()}
      </p>

      {post.photoUrl && (
        <div className="relative mt-6 w-full aspect-video overflow-hidden rounded-xl border">
          <Image
            src={post.photoUrl}
            alt={post.title}
            fill
            className="object-cover"
          />
        </div>
      )}
        <article className="prose prose-neutral mt-6 max-w-none">
          {post.content}
        </article>
        {/* COMMENTS */}
        <section className="mt-12 space-y-6">
          <h2 className="text-xl font-bold">Comments</h2>

          <SignedOut>
            <div className="rounded-xl border bg-white p-5 shadow-sm">
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
              className="bg-white space-y-3 rounded-xl border p-4"
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
                <CommentItem
                  key={c.id}
                  slug={slug}
                  comment={c}
                  currentUserId={userId ?? null}
                />
              ))}
            </div>
          )}
        </section>
      </div>
      </div>
    </main>
  );
}
