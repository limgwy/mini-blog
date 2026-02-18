"use server";

import { db } from "@/db";
import { comments, posts } from "@/db/schema"; 
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation"; 

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

  await db
    .delete(comments)
    .where(and(eq(comments.id, commentId), eq(comments.userId, userId)));

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

  await db
    .update(comments)
    .set({ body })
    .where(and(eq(comments.id, commentId), eq(comments.userId, userId)));

  revalidatePath(`/blogs/${slug}`);
}



export async function updatePost(formData: FormData) {
  const { userId } = await auth();
  if (!userId) throw new Error("You must be signed in.");

  const postId = String(formData.get("postId") ?? "");
  const slug = String(formData.get("slug") ?? "");
  const title = String(formData.get("title") ?? "").trim();
  const location = String(formData.get("location") ?? "").trim();
  const photoUrl = String(formData.get("photoUrl") ?? "").trim() || null;
  const content = String(formData.get("content") ?? "").trim();

  if (!postId || !slug) throw new Error("Missing postId or slug.");
  if (!title) throw new Error("Title is required.");
  if (!content) throw new Error("Content is required.");

  const [post] = await db.select().from(posts).where(eq(posts.id, postId));
  if (!post) throw new Error("Post not found.");

  // owner-only
  if (post.authorId !== userId) throw new Error("Not allowed.");

  await db
    .update(posts)
    .set({
      title,
      location: location || null,
      photoUrl,
      content,
    })
    .where(eq(posts.id, postId));

  revalidatePath("/blogs");
  revalidatePath(`/blogs/${slug}`);
  revalidatePath(`/blogs/${slug}/edit`);
}

export async function deletePost(formData: FormData) {
  const { userId } = await auth();
  if (!userId) throw new Error("You must be signed in.");

  const postId = String(formData.get("postId") ?? "");
  const slug = String(formData.get("slug") ?? "");

  if (!postId || !slug) throw new Error("Missing postId or slug.");

  const [post] = await db.select().from(posts).where(eq(posts.id, postId));
  if (!post) throw new Error("Post not found.");

  // owner-only
  if (post.authorId !== userId) throw new Error("Not allowed.");

  await db.delete(posts).where(eq(posts.id, postId));

  revalidatePath("/blogs");
  redirect("/blogs");
}
