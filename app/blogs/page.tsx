import Link from "next/link";
import Image from "next/image";
import { db } from "@/db";
import { posts } from "@/db/schema";
import { Card, CardContent } from "@/components/ui/card";
import { SignedIn } from "@clerk/nextjs";
import { desc } from "drizzle-orm";

const allPosts = await db
  .select()
  .from(posts)
  .orderBy(desc(posts.createdAt));

export default async function BlogsPage() {
  const allPosts = await db
  .select()
  .from(posts)
  .orderBy(desc(posts.createdAt));

  return (
    <main className="min-h-screen bg-[#FBF4E6]">
      {/* Top spacing */}
      <section className="py-14">
        {/* Bigger side spacing + slightly wider max width */}
        <div className="mx-auto max-w-6xl px-8 sm:px-10 lg:px-14">
          {/* Header row */}
          <div className="flex items-end justify-between gap-4">
            <div>
              <h1 className="text-4xl font-bold tracking-tight">All Blog Posts</h1>
              <p className="mt-2 text-sm text-gray-600">
                Browse community food reviews and guides.
              </p>
            </div>

            {/* Create Post only when logged in */}
            <SignedIn>
              <Link
                href="/blogs/new"
                className="inline-flex items-center gap-2 rounded-full bg-black px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-black/90"
              >
                <span className="text-lg leading-none">+</span>
                <span className="hidden sm:inline">Create Post</span>
              </Link>
            </SignedIn>
          </div>

          {/* Cards */}
          {allPosts.length === 0 ? (
            <Card className="mt-8">
              <CardContent className="p-6">
                <p className="text-gray-600">No blog posts yet.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {allPosts.map((p) => {
                const thumbSrc =
                  p.photoUrl && p.photoUrl.trim().length > 0
                    ? p.photoUrl
                    : "/Food.jpg";

                return (
                  <Link
                    key={p.id}
                    href={`/blogs/${p.slug}`}
                    className="group block focus:outline-none"
                  >
                    {/* Smaller card + image 3/4 */}
                    <Card className="h-[320px] overflow-hidden p-0 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                      <div className="flex h-full flex-col">
                        {/* IMAGE ~ 3/4 */}
                        <div className="relative flex-[3]">
                          <Image
                            src={thumbSrc}
                            alt={p.title}
                            fill
                            className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                            sizes="(max-width: 1024px) 50vw, 33vw"
                          />
                        </div>

                        {/* CONTENT ~ 1/4 */}
                        <CardContent className="flex-[1] p-4">
                          <div className="flex items-center gap-2 text-[11px] text-gray-500">
                            <span className="font-medium text-gray-700">
                            </span>
                            <span className="ml-auto">
                              {new Date(p.createdAt).toLocaleDateString()}
                            </span>
                          </div>

                          <h3 className="mt-1 line-clamp-2 text-sm font-semibold leading-snug">
                            {p.title}
                          </h3>

                          <p className="mt-1 line-clamp-2 text-xs text-gray-600">
                            {p.content?.length ? p.content : "No preview available."}
                          </p>
                        </CardContent>
                      </div>
                    </Card>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
