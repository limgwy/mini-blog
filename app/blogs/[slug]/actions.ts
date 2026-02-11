"use server";

import { db } from "@/db";
import { comments } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { auth, currentUser } from "@clerk/nextjs/server";

export async function createComment(formData: FormData) {
  const { userId } = await auth();
  if (!userId) throw new Error("You must be signed in to comment.");

  const user = await currentUser();
  const authorName =
    user?.fullName ||
    user?.username ||
    user?.primaryEmailAddress?.emailAddress ||
    "User";

  const postId = String(formData.get("postId") ?? "");
  const slug = String(formData.get("slug") ?? "");
  const body = String(formData.get("body") ?? "").trim();

  if (!postId || !slug) throw new Error("Missing postId or slug.");
  if (!body) throw new Error("Comment is required.");

  await db.insert(comments).values({
    postId,
    userId,
    authorName,
    body,
  });

  revalidatePath(`/blogs/${slug}`);
}

export async function deleteComment(formData: FormData) {
  const { userId } = await auth();
  if (!userId) throw new Error("You must be signed in.");

  const commentId = String(formData.get("commentId") ?? "");
  const slug = String(formData.get("slug") ?? "");

  if (!commentId || !slug) throw new Error("Missing commentId or slug.");

  // ✅ only delete if the logged-in user owns the comment
  await db.delete(comments).where(and(eq(comments.id, commentId), eq(comments.userId, userId)));

  revalidatePath(`/blogs/${slug}`);
}

export async function updateComment(formData: FormData) {
  const { userId } = await auth();
  if (!userId) throw new Error("You must be signed in.");

  const commentId = String(formData.get("commentId") ?? "");
  const slug = String(formData.get("slug") ?? "");
  const body = String(formData.get("body") ?? "").trim();

  if (!commentId || !slug) throw new Error("Missing commentId or slug.");
  if (!body) throw new Error("Comment cannot be empty.");

  // ✅ only update if the logged-in user owns the comment
  await db
    .update(comments)
    .set({ body })
    .where(and(eq(comments.id, commentId), eq(comments.userId, userId)));

  revalidatePath(`/blogs/${slug}`);
}
