"use server";

import { db } from "@/db";
import { comments } from "@/db/schema";
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
