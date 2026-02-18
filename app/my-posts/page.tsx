import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/db";
import { posts } from "@/db/schema";
import { eq, desc } from "drizzle-orm";

export default async function MyPostsPage() {
  const { userId } = await auth();

  // Not logged in
  if (!userId) {
    return (
      <main className="min-h-screen bg-[#FBF4E6]">
        <section className="pt-10 pb-16">
          <div className="mx-auto max-w-4xl px-6 lg:max-w-6xl 2xl:max-w-7xl">
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-gray-900">
              My Posts
            </h1>
            <p className="mt-2 max-w-xl text-gray-700">
              Please sign in to view posts you created.
            </p>

            <div className="mt-6 flex gap-3">
              <Link
                href="/blogs"
                className="inline-flex rounded-xl bg-gray-900 px-5 py-3 text-sm font-semibold text-white hover:bg-gray-800 transition"
              >
                Back to Blogs
              </Link>
            </div>
          </div>
        </section>
      </main>
    );
  }

  // Logged in: fetch user’s posts
  const myPosts = await db
    .select()
    .from(posts)
    .where(eq(posts.authorId, userId))
    .orderBy(desc(posts.createdAt));

  return (
    <main className="min-h-screen bg-[#FBF4E6]">
      <section className="pt-10 pb-16">
        <div className="mx-auto max-w-4xl px-6 lg:max-w-6xl 2xl:max-w-7xl">
          {/* Header */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-gray-900">
                My Posts
              </h1>
              <p className="mt-2 text-gray-700">
                Posts you created using your account.
              </p>

              <div className="mt-3 inline-flex items-center gap-2">
                <span className="rounded-full bg-black/5 px-3 py-1 text-xs font-semibold text-gray-800">
                  {myPosts.length} post{myPosts.length === 1 ? "" : "s"}
                </span>
              </div>
            </div>

            <div className="flex gap-2">
              <Link
                href="/blogs"
                className="rounded-xl border border-black/10 bg-white/70 px-4 py-2 text-sm font-semibold hover:bg-white transition"
              >
                All posts
              </Link>

              <Link
                href="/blogs/new"
                className="rounded-xl bg-gray-900 px-4 py-2 text-sm font-semibold text-white hover:bg-gray-800 transition"
              >
                Create post
              </Link>
            </div>
          </div>

          {/* Content */}
          {myPosts.length === 0 ? (
            <div className="mt-10 rounded-3xl border border-black/10 bg-white/70 p-10 text-center">
              <h2 className="text-lg font-semibold text-gray-900">
                No posts yet
              </h2>
              <p className="mt-2 text-sm text-gray-700">
                Create your first post and it will show up here.
              </p>

              <div className="mt-6 flex justify-center gap-3">
                <Link
                  href="/blogs/new"
                  className="rounded-xl bg-gray-900 px-5 py-3 text-sm font-semibold text-white hover:bg-gray-800 transition"
                >
                  Create post
                </Link>
                <Link
                  href="/blogs"
                  className="rounded-xl border border-black/10 bg-white px-5 py-3 text-sm font-semibold text-gray-900 hover:bg-gray-50 transition"
                >
                  Browse posts
                </Link>
              </div>
            </div>
          ) : (
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {myPosts.map((p) => (
                <div
                  key={p.id}
                  className="group overflow-hidden rounded-3xl border border-black/10 bg-white/70 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
                >
                  {/* Card click area */}
                  <Link href={`/blogs/${p.slug}`} className="block">
                    <div className="relative h-44 w-full">
                      <img
                        src={
                          p.photoUrl && p.photoUrl.trim()
                            ? p.photoUrl
                            : "/Food.jpg"
                        }
                        alt={p.title}
                        className="block h-full w-full object-cover transition duration-500 group-hover:scale-105"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-black/10" />
                    </div>

                    <div className="p-5">
                      <h2 className="text-base font-semibold text-gray-900">
                        {p.title}
                      </h2>
                      <p className="mt-1 text-xs text-gray-600">
                        {p.location ?? "—"} •{" "}
                        {new Date(p.createdAt).toLocaleDateString()}
                      </p>

                      <p className="mt-3 text-sm text-gray-700">
                        {p.content.length > 90
                          ? p.content.slice(0, 90) + "…"
                          : p.content}
                      </p>

                      <p className="mt-4 text-sm font-semibold text-gray-900">
                        Open →
                      </p>
                    </div>
                  </Link>

                  {/* Actions row */}
                  <div className="flex items-center justify-between gap-2 border-t border-black/5 bg-white/60 px-5 py-3">
                    <Link
                      href={`/blogs/${p.slug}/edit`}
                      className="rounded-lg border border-black/10 bg-white px-3 py-1.5 text-xs font-semibold text-gray-900 hover:bg-gray-50 transition"
                    >
                      Edit
                    </Link>

                    <span className="text-xs text-gray-600">
                      Slug: {p.slug}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
