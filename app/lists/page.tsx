import Link from "next/link";

const CURATED = [
  {
    category: "Japanese",
    items: [
      {
        title: "Japanese cuisine (overview)",
        source: "Wikipedia",
        url: "https://en.wikipedia.org/wiki/Japanese_cuisine",
        note: "Quick overview of common dishes and ingredients.",
      },
      {
        title: "Ramen guide (types and basics)",
        source: "Serious Eats",
        url: "https://www.seriouseats.com/ramen-recipes-5117860",
        note: "Good intro to ramen styles and what makes them different.",
      },
    ],
  },
  {
    category: "Korean",
    items: [
      {
        title: "Korean cuisine (overview)",
        source: "Wikipedia",
        url: "https://en.wikipedia.org/wiki/Korean_cuisine",
        note: "Basic dishes, side dishes, and flavor profile.",
      },
      {
        title: "Korean BBQ guide",
        source: "Serious Eats",
        url: "https://www.seriouseats.com/korean-barbecue-at-home",
        note: "What to order and how it’s usually served.",
      },
    ],
  },
];

export default function CuratedListsPage() {
  return (
    <main className="min-h-screen bg-[#FBF4E6]">
      <section className="pt-10 pb-16">
        <div className="mx-auto max-w-4xl px-6 lg:max-w-6xl 2xl:max-w-7xl">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-gray-900">
            Curated Food Reads
          </h1>
          <p className="mt-2 max-w-2xl text-gray-700">
            Helpful articles and guides for exploring cuisines (external links).
          </p>

          <div className="mt-8 space-y-8">
            {CURATED.map((section) => (
              <div key={section.category} className="rounded-3xl border border-black/10 bg-white/70 p-6">
                <h2 className="text-xl font-bold text-gray-900">{section.category}</h2>

                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  {section.items.map((it) => (
                    <a
                      key={it.url}
                      href={it.url}
                      target="_blank"
                      rel="noreferrer"
                      className="group rounded-2xl border border-black/10 bg-white p-5 transition hover:-translate-y-0.5 hover:shadow-lg"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <h3 className="font-semibold text-gray-900 group-hover:underline">
                          {it.title}
                        </h3>
                        <span className="shrink-0 rounded-full bg-black/5 px-3 py-1 text-xs font-semibold text-gray-800">
                          {it.source}
                        </span>
                      </div>
                      <p className="mt-2 text-sm text-gray-700">{it.note}</p>
                      <p className="mt-4 text-sm font-semibold text-gray-900">
                        Open article →
                      </p>
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10">
            <Link
              href="/"
              className="inline-flex items-center justify-center rounded-2xl bg-gray-900 px-5 py-3 text-sm font-semibold text-white hover:bg-gray-800 transition"
            >
              Back home
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
