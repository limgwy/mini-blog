import Link from "next/link";
import { db } from "@/db";
import { posts } from "@/db/schema";

export default async function BlogsPage() {
  const allPosts = await db.select().from(posts);

  return (
    <main className="mx-auto max-w-4xl px-6 py-10">
      <h1 className="text-3xl font-bold">All Blog Posts</h1>

      <div className="mt-6 space-y-4">
        {allPosts.map((p) => (
          <Link
            key={p.id}
            href={`/blogs/${p.slug}`}
            className="block rounded-xl border p-5 hover:bg-gray-50"
          >
            <h2 className="text-xl font-semibold">{p.title}</h2>
            <p className="mt-1 text-gray-600">{p.location}</p>
          </Link>
        ))}
      </div>
    </main>
  );
}
