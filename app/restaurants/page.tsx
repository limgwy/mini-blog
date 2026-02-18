import Link from "next/link";
import { db } from "@/db";
import { restaurants } from "@/db/schema";
import { desc } from "drizzle-orm";

export default async function RestaurantsPage() {
  const allRestaurants = await db
    .select()
    .from(restaurants)
    .orderBy(desc(restaurants.createdAt));

  return (
    <main className="min-h-screen bg-[#FBF4E6]">
      <section className="pt-10 pb-16">
        <div className="mx-auto max-w-4xl px-6 lg:max-w-6xl 2xl:max-w-7xl">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-gray-900">
                Restaurants
              </h1>
              <p className="mt-2 text-gray-700">
                Browse all restaurants added to GUSTO.
              </p>
            </div>

            <Link
              href="/cuisines"
              className="rounded-xl border border-black/10 bg-white/70 px-4 py-2 text-sm font-semibold hover:bg-white transition"
            >
              Browse cuisines
            </Link>
          </div>

          {allRestaurants.length === 0 ? (
            <div className="mt-10 rounded-3xl border border-black/10 bg-white/70 p-10 text-center">
              <p className="text-gray-700">No restaurants yet.</p>
            </div>
          ) : (
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {allRestaurants.map((r) => (
                <Link
                  key={r.id}
                  href={`/restaurants/${r.slug}`}
                  className="group overflow-hidden rounded-3xl border border-black/10 bg-white/70 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
                >
                  <div className="relative h-44 w-full">
                    <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-100" />
                    <div className="absolute left-4 top-4">
                      <span className="rounded-full bg-white/70 px-3 py-1 text-xs font-semibold text-gray-900 backdrop-blur">
                        {r.cuisine}
                      </span>
                    </div>
                  </div>

                  <div className="p-5">
                    <h2 className="text-base font-semibold text-gray-900">
                      {r.name}
                    </h2>
                    <p className="mt-1 text-sm text-gray-700">
                      {r.location ?? "—"}
                    </p>
                    <p className="mt-4 text-sm font-semibold text-gray-900">
                      View details →
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
