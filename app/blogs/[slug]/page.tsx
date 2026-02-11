import { db } from "@/db";
import { posts } from "@/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";

type Props = {
  params: Promise<{ slug: string }>;
};

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;

  const [post] = await db.select().from(posts).where(eq(posts.slug, slug));

  if (!post) notFound();

  return (
    <main className="mx-auto max-w-3xl px-6 py-10">
      <h1 className="text-3xl font-bold">{post.title}</h1>

      <p className="mt-2 text-sm text-gray-500">
        {post.location} •{" "}
        {new Date(post.createdAt).toLocaleDateString()}
      </p>

      <article className="prose prose-neutral mt-8 max-w-none">
        {post.content}
      </article>
    </main>
  );
}
