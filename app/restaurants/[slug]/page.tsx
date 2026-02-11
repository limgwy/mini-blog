import { notFound } from "next/navigation";
import { db } from "@/db";
import { restaurants, reviews } from "@/db/schema";
import { eq, desc } from "drizzle-orm";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export default async function RestaurantPage({ params }: PageProps) {
  const { slug } = await params;

  // 1) Find the restaurant
  const [restaurant] = await db
    .select()
    .from(restaurants)
    .where(eq(restaurants.slug, slug))
    .limit(1);

  if (!restaurant) notFound();

  // 2) Get reviews for this restaurant (newest first)
  const restaurantReviews = await db
    .select()
    .from(reviews)
    .where(eq(reviews.restaurantId, restaurant.id))
    .orderBy(desc(reviews.createdAt));

  return (
    <main className="mx-auto max-w-4xl px-6 py-10">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold">{restaurant.name}</h1>
        <p className="text-gray-600">
          {restaurant.cuisine}
          {restaurant.location ? ` • ${restaurant.location}` : ""}
        </p>
      </header>

      <section className="mt-10">
        <h2 className="text-xl font-semibold">Reviews</h2>

        <div className="mt-4 space-y-4">
          {restaurantReviews.length === 0 ? (
            <p className="text-gray-600">No reviews yet.</p>
          ) : (
            restaurantReviews.map((r) => (
              <article key={r.id} className="rounded-xl border p-4">
                <h3 className="text-lg font-semibold">{r.title}</h3>
                <p className="text-sm text-gray-600">
                  {r.authorName} • {r.rating}/5
                </p>

                <p className="mt-2">{r.body}</p>

                <p className="mt-2 text-xs text-gray-500">
                  {new Date(r.createdAt).toLocaleString()}
                </p>
              </article>
            ))
          )}
        </div>
      </section>
    </main>
  );
}
