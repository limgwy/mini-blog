import Link from "next/link";
import Image from "next/image";
import { db } from "@/db";
import { posts, restaurants } from "@/db/schema";
import { desc } from "drizzle-orm";
import { Bebas_Neue } from "next/font/google";
import { Card, CardContent } from "@/components/ui/card";


export const bebas = Bebas_Neue({
  subsets: ["latin"],
  weight: "400",
});

const CUISINE_IMAGES: Record<string, string> = {
  japanese:
    "https://i.pinimg.com/1200x/fc/a1/8e/fca18e8a24b8dcd0631d0e15aa223458.jpg",
  korean:
    "https://i.pinimg.com/1200x/f9/1d/e2/f91de2b485d66f5dc2067d236d09a1a0.jpg",
  filipino:
    "https://i.pinimg.com/1200x/46/0f/3e/460f3ebc512bcb68ba2806da0132a475.jpg",
  chinese:
    "https://i.pinimg.com/1200x/07/86/de/0786def40feb9c1ba85c7974b54c6a49.jpg",
  mexican:
    "https://i.pinimg.com/1200x/12/d6/1a/12d61a3954c621d0108a04f0c48db4bf.jpg",
  american:
    "https://i.pinimg.com/1200x/40/fb/bf/40fbbf51818b23c93ef792939991c363.jpg",
};

function keyifyCuisine(cuisine: string) {
  return cuisine.trim().toLowerCase();
}

export default async function HomePage() {
  const allPosts = await db.select().from(posts).orderBy(desc(posts.createdAt));

  const cuisineRows = await db
    .select({ cuisine: restaurants.cuisine })
    .from(restaurants);

  const cuisines = Array.from(new Set(cuisineRows.map((c) => c.cuisine)));

  return (
    <main>
     {/* ================= HERO ================= */}
<section className="relative h-[85vh] min-h-[520px]">
  <div
    className="absolute inset-0 bg-cover bg-center"
    style={{ backgroundImage: "url('/Food.jpg')" }}
  />
  <div className="absolute inset-0 bg-black/10" />

  <div className="relative z-10 flex h-full items-center">
    <div className="mx-auto w-full max-w-4xl px-6 text-center">
      <h1
        className={`${bebas.className} text-[clamp(4rem,12vw,9rem)] leading-none tracking-tight text-white`}
      >
        GUSTO
      </h1>

      <p className="mx-auto mt-3 max-w-xl text-white/90">
        Discover the best eats through honest community reviews.
      </p>

      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <a
          href="#blogs"
          className="rounded-xl bg-white px-6 py-3 text-sm font-semibold text-gray-900"
        >
          Browse Posts
        </a>

        <a
          href="#cuisines"
          className="rounded-xl border border-white/70 bg-white/10 px-6 py-3 text-sm font-semibold text-white backdrop-blur"
        >
          Browse Cuisines
        </a>
      </div>
    </div>
  </div>
</section>


      {/* ================= BLOGS ================= */}
      <section id="blogs" className="bg-[#FBF4E6] py-16">
        <div className="mx-auto max-w-4xl px-50 lg:max-w-6xl 2xl:max-w-7xl">
          {" "}
          <h2 className="text-2xl font-bold">Latest Posts</h2>
          {allPosts.length === 0 ? (
            <Card className="mt-6">
              <CardContent className="p-3">
                <p className="text-gray-600">No blog posts yet.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="mt-6 grid gap-6 sm:grid-cols-3">
              {allPosts.map((p, index) => {
                const isFeatured = index === 0;

                // use photoUrl if you have it; fallback to local image
                const thumbSrc =
                  p.photoUrl && p.photoUrl.trim().length > 0
                    ? p.photoUrl
                    : "/Food.jpg";

                return (
                  <Link
                    key={p.id}
                    href={`/blogs/${p.slug}`}
                    className={`group block focus:outline-none ${
                      isFeatured ? "sm:col-span-2" : ""
                    }`}
                  >
                    <Card className="h-full overflow-hidden p-0 transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-xl">
                      {/* IMAGE — FLUSH TO TOP */}
                      <div
                        className={`relative w-full ${
                          isFeatured ? "h-48" : "h-40"
                        }`}
                      >
                        <Image
                          src={thumbSrc}
                          alt={p.title}
                          fill
                          className="object-cover"
                          sizes={
                            isFeatured
                              ? "(max-width: 640px) 100vw, 768px"
                              : "(max-width: 640px) 100vw, 384px"
                          }
                          priority={isFeatured}
                        />
                      </div>

                      {/* CONTENT */}
                      <CardContent className="p-">
                        {/* META */}
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                         
                          {isFeatured && (
                            <span className="ml-auto rounded-full bg-black/5 px-2 py-0.5 text-[10px] font-semibold">
                              Featured
                            </span>
                          )}
                        </div>

                        {/* TITLE */}
                        <h3 className="mt-0 text-base font-semibold leading-snug">
                          {p.title}
                        </h3>

                        {/* EXCERPT */}
                        <p className="mt-1 text-sm text-gray-600">
                          {p.content.length > 90
                            ? p.content.slice(0, 90) + "…"
                            : p.content}
                        </p>

                        {/* FOOTER */}
                        <div className="mt-0 pb-2 flex items-center justify-end">
                          <p className="text-xs text-gray-500">
                            {new Date(p.createdAt).toLocaleDateString()}
                          </p>
                          
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>

    {/* ================= CUISINES ================= */}
<section id="cuisines" className="bg-[#FBF4E6] py-16">
  <div className="mx-auto max-w-4xl px-6 lg:max-w-6xl 2xl:max-w-7xl">
    <div className="flex items-end justify-between gap-4">
      <div>
        <h2 className="text-2xl font-bold">Browse by Cuisine</h2>
        <p className="mt-2 text-gray-700">
          Pick a cuisine to see restaurants under it.
        </p>
      </div>

      
    </div>

    <div className="mt-6">
      {cuisines.length === 0 ? (
        <p className="text-gray-600">No cuisines yet.</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {cuisines.map((cuisine) => {
            const img = CUISINE_IMAGES[keyifyCuisine(cuisine)];

            return (
              <Link
                key={cuisine}
                href={`/cuisines/${encodeURIComponent(cuisine)}`}
                className="group relative overflow-hidden rounded-3xl border border-black/10 bg-white/60 shadow-sm transition hover:-translate-y-1 hover:shadow-xl focus:outline-none"
              >
                <div className="relative h-48 w-full">
                  {img ? (
                    <img
                      src={img}
                      alt={`${cuisine} cuisine`}
                      className="block h-full w-full object-cover transition duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                  ) : (
                    <div className="h-full w-full bg-gradient-to-br from-gray-200 to-gray-100" />
                  )}

                  <div className="absolute inset-0 bg-black/35 transition group-hover:bg-black/45" />

                  <div className="absolute inset-0 flex items-center justify-center p-4">
                    <h3 className="text-center text-2xl font-bold tracking-tight text-white drop-shadow">
                      {cuisine}
                    </h3>
                  </div>

                
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>

    <div className="mt-6 sm:hidden">
      <Link
        href="/cuisines"
        className="inline-flex rounded-xl border border-black/10 bg-white/70 px-4 py-2 text-sm font-semibold hover:bg-white transition"
      >
        View all cuisines →
      </Link>
    </div>
  </div>
</section>

    </main>
  );
}
