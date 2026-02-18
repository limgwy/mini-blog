import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import { createPost } from "./actions";

export default function Page() {
  return (
    <main className="min-h-screen bg-[#FBF4E6]">
      <div className="mx-auto max-w-2xl px-6 py-10 space-y-6">
        <h1 className="text-3xl font-bold text-gray-900">Create a post</h1>

        <SignedOut>
          <div className="rounded-2xl border border-black/10 bg-white/70 p-5">
            <p className="text-sm text-gray-700">
              Please sign in to create a post.
            </p>
            <div className="mt-3">
              <SignInButton mode="modal">
                <button
                  type="button"
                  className="rounded-xl bg-gray-900 px-4 py-2 text-sm font-semibold text-white hover:bg-gray-800 transition"
                >
                  Sign in
                </button>
              </SignInButton>
            </div>
          </div>
        </SignedOut>

        <SignedIn>
          <form
            action={createPost}
            className="space-y-4 rounded-2xl border border-black/10 bg-white/70 p-6"
          >
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-900">Title</label>
              <input
                name="title"
                className="w-full rounded-xl border border-black/10 bg-white px-3 py-2"
                placeholder="Post title"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-900">
                Location (optional)
              </label>
              <input
                name="location"
                className="w-full rounded-xl border border-black/10 bg-white px-3 py-2"
                placeholder="e.g. Makati"
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-900">
                Photo URL (optional)
              </label>
              <input
                name="photoUrl"
                className="w-full rounded-xl border border-black/10 bg-white px-3 py-2"
                placeholder="https://..."
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-900">Content</label>
              <textarea
                name="content"
                className="w-full rounded-xl border border-black/10 bg-white px-3 py-2"
                rows={10}
                placeholder="Write your post..."
                required
              />
            </div>

            <button className="rounded-xl bg-gray-900 px-4 py-2 text-sm font-semibold text-white hover:bg-gray-800 transition">
              Publish
            </button>
          </form>
        </SignedIn>
      </div>
    </main>
  );
}
