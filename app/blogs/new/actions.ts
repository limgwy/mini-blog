"use server";

import { db } from "@/db";
import { posts } from "@/db/schema";
import { auth, currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";

function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

export async function createPost(formData: FormData) {
  const { userId } = await auth();
  if (!userId) throw new Error("You must be signed in to create a post.");

  const user = await currentUser();
  const authorName =
    user?.fullName ||
    user?.username ||
    user?.primaryEmailAddress?.emailAddress ||
    "User";

  const title = String(formData.get("title") ?? "").trim();
  const location = String(formData.get("location") ?? "").trim();
  const content = String(formData.get("content") ?? "").trim();
  const photoUrl = String(formData.get("photoUrl") ?? "").trim() || null;

  if (!title) throw new Error("Title is required.");
  if (!content) throw new Error("Content is required.");

  const base = slugify(title);
  let slug = base || `post-${Date.now()}`;

  const existing = await db.select().from(posts).where(eq(posts.slug, slug));
  if (existing.length > 0) slug = `${slug}-${Date.now().toString(36)}`;

  await db.insert(posts).values({
    title,
    slug,
    location: location || null,
    photoUrl,
    content,
    authorId: userId,
    authorName,
  });

  revalidatePath("/blogs");
  redirect(`/blogs/${slug}`);
}
