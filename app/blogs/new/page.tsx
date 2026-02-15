import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import { createPost } from "./actions";

export default function Page() {
  return (
    <main className="mx-auto max-w-2xl px-6 py-10 space-y-6">
      <h1 className="text-3xl font-bold">Create a post</h1>

      <SignedOut>
        <div className="rounded-xl border p-4">
          <p className="text-sm text-gray-700">
            Please sign in to create a post.
          </p>
          <div className="mt-3">
            <SignInButton>
              <button type="button" className="rounded-lg bg-black px-4 py-2 text-white">
                Sign in
              </button>
            </SignInButton>
          </div>
        </div>
      </SignedOut>

      <SignedIn>
        <form action={createPost} className="space-y-4 rounded-xl border p-5">
          <div className="space-y-1">
            <label className="text-sm font-medium">Title</label>
            <input
              name="title"
              className="w-full rounded-lg border px-3 py-2"
              placeholder="Post title"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium">Location (optional)</label>
            <input
              name="location"
              className="w-full rounded-lg border px-3 py-2"
              placeholder="e.g. Makati"
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium">Photo URL (optional)</label>
            <input
              name="photoUrl"
              className="w-full rounded-lg border px-3 py-2"
              placeholder="https://..."
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium">Content</label>
            <textarea
              name="content"
              className="w-full rounded-lg border px-3 py-2"
              rows={10}
              placeholder="Write your post..."
              required
            />
          </div>

          <button className="rounded-lg bg-black px-4 py-2 text-white">
            Publish
          </button>
        </form>
      </SignedIn>
    </main>
  );
}
