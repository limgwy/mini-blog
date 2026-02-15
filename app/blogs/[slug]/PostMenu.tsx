"use client";

import Link from "next/link";
import { useState } from "react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

type Props = {
  editHref: string;
  postId: string;
  slug: string;
  deleteAction: (formData: FormData) => void;
};

export default function PostMenu({ editHref, postId, slug, deleteAction }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            className="rounded-md border bg-white px-2 py-1 text-lg leading-none hover:bg-gray-50"
            aria-label="Post options"
          >
            ⋯
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-44">
          <DropdownMenuItem asChild>
            <Link href={editHref}>Edit</Link>
          </DropdownMenuItem>

          <DropdownMenuItem
            className="text-red-600 focus:text-red-600"
            onSelect={(e) => {
              // prevents dropdown from closing in a weird way
              e.preventDefault();
              setOpen(true);
            }}
          >
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* NICE CONFIRM MODAL */}
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this post?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently remove your post.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>

            {/* Server Action submit */}
            <form action={deleteAction}>
              <input type="hidden" name="postId" value={postId} />
              <input type="hidden" name="slug" value={slug} />
              <AlertDialogAction type="submit" className="bg-red-600 hover:bg-red-700">
                Delete
              </AlertDialogAction>
            </form>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
