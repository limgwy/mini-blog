import Link from "next/link";
import { db } from "@/db";
import { restaurants } from "@/db/schema";
import { eq } from "drizzle-orm";

type PageProps = {
  params: Promise<{ cuisine: string }>;
};

export default async function CuisinePage({ params }: PageProps) {
  const { cuisine: cuisineParam } = await params;
  const cuisine = decodeURIComponent(cuisineParam);

  const rows = await db
    .select()
    .from(restaurants)
    .where(eq(restaurants.cuisine, cuisine));

  return (
    <main className="mx-auto max-w-4xl px-6 py-10">
      <h1 className="text-3xl font-bold">{cuisine}</h1>
      <p className="mt-2 text-gray-600">Restaurants under this cuisine</p>

      <div className="mt-6 space-y-4">
        {rows.length === 0 ? (
          <p className="text-gray-600">No restaurants found.</p>
        ) : (
          rows.map((r) => (
            <article key={r.id} className="rounded-xl border p-4">
              <h2 className="text-xl font-semibold">{r.name}</h2>
              {r.location ? <p className="text-gray-600">{r.location}</p> : null}

              <Link className="mt-3 inline-block underline" href={`/restaurants/${r.slug}`}>
                View restaurant
              </Link>
            </article>
          ))
        )}
      </div>
    </main>
  );
}
