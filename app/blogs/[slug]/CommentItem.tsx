"use client";

import { useEffect, useRef, useState } from "react";
import { deleteComment, updateComment } from "./actions";

type Props = {
  slug: string;
  comment: {
    id: string;
    userId: string;
    authorName: string | null;
    body: string;
    createdAt: Date;
  };
  currentUserId: string | null;
};

export default function CommentItem({ slug, comment, currentUserId }: Props) {
  const isOwner = !!currentUserId && currentUserId === comment.userId;

  const [isEditing, setIsEditing] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!menuRef.current) return;
      if (!menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  return (
    <div className="rounded-xl bg-white border p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-gray-900">
            {comment.authorName ?? "Anonymous"}
          </p>
          <p className="text-xs text-gray-500 mt-0.5">
            {new Date(comment.createdAt).toLocaleString()}
          </p>
        </div>

        {isOwner ? (
          <div className="relative" ref={menuRef}>
            <button
              type="button"
              onClick={() => setMenuOpen((v) => !v)}
              className="h-8 w-8 rounded-lg border bg-white text-gray-700 hover:bg-gray-50"
              aria-label="Comment actions"
            >
              ⋯
            </button>

            {menuOpen ? (
              <div className="absolute right-0 mt-2 w-40 rounded-xl border bg-white shadow-sm overflow-hidden">
                <button
                  type="button"
                  onClick={() => {
                    setIsEditing(true);
                    setMenuOpen(false);
                    setConfirmDelete(false);
                  }}
                  className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50"
                >
                  Edit
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setConfirmDelete(true);
                    setMenuOpen(false);
                  }}
                  className="w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-gray-50"
                >
                  Delete
                </button>
              </div>
            ) : null}
          </div>
        ) : null}
      </div>

    {!isEditing ? (
  <p className="mt-2 text-sm text-gray-800 whitespace-pre-wrap">
    {comment.body}
  </p>
) : (
  <form
    action={updateComment}
    className="mt-2 space-y-2"
    onSubmit={() => {
      setIsEditing(false);
      setConfirmDelete(false);
      setMenuOpen(false);
    }}
  >
    <input type="hidden" name="commentId" value={comment.id} />
    <input type="hidden" name="slug" value={slug} />

    <textarea
      name="body"
      defaultValue={comment.body}
      className="w-full rounded-lg border px-3 py-2 text-sm"
      rows={3}
      required
    />

    <div className="flex items-center gap-2">
      <button className="rounded-lg bg-black px-3 py-2 text-sm text-white">
        Save
      </button>
      <button
        type="button"
        onClick={() => setIsEditing(false)}
        className="rounded-lg border px-3 py-2 text-sm"
      >
        Cancel
      </button>
    </div>
  </form>
)}


      {confirmDelete ? (
        <div className="mt-3 rounded-lg border bg-gray-50 p-3">
          <p className="text-sm text-gray-800">
            Delete this comment? This can’t be undone.
          </p>
          <div className="mt-2 flex items-center gap-2">
            <form action={deleteComment}>
              <input type="hidden" name="commentId" value={comment.id} />
              <input type="hidden" name="slug" value={slug} />
              <button className="rounded-lg bg-red-600 px-3 py-2 text-sm text-white hover:bg-red-700">
                Yes, delete
              </button>
            </form>

            <button
              type="button"
              onClick={() => setConfirmDelete(false)}
              className="rounded-lg border px-3 py-2 text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
