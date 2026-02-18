import Link from "next/link";
import { db } from "@/db";
import { restaurants } from "@/db/schema";

// Map cuisine -> background image
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

// helper to normalize “Japanese ” -> “japanese”
function keyifyCuisine(cuisine: string) {
  return cuisine.trim().toLowerCase();
}

export default async function CuisinesPage() {
  const rows = await db
    .select({ cuisine: restaurants.cuisine })
    .from(restaurants);

  const cuisines = Array.from(
    new Set(rows.map((r) => (r.cuisine ?? "").trim()).filter(Boolean)),
  ).sort((a, b) => a.localeCompare(b));

  return (
     <main className="min-h-screen bg-[#FBF4E6]">
      {/* HERO */}
      <section className="bg-[#FBF4E6] pt-10 pb-16">
        <div className="mx-auto max-w-4xl px-6 lg:max-w-6xl 2xl:max-w-7xl">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-gray-900">
            Browse by Cuisine
          </h1>
          <p className="mt-2 max-w-2xl text-gray-700">
            Choose a cuisine to see restaurants under it.
          </p>

          <div className="mt-6">
            {cuisines.length === 0 ? (
              <div className="rounded-2xl border border-black/10 bg-white/70 p-8">
                <p className="text-gray-700">No cuisines yet.</p>
              </div>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {cuisines.map((cuisine) => {
                  const k = keyifyCuisine(cuisine);
                  const img = CUISINE_IMAGES[k];

                  return (
                    <Link
                      key={cuisine}
                      href={`/cuisines/${encodeURIComponent(cuisine)}`}
                      className="group relative overflow-hidden rounded-3xl border border-black/10 bg-white/60 shadow-sm transition hover:-translate-y-1 hover:shadow-xl focus:outline-none"
                    >
                      <div className="relative h-56 w-full">
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
                          <h2 className="text-center text-2xl font-bold tracking-tight text-white drop-shadow">
                            {cuisine}
                          </h2>
                        </div>

                       
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
