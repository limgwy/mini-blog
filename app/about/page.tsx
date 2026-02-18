import Link from "next/link";
import { Bebas_Neue } from "next/font/google";
import { Card, CardContent } from "@/components/ui/card";

const bebas = Bebas_Neue({
  subsets: ["latin"],
  weight: "400",
});

export default function AboutPage() {
  return (
    <main>
      {/* ================= HERO ================= */}
      <section className="relative h-[55vh] min-h-[420px]">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/Fo.jpg')" }}
        />
        <div className="absolute inset-0 bg-black/25" />

        <div className="relative z-10 flex h-full items-center">
          <div className="mx-auto w-full max-w-4xl px-6 text-center">
            <h1
              className={`${bebas.className} text-[clamp(3.5rem,10vw,7rem)] leading-none tracking-tight text-white`}
            >
              ABOUT
            </h1>

            <p className="mx-auto mt-3 max-w-2xl text-white/90">
              A small blog project where readers discover food spots and share
              honest community reviews.
            </p>

         
          </div>
        </div>
      </section>

      {/* ================= CONTENT ================= */}
      <section className="bg-[#FBF4E6] py-16">
        <div className="mx-auto max-w-4xl px-6 lg:max-w-6xl 2xl:max-w-7xl">
          <div className="grid gap-6 md:grid-cols-3">
            <Card className="overflow-hidden">
              <CardContent className="p-6">
                <h2 className="text-lg font-semibold">What this is</h2>
                <p className="mt-2 text-sm text-gray-700 leading-relaxed">
                  Hi! This is a small blog project where I share posts and let
                  readers interact through comments. Posts are stored in a{" "}
                  PostgreSQL database and each post has a unique URL using a
                  slug.
                </p>
              </CardContent>
            </Card>

            <Card className="overflow-hidden">
              <CardContent className="p-6">
                <h2 className="text-lg font-semibold">How it works</h2>
                <p className="mt-2 text-sm text-gray-700 leading-relaxed">
                  Pages fetch posts in Server Components using Drizzle ORM
                  Logged-in users can leave comments using Server Actions, and
                  the page updates instantly using <code>revalidatePath</code>.
                </p>
              </CardContent>
            </Card>

            <Card className="overflow-hidden">
              <CardContent className="p-6">
                <h2 className="text-lg font-semibold">What you can do</h2>
                <p className="mt-2 text-sm text-gray-700 leading-relaxed">
                  Browse the latest posts, explore cuisines, and share your thoughts
                  through comments after logging in.
                </p>

                <div className="mt-4 flex gap-3">
                  <Link
                    href="/blogs"
                    className="rounded-xl bg-gray-900 px-4 py-2 text-xs font-semibold text-white hover:bg-gray-800 transition"
                  >
                    View posts
                  </Link>
                  <Link
                    href="/"
                    className="rounded-xl border border-black/10 bg-white px-4 py-2 text-xs font-semibold text-gray-900 hover:bg-gray-50 transition"
                  >
                    Back home
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Optional: a nicer long paragraph under cards */}
          <div className="mt-10">
            <Card>
              <CardContent className="p-8">
                <p className="text-gray-700 leading-relaxed">
                  The goal of this project is to show how a modern full-stack app can
                  handle routing, database content, authentication, and real-time-feeling
                  updates in a clean way.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </main>
  );
}
